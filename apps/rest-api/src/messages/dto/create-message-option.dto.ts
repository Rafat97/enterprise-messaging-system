import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageOptionsDto {
  @ApiProperty({ description: 'Add this value when you want to give unique message' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  jobId?: string;

  @ApiProperty({
    example: 1,
    description:
      'Set the message priority,  Ranges from 1 (highest priority) to MAX_INT (lowest priority)',
  })
  @IsNotEmpty()
  @IsInt()
  @IsOptional()
  priority?: number;
}
