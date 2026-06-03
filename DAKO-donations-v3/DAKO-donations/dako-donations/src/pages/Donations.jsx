import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useDonations } from '../context/DonationsContext'
import { getStatus, getSecondsLeft, formatCountdown } from '../utils/expiry'

const CountdownBadge = ({ expiryTime }) => {
    const [secs, setSecs] = useState(() => getSecondsLeft(expiryTime))

    useEffect(() => {
        if (secs === Infinity || secs <= 0) return
        const timer = setInterval(() => {
            setSecs(getSecondsLeft(expiryTime))
        }, 1000)
        return () => clearInterval(timer)
    }, [expiryTime])

    if (expiryTime === "0") return <span className="text-sm font-semibold text-emerald-600">No expiry</span>

    const status = getStatus(expiryTime)
    const color = status === "Urgent" || status === "Expired" ? "text-red-500" : "text-emerald-600"

    return (
        <span className={`text-sm font-semibold ${color}`}>
            {status === "Expired" ? "Expired" : formatCountdown(secs)}
        </span>
    )
}

const Donations = () => {

    const { donations, addDonation, deleteDonation, updateDonation } = useDonations()
    const [tab, setTab] = useState("active")

    const [food, setFood] = useState("")
    const [quantity, setQuantity] = useState("")
    const [location, setLocation] = useState("")
    const [expiryDate, setExpiryDate] = useState("")
    const [expiryTimeInput, setExpiryTimeInput] = useState("")
    const [noExpiry, setNoExpiry] = useState(false)

    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("all")

    const handleAdd = async () => {
        if (!food || !quantity || !location) return alert("Please fill all fields")
        if (!noExpiry && (!expiryDate || !expiryTimeInput)) {
            return alert("Please set an expiry date and time, or check 'No expiry'")
        }

        let expiryTime = "0"
        if (!noExpiry) {
            expiryTime = new Date(`${expiryDate}T${expiryTimeInput}`).toISOString()
        }

        try {
            await addDonation({ food, quantity, location, expiryTime })
            setFood("")
            setQuantity("")
            setLocation("")
            setExpiryDate("")
            setExpiryTimeInput("")
            setNoExpiry(false)
        } catch (err) {
            console.log(err)
            alert("Error adding donation")
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteDonation(id)
        } catch (err) {
            console.log(err)
        }
    }

    const handleMarkSent = async (id) => {
        try {
            await updateDonation(id, { status: "Sent", sentAt: new Date().toISOString() })
        } catch (err) {
            console.log(err)
            alert("Error marking as sent")
        }
    }

    const activeDonations = donations.filter(d => d.status !== "Sent" && d.status !== "Accepted")
    const sentDonations = donations.filter(d => d.status === "Sent" || d.status === "Accepted")

    const filteredActive = activeDonations.filter(item => {
        if (filter !== "all" && getStatus(item.expiryTime).toLowerCase() !== filter) return false
        return item.food.toLowerCase().includes(search.toLowerCase())
    })

    // Today's min date for the date picker
    const todayStr = new Date().toISOString().split("T")[0]

    return (
        <Layout title="Donations">

            {/* ADD DONATION FORM */}
            <div className="bg-white p-6 rounded-2xl shadow mb-8">

                <h2 className="text-xl font-bold mb-4">Add New Donation</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                        type="text"
                        placeholder="Food name"
                        value={food}
                        onChange={(e) => setFood(e.target.value)}
                        className="border p-3 rounded-lg outline-none focus:border-emerald-600"
                    />

                    <input
                        type="text"
                        placeholder="Quantity (e.g. 10 packs)"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="border p-3 rounded-lg outline-none focus:border-emerald-600"
                    />

                    <input
                        type="text"
                        placeholder="Pickup location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="border p-3 rounded-lg outline-none focus:border-emerald-600"
                    />

                    {/* EXPIRY */}
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={expiryDate}
                                min={todayStr}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                disabled={noExpiry}
                                className="flex-1 border p-3 rounded-lg outline-none focus:border-emerald-600 disabled:opacity-40"
                            />
                            <input
                                type="time"
                                value={expiryTimeInput}
                                onChange={(e) => setExpiryTimeInput(e.target.value)}
                                disabled={noExpiry}
                                className="flex-1 border p-3 rounded-lg outline-none focus:border-emerald-600 disabled:opacity-40"
                            />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={noExpiry}
                                onChange={() => setNoExpiry(!noExpiry)}
                                className="accent-emerald-600"
                            />
                            No expiry (set to 0)
                        </label>
                    </div>

                </div>

                <button
                    onClick={handleAdd}
                    className="mt-5 bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition font-semibold"
                >
                    Add Donation
                </button>

            </div>

            {/* OVERVIEW CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                <div className="bg-white p-5 rounded-2xl shadow">
                    <p className="text-gray-500 text-sm">Active Donations</p>
                    <h2 className="text-2xl font-bold text-emerald-600">{activeDonations.length}</h2>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow">
                    <p className="text-gray-500 text-sm">Sent to Centers</p>
                    <h2 className="text-2xl font-bold text-blue-600">{sentDonations.length}</h2>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow">
                    <p className="text-gray-500 text-sm">Urgent</p>
                    <h2 className="text-2xl font-bold text-red-500">
                        {activeDonations.filter(d => getStatus(d.expiryTime) === "Urgent").length}
                    </h2>
                </div>

            </div>

            {/* TABS */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setTab("active")}
                    className={`px-5 py-2 rounded-lg font-semibold transition ${tab === "active"
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-gray-600 hover:bg-green-50"
                    }`}
                >
                    Active Donations
                </button>
                <button
                    onClick={() => setTab("sent")}
                    className={`px-5 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${tab === "sent"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-blue-50"
                    }`}
                >
                    Sent to Centers
                    {sentDonations.length > 0 && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tab === "sent" ? "bg-white text-blue-600" : "bg-blue-100 text-blue-600"}`}>
                            {sentDonations.length}
                        </span>
                    )}
                </button>
            </div>

            {/* ACTIVE TAB */}
            {tab === "active" && (
                <>
                    <div className="flex flex-wrap gap-3 mb-6 items-center">
                        <input
                            type="text"
                            placeholder="Search donations..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white p-3 rounded-xl shadow outline-none border border-gray-200 w-full md:w-[260px]"
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

                    <div className="grid gap-4">
                        {filteredActive.length === 0 ? (
                            <p className="text-gray-500">No active donations</p>
                        ) : (
                            filteredActive.map(item => (
                                <div
                                    key={item._id}
                                    className="bg-white p-5 rounded-2xl shadow flex justify-between items-center"
                                >
                                    <div>
                                        <h3 className="text-lg font-bold">{item.food}</h3>
                                        <p className="text-gray-600 text-sm">{item.quantity} • {item.location}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-gray-400 text-xs">Expires in:</span>
                                            <CountdownBadge expiryTime={item.expiryTime} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                                            getStatus(item.expiryTime) === "Urgent"
                                                ? "bg-red-100 text-red-500"
                                                : "bg-green-100 text-emerald-600"
                                        }`}>
                                            {getStatus(item.expiryTime)}
                                        </span>
                                        <button
                                            onClick={() => handleMarkSent(item._id)}
                                            className="bg-blue-600 text-white text-sm px-4 py-1 rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Mark as Sent
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="text-red-400 text-xs hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* SENT TAB */}
            {tab === "sent" && (
                <div className="grid gap-4">
                    {sentDonations.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl shadow text-center">
                            <p className="text-gray-500 text-lg mb-1">No food sent to centers yet</p>
                            <p className="text-gray-400 text-sm">Mark donations as "Sent" to track them here</p>
                        </div>
                    ) : (
                        sentDonations.map(item => (
                            <div
                                key={item._id}
                                className="bg-blue-50 p-5 rounded-2xl shadow flex justify-between items-center border border-blue-100"
                            >
                                <div>
                                    <h3 className="text-lg font-bold">{item.food}</h3>
                                    <p className="text-gray-600 text-sm">{item.quantity} • {item.location}</p>
                                    {item.sentAt && (
                                        <p className="text-gray-400 text-xs mt-1">
                                            📤 Sent: {new Date(item.sentAt).toLocaleString()}
                                        </p>
                                    )}
                                    {item.acceptedAt && (
                                        <p className="text-emerald-600 text-xs mt-1">
                                            ✓ Accepted by center: {new Date(item.acceptedAt).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                                    item.status === "Accepted"
                                        ? "bg-green-100 text-emerald-600"
                                        : "bg-blue-100 text-blue-600"
                                }`}>
                                    {item.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            )}

        </Layout>
    )
}

export default Donations
