import { Module } from '@nestjs/common';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { WeaviateModule } from '../weaviate/weaviate.module';

@Module({
  imports: [WeaviateModule],
  controllers: [CitiesController],
  providers: [CitiesService],
})
export class CitiesModule {}
