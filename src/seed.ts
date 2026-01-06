import weaviate from 'weaviate-ts-client';
import { italianCities } from './data/cities.data';

async function seedDatabase() {
  console.log('Starting database seeding...');

  const client = weaviate.client({
    scheme: 'http',
    host: process.env.WEAVIATE_HOST || 'localhost:8080',
  });

  try {
    // Check if Weaviate is ready
    const isReady = await client.misc.liveChecker().do();
    console.log('Weaviate is ready:', isReady);

    // Ensure schema exists
    const className = 'City';
    const exists = await client.schema
      .classGetter()
      .withClassName(className)
      .do()
      .catch(() => null);

    if (!exists) {
      console.log('Creating City schema...');
      const classObj = {
        class: className,
        description: 'Italian cities and municipalities',
        properties: [
          {
            name: 'name',
            dataType: ['text'],
            description: 'City name',
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

      await client.schema.classCreator().withClass(classObj).do();
      console.log('City schema created successfully');
    } else {
      console.log('City schema already exists');
    }

    // Seed cities
    console.log(`Seeding ${italianCities.length} cities...`);
    let successCount = 0;
    let errorCount = 0;

    for (const city of italianCities) {
      try {
        await client.data
          .creator()
          .withClassName(className)
          .withProperties(city)
          .do();
        successCount++;
        console.log(`Added: ${city.name}`);
      } catch (error) {
        errorCount++;
        console.error(`Error adding ${city.name}:`, error.message);
      }
    }

    console.log('\n=== Seeding Summary ===');
    console.log(`Successfully added: ${successCount} cities`);
    console.log(`Errors: ${errorCount}`);
    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
