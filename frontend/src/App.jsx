import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PricelistPage from "./pages/PricelistPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* root route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* protected */}
      {/* descomentar luego */}
      <Route
        path="/pricelist"
        element={
          <ProtectedRoute>
            <PricelistPage />
          </ProtectedRoute>
        }
      />

      {/* another unkown route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
