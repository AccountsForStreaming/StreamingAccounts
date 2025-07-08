# StreamingAccounts Backend API

Backend API for the StreamingAccounts platform - a full-stack web application for selling streaming accounts.

## 🚀 Features

- **Authentication**: Firebase Auth integration with JWT middleware
- **Order Management**: Complete order lifecycle management
- **Payment Processing**: Stripe and PayPal integration
- **File Upload**: Firebase Storage for screenshots
- **Email Service**: Automated email notifications
- **Admin Panel**: Admin-only routes for order fulfillment
- **Real-time Updates**: Firebase Firestore integration

## 🛠️ Tech Stack

- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Admin SDK
- **Payment**: Stripe & PayPal
- **Email**: Nodemailer with Gmail SMTP

## 📋 Prerequisites

- Node.js 20 or higher
- Firebase project with Firestore and Storage enabled
- Gmail account with App Password for email service
- Stripe account for payment processing

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=production
PORT=3001

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="your-private-key"

# Payment Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_STATEMENT_DESCRIPTOR=YOUR_COMPANY
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_MODE=sandbox

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Security
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=https://your-frontend-domain.com
```

## 🚀 Deployment

### Docker Deployment

1. **Build the Docker image**:
   ```bash
   docker build -t streaming-accounts-backend .
   ```

2. **Run the container**:
   ```bash
   docker run -p 3001:3001 --env-file .env streaming-accounts-backend
   ```

### Render Deployment

1. Connect this repository to Render
2. Set environment variables in Render dashboard
3. Deploy as a Web Service

## 📚 API Documentation

### Base URL
```
Production: https://your-backend-domain.com
Development: http://localhost:3001
```

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Health Check
- `GET /health` - Server health status

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

#### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

#### Orders
- `GET /api/orders/user/:userId` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/admin/all` - Get all orders (Admin only)
- `POST /api/orders/admin/:id/fulfill` - Fulfill order (Admin only)

#### Payments
- `POST /api/payments/stripe/create-intent` - Create Stripe payment intent

## 🛡️ Security Features

- Rate limiting
- CORS protection
- Helmet security headers
- Input validation with Joi
- JWT token verification
- Firebase Admin SDK authentication

## 📝 Development

### Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AccountsForStreaming/StreamingAccounts_backend.git
   cd StreamingAccounts_backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run seed` - Seed initial products to database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email [support@streamingaccounts.com](mailto:support@streamingaccounts.com) or create an issue on GitHub.
