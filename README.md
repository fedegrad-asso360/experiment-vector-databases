# Cities Vector Database API

A backend API built with NestJS and Weaviate vector database to search and query Italian cities and municipalities.

## Features

- **NestJS Backend API** with TypeORM support
- **Weaviate Vector Database** for efficient city searches
- **Italian Cities Data** with ISO codes, Belfiore codes, districts, and regions
- **REST API Endpoints** to search cities by name
- **Docker Compose** for easy setup

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/fedegrad-asso360/experiment-vector-databases.git
cd experiment-vector-databases
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` if you need to customize the Weaviate host or port.

### 4. Start Weaviate with Docker Compose

> **Note:** Make sure Docker Desktop is running before executing this command.

```bash
docker compose up -d
```

This will start a Weaviate instance on `http://localhost:8080`.

### 5. Seed the database with Italian cities

```bash
npm run seed
```

This will populate the Weaviate database with 50 Italian cities and municipalities.

### 6. Start the NestJS API server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

## API Endpoints

### Search Cities by Name

Search for cities by name using a query parameter:

```bash
GET /cities/search?name=Roma&limit=10
```

**Parameters:**
- `name` (required): Search query for city name
- `limit` (optional): Maximum number of results (default: 10)

**Example Response:**
```json
{
  "query": "Roma",
  "count": 1,
  "results": [
    {
      "name": "Roma",
      "isoCode": "IT-RM",
      "belfioreCode": "H501",
      "cityId": 1,
      "district": "Roma",
      "region": "Lazio"
    }
  ]
}
```

### Get All Cities

Retrieve all cities from the database:

```bash
GET /cities?limit=100
```

**Parameters:**
- `limit` (optional): Maximum number of results (default: 100)

**Example Response:**
```json
{
  "count": 50,
  "results": [
    {
      "name": "Roma",
      "isoCode": "IT-RM",
      "belfioreCode": "H501",
      "cityId": 1,
      "district": "Roma",
      "region": "Lazio"
    },
    ...
  ]
}
```

## Data Structure

Each city contains the following information:

- **name**: City name (e.g., "Roma", "Milano")
- **isoCode**: ISO code (e.g., "IT-RM", "IT-MI")
- **belfioreCode**: Belfiore code (Italian cadastral code)
- **cityId**: Unique identifier
- **district**: District/Province name
- **region**: Italian region name

## Development

### Build the project

```bash
npm run build
```

### Run in production mode

```bash
npm run start:prod
```

### Format code

```bash
npm run format
```

### Lint code

```bash
npm run lint
```

## Project Structure

```
.
├── docker-compose.yml          # Docker Compose configuration for Weaviate
├── package.json                # Project dependencies and scripts
├── src/
│   ├── main.ts                # Application entry point
│   ├── app.module.ts          # Root application module
│   ├── cities/                # Cities module
│   │   ├── cities.module.ts   # Cities module configuration
│   │   ├── cities.controller.ts # REST API endpoints
│   │   ├── cities.service.ts  # Business logic
│   │   └── city.interface.ts  # City data interface
│   ├── weaviate/              # Weaviate integration module
│   │   ├── weaviate.module.ts # Weaviate module configuration
│   │   └── weaviate.service.ts # Weaviate client and operations
│   ├── data/                  # Data files
│   │   └── cities.data.ts     # Italian cities dataset
│   └── seed.ts                # Database seeding script
└── README.md
```

## Technologies Used

- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for TypeScript and JavaScript
- **Weaviate** - Vector database for semantic search
- **Docker** - Containerization platform
- **TypeScript** - Typed superset of JavaScript

## Testing the API

You can test the API using curl or any HTTP client:

### Search for cities containing "Roma"
```bash
curl "http://localhost:3000/cities/search?name=Roma"
```

### Search for cities containing "Mil"
```bash
curl "http://localhost:3000/cities/search?name=Mil&limit=5"
```

### Get all cities
```bash
curl "http://localhost:3000/cities"
```

## Stopping the Services

To stop the Weaviate container:

```bash
docker compose down
```

To stop the Weaviate container and remove volumes:

```bash
docker compose down -v
```

## License

MIT 

## References
```
https://www.youtube.com/watch?v=e03bBeE5jZY
```
Da provare:
- Weaviate (open source) - Milvus (enterprise)
- pgvector (plugin Postgre)
