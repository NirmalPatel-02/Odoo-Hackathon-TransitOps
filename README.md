# TransitOps — Smart Transport Operations Platform

TransitOps is a full-stack fleet and transport-operations platform built for the Odoo Hackathon. It brings fleet assets, drivers, trips, maintenance, operating costs, and performance reporting into one role-aware workspace.

The platform is designed around a simple operational goal: dispatch only compliant, available resources; keep fleet status accurate as work happens; and turn the resulting data into clear operational and financial insight.

## Problem statement

Transport teams often manage vehicle availability, driver compliance, trip allocation, workshop activity, fuel spend, and operational reporting across disconnected spreadsheets and tools. This makes it difficult to prevent resource conflicts, track the real cost of operating a vehicle, or make timely decisions.

TransitOps centralizes those workflows. It provides a controlled transport-operations system where authorized users can maintain fleet and driver records, create and progress trips, manage maintenance, record costs, and review fleet analytics.

## Highlights

- JWT-based authentication with secure bcrypt password hashing.
- Role-based access control for Fleet Managers, Drivers, Safety Officers, and Financial Analysts.
- Vehicle registry with unique registration numbers, capacity validation, and protected odometer updates.
- Driver registry with unique licence numbers, licence-expiry checks, safety score, and working status.
- Trip planning and dispatch rules that prevent double-booking, invalid assignments, expired licences, and overloaded vehicles.
- Automatic vehicle and driver status updates during dispatch, completion, and cancellation.
- Maintenance lifecycle that takes a vehicle out of service and automatically records maintenance cost when closed.
- Fuel and expense recording linked to the relevant vehicle.
- Live fleet analytics: utilization, fuel efficiency, operating cost, and ROI; CSV export plus a browser-printable PDF report.
- Responsive React dashboard with search, filters, status badges, modal forms, protected routes, and session persistence.

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 8, React Router, Axios, Tailwind CSS |
| Backend | Python, FastAPI, Uvicorn, Pydantic |
| Data | SQLAlchemy ORM with a SQL database (MySQL/PyMySQL supported) |
| Security | OAuth2 password flow, JWT, bcrypt, role checks |
| Reporting | SQLAlchemy aggregations, CSV generation, browser print-to-PDF |

## Application modules

### Authentication and access control

Users register against an existing role and sign in through the OAuth2 password flow. The backend issues a time-limited JWT (60 minutes by default), which the frontend keeps in `sessionStorage` and attaches to API requests. Invalid or expired tokens clear the session and redirect to sign-in.

| Role | Frontend access |
| --- | --- |
| Fleet Manager | Full access to all modules |
| Driver | Dashboard, own-driver view, and trip management |
| Safety Officer | Dashboard, full driver management, analytics view |
| Financial Analyst | Dashboard, maintenance view, fuel/expense tools, full analytics |

> Backend authorization is enforced independently of the interface. The API is the source of truth for permissions.

### Fleet and vehicle registry

Fleet Managers can register and update fleet assets. Every vehicle has a unique, normalized registration number, model, type, maximum load capacity, odometer, acquisition cost, and operating status.

Vehicle states are `Available`, `On Trip`, `In Shop`, and `Retired`. Odometer readings cannot move backwards. Retired or in-shop vehicles cannot be assigned to a trip.

### Driver management

Fleet Managers and Safety Officers can create and update driver records. Driver data includes licence details, licence expiry date, contact number, safety score (0–100), and status.

Driver states are `Available`, `On Trip`, `Off Duty`, and `Suspended`. Trip creation rejects suspended drivers and drivers whose licence has expired.

### Trip management

Fleet Managers and Drivers can create trip records with origin, destination, cargo weight, planned distance, vehicle, and driver. A new trip begins in `Draft` state.

Before a trip is created, TransitOps verifies that:

- the selected vehicle and driver exist;
- the vehicle is neither retired nor in the workshop;
- neither resource is already assigned to an active trip;
- the driver is not suspended and has a current licence; and
- cargo weight does not exceed vehicle capacity.

