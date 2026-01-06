import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CitiesModule } from './cities/cities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CitiesModule,
  ],
})
export class AppModule {}
