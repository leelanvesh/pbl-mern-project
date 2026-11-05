# Blood Donor Management Portal (MERN Stack Mini Project)

A complete, production-ready MERN Stack Web Application developed for voluntary blood donor registration, real-time availability tracking, hospital donor search, and administrative donor & donation verification.

---

## 🚀 Key Features

### 🩸 Voluntary Donors
- Register account and complete donor profile (Blood Group, Age, Gender, Mobile, City).
- Real-time **Eligibility Status** tracking (`Eligible`, `Pending`, `Not Eligible`).
- Next eligible donation date calculation (automatic 90-day cooldown).
- Complete donation history log with facility names and units donated.
- Profile update interface (name, contact, location).

### 🏥 Hospitals & Healthcare Centers
- Filter voluntary donors by **Blood Group** (A+, A-, B+, B-, AB+, AB-, O+, O-).
- Filter by **City** and **Eligibility Status**.
- View verified contact details for immediate blood requirement coordination.
- Real-time count of currently eligible, ready donors.

### 🛡️ System Administrators
- Comprehensive Dashboard with live metrics & KPI cards.
- **Manage Donors**: Full CRUD (Create, Read, Update, Delete) for donor directory.
- **Verify Donors**: One-click verification changing status from `Pending` to `Eligible`.
- **Manage Donations**: Record donation sessions with hospital name, units, and date.
- **Automated Cooling**: Recording a donation updates donor availability and schedules next eligible date.
- **Blood Availability & Reports**: Aggregated breakdown by blood types and hospital donation totals.

---

## 🛠️ Technology Stack

- **Frontend**: ReactJS, Vite, React Router DOM (v6), Axios, Modular CSS
- **Backend**: NodeJS, ExpressJS, CORS, Morgan, Dotenv
- **Database**: MongoDB Atlas with Mongoose ODM (Indexes, Schemas, Aggregation Pipelines)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs password hashing, Role-based Access Control (RBAC)

---

## 📁 Project Structure

```text
blood-donor-portal/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI: Navbar, Sidebar, SearchBar, DonorTable, etc.
│   │   ├── context/          # AuthContext with token persistence & RBAC
│   │   ├── layouts/          # DashboardLayout
│   │   ├── pages/            # Home, Login, Register, Dashboards, CRUD pages
│   │   ├── services/         # Axios API clients for Auth, Donors, Donations, Reports
│   │   ├── styles/           # Global CSS and healthcare design system
│   │   ├── App.jsx           # Client router and route guards
│   │   └── main.jsx          # React DOM root
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/               # db.js Mongoose connection
│   ├── controllers/          # authController, donorController, donationController, dashboardController
│   ├── middleware/           # auth.js (JWT verify + authorize middleware)
│   ├── models/               # User, Donor, Donation Mongoose schemas with indexes
│   ├── routes/               # authRoutes, donorRoutes, donationRoutes, dashboardRoutes
│   ├── seeds/                # seed.js Demo database seeder
│   ├── utils/                # generateToken.js
│   ├── server.js             # Express app entry point
│   ├── .env.example
│   └── package.json
│
├── README.md
└── package.json
```

---

## 🌐 MongoDB Atlas Setup Guide

1. **Create an Atlas Account**: Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and register.
2. **Create a Free Cluster**: Choose **M0 Free Shared Cluster** in your preferred region.
3. **Configure Database User**:
   - Go to **Database Access** -> **Add New Database User**.
   - Select **Password** authentication.
   - Enter a username and strong password (remember these).
   - Set privileges to **Read and write to any database**.
4. **Configure Network Access**:
   - Go to **Network Access** -> **Add IP Address**.
   - Choose **Allow Access From Anywhere** (`0.0.0.0/0`) for local testing.
5. **Get Connection String**:
   - Click **Database** -> **Connect** on your cluster.
   - Select **Drivers** (Node.js).
   - Copy the URI string, which looks like:
     ```text
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/blood_donor_portal?retryWrites=true&w=majority
     ```
6. **Configure `backend/.env`**:
   - In `backend/`, create a file named `.env` and fill:
     ```env
     PORT=5000
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/blood_donor_portal?retryWrites=true&w=majority
     JWT_SECRET=super_secret_jwt_key_here_for_blood_portal_2026
     NODE_ENV=development
     ```

---

## 🏃‍♂️ Running the Project

### 1. Backend Setup
```bash
cd backend
npm install
# Optional: Seed initial demo data into your MongoDB Atlas
npm run seed  # (or node seeds/seed.js)
npm run dev
```
The server will start on `http://localhost:5000`.

### 2. Frontend Setup
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
The React frontend will be accessible at `http://localhost:5173`.

---

## 🔑 Demo Login Credentials (Seeded)

Run `node server/seeds/seed.js` to populate these users:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@portal.com` | `Admin@123` | Full CRUD, Verification, Analytics, Donation recording |
| **Donor** | `donor@portal.com` | `Donor@123` | Personal profile, history, eligibility countdown |
| **Hospital** | `hospital@portal.com` | `Hospital@123` | Search donors by blood group & city, view contacts |

---

## 📡 REST API Documentation

### Authentication
- `POST /api/auth/register` — Register User (creates Donor record if role is `donor`).
- `POST /api/auth/login` — Sign in and receive JWT token + user payload.
- `GET /api/auth/me` — [Protected] Fetch current authenticated user & donor profile.

### Donors
- `GET /api/donors` — [Protected] List donors with filter queries (`?bloodGroup=O%2B&city=Hyderabad&eligibilityStatus=Eligible`).
- `GET /api/donors/:id` — [Protected] Get single donor details.
- `GET /api/donors/user/:userId` — [Protected] Get donor by associated User ID.
- `POST /api/donors` — [Admin] Create donor and linked user account.
- `PUT /api/donors/:id` — [Admin / Donor Own Profile] Update profile fields.
- `PUT /api/donors/:id/verify` — [Admin] Set donor as verified & eligible.
- `DELETE /api/donors/:id` — [Admin] Remove donor record & user login.

### Donations
- `GET /api/donations` — [Protected] Get donations (Admins see all; Donors see own).
- `POST /api/donations` — [Admin] Log new donation; updates donor eligibility & cooldown.
- `PUT /api/donations/:id` — [Admin] Update donation record and recalculate eligibility.
- `DELETE /api/donations/:id` — [Admin] Delete donation record.

### Dashboard & Reports
- `GET /api/dashboard/stats` — [Admin] Total counts, active pool, and blood group distribution.
- `GET /api/reports/blood-groups` — [Admin] Aggregated blood type metrics and hospital totals.
