import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { FrameworkModule } from 'apps/framework/src/framework.module';
import { CommonModule } from 'apps/common/src/common.module';

@Module({
  imports: [FrameworkModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit(): any {
    console.log('app onModuleInit');
  }
}
