import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import {
  ListAnnouncementDto,
  ListAnnouncementResponseDto,
} from './dto/list-announcement.dto';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  listAnnouncements(
    @Query() params: ListAnnouncementDto,
  ): Promise<ListAnnouncementResponseDto> {
    return this.announcementsService.listAnnouncements(params);
  }

  @Get(':id')
  getAnnouncement(@Param('id') id: string) {
    return this.announcementsService.getAnnouncement(+id);
  }

  @Post()
  create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementsService.createAnnouncement(createAnnouncementDto);
  }

  @Post('generate')
  generateAnnouncements() {
    return this.announcementsService.generateAnnouncements();
  }

  @Patch(':id')
  updateAnnouncement(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    return this.announcementsService.updateAnnouncement(
      +id,
      updateAnnouncementDto,
    );
  }

  @Delete(':id')
  removeAnnouncement(@Param('id') id: string) {
    return this.announcementsService.removeAnnouncement(+id);
  }
}
