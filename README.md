# Weather Land
<a href="https://weather-land.vercel.app/" target="_blank">
<img src="src/app/favicon.ico" alt="favicon" width="30" /><br>
</a> 

## Introduction
Weather Land is a demonstration of a 3D weather application that visualizes real-world weather conditions in an interactive natural environment.

The application transforms weather data into a living 3D world featuring dynamic landscapes, sunlight, wind effects, rain, snow, and atmospheric mist, creating an immersive weather experience beyond traditional weather dashboards.

## Features
- 🌤️ Visualization of hourly weather forecasts in a 3D world
- 🌧️ Dynamic weather effects including rain, snow, and mist
- 🌬️ Wind-driven environmental animations
- 🌳 Immersive natural landscapes with interactive 3D elements
- ☀️ Real-time sun positioning and lighting
- 🌙 Seamless day-to-night transitions
- 📍 Location-aware weather data
- 📱 Responsive design for desktop and mobile
- ⚡ High-performance rendering powered by WebGL

## Tech Stack
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Javascript](https://img.shields.io/badge/JavaScript-3178C6?style=for-the-badge&logo=javascript&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)
![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![GLSL](https://img.shields.io/badge/GLSL-5586A4?style=for-the-badge&logo=opengl&logoColor=white)

| Layer            | Technology |
| ---------------- | ---------- |
| Framework        | [Next.js](https://nextjs.org/) |
| UI               | [React](https://react.dev/) |
| Styling          | [Tailwind CSS](https://tailwindcss.com/) |
| 3D Engine        | [Three.js](https://threejs.org/) |
| React Renderer   | [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) |
| 3D Utilities     | [Drei](https://github.com/pmndrs/drei) |
| Shaders          | GLSL |
| Debug Controls   | [Leva](https://github.com/pmndrs/leva) |
| Weather Data     | [Open-Meteo API](https://open-meteo.com/) |
| Deployment       | [Vercel](https://vercel.com/) |

## Project Goal

Weather Land explores how weather information can be presented through immersive 3D environments rather than conventional charts and icons. By combining real-time weather data with interactive graphics, users can experience weather conditions in a more intuitive and engaging way.

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

```env
NEXT_PUBLIC_GEOAPIFY_API=your_GEOAPIFY_API
NEXT_PUBLIC_IPGEOLOCATION_API=your_IPGEOLOCATION_API
NEXT_PUBLIC_FORECAST_API=your_FORECAST_API
```

The application uses Neon for database caching.

If deploying with Vercel, connect a Neon database to the project through the Vercel dashboard. Vercel automatically provides the `DATABASE_URL` environment variable.

After connecting the database, create a table using the following SQL:

```sql
CREATE TABLE YOUR_TABLE (
  id SERIAL PRIMARY KEY,
  lat DOUBLE PRECISION NOT NULL,
  lon DOUBLE PRECISION NOT NULL,
  timezone TEXT NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (lat, lon)
);
```

The `lat` and `lon` columns are unique because the application stores one cached forecast per location. This constraint is also required for the `UNIQUE (lat, lon)` operation used when updating the cache.

`DATABASE_URL` is optional. If it is not provided, the application runs without database caching and fetches weather data directly from the weather API.



### 4. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 5. Create a production build

To create and test a production build:

```bash
npm run build
npm start
```