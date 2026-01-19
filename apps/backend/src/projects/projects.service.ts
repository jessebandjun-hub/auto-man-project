import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: createProjectDto,
    });
  }

  findAll(userId: number) {
    return this.prisma.project.findMany({
      where: { userId },
      include: {
        _count: {
          select: { episodes: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        episodes: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  update(id: string, updateProjectDto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  remove(id: string) {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
