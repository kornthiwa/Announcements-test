import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateAnnouncementDto,
  CreateAnnouncementResponseDto,
} from './dto/create-announcement.dto';
import {
  DeleteAnnouncementResponseDto,
  UpdateAnnouncementDto,
  UpdateAnnouncementResponseDto,
} from './dto/update-announcement.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  GetAnnouncementResponseDto,
  ListAnnouncementDto,
  ListAnnouncementResponseDto,
} from './dto/list-announcement.dto';
import { Announcement } from './entities/announcement.entity';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly prisma: PrismaService) {}

  async generateAnnouncements(): Promise<{ data: { count: number } }> {
    const records = Array.from({ length: 100 }, (_, index) => {
      const sequence = index + 1;
      const isPinned = sequence % 10 === 0;

      return {
        title: `Generated announcement ${sequence}`,
        body: `Auto-generated body for announcement ${sequence}.`,
        author: `system-${(sequence % 5) + 1}`,
        pinned: isPinned,
      };
    });

    const result = await this.prisma.announcements.createMany({
      data: records,
    });

    return {
      data: {
        count: result.count,
      },
    };
  }

  async listAnnouncements(
    params: ListAnnouncementDto,
  ): Promise<ListAnnouncementResponseDto> {
    const { page, limit, search } = params;
    const pageNumber = Math.max(page ?? 1, 1);
    const pageSize = Math.max(limit ?? 10, 1);
    const createdDateSort = 'desc';
    const whereClause = {
      title: { contains: search },
    };

    const total = await this.prisma.announcements.count({
      where: whereClause,
    });

    const announcements = await this.prisma.announcements.findMany({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      where: whereClause,
      orderBy: [{ pinned: 'desc' }, { created_at: createdDateSort }],
    });

    const displayItems: Announcement[] = announcements.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      author: announcement.author,
      body: announcement.body,
      pinned: announcement.pinned,
      created_at: announcement.created_at,
      updated_at: announcement.updated_at,
    }));

    return {
      data: displayItems,
      page: pageNumber,
      limit: pageSize,
      total,
    };
  }

  async getAnnouncement(id: number): Promise<GetAnnouncementResponseDto> {
    const announcement = await this.prisma.announcements.findUnique({
      where: { id },
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    return {
      data: announcement,
    };
  }

  async createAnnouncement(
    createAnnouncementDto: CreateAnnouncementDto,
  ): Promise<CreateAnnouncementResponseDto> {
    const announcement = await this.prisma.announcements.create({
      data: createAnnouncementDto,
    });
    return {
      data: announcement,
    };
  }

  async updateAnnouncement(
    id: number,
    updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<UpdateAnnouncementResponseDto> {
    const announcement = await this.prisma.announcements.update({
      where: { id },
      data: updateAnnouncementDto,
    });
    return {
      data: announcement,
    };
  }

  async removeAnnouncement(id: number): Promise<DeleteAnnouncementResponseDto> {
    const announcement = await this.prisma.announcements.delete({
      where: { id },
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    return {
      data: announcement,
    };
  }
}
