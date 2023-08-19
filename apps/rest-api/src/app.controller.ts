import { Controller, Get, Headers } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Headers() headers) {
    console.log(headers);

    return this.appService.getHello();
  }

  @Get('/retry-failed-jobs')
  getAllJobs() {
    return this.appService.retryFailedJobs();
  }
}
