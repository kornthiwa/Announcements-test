import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { Announcement } from '../entities/announcement.entity';

export class CreateAnnouncementDto {
  @IsString()
  @MaxLength(255)
  title!: string;

  @IsString()
  body!: string;

  @IsString()
  @MaxLength(120)
  author!: string;

  @IsOptional()
  @IsBoolean()
  pinned?: boolean;
}

export class CreateAnnouncementResponseDto {
  data: Announcement;
}
