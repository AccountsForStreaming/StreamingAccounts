# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a full-stack web application for selling streaming accounts with the following architecture:

### Frontend (React + TypeScript + Vite)
- Modern React application with TypeScript
- Tailwind CSS for styling
- Firebase Authentication (email/password + Google OAuth)
- React Router for navigation
- Payment integration with Stripe and PayPal
- Responsive design for mobile and desktop

### Backend (Node.js + Express)
- REST API with Express.js
- Firebase Admin SDK for backend operations
- JWT token validation
- Email service integration
- Payment webhook handling
- Admin panel APIs

### Database (Firebase Firestore)
- User profiles and authentication
- Product/account inventory with stock tracking
- Orders and transaction history
- Admin management
- Real-time updates

## Key Features
1. User authentication and registration
2. Product catalog with streaming accounts
3. Shopping cart and checkout flow
4. Payment processing (Stripe + PayPal)
5. User dashboard with order history
6. Admin panel for inventory and order management
7. Email notifications for order fulfillment
8. Stock tracking per product
9. Multi-admin support

## Development Guidelines
- Use TypeScript for type safety
- Follow React functional components with hooks
- Implement proper error handling and loading states
- Use Firebase security rules for data protection
- Implement responsive design patterns
- Follow clean code principles and component organization
- Use environment variables for sensitive configuration
- Implement proper form validation
- Use async/await for API calls
- Follow RESTful API conventions
