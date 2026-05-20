import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SendSms from "./pages/SendSms";
import Campaigns from "./pages/Campaigns";
import Contact from "./pages/Contact";
import Templates from "./pages/Templates";
import Analytics from "./pages/Analytics";
import APIKeys from "./pages/APIkeys";
import Scheduler from "./pages/scheduler";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="send" element={<SendSms />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="contacts" element={<Contact />} />
          <Route path="templates" element={<Templates />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="api-keys" element={<APIKeys />} />
          <Route path="schedules" element={<Scheduler />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
