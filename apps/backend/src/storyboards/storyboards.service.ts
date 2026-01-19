import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';
import { ProjectsService } from '../projects/projects.service';
import { CharactersService } from '../characters/characters.service';
import { CreateStoryboardDto } from './dto/create-storyboard.dto';
import { UpdateStoryboardDto } from './dto/update-storyboard.dto';

@Injectable()
export class StoryboardsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private projectsService: ProjectsService,
    private charactersService: CharactersService,
  ) {}

  create(createStoryboardDto: CreateStoryboardDto) {
    return this.prisma.storyboard.create({
      data: {
        ...createStoryboardDto,
        status: 'DRAFT',
      },
    });
  }

  findAll(episodeId: string) {
    return this.prisma.storyboard.findMany({
      where: { episodeId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.storyboard.findUnique({
      where: { id },
    });
  }

  update(id: string, updateStoryboardDto: UpdateStoryboardDto) {
    return this.prisma.storyboard.update({
      where: { id },
      data: updateStoryboardDto,
    });
  }

  remove(id: string) {
    return this.prisma.storyboard.delete({
      where: { id },
    });
  }

  async autoSplit(episodeId: string) {
    // 1. Get Project ID from Episode
    const episode = await this.prisma.episode.findUnique({
      where: { id: episodeId },
      include: { project: true },
    });
    if (!episode) throw new Error('Episode not found');

    // 2. Get Script from Project
    const script = await this.projectsService.getScript(episode.projectId);
    if (!script) throw new Error('Script not found');

    // 3. Call AI to split script (In real app, we might send only relevant part)
    const shots = await this.aiService.splitScriptToStoryboards(script);

    // 4. Clear existing storyboards for this episode (Optional, or append)
    await this.prisma.storyboard.deleteMany({ where: { episodeId } });

    // 5. Create new storyboards
    const createdStoryboards = [];
    for (const shot of shots) {
      const sb = await this.create({
        episodeId,
        sortOrder: shot.sortOrder,
        shotType: shot.shotType,
        action: shot.action,
        dialogue: shot.dialogue,
        prompt: `${shot.shotType}, ${shot.action}, ${shot.dialogue}`, // Initial prompt
      });
      createdStoryboards.push(sb);
    }
    return createdStoryboards;
  }

  async generateImage(id: string, useRefImage: boolean = true) {
    const storyboard = await this.findOne(id);
    if (!storyboard) throw new Error('Storyboard not found');

    // 1. Update status
    await this.update(id, { status: 'GENERATING' } as any);

    try {
      // 2. Get Project and Characters to find matching character tags/avatars
      // This is a simplified logic. Real implementation needs detailed entity extraction from action/dialogue
      const episode = await this.prisma.episode.findUnique({
        where: { id: storyboard.episodeId },
      });
      const characters = await this.charactersService.findAll(episode!.projectId);
      
      // 3. Assemble Prompt
      let finalPrompt = storyboard.prompt || '';
      let referenceImageUrl: string | undefined;

      // Simple keyword matching for demo
      for (const char of characters) {
        if (storyboard.action?.includes(char.name) || storyboard.dialogue?.includes(char.name)) {
          finalPrompt = `${char.tags}, ${finalPrompt}`;
          if (useRefImage && char.avatarUrl) {
            referenceImageUrl = char.avatarUrl; // Use the first found character's avatar as ref
          }
        }
      }

      // 4. Call AI
      const imageUrl = await this.aiService.generateStoryboardImage(finalPrompt, referenceImageUrl);

      // 5. Save result
      return await this.update(id, {
        imageUrl,
        prompt: finalPrompt, // Save the assembled prompt
        status: 'DONE',
      } as any);
    } catch (error) {
      await this.update(id, { status: 'DRAFT' } as any);
      throw error;
    }
  }

  async refineImage(id: string, instruction: string) {
    const storyboard = await this.findOne(id);
    if (!storyboard) throw new Error('Storyboard not found');
    
    await this.update(id, { status: 'GENERATING' } as any);

    try {
      // Keep consistency: use same reference logic if needed, but here we focus on instruction
      // In real scenario, we might pass the current imageUrl as reference for img2img
      const newImageUrl = await this.aiService.refineStoryboardImage(
        storyboard.prompt || '',
        instruction,
        storyboard.imageUrl || undefined
      );

      return await this.update(id, {
        imageUrl: newImageUrl,
        status: 'DONE',
      } as any);
    } catch (error) {
      await this.update(id, { status: 'DONE' } as any); // Revert to previous state ideally
      throw error;
    }
  }
}
