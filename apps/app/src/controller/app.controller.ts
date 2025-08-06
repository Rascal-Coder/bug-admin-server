import { Controller, Get } from '@nestjs/common';
import { AppService } from '../service/app.service';
import { ApiTags } from '@nestjs/swagger';
import { I18nService } from 'nestjs-i18n';

@ApiTags('App root')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly i18n: I18nService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/test')
  test() {
    return this.i18n.t('test11.aa');
  }

  @Get('/test2')
  test2() {
    return this.i18n.t('system.test.aa');
  }
}
