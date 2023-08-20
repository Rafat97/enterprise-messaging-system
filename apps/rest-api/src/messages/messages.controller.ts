import { Controller, Get, Post, Body, Param, Delete, Headers } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateDelayedMessageDto } from './dto/create-delayed-message.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('messages')
@Controller('/v1/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('/delayed-message')
  create(@Body() createMessageDto: CreateDelayedMessageDto, @Headers() header: Headers) {
    return this.messagesService.create(header, createMessageDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}
