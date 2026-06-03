import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {

    const navigate = useNavigate()

    const [role, setRole] = useState("restaurant")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [location, setLocation] = useState("")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")

    const handleRegister = () => {

        if (!name || !email || !phone || !location || !password || !confirm) {
            return alert("Please fill all fields")
        }

        if (password !== confirm) {
            return alert("Passwords do not match")
        }

        // Save role to localStorage so login can redirect correctly
        localStorage.setItem("dakoRole", role)
        localStorage.setItem("dakoName", name)

        alert(`${role === "restaurant" ? "Restaurant" : "Donation Center"} registered! Please login.`)
        navigate("/")
    }

    return (
        <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center py-10">

            {/* Logo */}
            <h1 className="text-4xl font-extrabold text-emerald-600 tracking-wide">
                DAKO DONATIONS
            </h1>

            <p className="text-sm text-gray-500 pb-2 mb-6 border-b border-gray-300">
                Reducing food waste
            </p>

            {/* Card */}
            <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">

                <h2 className="text-2xl font-bold text-center mb-2">
                    Create Account
                </h2>

                <p className="text-center text-gray-500 text-sm mb-6">
                    Join the DAKO platform
                </p>

                {/* Role Toggle */}
                <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
                    <button
                        onClick={() => setRole("restaurant")}
                        className={`flex-1 py-2 text-sm font-semibold transition ${role === "restaurant"
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-gray-600 hover:bg-green-50"
                            }`}
                    >
                        🍽 Restaurant
                    </button>
                    <button
                        onClick={() => setRole("center")}
                        className={`flex-1 py-2 text-sm font-semibold transition ${role === "center"
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-gray-600 hover:bg-green-50"
                            }`}
                    >
                        🏠 Donation Center
                    </button>
                </div>

                <div className="flex flex-col gap-4">

                    <input
                        type="text"
                        placeholder={role === "restaurant" ? "Restaurant Name" : "Center Name"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-emerald-600"
                    />

                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-emerald-600"
                    />

                    <input
                        type="tel"
                        placeholder="Phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-emerald-600"
                    />

                    <input
                        type="text"
                        placeholder={role === "restaurant" ? "Restaurant Address" : "Center Address"}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-emerald-600"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-emerald-600"
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-emerald-600"
                    />

                    {role === "restaurant" && (
                        <p className="text-xs text-gray-500 bg-green-50 p-3 rounded-lg">
                            🍽 As a <b>Restaurant</b>, you can post surplus food donations for nearby centers to collect.
                        </p>
                    )}

                    {role === "center" && (
                        <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                            🏠 As a <b>Donation Center</b>, you can browse available donations and accept food from restaurants.
                        </p>
                    )}

                    <button
                        onClick={handleRegister}
                        className="bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 transition font-semibold"
                    >
                        Create Account
                    </button>

                    <p className="text-center text-gray-600 text-sm">
                        Already have an account?
                        <span
                            onClick={() => navigate("/")}
                            className="text-emerald-600 font-semibold cursor-pointer ml-1"
                        >
                            Login
                        </span>
                    </p>

                </div>

            </div>

        </div>
    )
}

export default Register
