import { Controller, Get, Query, Logger } from '@nestjs/common';
import { CitiesService } from './cities.service';

@Controller('cities')
export class CitiesController {
  private readonly logger = new Logger(CitiesController.name);

  constructor(private readonly citiesService: CitiesService) {}

  @Get('search')
  async searchCities(
    @Query('name') name: string,
    @Query('limit') limit?: string,
  ) {
    this.logger.log(`Search request received: name=${name}, limit=${limit}`);
    
    if (!name) {
      return {
        message: 'Please provide a name query parameter',
        example: '/cities/search?name=Roma&limit=10',
      };
    }

    const limitNum = limit ? parseInt(limit, 10) : 10;
    const cities = await this.citiesService.searchByName(name, limitNum);
    
    return {
      query: name,
      count: cities.length,
      results: cities,
    };
  }

  @Get()
  async getAllCities(@Query('limit') limit?: string) {
    this.logger.log(`Get all cities request received: limit=${limit}`);
    const limitNum = limit ? parseInt(limit, 10) : 100;
    const cities = await this.citiesService.getAllCities(limitNum);
    
    return {
      count: cities.length,
      results: cities,
    };
  }
}
