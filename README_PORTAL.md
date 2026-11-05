# Blood Donor Management Portal

A full-stack MERN application for managing blood donors, tracking donations, and connecting hospitals with eligible donors.

## Features
- Donor registration and profile management
- Role-based access (Admin, Donor, Hospital)
- Blood group search and filtering
- Donation history tracking
- Admin dashboard with statistics
- JWT authentication with bcrypt
- Responsive healthcare-themed UI

## Tech Stack
- **Frontend**: React 18, Vite, React Router 6, Axios, React Icons, React Toastify
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas, Mongoose
- **Authentication**: JWT, bcryptjs

## Project Structure
```
blood-donor-portal/
├── client/                     # Frontend React application (Vite)
│   ├── public/                 # Static assets
│   ├── src/                    # Application source code
│   │   ├── assets/             # Images and styles
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # React Context providers (AuthContext)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── layouts/            # Page layout wrappers
│   │   ├── pages/              # Routed page components
│   │   │   ├── admin/          # Admin management and dashboard
│   │   │   ├── auth/           # Login and registration pages
│   │   │   ├── donor/          # Donor portal pages
│   │   │   ├── hospital/       # Hospital portal pages
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── Login.jsx       # Login view
│   │   │   └── Register.jsx    # Registration view
│   │   ├── services/           # Axios API services
│   │   ├── App.css             # Main application styling
│   │   ├── App.jsx             # Root React component & routes
│   │   ├── index.css           # Global CSS and utility styles
│   │   └── main.jsx            # React DOM entry point
│   ├── index.html              # HTML entry point
│   ├── package.json            # Client dependencies and scripts
│   └── vite.config.js          # Vite build configuration & proxy
├── server/                     # Backend Node.js / Express application
│   ├── config/
│   │   └── db.js               # MongoDB connection configuration
│   ├── controllers/            # Express route controllers
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── donationController.js
│   │   └── donorController.js
│   ├── middleware/             # Express middlewares
│   │   ├── auth.js             # JWT authentication & authorization
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js     # Global error handling middleware
│   │   ├── errorMiddleware.js
│   │   └── roleMiddleware.js   # Role-based access control
│   ├── models/                 # Mongoose schemas & models
│   │   ├── Donation.js         # Donation schema
│   │   ├── Donor.js            # Donor profile schema
│   │   └── User.js             # User account & authentication schema
│   ├── routes/                 # API route definitions
│   │   ├── adminRoutes.js      # Admin management routes
│   │   ├── authRoutes.js       # Authentication routes
│   │   ├── dashboardRoutes.js  # Dashboard analytics routes
│   │   ├── donationRoutes.js   # Donation transaction routes
│   │   └── donorRoutes.js      # Donor CRUD routes
│   ├── utils/                  # Utility scripts & seeders
│   │   ├── seed.js             # Database seeding script
│   │   └── seedData.js         # Seed data definitions
│   ├── .env.example            # Backend environment template
│   ├── package.json            # Server dependencies and scripts
│   └── server.js               # Express application entry point
├── .env.example                # Root environment variables template
├── package.json                # Root package.json with unified scripts
├── postman_collection.json     # Postman API test collection
└── README.md                   # Project documentation
```

## Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB Atlas account (free tier works)
- Git

## MongoDB Atlas Setup

Step-by-step guide:
1. Go to https://www.mongodb.com/atlas and create a free account
2. Create a new project (e.g., "Blood Donor Portal")
3. Create a free shared cluster (M0 tier)
4. Set up database access:
   - Go to Database Access > Add New Database User
   - Choose username/password authentication
   - Set a username and password (remember these!)
   - Set permissions to "Read and Write to Any Database"
5. Set up network access:
   - Go to Network Access > Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
   - For production, add only your server's IP
6. Get your connection string:
   - Go to Database > Connect > Drivers
   - Copy the connection string
   - It looks like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/`
   - Replace `<password>` with your actual database user password
   - Add database name: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/blood_donor_portal`

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd blood-donor-portal
```

### 2. Install dependencies
```bash
# Install all dependencies (root, server, client)
npm run install-all
```

Or install individually:
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure environment variables
```bash
# Copy .env.example to server/.env
cp .env.example server/.env
```

Edit `server/.env` with your values:
```env
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/blood_donor_portal
JWT_SECRET=your_secret_key_here
PORT=5000
```

### 4. Seed demo data (optional)
```bash
cd server
npm run seed
```

### 5. Run the application

Backend (Terminal 1):
```bash
cd server
npm run dev
```
Server runs on http://localhost:5000

Frontend (Terminal 2):
```bash
cd client
npm run dev
```
Client runs on http://localhost:3000

## Demo Credentials

After running the seed script:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bloodportal.com | admin123 |
| Donor | rahul@bloodportal.com | donor123 |
| Donor | priya@bloodportal.com | donor123 |
| Hospital | hospital@bloodportal.com | hospital123 |

> **Note**: These are demo credentials. Change them in production.

## API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login user | Public |

### Donors
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/donors | List/search donors | Protected |
| GET | /api/donors/me | Get my profile | Donor |
| GET | /api/donors/:id | Get donor by ID | Protected |
| POST | /api/donors | Create donor | Admin |
| PUT | /api/donors/:id | Update donor | Admin/Owner |
| DELETE | /api/donors/:id | Delete donor | Admin |

### Donations
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/donations | List donations | Protected |
| GET | /api/donations/donor/:id | Donor's donations | Protected |
| POST | /api/donations | Add donation | Admin |
| PUT | /api/donations/:id | Update donation | Admin |
| DELETE | /api/donations/:id | Delete donation | Admin |

### Dashboard & Reports
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/dashboard/stats | Dashboard statistics | Admin |
| GET | /api/dashboard/reports/blood-groups | Blood group report | Admin |

## Application Screenshots

(Add screenshots after running the application)

## Troubleshooting

### MongoDB Connection Failed
- Check that your MongoDB Atlas cluster is running
- Verify your connection string in .env
- Check that your IP is whitelisted in Network Access
- Ensure your database user password is correct

### Port Already in Use
- Change PORT in .env
- Kill the process using the port: `npx kill-port 5000`

### CORS Errors
- Make sure both frontend and backend are running
- Frontend proxies requests to backend via Vite config

## License
MIT

---
*A MERN Stack Mini Project for College*
