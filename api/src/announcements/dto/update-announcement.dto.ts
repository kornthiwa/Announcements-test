import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { Announcement } from '../entities/announcement.entity';

export class UpdateAnnouncementDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  author?: string;

  @IsOptional()
  @IsBoolean()
  pinned?: boolean;
}

export class UpdateAnnouncementResponseDto {
  data: Announcement;
}

export class DeleteAnnouncementResponseDto {
  data: Announcement;
}
