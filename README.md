# Pet Adoption Platform

A full-stack web application for connecting pets with loving homes. This platform allows users to browse available pets, submit adoption requests, and manage the adoption process through an intuitive interface.

## Features

- **User Authentication**: Secure registration and login system with JWT authentication
- **Pet Browsing**: View available pets with detailed information including photos, age, breed, and temperament
- **Adoption Requests**: Submit and track adoption applications for pets
- **Admin Dashboard**: Manage pets, review adoption requests, and oversee platform operations
- **Responsive Design**: Mobile-friendly interface built with React
- **Real-time Updates**: Live database synchronization with MongoDB

## Tech Stack

### Frontend
- **React 19.1.1** - UI library
- **React Router DOM 7.7.1** - Client-side routing
- **Axios 1.11.0** - HTTP client for API requests
- **React Icons 5.5.0** - Icon library
- **React Toastify 11.0.5** - Notification system
- **Firebase 12.1.0** - Backend services integration

### Backend
- **Express 5.1.0** - Web framework
- **MongoDB/Mongoose 8.17.1** - Database and ODM
- **JWT 9.0.2** - Authentication tokens
- **bcryptjs 3.0.2** - Password hashing
- **CORS 2.8.5** - Cross-origin resource sharing
- **dotenv 17.2.1** - Environment configuration

### Development Tools
- **nodemon 3.1.10** - Auto-restart server on changes
- **concurrently 8.0.0** - Run multiple npm scripts simultaneously

## Project Structure

```
pet/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── contexts/      # React context providers
│   │   ├── functions/     # Utility functions
│   │   ├── images/        # Image assets
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Helper utilities
│   │   ├── App.jsx        # Main app component
│   │   └── index.jsx      # Entry point
│   └── package.json
├── server/                # Express backend
│   ├── middleware/        # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API route handlers
│   ├── server.js         # Server entry point
│   └── .env              # Environment variables
└── package.json          # Root package file
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB installation)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pet
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   npm run install-client
   ```

4. **Install server dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

5. **Configure environment variables**
   
   Create a `.env` file in the `server` directory with the following variables:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

## Usage

### Development Mode

Run both client and server simultaneously:
```bash
npm run dev
```

This will start:
- Frontend at http://localhost:3000
- Backend at http://localhost:5000

### Individual Services

**Server only:**
```bash
npm run server
```

**Client only:**
```bash
cd client
npm start
```

### Production Build

Build the client for production:
```bash
npm run build
```

This will:
1. Install client dependencies
2. Build the React application for production

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user

### Pets
- `GET /api/pets` - Get all pets
- `GET /api/pets/:id` - Get specific pet
- `POST /api/pets` - Add new pet (admin)
- `PUT /api/pets/:id` - Update pet (admin)
- `DELETE /api/pets/:id` - Delete pet (admin)

### Adoptions
- `POST /api/adoptions` - Submit adoption request
- `GET /api/adoptions` - Get adoption requests
- `PUT /api/adoptions/:id` - Update adoption status (admin)

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `PORT` | Server port (default: 5000) | No |
| `FRONTEND_URL` | Frontend URL for CORS | No |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.
