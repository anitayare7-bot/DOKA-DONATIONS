import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Center from "./pages/Center"
import Donations from "./pages/Donations"
import Analytics from "./pages/Analytics"
import Settings from "./pages/Settings"
import Profile from "./pages/Profile"

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/center" element={<Center />} />

        <Route path="/donations" element={<Donations />} />

        <Route path="/analytics" element={<Analytics />} />

        <Route path="/settings" element={<Settings />} />

        <Route path="/profile" element={<Profile />} />

      </Routes>
    </Router>
  )
}

export default App