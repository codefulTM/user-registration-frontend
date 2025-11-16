import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Wrapper component to handle auth redirects
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated 
          ? <Navigate to="/home" replace /> 
          : <Navigate to="/login" replace />
      } />
      <Route path="/login" element={
        !isAuthenticated ? <Login /> : <Navigate to="/home" replace />
      } />
      <Route path="/signup" element={
        !isAuthenticated ? <SignUp /> : <Navigate to="/home" replace />
      } />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        {/* Add more protected routes here */}
      </Route>
      
      {/* 404 - Keep at the end */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="bottom-right" />
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
