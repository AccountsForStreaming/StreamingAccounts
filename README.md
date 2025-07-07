# StreamAccounts - Full-Stack Streaming Accounts Platform

A modern full-stack web application for selling streaming accounts with secure authentication, payment processing, and admin management.

## 🚀 Features

### User Features
- **Authentication**: Email/password and Google OAuth login
- **Product Catalog**: Browse streaming accounts with search and filtering
- **Shopping Cart**: Add/remove items with stock validation
- **Secure Payments**: Stripe and PayPal integration
- **Order Management**: Track order history and delivery status
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Admin Features
- **Inventory Management**: Add, edit, and manage products
- **Order Fulfillment**: Process orders and deliver account credentials
- **User Management**: Multi-admin support with role-based access
- **Analytics Dashboard**: Track sales and inventory

### Technical Features
- **Real-time Updates**: Firebase Firestore for live data
- **Stock Tracking**: Automatic inventory management
- **Email Notifications**: Order confirmations and delivery
- **Security**: JWT tokens, Firebase Auth, input validation
- **Performance**: Optimized builds, lazy loading, caching

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Firebase Auth** for authentication
- **React Router** for navigation
- **Axios** for API calls
- **Stripe & PayPal** for payments

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Firebase Admin SDK** for backend operations
- **Firestore** for database
- **Stripe & PayPal** APIs for payment processing
- **Nodemailer** for email services
- **JWT** for authentication

### Database
- **Firebase Firestore** with real-time updates
- **Firebase Authentication** for user management
- **Automatic backups** and scaling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Firebase project with Firestore and Authentication
- Stripe account for payments
- PayPal developer account

### 1. Clone and Install

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 2. Environment Setup

#### Frontend (.env)
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_API_URL=http://localhost:3000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

#### Backend (.env)
```env
NODE_ENV=development
PORT=3000

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key

STRIPE_SECRET_KEY=sk_test_your_stripe_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
```

### 3. Development

```bash
# Start frontend (port 5173)
npm run dev

# Start backend (port 3000)
cd backend
npm run dev
```

## 📞 Support

For support, email support@streamaccounts.com or create an issue in the repository.

---

**StreamAccounts** - Your trusted source for premium streaming accounts! 🎬🎵📺
