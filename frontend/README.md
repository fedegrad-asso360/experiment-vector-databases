# City Search Frontend - Angular Elements

This is an Angular frontend project that provides a reusable city search component as an Angular Element (Web Component). The component queries the backend API to search for Italian cities and displays the results in a selectable combobox.

## Features

- 🎯 **Reusable Web Component** - Built with Angular Elements for use anywhere
- 🔍 **Real-time Search** - Search cities with debouncing and auto-complete
- 📦 **Selectable Combobox** - Dropdown with clickable city results
- 📊 **Detailed Information** - Display complete city data when selected
- 🌐 **API Integration** - Queries the backend vector database API
- ⚡ **Configurable** - Customizable API URL, placeholder, and result limit

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on `http://localhost:3000`

## Installation

### 1. Install dependencies

```bash
cd frontend
npm install
```

## Development

### Start development server

```bash
npm start
```

The application will be available at `http://localhost:4200`.

### Build for production

```bash
npm run build
```

The built files will be in the `dist/frontend` directory.

## Using as Angular Element (Web Component)

### In Angular Application

1. The component is already configured in `app.module.ts`
2. Use it in your templates:

```html
<app-city-search 
  apiUrl="http://localhost:3000/cities/search"
  placeholder="Search for a city..."
  [limit]="10"
  (citySelected)="onCitySelected($event)">
</app-city-search>
```

### As a Web Component (in any HTML page)

After building the project, include the generated JavaScript files and use the custom element:

```html
<!DOCTYPE html>
<html>
<head>
  <title>City Search Demo</title>
  <!-- Include the built Angular Element scripts -->
  <script src="dist/frontend/browser/main-*.js" defer></script>
  <script src="dist/frontend/browser/polyfills-*.js" defer></script>
</head>
<body>
  <!-- Use the custom element -->
  <city-search-element
    apiUrl="http://localhost:3000/cities/search"
    placeholder="Search for Italian cities..."
    limit="10">
  </city-search-element>

  <script>
    // Listen for city selection events
    const citySearch = document.querySelector('city-search-element');
    citySearch.addEventListener('citySelected', (event) => {
      console.log('City selected:', event.detail);
    });
  </script>
</body>
</html>
```

## Component API

### Inputs (Attributes)

- `apiUrl` (string) - Backend API endpoint URL (default: `http://localhost:3000/cities/search`)
- `placeholder` (string) - Input placeholder text (default: `Search for a city...`)
- `limit` (number) - Maximum number of results to display (default: `10`)

### Outputs (Events)

- `citySelected` - Emitted when a city is selected from the dropdown
  - Event detail contains the selected city object or `null` when cleared

### City Object Structure

```typescript
interface City {
  name: string;           // City name (e.g., "Roma")
  isoCode: string;        // ISO code (e.g., "IT-RM")
  belfioreCode: string;   // Belfiore code
  cityId: number;         // Unique identifier
  district: string;       // District/Province name
  region: string;         // Italian region name
}
```

## Demo Page

A standalone demo page is included at `src/demo.html`. After building the project, you can:

1. Build the project: `npm run build`
2. Serve the dist folder with any web server
3. Open `demo.html` in your browser

Example using a simple HTTP server:

```bash
# After building
cd dist/frontend
npx http-server -p 8080
# Open http://localhost:8080/demo.html
```

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── city-search/              # City search component
│   │   │   ├── city-search.component.ts
│   │   │   ├── city-search.component.html
│   │   │   ├── city-search.component.css
│   │   │   └── city-search.component.spec.ts
│   │   ├── app.component.ts          # Root component
│   │   ├── app.component.html        # Demo page template
│   │   └── app.module.ts             # Main module
│   ├── demo.html                     # Standalone demo page
│   ├── main.ts                       # Bootstrap & Angular Elements config
│   ├── polyfills.ts                  # Polyfills including custom elements
│   └── styles.css                    # Global styles
├── angular.json                       # Angular CLI configuration
├── package.json                       # Dependencies and scripts
├── tsconfig.json                      # TypeScript configuration
└── README.md                          # This file
```

## Technologies Used

- **Angular 17** - Frontend framework
- **Angular Elements** - For creating Web Components
- **RxJS** - Reactive programming for search debouncing
- **HttpClient** - For API communication
- **TypeScript** - Type-safe development

## Backend API

This component requires the backend API to be running. The API should provide a search endpoint:

```
GET /cities/search?name={query}&limit={limit}
```

Response format:
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

## Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run lint` - Lint the code

## License

MIT
