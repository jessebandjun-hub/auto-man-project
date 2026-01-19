import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';

@Injectable()
export class EpisodesService {
  constructor(private prisma: PrismaService) {}

  create(createEpisodeDto: CreateEpisodeDto) {
    return this.prisma.episode.create({
      data: createEpisodeDto,
    });
  }

  findAll(projectId?: string) {
    return this.prisma.episode.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { sortOrder: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.episode.findUnique({
      where: { id },
    });
  }

  update(id: string, updateEpisodeDto: UpdateEpisodeDto) {
    return this.prisma.episode.update({
      where: { id },
      data: updateEpisodeDto,
    });
  }

  remove(id: string) {
    return this.prisma.episode.delete({
      where: { id },
    });
  }
}
