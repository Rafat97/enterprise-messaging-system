import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
  Min,
  Length,
} from 'class-validator';
import { CreateMessageOptionsDto } from './create-message-option.dto';

export class CreateDelayedMessageDto {
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
  message: { [x: string]: any };

  @ApiProperty({ example: 10, description: 'Delay in millisecond' })
  @IsNumber()
  @IsPositive()
  @Min(10)
  delay: number;
}
