# Job Portal

A full-stack job portal application designed to connect job seekers with employers. This platform provides a seamless experience for posting job listings, applying to positions, and managing applications.

**Live Demo:** [https://job-portal1-delta.vercel.app](https://job-portal1-delta.vercel.app)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### For Job Seekers
- 🔐 User authentication and profile management
- 📝 Create and update resumes/profiles
- 🔍 Search and filter job listings
- 💼 Apply to job postings
- 📊 Track application status
- ⭐ Save favorite job listings
- 📱 Responsive mobile-friendly interface

### For Employers
- 📢 Post and manage job listings
- 👥 Review applications
- 📧 Communicate with candidates
- 📊 Application analytics
- 🎯 Target job seekers by skills and experience

### General Features
- 🎨 Modern UI with smooth animations
- 🌙 Dark/Light theme support
- 🔒 Secure authentication with JWT
- 📤 File upload support (resumes, profile pictures)
- ✅ Form validation and error handling
- 🚀 Optimized performance

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.3.1
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4.1.12 + TailwindCSS Animate
- **State Management:** Redux Toolkit 2.5.0 + Redux Persist
- **Routing:** React Router DOM 7.0.2
- **UI Components:** Radix UI
- **HTTP Client:** Axios
- **Animations:** Framer Motion
- **Icons:** Lucide React, React Icons
- **Notifications:** Sonner
- **Theme:** Next Themes

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 4.21.2
- **Database:** MongoDB with Mongoose 8.8.4
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **File Storage:** Cloudinary
- **Middleware:** CORS, Cookie Parser
- **File Upload:** Multer
- **Development:** Nodemon

---

## 📁 Project Structure

```
jobportal/
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Cloudinary account (for image uploads)

### Backend Setup

1. **Navigate to Backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

   **Or start production server:**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to Frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📖 Usage

### Starting the Application

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

The application will be available at `http://localhost:5173` (Vite default)

### Key Workflows

#### Register a New Account
1. Click "Sign Up" on the homepage
2. Fill in your details (name, email, password)
3. Select your role (Job Seeker or Employer)
4. Verify your email (if enabled)

#### Post a Job (Employer)
1. Log in as an employer
2. Navigate to "Post a Job"
3. Fill in job details (title, description, requirements, etc.)
4. Set salary range and job type
5. Publish the listing

#### Apply for a Job (Job Seeker)
1. Log in as a job seeker
2. Browse job listings or use search filters
3. Click on a job posting
4. Click "Apply" and review your profile
5. Submit your application

---

## 📡 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - User login
POST   /api/auth/logout          - User logout
GET    /api/auth/profile         - Get user profile
PUT    /api/auth/profile         - Update user profile
```

### Job Endpoints
```
GET    /api/jobs                 - Get all jobs (with filters)
GET    /api/jobs/:id             - Get job details
POST   /api/jobs                 - Create new job (employer)
PUT    /api/jobs/:id             - Update job (employer)
DELETE /api/jobs/:id             - Delete job (employer)
```

### Application Endpoints
```
POST   /api/applications         - Submit application
GET    /api/applications         - Get user applications
GET    /api/applications/:id     - Get application details
PUT    /api/applications/:id     - Update application status
DELETE /api/applications/:id     - Withdraw application
```

### Upload Endpoints
```
POST   /api/upload/resume        - Upload resume
POST   /api/upload/profile-pic   - Upload profile picture
```

---

## 🔐 Environment Variables

### Backend (`.env`)
```
PORT                    - Server port (default: 5000)
MONGODB_URI            - MongoDB connection string
JWT_SECRET             - Secret key for JWT tokens
JWT_EXPIRY             - Token expiry time
CLOUDINARY_NAME        - Cloudinary cloud name
CLOUDINARY_API_KEY     - Cloudinary API key
CLOUDINARY_API_SECRET  - Cloudinary API secret
NODE_ENV               - Environment (development/production)
```

### Frontend (`.env`)
```
VITE_API_URL           - Backend API URL
VITE_APP_TITLE         - Application title
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Guidelines
- Follow consistent naming conventions
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes before submitting PR

---

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Saloni** - [@saloni1225](https://github.com/saloni1225)

---

## 📞 Support

For support, issues, or questions:
- Open an issue on GitHub
- Contact via email

---

## 🙏 Acknowledgments

- Built with modern web technologies
- UI components from Radix UI and React Icons
- Image hosting by Cloudinary
- Database by MongoDB
- Deployed on Vercel

---

**Last Updated:** June 2026

