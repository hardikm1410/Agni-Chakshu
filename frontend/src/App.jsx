import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";

import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import LiveGISMap from "./pages/LiveGISMap";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FireIntel from "./pages/FireIntel";
import PersistentSources from "./pages/PersistentSources";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import SystemStatus from "./pages/SystemStatus";
import Settings from "./pages/Settings";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="live-map" element={<LiveGISMap />} />
              <Route path="live-mapsvg" element={<LiveGISMap />} />
              <Route path="fire-intel" element={<FireIntel />} />
              <Route path="persistent-sources" element={<PersistentSources />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="status" element={<SystemStatus />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;