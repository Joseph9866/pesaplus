# PesaPlus - Smart Savings & Financial Growth Platform

PesaPlus is a modern web application designed to help users save money, achieve financial goals, and earn rewards through gamified savings challenges. Built with React, TypeScript, and integrated with a Django REST API backend.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure signup, login, and profile management with JWT authentication
- **Savings Goals**: Create and track multiple savings goals with customizable targets and deadlines
- **Auto-Save**: Set up automatic savings with configurable frequency (daily, weekly, monthly)
- **KYC Verification**: Complete identity verification to unlock all features
- **Savings Challenges**: Participate in community challenges to boost savings and earn rewards
- **Lottery System**: Earn lottery entries through savings activities
- **Referral Program**: Invite friends and earn rewards
- **Multi-Currency Support**: View balances in different currencies (KES, USD, EUR, GBP)

### User Experience
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Real-time Updates**: Live balance and progress tracking
- **Notifications**: Stay informed about goals, challenges, and rewards
- **Social Features**: Connect with other savers and share achievements
- **Profile Management**: Edit personal information and manage account settings

## 🎨 Design System

### Color Palette
- **Primary Dark**: `#0F2A44` - Main brand color
- **Secondary Dark**: `#1a3a5c` - Gradient accent
- **Primary Yellow**: `#F4B400` - Call-to-action buttons
- **Hover Yellow**: `#E5A800` - Interactive states

### UI Components
- Modern card-based layouts
- Consistent button styling
- Smooth transitions and animations
- Professional typography
- Accessible form inputs with validation

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client

### Backend Integration
- **Django REST API** - Backend services
- **JWT Authentication** - Secure token-based auth
- **RESTful API** - Standard HTTP methods

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── features/       # Feature-specific components
│   ├── layout/         # Layout components (Header, Nav, etc.)
│   └── ui/             # Base UI components (Button, Card, Input)
├── contexts/           # React contexts (Auth, Currency)
├── lib/                # Utilities and API services
│   └── api/           # API client and service modules
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── utils/              # Helper functions

```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Backend API running (see backend documentation)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd pesaplus
```

2. Install dependencies
```bash
npm install
# or
pnpm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` and set:
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_USE_MOCK_DATA` - Set to 'false' for production

4. Start development server
```bash
npm run dev
```

5. Open browser at `http://localhost:5173`

## 📚 Documentation

### API Documentation
- `Pesapal API.yaml` - OpenAPI specification for backend endpoints
- View in Swagger UI: https://editor.swagger.io/

### Backend API Base URL
```
https://tj85nw4s-8000.uks1.devtunnels.ms/api/v1
```

### Authentication Flow
1. User registers with email, password, and full name
2. Backend returns JWT access and refresh tokens
3. Frontend stores tokens securely
4. Access token included in all authenticated requests
5. Refresh token used to get new access token when expired

## 🔐 Security

- JWT-based authentication
- Secure token storage
- Password validation (minimum 6 characters)
- Email verification
- KYC verification for enhanced features
- HTTPS-only in production

## 🎯 Key User Flows

### New User Journey
1. **Splash Screen** → Introduction to PesaPlus
2. **Sign Up** → Create account with email and password
3. **Dashboard** → View balance and create first goal
4. **KYC Verification** → Complete identity verification
5. **Savings Goals** → Set up goals and auto-save
6. **Challenges** → Join community challenges
7. **Rewards** → Earn and track lottery entries

### Returning User Journey
1. **Login** → Authenticate with credentials
2. **Dashboard** → View updated balances and progress
3. **Manage Goals** → Add funds, adjust targets
4. **Profile** → Update personal information
5. **Settings** → Configure preferences

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🏗️ Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

## 📝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📄 License

[Add your license information here]

## 👥 Team

[Add team information here]

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Contact support team
- Check documentation

---

**PesaPlus** - Save, Grow, Earn 💰
