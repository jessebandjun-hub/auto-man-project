import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from '../ai/ai.service';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly aiService: AiService,
  ) {}

  @Post()
  create(@Request() req: any, @Body() createProjectDto: CreateProjectDto) {
    // Override userId with current authenticated user
    return this.projectsService.create({
      ...createProjectDto,
      userId: req.user.userId,
    });
  }

  @Get()
  findAll(@Request() req: any) {
    return this.projectsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Post(':id/script/generate')
  async generateScript(@Param('id') id: string, @Body() body: { idea: string; genre: string }) {
    const script = await this.aiService.generateScript(body.idea, body.genre);
    await this.projectsService.updateScript(id, script);
    return { script };
  }

  @Patch(':id/script')
  updateScript(@Param('id') id: string, @Body() body: { content: string }) {
    return this.projectsService.updateScript(id, body.content);
  }

  @Get(':id/script')
  getScript(@Param('id') id: string) {
    return this.projectsService.getScript(id);
  }
}

