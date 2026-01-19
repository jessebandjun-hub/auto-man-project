import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post('characters')
  create(@Body() createCharacterDto: CreateCharacterDto) {
    return this.charactersService.create(createCharacterDto);
  }

  // Handle /projects/:projectId/characters
  @Get('projects/:projectId/characters')
  findAllByProject(@Param('projectId') projectId: string) {
    return this.charactersService.findAll(projectId);
  }

  // Handle /projects/:projectId/characters/extract
  @Post('projects/:projectId/characters/extract')
  extractFromScript(@Param('projectId') projectId: string) {
    return this.charactersService.extractFromScript(projectId);
  }

  @Get('characters/:id')
  findOne(@Param('id') id: string) {
    return this.charactersService.findOne(id);
  }

  @Patch('characters/:id')
  update(@Param('id') id: string, @Body() updateCharacterDto: UpdateCharacterDto) {
    return this.charactersService.update(id, updateCharacterDto);
  }

  @Delete('characters/:id')
  remove(@Param('id') id: string) {
    return this.charactersService.remove(id);
  }

  @Post('characters/:id/avatar/generate')
  generateAvatar(@Param('id') id: string, @Body() body: { prompt_adjustment?: string }) {
    return this.charactersService.generateAvatar(id, body.prompt_adjustment);
  }

  @Post('characters/:id/lock')
  lock(@Param('id') id: string, @Body() body: { selectedImageUrl: string; finalTags?: string }) {
    return this.charactersService.lock(id, body.selectedImageUrl, body.finalTags);
  }
}