When a trip is **Dispatched**, its vehicle and driver both become `On Trip`. When it is **Completed**, both return to `Available`. Cancelling a dispatched trip also releases both resources.

### Maintenance

Fleet Managers can open a maintenance log for an eligible vehicle. Opening a log changes the vehicle status to `In Shop`, preventing it from being dispatched. A vehicle that is on a trip or already retired cannot enter maintenance.

Closing an open log records its end date and cost, restores an in-shop vehicle to `Available`, and automatically creates a matching `Maintenance` expense for reporting.

### Fuel, expenses, and reporting

Fleet Managers and Financial Analysts can record fuel logs and manual expenses against a vehicle. The analytics service then produces a per-vehicle and fleet-wide summary.

| Metric | Current calculation |
| --- | --- |
| Active vehicles | Vehicles currently marked `On Trip` |
| Fleet utilization | `active vehicles / all vehicles × 100` |
| Fuel efficiency | Sum of planned trip distance / total fuel litres |
| Operational cost | Fuel cost + expenses whose type contains `Maintenance` |
| Simulated revenue | Planned trip distance × 15.50 |
| Vehicle ROI | `(simulated revenue − operational cost) / acquisition cost` |

Reports are available as JSON through the API, downloadable CSV, and a print-ready HTML report from the analytics screen that can be saved as PDF in the browser.

## Frontend experience

The React application provides:

- a dashboard with fleet, trip, driver, utilization, and open-maintenance KPIs;
- searchable and filterable vehicle, driver, trip, and maintenance tables;
- role-gated navigation and routes;
- modal forms for creating and editing operational records;
- status badges for quick operational visibility;
- analytics dashboard with refresh, CSV export, and print-to-PDF; and
- locally stored workspace preferences and theme state.

## Architecture

```text
React + Vite client
  ├─ AuthContext / sessionStorage
  ├─ Protected routes and role-aware navigation
  └─ Axios client adds Bearer JWT
             │
             ▼
FastAPI REST API (/api/v1)
  ├─ Authentication and JWT validation
  ├─ RoleChecker authorization
  ├─ Validation and workflow rules
  ├─ SQLAlchemy models and repositories
  └─ Fleet reporting and CSV export
             │
             ▼
SQL database
  ├─ roles / users
  ├─ vehicles / drivers / trips
  ├─ maintenance_logs
  └─ fuel_logs / expenses
```

## Repository structure

```text
.
├── backend/
│   ├── app/
│   │   ├── api/v1/          # FastAPI route modules
│   │   ├── core/            # config, database, security, permissions
│   │   ├── models/          # SQLAlchemy entities
│   │   ├── schemas/         # Pydantic request/response models
│   │   └── services/        # domain-service layer
│   ├── requirements.txt
│   └── run.ps1
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios client and endpoint wrappers
│   │   ├── components/      # dashboard, layout, and shared UI
│   │   ├── context/         # auth and theme state
│   │   ├── pages/           # feature screens
│   │   └── routes/          # route protection and route map
│   └── package.json
└── README.md
```

## Getting started

### Prerequisites

- Python 3.10+
- Node.js 20+ and npm
- A supported SQL database. The installed `PyMySQL` driver supports MySQL/MariaDB.

### 1. Configure the backend

From the `backend` directory, create a `.env` file:

```env
DATABASE_URL=mysql+pymysql://USERNAME:PASSWORD@localhost:3306/transitops
JWT_SECRET=replace-with-a-long-random-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Create the database before running the API. Tables are created automatically at application startup.

Install dependencies and start the server:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`; interactive OpenAPI documentation is available at `http://localhost:8000/docs`.

### 2. Create the required roles

Registration only accepts roles already present in the `roles` table. Seed these exact role names before registering users:

```text
Fleet Manager
Driver
Safety Officer
Financial Analyst
```

