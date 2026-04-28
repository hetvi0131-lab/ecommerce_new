# VogueStore Frontend

A production-level E-Commerce Frontend built with React, Vite, Tailwind CSS, and Redux Toolkit.

## 🚀 Features

- **Authentication**: JWT-based Login & Registration with protected routes.
- **Product Discovery**: Homepage with Hero, Categories, and Featured products.
- **Advanced Filtering**: Product Listing Page (PLP) with category, price, and rating filters.
- **Shopping Experience**: Dynamic Cart, Wishlist, and Multi-step Checkout.
- **Admin Panel**: Dashboard for managing products and inventory.
- **Aesthetics**: Dark mode support, smooth animations (Framer Motion), and responsive design.
- **State Management**: Redux Toolkit for cart, auth, and global state.
- **API**: Axios with interceptors for JWT handling.

## 🛠️ Tech Stack

- **React.js** (Vite)
- **Tailwind CSS** (Styling)
- **Redux Toolkit** (State Management)
- **React Router 6** (Navigation)
- **Axios** (API Calls)
- **Lucide React** (Icons)
- **React Toastify** (Notifications)
- **Framer Motion** (Animations)

## 📦 Getting Started

### 1. Clone the repository
```bash
# If you have the code locally, just navigate to the folder
cd e-commerce
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the development server
```bash
npm run dev
```

## 📁 Folder Structure

- `src/components/`: Reusable UI components.
- `src/pages/`: Main page components.
- `src/redux/`: Redux slices and store configuration.
- `src/services/api/`: Axios configuration and API services.
- `src/hooks/`: Custom React hooks.
- `src/utils/`: Helper functions and constants.

## 🔐 Authentication
The app uses JWT tokens stored in `localStorage`. The Axios interceptor automatically attaches the token to every request.

## 🎨 UI/UX
- Fully responsive from mobile to desktop.
- Dark mode support (toggled in Navbar).
- Loading skeletons for better perceived performance.
- Toast notifications for user feedback.
