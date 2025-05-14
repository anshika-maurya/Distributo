# 🚀 Distributo

<div align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/license-MIT-green.svg" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" />
</div>

<p align="center">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="react" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" alt="nodejs" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg" alt="mongodb" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/bootstrap/bootstrap-original.svg" alt="bootstrap" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg" alt="express" width="40" height="40"/>
</p>

<hr />

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Screenshots](#-screenshots)
- [License](#-license)

<hr />

## 🌟 Overview

**Distributo** is a powerful task distribution system designed to efficiently distribute and manage work items among a team of agents. The platform enables administrators to upload lists of tasks via CSV or Excel files and automatically distributes them among agents using an intelligent allocation algorithm. 

The system ensures equal distribution of tasks, with a specific focus on distributing tasks among exactly 5 agents, making it perfect for small to medium-sized teams looking to balance workloads efficiently.

<hr />

## ✨ Features

- 🔐 **Secure Authentication** - User registration and login with JWT authentication
- 👥 **Agent Management** - Create, edit, and manage agent profiles
- 📊 **Task Distribution** - Upload and distribute tasks evenly among 5 agents
- 📝 **List Management** - View and manage all task lists and their statuses
- 📱 **Responsive Design** - Full mobile and desktop responsive UI
- 🔄 **Real-time Updates** - View agent workloads and task assignments in real-time
- 📁 **File Import** - Support for CSV, XLSX, and XLS file formats
- 🔍 **Detailed Reporting** - View batch details and agent-specific task lists

<hr />

## 🛠 Tech Stack

### Frontend
- **React.js** - Frontend framework
- **Tailwind CSS** - UI styling
- **Formik & Yup** - Form handling and validation
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload handling
- **csvtojson & xlsx** - File parsing utilities

<hr />

## 📂 Project Structure

```
distributo/
├── frontend/                # React frontend application
│   ├── public/              # Static files
│   ├── src/                 # Source files
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context (Auth, etc.)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service integrations
│   │   └── utils/           # Utility functions
│   ├── package.json         # Frontend dependencies
│   └── README.md            # Frontend documentation
│
├── backend/                 # Node.js Express backend
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── middlewares/         # Custom middlewares
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── uploads/             # File upload directory
│   ├── server.js            # Server entry point
│   └── package.json         # Backend dependencies
│
└── README.md                # Project documentation
```

<hr />

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/distributo.git
   cd distributo
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the backend directory:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/distributo
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

5. **Start the application**
   
   Start Backend:
   ```bash
   cd backend
   npm start
   ```
   
   Start Frontend (in a new terminal):
   ```bash
   cd frontend
   npm start
   ```

6. **Access the application**
   
   The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

<hr />

## 💻 Usage

### User Registration and Login
1. Navigate to the application URL
2. Create a new account using the "Sign Up" option
3. Login with your registered email and password

### Managing Agents
1. From the dashboard, navigate to the "Agents" section
2. Add new agents with their name, email, and contact details
3. Edit or remove existing agents as needed

### Uploading and Distributing Tasks
1. Navigate to the "Lists Management" section
2. Upload a CSV or Excel file containing task details
3. Ensure you have at least 5 agents registered in the system
4. The system will automatically distribute tasks equally among 5 agents
5. View the distribution results and batch details

### Viewing Agent Tasks
1. From the "Lists Management" section, click on "View Agent Lists"
2. Select an agent from the tabs to view their assigned tasks
3. Review task details and manage as needed

<hr />

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user profile

### Agents
- `GET /api/agents` - Get all agents
- `POST /api/agents` - Create a new agent
- `PUT /api/agents/:id` - Update an agent
- `DELETE /api/agents/:id` - Delete an agent

### Lists
- `POST /api/lists/upload` - Upload and distribute a task list
- `GET /api/lists/batches` - Get all list batches
- `GET /api/lists/batch/:batchId` - Get list items by batch
- `GET /api/lists/agent/:agentId` - Get lists assigned to an agent

<hr />

## 🔐 Authentication

Distributo uses JWT (JSON Web Tokens) for secure authentication. When a user logs in, a token is generated and stored in local storage. This token is used for subsequent API requests to verify the user's identity.

Auth process:
1. User registers or logs in
2. Backend generates a JWT token
3. Token is stored in client's local storage
4. Token is sent with each API request in Authorization header
5. Backend validates the token for protected routes

<hr />

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

<hr />

<p align="center">Made with ❤️ by Anshika Maurya</p> 