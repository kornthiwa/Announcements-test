import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';

describe('AnnouncementsController', () => {
  let controller: AnnouncementsController;
  let announcementsService: {
    listAnnouncements: jest.Mock;
    generateAnnouncements: jest.Mock;
  };

  beforeEach(() => {
    announcementsService = {
      listAnnouncements: jest.fn(),
      generateAnnouncements: jest.fn(),
    };
    controller = new AnnouncementsController(
      announcementsService as unknown as AnnouncementsService,
    );
  });

  it('delegates listAnnouncements to service with query params', async () => {
    const params = { page: 1, limit: 10, search: 'news' };
    const expected = { data: [], page: 1, limit: 10, total: 0 };
    announcementsService.listAnnouncements.mockResolvedValue(expected);

    const result = await controller.listAnnouncements(params);

    expect(announcementsService.listAnnouncements).toHaveBeenCalledWith(params);
    expect(result).toEqual(expected);
  });

  it('delegates generateAnnouncements endpoint to service', async () => {
    const expected = { data: { count: 100 } };
    announcementsService.generateAnnouncements.mockResolvedValue(expected);

    const result = await controller.generateAnnouncements();

    expect(announcementsService.generateAnnouncements).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expected);
  });
});
