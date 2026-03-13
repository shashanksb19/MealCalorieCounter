# 🥗 MealCalorieCounter

A full-stack meal nutrition tracker that calculates calories and macronutrients for any dish using the USDA FoodData Central API. Built with FastAPI and Next.js.

![FastAPI](https://img.shields.io/badge/FastAPI-0.135-009688?logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.14-3776AB?logo=python&logoColor=white)

---

## 📸 Screenshots

### Calorie Calculator
![Dashboard](meal-calorie-frontend/public/Screenshot_Dashboard.png)

### SignUp
![SignUp](meal-calorie-frontend/public/Screenshot_SignUp.png)

---

## ✨ Features

- 🔐 JWT Authentication — register, login, protected routes
- 🔍 Smart Dish Search — fuzzy matching against USDA FoodData Central
- 🔢 Calorie Calculation — per serving and total calories
- 📊 Full Macro Breakdown — protein, carbs, fat, fiber, sugar per serving and total
- 🕓 Meal History — last 20 searches stored in Zustand state
- 🌗 Dark / Light Mode — animated sun/moon theme toggle
- 📱 Fully Responsive — mobile-first layout
- ⚡ In-memory Caching — avoids redundant USDA API calls

---

## 🏗️ Project Structure
```
MealCalorieCounter/
├── meal-calorie-backend/     # FastAPI + PostgreSQL
└── meal-calorie-frontend/    # Next.js + TypeScript
```

---

## 🧱 Tech Stack

### Backend
| Layer | Technology |
|-------|------------|
| Language | Python 3.14 |
| Framework | FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy (async) |
| Migrations | Alembic |
| Auth | PyJWT + bcrypt |
| HTTP Client | httpx |
| Validation | Pydantic v2 |

### Frontend
| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| State | Zustand + persist middleware |
| Validation | Zod v3 + react-hook-form |
| Font | Inter |
| Theme | next-themes |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL

---

### Backend Setup
```bash
cd meal-calorie-backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Fill in your values in .env

# Create database
psql -U postgres -c "CREATE DATABASE meal_calorie_db;"

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload --port 8000
```

API docs at `http://localhost:8000/docs`

---

### Frontend Setup
```bash
cd meal-calorie-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your values

# Start dev server
npm run dev
```

App at `http://localhost:3000`

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login + get JWT token | ❌ |
| POST | `/get-calories` | Get calories + macros for a dish | ✅ |
| GET | `/health` | Health check | ❌ |

### Sample Request
```json
POST /get-calories
{
  "dish_name": "chicken biryani",
  "servings": 2
}
```

### Sample Response
```json
{
  "dish_name": "chicken biryani",
  "servings": 2,
  "calories_per_serving": 163,
  "total_calories": 326,
  "macros_per_serving": {
    "protein_g": 6.01,
    "carbs_g": 24.7,
    "fat_g": 4.59,
    "fiber_g": 0.7,
    "sugar_g": 1.41
  },
  "total_macros": {
    "protein_g": 12.02,
    "carbs_g": 49.4,
    "fat_g": 9.18,
    "fiber_g": 1.4,
    "sugar_g": 2.82
  },
  "source": "USDA FoodData Central"
}
```

---

## 🔐 Environment Variables

### Backend `.env`
```
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/meal_calorie_db
JWT_SECRET_KEY=your_secret_key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
USDA_API_KEY=your_usda_api_key
USDA_PAGE_SIZE=10
ENVIRONMENT=development
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env.local`
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## 🧠 Architecture Decisions

### Backend
- **Async SQLAlchemy** — keeps FastAPI fully async for better performance
- **Service layer pattern** — business logic in services, routes stay thin
- **Fuzzy matching algorithm** — Jaccard similarity (50%) + exact phrase bonus (30%) + length penalty (20%) to find best USDA match
- **In-memory caching** — avoids redundant USDA API calls for repeated queries
- **Custom exception hierarchy** — consistent JSON error shape across all endpoints
- **bcrypt direct library** — used instead of passlib due to Python 3.14 compatibility issues

### Frontend
- **Zustand + persist** — auth token persisted to localStorage, rehydrated on load with token synced to API client
- **Token bridge pattern** — `lib/auth.ts` decouples API client from Zustand store to avoid circular dependencies
- **Central API client** — all fetch calls go through `lib/api.ts`, token attached automatically, 401s handled globally
- **Zod v3** — downgraded from v4 for react-hook-form resolver compatibility

---

## 🗂️ Folder Structure

### Backend
```
app/
  core/         → config, security, exceptions
  db/           → database engine + session
  models/       → SQLAlchemy ORM models
  schemas/      → Pydantic request/response schemas
  services/     → business logic (auth, USDA)
  routers/      → thin API route handlers
  main.py       → app entry point, middleware, lifespan
```

### Frontend
```
src/
  app/          → Next.js App Router pages
  components/
    auth/       → AuthForm (login + register)
    meal/       → MealForm, ResultCard
    ThemeToggle → animated dark/light mode toggle
    ThemeProvider → next-themes wrapper
    Navbar      → top navigation with user info
  lib/
    api.ts      → central fetch client
    auth.ts     → token bridge (no circular deps)
    validators.ts → Zod schemas
  stores/
    authStore.ts → JWT + user state with persistence
    mealStore.ts → calorie results + history
  types/
    index.ts    → shared TypeScript interfaces
```

---

## 🔑 Get a USDA API Key

Free signup at:
```
https://fdc.nal.usda.gov/api-key-signup.html
```

---

## 📦 Deployment

- **Backend** → [Render](https://render.com)
- **Frontend** → [Vercel](https://vercel.com)

---

## 📄 License

MIT
