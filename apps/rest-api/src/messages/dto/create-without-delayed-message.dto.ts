import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
  Length,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { CreateMessageOptionsDto } from './create-message-option.dto';
import { DriverNameEnum, IDriverConfig, IDrivers } from '@fanout/interface';

export class CreateWithoutDelayedMessageDto {
  @ApiProperty({ description: 'Give the driver name', default: 'kafka' })
  @IsNotEmpty()
  @IsString()
  @IsEnum(DriverNameEnum)
  driverName: IDrivers;

  @ApiProperty({ default: null, description: 'Give the driver configuration' })
  @IsOptional()
  @IsNotEmptyObject({ nullable: true })
  driverConfig: IDriverConfig;

  @ApiProperty({ description: 'Give event name' })
  @IsNotEmpty()
  @IsString()
  @Length(2)
  eventName: string;

  @ApiProperty({ description: 'Message send option' })
  @Type(() => CreateMessageOptionsDto)
  @ValidateNested({ each: true })
  option?: CreateMessageOptionsDto;

  @ApiProperty({ example: { send: 'hello world' }, description: 'Give your message body' })
  @IsNotEmptyObject({ nullable: false })
  data: { [x: string]: any };
}
