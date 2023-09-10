import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
  Length,
  IsEnum,
} from 'class-validator';
import { CreateMessageOptionsDto } from './create-message-option.dto';
import { IDriverConfig, IDrivers } from '@fanout/interface';

export enum DriverName {
  KAFKA = 'kafka',
  // HTTP = 'http',
  // NATS = 'nats',
}

export class CreateWithoutDelayedMessageDto {
  @ApiProperty({ description: 'Give the driver name', default: 'kafka' })
  @IsNotEmpty()
  @IsString()
  @IsEnum(DriverName)
  driverName: IDrivers;

  @ApiProperty({ example: null, description: 'Give the driver configuration' })
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
