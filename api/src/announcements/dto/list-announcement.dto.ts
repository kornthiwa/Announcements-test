import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Announcement } from '../entities/announcement.entity';

export class ListAnnouncementDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort?: string;
}

export class ListAnnouncementResponseDto {
  data: Announcement[];
  total: number;
  page: number;
  limit: number;
}

export class GetAnnouncementResponseDto {
  data: Announcement;
}
