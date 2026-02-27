//App.jsx
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import EditProfilePage from "./pages/EditProfilePage";
import ReportProblemPage from "./pages/ReportProblemPage";
import TalktimeWalletPage from "./pages/TalktimeWalletPage";

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/signin" replace />;
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/home" replace />;
}

const router = createBrowserRouter(
  [
    { path: "/", element: <Navigate to="/signin" replace /> },
    {
      path: "/signup",
      element: (
        <PublicOnly>
          <SignupPage />
        </PublicOnly>
      ),
    },
    {
      path: "/signin",
      element: (
        <PublicOnly>
          <LoginPage />
        </PublicOnly>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <PublicOnly>
          <ForgotPasswordPage />
        </PublicOnly>
      ),
    },
    { path: "/verify-otp", element: <VerifyOTPPage /> },
    { path: "/reset-password", element: <ResetPasswordPage /> },
    {
      path: "/home",
      element: (
        <RequireAuth>
          <HomePage />
        </RequireAuth>
      ),
    },
    {
      path: "/account",
      element: (
        <RequireAuth>
          <AccountPage />
        </RequireAuth>
      ),
    },
    {
      path: "/edit-profile",
      element: (
        <RequireAuth>
          <EditProfilePage />
        </RequireAuth>
      ),
    },
    {
      path: "/report-problem",
      element: (
        <RequireAuth>
          <ReportProblemPage />
        </RequireAuth>
      ),
    },
    {
      path: "/talktime-wallet",
      element: (
        <RequireAuth>
          <TalktimeWalletPage />
        </RequireAuth>
      ),
    },
  ],
  {
    future: { v7_relativeSplatPath: true, v7_startTransition: true },
  },
);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
