import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Layout = ({ title, children }) => {

    const navigate = useNavigate()
    const location = useLocation()

    const role = localStorage.getItem("dakoRole") || "restaurant"
    const name = localStorage.getItem("dakoName") || "User"

    const handleLogout = () => {
        localStorage.clear()
        navigate("/")
    }

    const navItems = role === "restaurant"
        ? [
            { label: "Dashboard", path: "/dashboard" },
            { label: "Donations", path: "/donations" },
            { label: "Analytics", path: "/analytics" },
            { label: "Settings", path: "/settings" },
            { label: "Profile", path: "/profile" },
          ]
        : [
            { label: "Center", path: "/center" },
            { label: "Analytics", path: "/analytics" },
            { label: "Settings", path: "/settings" },
            { label: "Profile", path: "/profile" },
          ]

    return (
        <div className="flex min-h-screen bg-green-50">

            {/* SIDEBAR */}
            <div className="w-[250px] bg-white shadow-lg p-6 flex-shrink-0 flex flex-col">

                <h1 className="text-2xl font-extrabold text-emerald-600 mb-2">DAKO</h1>
                <p className="text-xs text-gray-400 mb-8">
                    {role === "restaurant" ? "🍽 Restaurant" : "🏠 Donation Center"}
                </p>

                <div className="flex flex-col gap-2 flex-1">
                    {navItems.map(item => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`text-left p-3 rounded-lg transition font-medium ${
                                location.pathname === item.path
                                    ? "bg-emerald-600 text-white"
                                    : "hover:bg-green-100 text-gray-700"
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-1">Logged in as</p>
                    <p className="text-sm font-semibold text-gray-700 truncate">{name}</p>
                    <button
                        onClick={handleLogout}
                        className="mt-3 text-red-500 text-sm font-semibold hover:text-red-600 transition"
                    >
                        Logout
                    </button>
                </div>

            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 p-8 overflow-auto">

                {/* TOPBAR */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold">{title}</h2>
                        <p className="text-gray-500">DAKO Donations Platform</p>
                    </div>
                </div>

                {children}

            </div>

        </div>
    )
}

export default Layout
