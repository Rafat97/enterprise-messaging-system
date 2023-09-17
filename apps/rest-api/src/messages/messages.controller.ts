import { Controller, Post, Body, Headers, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateDelayedMessageDto } from './dto/create-delayed-message.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateWithoutDelayedMessageDto } from './dto/create-without-delayed-message.dto';
import { Request } from 'express';
import { QueueRedisRateLimit } from './guard/redisRateLimitGuard.guard';

@ApiTags('messages')
@Controller('/v1/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('/delayed-message')
  @QueueRedisRateLimit()
  createDelayedMessage(
    @Req() req: Request,
    @Body() createMessageDto: CreateDelayedMessageDto,
    @Headers() header: Headers,
  ) {
    return this.messagesService.createDelayedMessage(req, header, createMessageDto);
  }

  @Post('/without-delayed-message')
  @QueueRedisRateLimit()
  createWithoutDelayedMessage(
    @Req() req: Request,
    @Body() createMessageDto: CreateWithoutDelayedMessageDto,
    @Headers() header: Headers,
  ) {
    return this.messagesService.createWithoutDelayedMessage(req, header, createMessageDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.messagesService.findOne(id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.messagesService.remove(id);
  // }
}
