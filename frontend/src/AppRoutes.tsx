import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Loading } from "@/components/Loading";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

const Home = lazy(() => import("@/pages/HomePage"));
const Login = lazy(() => import("@/pages/LoginPage"));
const Register = lazy(() => import("@/pages/RegisterPage"));
const Dashboard = lazy(() => import("@/pages/DashboardPage"));


const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Toaster />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
};

export default App;
