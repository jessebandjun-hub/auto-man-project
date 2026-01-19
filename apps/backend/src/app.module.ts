import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { PrismaModule } from './prisma.module';
import { EpisodesModule } from './episodes/episodes.module';
import { CharactersModule } from './characters/characters.module';
import { AiModule } from './ai/ai.module';
import { StoryboardsModule } from './storyboards/storyboards.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ProjectsModule, EpisodesModule, CharactersModule, AiModule, StoryboardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
