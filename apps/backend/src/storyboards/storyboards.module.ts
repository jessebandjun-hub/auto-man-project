import { Module } from '@nestjs/common';
import { StoryboardsService } from './storyboards.service';
import { StoryboardsController } from './storyboards.controller';
import { PrismaModule } from '../prisma.module';
import { AiModule } from '../ai/ai.module';
import { ProjectsModule } from '../projects/projects.module';
import { CharactersModule } from '../characters/characters.module';

@Module({
  imports: [PrismaModule, AiModule, ProjectsModule, CharactersModule],
  controllers: [StoryboardsController],
  providers: [StoryboardsService],
})
export class StoryboardsModule {}
