# ClusterTwin AI

![ClusterTwin AI Banner](/screenshots/banner-placeholder.png)

## Overview
ClusterTwin AI is a high-performance Industrial IoT (IIoT) and Digital Twin platform. Designed as a centralized command center, it aggregates telemetry data across multiple factory clusters, leveraging real-time socket communication to provide instant visibility into machine health, production metrics, and critical system anomalies.

## Features
- **Real-Time Telemetry:** Live WebSocket-driven dashboards mapping physical factory floors and tracking real-time machine status.
- **Predictive AI Insights:** Automated heuristics engine forecasting potential machine failures and identifying high-risk assets.
- **Smart Alert System:** Centralized triage dashboard for critical environmental and production anomalies.
- **Role-Based Access Control (RBAC):** Secure JWT authentication enforcing strict Operator, Manager, and Admin hierarchies.
- **Cross-Factory Resource Tracking:** High-level logistics tracking to monitor inventory and output across decentralized clusters.
- **Enterprise-Grade Security:** Hardened API layer featuring strict CORS origins, rate limiting, and NoSQL injection protection.
- **Performance Optimized:** Aggressively code-split and lazy-loaded React SPA utilizing Vite's native `terser` minification for rapid Time-To-Interactive (TTI).

## Tech Stack
**Frontend:**
- React (Lazy-loaded Suspense Architecture)
- React Router DOM
- Tailwind CSS
- Vite (Terser Minification)
- Socket.IO Client
- Axios

**Backend:**
- Node.js & Express.js
- MongoDB Atlas & Mongoose
- Socket.IO Server
- JSON Web Tokens (JWT) & Bcrypt
- Security Middleware (Helmet, XSS-Clean, Express-Mongo-Sanitize, Rate-Limit)

## Folder Structure

```text
clustertwin-ai/
├── backend/
│   ├── controllers/     # Route logic and request handling
│   ├── database/        # Mongoose connection pooling (db.js)
│   ├── middleware/      # Auth, Error, and Caching middleware
│   ├── models/          # MongoDB database schemas
│   ├── routes/          # Express route definitions
│   ├── scripts/         # Standalone generation and simulation tools
│   ├── services/        # Decoupled business logic (e.g., recommendationEngine)
│   ├── utils/           # Helper functions and loggers
│   ├── validations/     # Input validation layers
│   └── server.js        # Core Express entry point
├── src/
│   ├── assets/          # Static images and icons
│   ├── components/      
│   │   ├── auth/        # Protected routing components
│   │   ├── layout/      # Navbars, Sidebars, and Page wrappers
│   │   └── ui/          # Reusable generic components (Cards, Badges, Modals)
│   ├── constants/       # Global frontend constants
│   ├── context/         # Socket and Auth global state providers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Code-split top-level route views
│   ├── routes/          # Centralized React Router configuration
│   ├── services/        # Axios API interceptors
│   ├── styles/          # Global CSS and Tailwind definitions
│   ├── types/           # Type definitions
│   ├── utils/           # Frontend helper logic
│   └── main.jsx         # React application mount point
├── .env                 # Environment variables
├── package.json         # Unified project dependencies
└── vite.config.js       # Custom Vite chunk-splitting configuration
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/clustertwin-ai.git
   cd clustertwin-ai
   ```

2. Install unified dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:5000/api/v1

# Database Configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/clustertwin?retryWrites=true&w=majority

# Security
JWT_SECRET=your_secure_jwt_secret

# Simulators
ENABLE_SIMULATOR=true
```

## Running Frontend

The frontend is powered by Vite. Start the development server by running:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## Running Backend

The backend is powered by Node/Express. Start the server by running:
```bash
npm start
```
The API will bind to `http://localhost:5000`.

## Deployment

The repository is structured to separate concerns for modern PAAS hosting:

- **Frontend (Vercel):** 
  - Vercel will automatically detect the Vite framework.
  - The `vercel.json` file dictates that React Router controls all internal SPA routing.
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - *Ensure you inject `VITE_API_URL` into your Vercel Environment Variables.*

- **Backend (Render):**
  - Create a new Render Web Service targeting this repository.
  - Start Command: `npm start`
  - *Ensure you securely map `MONGO_URI`, `JWT_SECRET`, and `FRONTEND_URL` in the Render dashboard.*

- **Database (MongoDB Atlas):**
  - Provision an Atlas cluster.
  - Whitelist the Render static IPs or allow global access (`0.0.0.0/0`) via the Network Access tab.

## API Overview

The platform exposes a secured RESTful API. All routes (excluding authentication) require a valid JWT passed via the `Authorization: Bearer <token>` header.

- `POST /api/v1/auth/login` - Authenticate user
- `GET /api/v1/factories` - Retrieve top-level cluster metrics
- `GET /api/v1/machines` - Retrieve specific hardware telemetry
- `GET /api/v1/alerts` - Fetch active system anomalies
- `GET /api/v1/ai/insights` - Trigger predictive heuristic calculations

## Screenshots

| Command Center | Predictive Engine |
| :---: | :---: |
| ![Dashboard UI Placeholder](/screenshots/dashboard-placeholder.png) | ![Predictive Engine Placeholder](/screenshots/predictive-placeholder.png) |
| *High-level cluster overview* | *Real-time failure forecasting* |

| Smart Alerts | Resource Logistics |
| :---: | :---: |
| ![Alerts Placeholder](/screenshots/alerts-placeholder.png) | ![Logistics Placeholder](/screenshots/logistics-placeholder.png) |
| *Automated anomaly triage* | *Cross-factory inventory routing* |

## Future Scope

- **Edge IoT Integration:** Push initial telemetry filtering directly to physical factory edge controllers to reduce WebSocket load.
- **Advanced Machine Learning:** Implement Python-based LSTM models for vastly superior Remaining Useful Life (RUL) predictions.
- **Enterprise ERP Webhooks:** Automate supply chain purchase orders directly into SAP/Oracle upon inventory depletion.

## Team

- **Lead Architect / Developer:** [Your Name / Team]

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
