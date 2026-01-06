import { Injectable, Logger } from '@nestjs/common';
import { WeaviateService } from '../weaviate/weaviate.service';
import { City } from './city.interface';

@Injectable()
export class CitiesService {
  private readonly logger = new Logger(CitiesService.name);

  constructor(private readonly weaviateService: WeaviateService) {}

  async searchByName(query: string, limit?: number): Promise<City[]> {
    this.logger.log(`Searching cities with query: ${query}`);
    return this.weaviateService.searchCitiesByName(query, limit);
  }

  async getAllCities(limit?: number): Promise<City[]> {
    this.logger.log('Getting all cities');
    return this.weaviateService.getAllCities(limit);
  }
}
