# Cities Vector Database API

A backend API built with NestJS and Weaviate vector database to search and query Italian cities and municipalities, with an Angular frontend featuring a reusable Web Component.

## Features

### Backend
- **NestJS Backend API** with TypeORM support
- **Weaviate Vector Database** for efficient city searches
- **Flexible Fuzzy Search** with typo tolerance using Levenshtein distance
- **Italian Cities Data** with ISO codes, Belfiore codes, districts, and regions
- **REST API Endpoints** to search cities by name with multiple matching strategies
- **Docker Compose** for easy setup

### Frontend
- **Angular 17 Frontend** with reusable city search component
- **Angular Elements** - Component exported as Web Component for use in any webpage
- **Real-time Search** with debouncing and auto-complete
- **Selectable Combobox** with dropdown results
- **Detailed City Information** display
- **Configurable** API endpoint and search parameters

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

## Frontend Setup

The project includes an Angular frontend with a reusable city search component built as an Angular Element (Web Component).

### 1. Navigate to frontend directory

```bash
cd frontend
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Start the frontend development server

```bash
npm start
```

The frontend will be available at `http://localhost:4200`.

**Note:** Make sure the backend API is running before starting the frontend.

### Build the frontend for production

```bash
cd frontend
npm run build
```

For more details about the frontend, see [frontend/README.md](frontend/README.md).

## API Endpoints

### Search Cities by Name

Search for cities by name using a query parameter with **fuzzy matching** support:

```bash
GET /cities/search?name=Roma&limit=10
```

**Features:**
- **Exact matching**: Finds cities with exact name matches
- **Prefix matching**: Matches city names that start with the query
- **Substring matching**: Finds cities containing the query text
- **Typo tolerance**: Handles minor spelling mistakes using Levenshtein distance (up to 2 character edits)
- **Case-insensitive**: Searches work regardless of letter casing

**Parameters:**
- `name` (required): Search query for city name
- `limit` (optional): Maximum number of results (default: 10)

**Example Queries:**
```bash
# Exact match
curl "http://localhost:3000/cities/search?name=Roma"

# English variation
curl "http://localhost:3000/cities/search?name=Rome"

# Typo with extra character
curl "http://localhost:3000/cities/search?name=Romma"

# Prefix match
curl "http://localhost:3000/cities/search?name=Mil"
```

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
├── package.json                # Backend dependencies and scripts
├── src/                        # Backend source code
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
├── frontend/                   # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── city-search/   # Reusable city search component
│   │   │   ├── app.component.* # Root component with demo
│   │   │   └── app.module.ts  # Angular module configuration
│   │   ├── demo.html          # Standalone Web Component demo
│   │   ├── main.ts            # Bootstrap & Angular Elements config
│   │   └── polyfills.ts       # Polyfills for Web Components
│   ├── angular.json           # Angular CLI configuration
│   ├── package.json           # Frontend dependencies
│   └── README.md              # Frontend documentation
└── README.md                   # This file
```

## Technologies Used

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for TypeScript and JavaScript
- **Weaviate** - Vector database for semantic search
- **Docker** - Containerization platform
- **TypeScript** - Typed superset of JavaScript

### Frontend
- **Angular 17** - Frontend framework
- **Angular Elements** - For creating Web Components
- **RxJS** - Reactive programming for search debouncing
- **HttpClient** - For API communication
- **TypeScript** - Type-safe development

## Testing the API

You can test the API using curl or any HTTP client:

### Search with exact match
```bash
curl "http://localhost:3000/cities/search?name=Roma"
```

### Search with English variation
```bash
curl "http://localhost:3000/cities/search?name=Rome"
```

### Search with typo (fuzzy matching)
```bash
curl "http://localhost:3000/cities/search?name=Romma"
curl "http://localhost:3000/cities/search?name=Milamo"
```

### Search with prefix
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