### 3. Start the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`). By default, the frontend calls `http://localhost:8000`.

For another API environment, add `frontend/.env`:

```env
VITE_API_BASE_URL=https://your-api.example.com
```

## API reference

All protected endpoints require:

```http
Authorization: Bearer <access_token>
```

| Module | Method | Endpoint | Roles |
| --- | --- | --- | --- |
| Health | `GET` | `/` | Public |
| Auth | `POST` | `/api/v1/auth/register` | Public; requested role must exist |
| Auth | `POST` | `/api/v1/auth/login` | Public; form-encoded credentials |
| Auth | `GET` | `/api/v1/auth/me` | Authenticated user |
| Vehicles | `GET` | `/api/v1/vehicles/` | All staff roles |
| Vehicles | `POST` | `/api/v1/vehicles/` | Fleet Manager |
| Vehicles | `GET` | `/api/v1/vehicles/{vehicle_id}` | All staff roles |
| Vehicles | `PATCH` | `/api/v1/vehicles/{vehicle_id}` | Fleet Manager |
| Drivers | `GET` | `/api/v1/drivers/` | All staff roles |
| Drivers | `POST` | `/api/v1/drivers/` | Fleet Manager, Safety Officer |
| Drivers | `GET` | `/api/v1/drivers/{driver_id}` | All staff roles |
| Drivers | `PATCH` | `/api/v1/drivers/{driver_id}` | Fleet Manager, Safety Officer |
| Trips | `GET` | `/api/v1/trips/` | All staff roles |
| Trips | `POST` | `/api/v1/trips/` | Fleet Manager, Driver |
| Trips | `PATCH` | `/api/v1/trips/{trip_id}/status` | Fleet Manager, Driver |
| Maintenance | `GET` | `/api/v1/maintenance/` | All staff roles |
| Maintenance | `POST` | `/api/v1/maintenance/` | Fleet Manager |
| Maintenance | `PATCH` | `/api/v1/maintenance/{log_id}/close` | Fleet Manager |
| Fuel | `POST` | `/api/v1/expenses/fuel` | Fleet Manager, Financial Analyst |
| Expense | `POST` | `/api/v1/expenses/expense` | Fleet Manager, Financial Analyst |
| Reports | `GET` | `/api/v1/reports/summary` | Fleet Manager, Financial Analyst |
| Reports | `GET` | `/api/v1/reports/export/csv` | Fleet Manager, Financial Analyst |

### Example: login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=manager@example.com&password=your-password"
```

### Example: create a vehicle

```json
{
  "registration_number": "GJ-01-AB-1234",
  "model": "Volvo FH16",
  "type": "Truck",
  "max_load_capacity": 25000,
  "odometer": 15500,
  "acquisition_cost": 145000
}
```

### Example: create a trip

```json
{
  "source": "Mundra Port",
  "destination": "Kandla Port",
  "cargo_weight": 20000,
  "planned_distance": 450,
  "vehicle_id": 1,
  "driver_id": 1
}
```

## Important implementation notes

- Decimal values are serialized as strings by the API to preserve precision.
- Input validation errors return HTTP `422`; business-rule failures return appropriate `400`, `401`, `403`, or `404` responses.
- CORS is currently configured to allow all origins for hackathon development. Restrict allowed origins before production deployment.
- The API currently exposes create-only fuel/expense routes and no expense-list route. The present Fuel & Expenses UI is a scaffold awaiting alignment with that API contract (vehicle selection, date field naming, and list endpoint). This is documented here to accurately reflect the current repository state.

## Future improvements

- Add migrations and a repeatable role/data seeding command.
- Add expense and fuel-log list, edit, and approval endpoints.
- Move CORS, database credentials, and production settings to deployment-specific configuration.
- Add automated unit, integration, and end-to-end tests.
- Add real route tracking, notifications, and configurable revenue/ROI rules.

---

Built for the **Odoo Hackathon** — TransitOps Smart Transport Operations Platform.
