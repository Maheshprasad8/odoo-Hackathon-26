# FleetFlow API Documentation

FleetFlow is a RESTful API for managing fleet operations, trips, drivers, and financial analytics.

## Base URL
`http://localhost:5000/api/v1`

## Authentication

### POST `/auth/register`
Register a new user to the system.
- **Roles**: Fleet Manager, Dispatcher, Safety Officer, Financial Analyst.

### POST `/auth/login`
Authenticate and receive a JWT token.

---

## Fleet Registry

### GET `/vehicles`
Fetch all vehicles. Supports filtering by `status`, `type`, and `region`.

### POST `/vehicles`
**Auth**: Fleet Manager
Register a new vehicle.

---

## Trip Dispatching

### POST `/trips`
**Auth**: Dispatcher, Fleet Manager
Create a new trip in `Draft` status.
- **Validation**: Cargo weight must not exceed vehicle capacity.

### POST `/trips/:id/dispatch`
**Auth**: Dispatcher, Fleet Manager
Change trip status to `Dispatched`.
- **Validation**: Vehicle must be `Available` and Driver must be `On Duty` with a valid license.

### POST `/trips/:id/complete`
Mark trip as `Completed`. Updates vehicle status back to `Available` and increments driver stats.

---

## Driver Performance

### GET `/drivers`
Fetch all registered drivers.

### POST `/drivers/:id/complaint`
**Auth**: Safety Officer
Log a complaint against a driver. Automatically recalculates the driver's safety score (0-10).

---

## Analytics

### GET `/analytics/dashboard`
Aggregated KPIs for the command center.

### GET `/analytics/financials`
**Auth**: Financial Analyst, Fleet Manager
Revenue, fuel costs, maintenance costs, and Fleet ROI calculations.

### GET `/analytics/dead-stock`
**Auth**: Fleet Manager
List of vehicles idle for more than 30 days.
