import { NotFoundException } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AnnouncementsService', () => {
  let service: AnnouncementsService;
  let prisma: {
    announcements: {
      count: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      announcements: {
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };
    service = new AnnouncementsService(prisma as unknown as PrismaService);
  });

  it('lists announcements with pinned-first order and pagination params', async () => {
    const createdAt = new Date('2026-04-20T00:00:00.000Z');
    prisma.announcements.count.mockResolvedValue(3);
    prisma.announcements.findMany.mockResolvedValue([
      {
        id: 10,
        title: 'Pinned item',
        body: 'Body',
        author: 'Admin',
        pinned: true,
        created_at: createdAt,
        updated_at: createdAt,
      },
    ]);

    const response = await service.listAnnouncements({
      page: 2,
      limit: 5,
      search: 'Pinned',
    });

    expect(prisma.announcements.findMany).toHaveBeenCalledWith({
      skip: 5,
      take: 5,
      where: { title: { contains: 'Pinned' } },
      orderBy: [{ pinned: 'desc' }, { created_at: 'desc' }],
    });
    expect(response.total).toBe(3);
    expect(response.page).toBe(2);
    expect(response.limit).toBe(5);
    expect(response.data).toHaveLength(1);
    expect(response.data[0]?.pinned).toBe(true);
  });

  it('throws NotFoundException when requested announcement does not exist', async () => {
    prisma.announcements.findUnique.mockResolvedValue(null);

    await expect(service.getAnnouncement(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
