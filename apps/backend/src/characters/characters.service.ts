import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';
import { ProjectsService } from '../projects/projects.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';

@Injectable()
export class CharactersService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private projectsService: ProjectsService,
  ) {}

  create(createCharacterDto: CreateCharacterDto) {
    return this.prisma.character.create({
      data: createCharacterDto,
    });
  }

  findAll(projectId: string) {
    return this.prisma.character.findMany({
      where: { projectId },
    });
  }

  findOne(id: string) {
    return this.prisma.character.findUnique({
      where: { id },
    });
  }

  update(id: string, updateCharacterDto: UpdateCharacterDto) {
    return this.prisma.character.update({
      where: { id },
      data: updateCharacterDto,
    });
  }

  remove(id: string) {
    return this.prisma.character.delete({
      where: { id },
    });
  }

  async extractFromScript(projectId: string) {
    const script = await this.projectsService.getScript(projectId);
    if (!script) {
      throw new Error('No script found for this project');
    }

    const charactersData = await this.aiService.extractCharacters(script);
    
    // Create characters in bulk (or one by one to avoid duplicates if needed)
    // For now, simple create
    const createdCharacters = [];
    for (const charData of charactersData) {
      const char = await this.prisma.character.create({
        data: {
          name: charData.name,
          description: charData.description,
          tags: charData.tags,
          projectId,
        },
      });
      createdCharacters.push(char);
    }
    return createdCharacters;
  }

  async generateAvatar(id: string, promptAdjustment?: string) {
    const character = await this.findOne(id);
    if (!character) throw new Error('Character not found');

    const prompt = `${character.description}, ${character.tags || ''}, ${promptAdjustment || ''}`;
    const avatarUrl = await this.aiService.generateAvatar(prompt);
    return { avatarUrl };
  }

  async lock(id: string, selectedImageUrl: string, finalTags?: string) {
    return this.prisma.character.update({
      where: { id },
      data: {
        avatarUrl: selectedImageUrl,
        tags: finalTags,
      },
    });
  }
}
