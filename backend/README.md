# SmartSeason Field Monitoring System - Backend

This is the backend service for the SmartSeason Field Monitoring System. It provides RESTful APIs, role-based authentication, and core business logic for field management and tracking.

## Tech Stack
- **Node.js** & **Express**
- **TypeScript**
- **Prisma** ORM
- **PostgreSQL** Database
- **Zod** for Validation
- **JWT** for Authentication

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `backend` directory (you can copy `.env.example`):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/smartseason?schema=public"
   JWT_SECRET="your_super_secret_key"
   PORT=3000
   ```

3. **Database Setup**
   Ensure PostgreSQL is running, and your `DATABASE_URL` is correct. Then run:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Database Schema Highlights

- **User**: Represents `ADMIN` and `FIELD_AGENT` roles.
- **Field**: Stores details like crop type, planting date, current stage, and the Assigned Agent. Tracks `updatedAt`.
- **FieldUpdate**: Logs every change in field stage along with optional notes. Used to track history securely.

## ⚠️ Field Status Logic (IMPORTANT)

The system dynamically computes the **Status** of a Field instead of storing it directly, based on the following rules:

1. **Completed**: The field is in the `Harvested` stage.
2. **Active**: The field is in `Planted`, `Growing`, or `Ready` AND its last update (`updatedAt`) was within the last 7 days.
3. **At Risk**: 
   - No updates have happened in the last 7 days.
   - OR, the field is currently in the `Growing` stage but hasn't received an update in over 14 days.

*This logic is isolated within the `FieldService` (`src/services/field.service.ts`) and is computed dynamically when fields are queried.*

## Assumptions Made
- Registration defaults to `FIELD_AGENT` unless an `ADMIN` role is specified in the request.
- The `updatedAt` field on the `Field` model is automatically managed by Prisma and gives an accurate timestamp of the last time the field was touched (either assigned, edited, or stage updated through transactions).
- Agents can only view and update fields explicitly assigned to them.
- Deletion of fields isn't implemented as per the minimal spec, keeping it strictly addition/updates.

## API Documentation

### Auth Endpoints
- `POST /api/register` - Register a new user (admin or agent).
- `POST /api/login` - Authenticate and receive a JWT.

### Field Management (Admin)
- `POST /api/fields` - Create a new field.
- `PUT /api/fields/:id` - Update a field (or assign agent).
- `GET /api/fields` - Retrieve all fields with dynamic status.

### Field Management (Agent)
- `GET /api/fields/assigned` - Retrieve fields assigned to the authenticated agent.

### Field Updates
- `POST /api/fields/:id/update` (Agent) - Advance the field's stage sequentially (`Planted -> Growing -> Ready -> Harvested`) and add notes.
- `GET /api/updates` (Admin) - View global update logs across all fields.

### Dashboards
- `GET /api/dashboard/admin` - Retrieves stats: total, active, completed, at-risk fields, plus recent activity.
- `GET /api/dashboard/agent` - Retrieves stats relevant to the agent's assigned fields.
