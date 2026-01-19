import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { StoryboardsService } from './storyboards.service';
import { CreateStoryboardDto } from './dto/create-storyboard.dto';
import { UpdateStoryboardDto } from './dto/update-storyboard.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class StoryboardsController {
  constructor(private readonly storyboardsService: StoryboardsService) {}

  @Post('episodes/:episodeId/storyboards/auto')
  autoSplit(@Param('episodeId') episodeId: string) {
    return this.storyboardsService.autoSplit(episodeId);
  }

  @Get('episodes/:episodeId/storyboards')
  findAll(@Param('episodeId') episodeId: string) {
    return this.storyboardsService.findAll(episodeId);
  }

  @Patch('storyboards/:id')
  update(@Param('id') id: string, @Body() updateStoryboardDto: UpdateStoryboardDto) {
    return this.storyboardsService.update(id, updateStoryboardDto);
  }

  @Delete('storyboards/:id')
  remove(@Param('id') id: string) {
    return this.storyboardsService.remove(id);
  }

  @Post('storyboards/:id/image/generate')
  generateImage(@Param('id') id: string, @Body() body: { useRefImage: boolean }) {
    return this.storyboardsService.generateImage(id, body.useRefImage);
  }

  @Post('storyboards/:id/refine')
  refineImage(@Param('id') id: string, @Body() body: { instruction: string }) {
    return this.storyboardsService.refineImage(id, body.instruction);
  }

  @Post('storyboards/:id/video/generate')
  generateVideo(@Param('id') id: string, @Body() body: { motionPrompt: string }) {
    return this.storyboardsService.generateVideo(id, body.motionPrompt);
  }

  @Post('episodes/:episodeId/export')
  exportVideo(@Param('episodeId') episodeId: string) {
    return this.storyboardsService.exportVideo(episodeId);
  }

  @Post('episodes/:episodeId/tts')
  generateTTS(@Param('episodeId') episodeId: string) {
    return this.storyboardsService.generateTTS(episodeId);
  }
}
