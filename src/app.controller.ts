import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('video')
  getVideo(@Req() request: any, @Res() result: any) {
    return this.appService.getVideo(request, result);
  }
}
