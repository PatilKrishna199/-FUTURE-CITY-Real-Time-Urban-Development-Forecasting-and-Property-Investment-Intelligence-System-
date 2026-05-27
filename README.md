# FutureCity - Real Time Urban Development Forecasting and Property Investment Intelligence System 

---
## Project Title
**FutureCity - Real Time Urban Development Forecasting and Property Investment Intelligence System **
---
*"A full-stack PropTech platform that uses AI/ML, GIS mapping, and real-time data analytics to predict future property price appreciation across Indian cities before prices rise."*
---

## Detailed Project Description
### What problem does it solve?
Most people miss real estate investment opportunities because they cannot predict which areas will become valuable in the future. FutureCity solves this by analysing government infrastructure projects, metro expansions, highway construction, migration patterns, and market data to predict which zones will appreciate 30–70% in the next 3–10 years — before the general market notices.
---

## Technical Architecture:-  

### Backend — Java Spring Boot
```
Technology Stack:
- Java 17 + Spring Boot 3.x
- Spring Security with JWT Authentication
- Spring Data JPA + Hibernate ORM
- RESTful Microservices Architecture (7 services)
- Apache Kafka for event streaming
- Redis for caching
- PostgreSQL + PostGIS for geospatial data
- Docker + Kubernetes-ready deployment
```

**Microservices**

| Service | Responsibility |
|---|---|
| `user-service` | JWT auth, registration, role management |
| `property-service` | Property data CRUD, zone management |
| `prediction-service` | Calls Python ML API, stores predictions |
| `gis-service` | PostGIS spatial queries, heatmap data |
| `infrastructure-service` | Government project tracking |
| `notification-service` | Kafka-driven alerts |
| `recommendation-service` | AI investment suggestions |

**Key Java concepts demonstrated:**
- **Design Patterns:** Repository, Service, DTO, Factory
- **Security:** JWT token generation/validation, BCrypt password hashing, role-based access (INVESTOR / ANALYST / ADMIN)
- **ORM:** JPA entities with `@OneToMany`, `@ManyToOne`, `@Spatial` annotations
- **Exception Handling:** `@GlobalExceptionHandler`, custom `ApiException` classes
- **API Versioning:** `/api/v1/` prefix on all endpoints
- **Caching:** `@Cacheable` with Redis for prediction results

---

### Frontend — React.js
```
Technology Stack:
- React 18 with Hooks (useState, useEffect, useContext, useRef, useMemo, useCallback)
- React Context API for global auth state
- Recharts for interactive investment charts
- Leaflet.js + leaflet.heat for real GIS heatmaps
- Vite as build tool
- Pure CSS with CSS Variables (no framework dependency)
```

**Components built:**
- `AuthModule` — Login/Register modal with JWT integration
- `FutureCity` — Main dashboard with 8 interactive sections
- `RealMap` — Live Leaflet map with 4 switchable layers
- `AdminPanel` — Full admin control panel with 5 tabs
- `ChartsModule` — Multi-city price comparison, ROI simulator, risk-return scatter

---

### AI/ML — Python FastAPI
```
Technology Stack:
- Python 3.11 + FastAPI
- XGBoost for property price prediction
- LSTM (TensorFlow/Keras) for time-series forecasting
- Scikit-learn for risk classification
- Pandas + NumPy for data processing
- Exposed as REST API consumed by Spring Boot
```

---

## Key Features to Highlight

- **Real-time GIS Heatmap** — Live Leaflet.js map with 4 switchable layers: growth heatmap, infrastructure markers, metro corridors, risk zones across 12+ Indian cities
- **AI Investment Chatbot** — Context-aware advisor covering all major Indian cities across 28 states with infrastructure-specific recommendations
- **Future Timeline Simulator** — Interactive slider from 2025–2035 with compound growth model recalculating prices in real time
- **JWT Authentication System** — Role-based access (Investor, Analyst, Builder, Admin) with Spring Security
- **Admin Control Panel** — Full CRUD for builders, investors, alerts, and users with reputation scoring
- **Builder Reputation Engine** — Scores developers 1–100 based on project delays, complaints, legal issues, and quality ratings
- **Multi-city Price Forecast Chart** — Recharts line graph with 3Y/5Y/10Y views and custom dark tooltip
- **Risk Analysis Module** — Area risk scoring with flood, legal, and market saturation factors
- **Kafka Event Streaming** — Real-time hotspot alerts pushed to 1,240+ subscribers
- **Redis Caching** — Prediction results cached with TTL to reduce ML API calls by 70%
- **Microservices + Docker** — 7 independent services with Docker Compose, Kubernetes-ready structure


| Metric | Value |
|---|---|
| Cities covered | 15+ major Indian metros |
| Infrastructure projects tracked | 340+ |
| Zones analysed | 1,240+ |
| Prediction accuracy (model) | 87% |
| API response time (cached) | < 40ms |
| Services in architecture | 7 microservices |
| ML models used | 3 (XGBoost, LSTM, Risk Classifier) |
| Authentication roles | 4 (Investor, Analyst, Builder, Admin) |

---


*"FutureCity is a full-stack AI-powered real estate intelligence platform built with Java Spring Boot microservices on the backend and React.js on the frontend. It predicts future property price appreciation across major Indian cities by analysing infrastructure data (metro expansions, airports, highways, SEZs), migration patterns, and market signals using XGBoost and LSTM models exposed through a Python FastAPI ML service. Key technical features include JWT-based authentication with role-based access control, PostGIS geospatial database queries visualised through a real Leaflet.js interactive heatmap, Apache Kafka for real-time investment alert streaming, Redis caching for prediction results, and a comprehensive admin dashboard for managing builders, investors, and alerts. The platform demonstrates enterprise-grade architecture including DTO pattern, global exception handling, API versioning, Docker containerisation, and clean code principles across 7 independent microservices."*

---

## GitHub README Summary

```
FutureCity | AI Real Estate Intelligence Platform
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Stack:   Java Spring Boot · React.js · Python FastAPI · PostgreSQL+PostGIS
         Apache Kafka · Redis · Leaflet.js · Recharts · Docker

Features: GIS heatmap · JWT auth · ML price prediction · Admin panel
          AI chatbot · Timeline simulator · Builder reputation scoring
          Risk analysis · Multi-city comparison charts

Architecture: 7 microservices · REST APIs · Event streaming · Redis cache
```

---

## Why This Project Stands Out

Most student projects are basic CRUD apps — login, add item, delete item. FutureCity combines five distinct technical domains simultaneously:

**Java enterprise development** (Spring Boot microservices, JWT, Kafka, Redis) + **AI/ML** (XGBoost price prediction, LSTM forecasting) + **GIS/geospatial systems** (PostGIS, Leaflet heatmaps) + **Real-world economics** (infrastructure impact on property markets) + **Production-grade frontend** (React context, custom hooks, Recharts, interactive maps)

Very few student or junior-level projects demonstrate this depth across backend, frontend, AI, and distributed systems simultaneously — which is exactly what companies building data-driven or fintech products look for.
