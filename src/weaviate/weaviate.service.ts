import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client';

@Injectable()
export class WeaviateService implements OnModuleInit {
  private client: WeaviateClient;
  private readonly logger = new Logger(WeaviateService.name);
  private readonly className = 'City';

  async onModuleInit() {
    this.client = weaviate.client({
      scheme: 'http',
      host: process.env.WEAVIATE_HOST || 'localhost:8080',
    });

    await this.ensureSchema();
  }

  private async ensureSchema() {
    try {
      // Check if the class already exists
      const exists = await this.client.schema
        .classGetter()
        .withClassName(this.className)
        .do()
        .catch(() => null);

      if (!exists) {
        // Create the schema for cities with vectorization enabled
        const classObj = {
          class: this.className,
          description: 'Italian cities and municipalities',
          vectorizer: 'text2vec-contextionary',
          moduleConfig: {
            'text2vec-contextionary': {
              vectorizeClassName: false,
            },
          },
          properties: [
            {
              name: 'name',
              dataType: ['text'],
              description: 'City name',
              moduleConfig: {
                'text2vec-contextionary': {
                  skip: false,
                  vectorizePropertyName: false,
                },
              },
            },
            {
              name: 'isoCode',
              dataType: ['text'],
              description: 'ISO code',
              moduleConfig: {
                'text2vec-contextionary': {
                  skip: true,
                },
              },
            },
            {
              name: 'belfioreCode',
              dataType: ['text'],
              description: 'Belfiore code',
              moduleConfig: {
                'text2vec-contextionary': {
                  skip: true,
                },
              },
            },
            {
              name: 'cityId',
              dataType: ['int'],
              description: 'City ID',
            },
            {
              name: 'district',
              dataType: ['text'],
              description: 'District/Province',
              moduleConfig: {
                'text2vec-contextionary': {
                  skip: true,
                },
              },
            },
            {
              name: 'region',
              dataType: ['text'],
              description: 'Region',
              moduleConfig: {
                'text2vec-contextionary': {
                  skip: true,
                },
              },
            },
          ],
        };

        await this.client.schema.classCreator().withClass(classObj).do();
        this.logger.log('City schema created successfully');
      } else {
        this.logger.log('City schema already exists');
      }
    } catch (error) {
      this.logger.error('Error ensuring schema', error);
      throw error;
    }
  }

  async addCity(city: {
    name: string;
    isoCode: string;
    belfioreCode: string;
    cityId: number;
    district: string;
    region: string;
  }) {
    try {
      const result = await this.client.data
        .creator()
        .withClassName(this.className)
        .withProperties(city)
        .do();
      return result;
    } catch (error) {
      this.logger.error('Error adding city', error);
      throw error;
    }
  }

  async searchCitiesByName(query: string, limit: number = 10) {
    try {
      const result = await this.client.graphql
        .get()
        .withClassName(this.className)
        .withFields('name isoCode belfioreCode cityId district region')
        .withNearText({
          concepts: [query],
        })
        .withLimit(limit)
        .do();

      return result.data.Get[this.className] || [];
    } catch (error) {
      this.logger.error('Error searching cities', error);
      throw error;
    }
  }

  async getAllCities(limit: number = 100) {
    try {
      const result = await this.client.graphql
        .get()
        .withClassName(this.className)
        .withFields('name isoCode belfioreCode cityId district region')
        .withLimit(limit)
        .do();

      return result.data.Get[this.className] || [];
    } catch (error) {
      this.logger.error('Error getting all cities', error);
      throw error;
    }
  }

  async deleteAllCities() {
    try {
      // Delete all objects of the City class
      await this.client.batch
        .objectsBatchDeleter()
        .withClassName(this.className)
        .withWhere({
          path: ['name'],
          operator: 'Like',
          valueText: '*',
        })
        .do();
      this.logger.log('All cities deleted successfully');
    } catch (error) {
      this.logger.error('Error deleting all cities', error);
      throw error;
    }
  }

  getClient(): WeaviateClient {
    return this.client;
  }
}
