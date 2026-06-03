import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useNavigate } from "react-router-dom"
import { useDonations } from '../context/DonationsContext'
import { getStatus, getSecondsLeft, formatCountdown } from '../utils/expiry'

const MiniCountdown = ({ expiryTime }) => {
    const [secs, setSecs] = useState(() => getSecondsLeft(expiryTime))

    useEffect(() => {
        if (secs === Infinity || secs <= 0) return
        const t = setInterval(() => setSecs(getSecondsLeft(expiryTime)), 1000)
        return () => clearInterval(t)
    }, [expiryTime])

    return <span>{formatCountdown(secs)}</span>
}

const Dashboard = () => {

    const navigate = useNavigate()
    const { donations } = useDonations()
    const [filter, setFilter] = useState("all")
    const [search, setSearch] = useState("")

    const userName = localStorage.getItem("dakoName") || "Restaurant"

    const activeDonations = donations.filter(d => d.status !== "Sent" && d.status !== "Accepted")
    const sentDonations = donations.filter(d => d.status === "Sent" || d.status === "Accepted")
    const urgentDonations = activeDonations.filter(d => getStatus(d.expiryTime) === "Urgent")

    // Food saved = count of sent/accepted donations (each = 1 unit of food rescued)
    const foodSaved = sentDonations.length

    // Build chart data from actual donations - last 7 days
    const buildChartData = () => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        const counts = Array(7).fill(0)
        donations.forEach(d => {
            const day = new Date(d.createdAt).getDay()
            counts[day]++
        })
        // Show last 7 days starting from today
        const today = new Date().getDay()
        const result = []
        for (let i = 6; i >= 0; i--) {
            const idx = (today - i + 7) % 7
            result.push({ day: days[idx], donations: counts[idx] })
        }
        return result
    }

    const chartData = buildChartData()

    const filtered = activeDonations.filter(item => {
        if (filter !== "all" && getStatus(item.expiryTime).toLowerCase() !== filter) return false
        return item.food.toLowerCase().includes(search.toLowerCase())
    })

    return (
        <div className="flex min-h-screen bg-green-50">

            {/* SIDEBAR */}
            <div className="w-[250px] bg-white shadow-lg p-6 flex-shrink-0">

                <h1 className="text-2xl font-extrabold text-emerald-600 mb-10">DAKO</h1>

                <div className="flex flex-col gap-4">
                    <button onClick={() => navigate("/dashboard")}
                        className="text-left bg-emerald-600 text-white p-3 rounded-lg font-semibold">
                        Dashboard
                    </button>
                    <button onClick={() => navigate("/donations")}
                        className="text-left p-3 rounded-lg hover:bg-green-100 transition">
                        Donations
                    </button>
                    <button onClick={() => navigate("/analytics")}
                        className="text-left p-3 rounded-lg hover:bg-green-100 transition">
                        Analytics
                    </button>
                    <button onClick={() => navigate("/settings")}
                        className="text-left p-3 rounded-lg hover:bg-green-100 transition">
                        Settings
                    </button>
                    <button onClick={() => navigate("/profile")}
                        className="text-left p-3 rounded-lg hover:bg-green-100 transition">
                        Profile
                    </button>
                </div>

            </div>

            {/* MAIN */}
            <div className="flex-1 p-8 overflow-auto">

                {/* TOP BAR */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold">Dashboard</h2>
                        <p className="text-gray-500">Welcome back, {userName}</p>
                    </div>
                    <button
                        onClick={() => { localStorage.clear(); navigate("/") }}
                        className="text-red-500 font-semibold hover:text-red-600 transition"
                    >
                        Logout
                    </button>
                </div>

                {/* STAT CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

                    <div className="bg-white p-5 rounded-2xl shadow">
                        <p className="text-gray-500 text-sm">Total Donations</p>
                        <h2 className="text-2xl font-bold text-emerald-600">{donations.length}</h2>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow">
                        <p className="text-gray-500 text-sm">Active</p>
                        <h2 className="text-2xl font-bold text-emerald-600">{activeDonations.length}</h2>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow">
                        <p className="text-gray-500 text-sm">Expiring Soon</p>
                        <h2 className="text-2xl font-bold text-red-500">{urgentDonations.length}</h2>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow">
                        <p className="text-gray-500 text-sm">Food Batches Saved</p>
                        <h2 className="text-2xl font-bold text-emerald-600">{foodSaved}</h2>
                    </div>

                </div>

                {/* CHART + ADD BUTTON ROW */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    {/* CHART */}
                    <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow">
                        <h2 className="text-xl font-bold mb-4">Weekly Donations</h2>
                        <div className="w-full h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="day" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="donations" fill="#059669" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* BIG ADD BUTTON */}
                    <div
                        onClick={() => navigate("/donations")}
                        className="bg-white rounded-2xl shadow flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-green-50 hover:shadow-md transition p-6 border-2 border-dashed border-emerald-300 group"
                    >
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition">
                            <span className="text-5xl text-emerald-600 leading-none font-light">+</span>
                        </div>
                        <p className="text-emerald-700 font-bold text-lg text-center">Add Donation</p>
                        <p className="text-gray-400 text-xs text-center">Post surplus food for donation centers to collect</p>
                    </div>

                </div>

                {/* RECENT ACTIVITY — live from context */}
                <div className="bg-white p-6 rounded-2xl shadow mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Recent Activity</h2>
                        <button
                            onClick={() => navigate("/donations")}
                            className="text-sm text-emerald-600 font-semibold hover:underline"
                        >
                            View all →
                        </button>
                    </div>

                    {donations.length === 0 ? (
                        <p className="text-gray-500">No donations yet. Add one above!</p>
                    ) : (
                        donations.slice(0, 5).map((item, index) => (
                            <div key={item._id || index} className="border-b py-3 last:border-none flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{item.food}</p>
                                    <p className="text-sm text-gray-500">{item.quantity} • {item.location}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-sm font-semibold ${
                                        item.status === "Sent" || item.status === "Accepted"
                                            ? "text-blue-600"
                                            : getStatus(item.expiryTime) === "Urgent"
                                                ? "text-red-500"
                                                : "text-emerald-600"
                                    }`}>
                                        {item.status === "Sent" || item.status === "Accepted"
                                            ? item.status
                                            : getStatus(item.expiryTime)
                                        }
                                    </span>
                                    {item.status !== "Sent" && item.status !== "Accepted" && item.expiryTime !== "0" && (
                                        <p className="text-xs text-gray-400">
                                            <MiniCountdown expiryTime={item.expiryTime} />
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* SEARCH + FILTER */}
                <div className="flex flex-wrap gap-3 mb-4 items-center">
                    <input
                        type="text"
                        placeholder="Search donations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-[260px] bg-white p-3 rounded-xl shadow outline-none border border-gray-200"
                    />
                    {["all", "active", "urgent"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg font-semibold capitalize ${filter === f
                                ? f === "urgent" ? "bg-red-500 text-white" : "bg-emerald-600 text-white"
                                : "bg-white"
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* ACTIVE DONATIONS LIST */}
                <h2 className="text-xl font-bold mb-4">Active Donations</h2>

                <div className="grid gap-4">
                    {filtered.length === 0 ? (
                        <p className="text-gray-500">No donations match</p>
                    ) : (
                        filtered.map((item, index) => (
                            <div key={item._id || index} className="bg-white p-5 rounded-2xl shadow flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold">{item.food}</h3>
                                    <p className="text-gray-600 text-sm">{item.quantity} • {item.location}</p>
                                    <p className="text-gray-400 text-xs mt-1">
                                        {item.expiryTime === "0"
                                            ? "No expiry"
                                            : <>Expires in: <MiniCountdown expiryTime={item.expiryTime} /></>
                                        }
                                    </p>
                                </div>
                                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                                    getStatus(item.expiryTime) === "Urgent"
                                        ? "bg-red-100 text-red-500"
                                        : "bg-green-100 text-emerald-600"
                                }`}>
                                    {getStatus(item.expiryTime)}
                                </span>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    )
}

export default Dashboard
