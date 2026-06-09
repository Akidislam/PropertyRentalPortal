# Property Rental Portal

A comprehensive full-stack web application for managing property rentals with support for landlords, tenants, and administrators. Built with Node.js/Express backend and React frontend.

## 🎯 Features

### For Tenants
- Browse and search available properties
- Submit rental requests to landlords
- Track rental request status (approved/rejected)
- Manage wallet and payment history
- Submit reviews and ratings for properties
- View rental history and approved requests
- Support tickets for assistance

### For Landlords
- List and manage properties
- View and approve/reject rental requests
- Track rental income via wallet
- Manage payment history
- Respond to tenant reviews
- Monitor property availability

### For Admins
- User management (view, filter by role)
- Property approval workflow
- Rental request oversight
- Review management
- Support ticket management
- System analytics and monitoring

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer (profile pictures, property images)

### Frontend
- **Framework**: React
- **Styling**: Tailwind CSS, PostCSS
- **Build Tool**: Create React App
- **Package Manager**: npm

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Environment**: .env configuration

## 📁 Project Structure

```
PropertyRentalPortal/
├── backend/
│   ├── controllers/          # Business logic for routes
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoint definitions
│   ├── middleware/          # Auth, file upload middleware
│   ├── uploads/             # User profile and property images
│   ├── app.js               # Express app setup
│   ├── server.js            # Server entry point
│   ├── seedAbout.js         # Database seeding script
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── styles/          # CSS files
│   │   ├── utils/           # Utility functions
│   │   ├── context/         # React Context (Toast notifications)
│   │   ├── assets/          # Images and static files
│   │   └── App.js           # Main React component
│   ├── public/              # Static HTML/assets
│   ├── package.json
│   └── tailwind.config.js
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB Atlas account (or local MongoDB instance)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** with the following environment variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```
   
   > **Note**: Get `MONGO_URI` from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

4. **(Optional) Seed the database**
   ```bash
   node seedAbout.js
   ```

5. **Start the backend server**
   ```bash
   npm start
   # Server runs on http://localhost:5000
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # App runs on http://localhost:3000
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — User login
- `GET /api/auth/profile` — Get logged-in user profile

### Properties
- `GET /api/properties` — Fetch all properties
- `POST /api/properties` — Create new property (landlord)
- `PUT /api/properties/:id` — Update property (landlord)
- `DELETE /api/properties/:id` — Delete property (landlord)

### Rental Requests
- `POST /api/rentalRequests` — Submit rental request (tenant)
- `GET /api/rentalRequests` — Get rental requests (landlord/tenant)
- `PUT /api/rentalRequests/:id` — Approve/reject request (landlord)

### Reviews
- `POST /api/reviews` — Submit property review (tenant)
- `GET /api/reviews/:propertyId` — Get reviews for property
- `DELETE /api/reviews/:id` — Delete review (admin/author)

### Wallet
- `GET /api/wallet` — Get wallet balance
- `POST /api/wallet/addFunds` — Add funds to wallet
- `GET /api/walletHistory` — Get transaction history

### Support
- `POST /api/support` — Create support ticket
- `GET /api/support` — Get support tickets (admin/user)
- `PUT /api/support/:id` — Update ticket status (admin)

### Admin
- `GET /api/admin/users` — Get all users (admin)
- `GET /api/admin/properties` — Approve/manage properties (admin)
- `GET /api/admin/support` — View all support tickets (admin)

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Include the token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

## 🎨 File Upload

- Profile pictures and property images are stored in `/backend/uploads/`
- Maximum file size: ~5MB (configurable in middleware)
- Supported formats: JPG, PNG, GIF

## 📝 Environment Variables

### Backend `.env` template
```env
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify MongoDB Atlas IP whitelist includes your current IP
- Check `MONGO_URI` format and credentials
- Ensure MongoDB cluster is active

### Port Already in Use
- Change `PORT` in `.env` (e.g., PORT=5001)
- Or kill the process using the port

### CORS Issues
- Verify backend and frontend URLs match in CORS configuration
- Check frontend is making requests to `http://localhost:5000`

## 🤝 Contributing

1. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -m "Add your feature description"`
3. Push to the branch: `git push origin feature/your-feature-name`
4. Submit a pull request with a clear description

## 📄 License

This project is open source and available under the MIT License.

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

---

**Last Updated**: June 9, 2026  
**Version**: 1.0.0
