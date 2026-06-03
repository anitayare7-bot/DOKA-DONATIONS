import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"

const Login = () => {
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("restaurant")

    const handleLogin = () => {
        if (!username || !password) return alert("Please enter your username and password")

        // Read role saved during registration if available, else use the dropdown
        const savedRole = localStorage.getItem("dakoRole") || role

        localStorage.setItem("dakoRole", savedRole)
        localStorage.setItem("dakoName", username)

        if (savedRole === "restaurant") {
            navigate("/dashboard")
        } else {
            navigate("/center")
        }
    }

    return (
        <div className="h-screen bg-green-50 flex flex-col items-center justify-center">

            {/* Logo */}
            <h1 className="text-4xl font-extrabold text-emerald-600 tracking-wide">
                DAKO DONATIONS
            </h1>

            <p className="text-sm text-gray-500 pb-2 mb-6 border-b border-gray-300">
                Reducing food waste
            </p>

            {/* Login Card */}
            <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">

                <h2 className="text-2xl font-bold text-center mb-8">
                    Login
                </h2>

                <div className="flex flex-col gap-5">

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-emerald-600"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-emerald-600"
                    />

                    <div className='border-gray-300 rounded-xl'>
                        <h1 className='text-center text-bold text-gray-800'>I am a:</h1>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-emerald-50 border border-gray-300 p-3 rounded-lg outline-none focus:border-emerald-600"
                        >
                            <option value="restaurant">Restaurant</option>
                            <option value="center">Donation Center</option>
                        </select>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 transition font-semibold"
                    >
                        Login
                    </button>

                    <p className="text-center text-gray-600">
                        Don't have an account?
                        <span
                            onClick={() => navigate("/register")}
                            className="text-emerald-600 font-semibold cursor-pointer ml-1"
                        >
                            Register
                        </span>
                    </p>

                </div>

            </div>
        </div>
    )
}

export default Login
