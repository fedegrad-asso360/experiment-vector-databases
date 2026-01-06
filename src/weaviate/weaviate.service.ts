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
        // Create the schema for cities
        const classObj = {
          class: this.className,
          description: 'Italian cities and municipalities',
          vectorizer: 'none',
          properties: [
            {
              name: 'name',
              dataType: ['text'],
              description: 'City name',
              tokenization: 'word',
            },
            {
              name: 'isoCode',
              dataType: ['text'],
              description: 'ISO code',
            },
            {
              name: 'belfioreCode',
              dataType: ['text'],
              description: 'Belfiore code',
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
            },
            {
              name: 'region',
              dataType: ['text'],
              description: 'Region',
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
      // Normalize query to lowercase for case-insensitive matching
      const normalizedQuery = query.toLowerCase();
      
      // Get all cities (or a reasonable subset) to apply fuzzy matching
      const allCitiesResult = await this.client.graphql
        .get()
        .withClassName(this.className)
        .withFields('name isoCode belfioreCode cityId district region')
        .withLimit(100) // Get more cities for better fuzzy matching
        .do();

      const allCities = allCitiesResult.data.Get[this.className] || [];

      // Apply fuzzy matching: calculate similarity scores
      const scoredCities = allCities
        .map((city) => ({
          ...city,
          score: this.calculateSimilarity(normalizedQuery, city.name.toLowerCase()),
        }))
        .filter((city) => city.score > 0) // Only include cities with some similarity
        .sort((a, b) => b.score - a.score) // Sort by descending score
        .slice(0, limit) // Take top N results
        .map(({ score, ...city }) => city); // Remove score from final result

      return scoredCities;
    } catch (error) {
      this.logger.error('Error searching cities', error);
      throw error;
    }
  }

  /**
   * Calculate similarity between query and city name using multiple methods:
   * 1. Exact match
   * 2. Starts with query
   * 3. Contains query as substring
   * 4. Levenshtein distance for typo tolerance
   */
  private calculateSimilarity(query: string, cityName: string): number {
    // Exact match gets highest score
    if (query === cityName) {
      return 1000;
    }

    // Starts with query
    if (cityName.startsWith(query)) {
      return 800;
    }

    // Contains query as substring
    if (cityName.includes(query)) {
      return 600;
    }

    // Calculate Levenshtein distance for fuzzy matching
    const distance = this.levenshteinDistance(query, cityName);
    const maxLength = Math.max(query.length, cityName.length);
    
    // If distance is small relative to length, it's a good match
    if (distance <= 2 && maxLength - distance >= 3) {
      return 400 - distance * 50;
    }

    // Check if query is a prefix of cityName with small edit distance
    if (cityName.length >= query.length) {
      const prefix = cityName.substring(0, query.length);
      const prefixDistance = this.levenshteinDistance(query, prefix);
      if (prefixDistance <= 2) {
        return 300 - prefixDistance * 50;
      }
    }

    return 0;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1,     // deletion
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
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
