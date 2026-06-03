import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useDonations } from '../context/DonationsContext'
import { getStatus, formatCountdown, getSecondsLeft } from '../utils/expiry'

const CountdownBadge = ({ expiryTime }) => {
    const [secs, setSecs] = useState(() => getSecondsLeft(expiryTime))

    useEffect(() => {
        if (secs === Infinity || secs <= 0) return
        const t = setInterval(() => setSecs(getSecondsLeft(expiryTime)), 1000)
        return () => clearInterval(t)
    }, [expiryTime])

    if (expiryTime === "0") return <span className="text-xs font-semibold text-emerald-600">No expiry</span>

    const status = getStatus(expiryTime)
    const color = status === "Urgent" || status === "Expired" ? "text-red-500" : "text-emerald-600"

    return <span className={`text-xs font-semibold ${color}`}>{formatCountdown(secs)}</span>
}

const Center = () => {

    const { donations, updateDonation } = useDonations()
    const [tab, setTab] = useState("available")

    const centerName = localStorage.getItem("dakoName") || "Donation Center"

    // Available = restaurants marked as Sent, waiting for center to accept
    const available = donations.filter(d => d.status === "Sent")
    const accepted = donations.filter(d => d.status === "Accepted")
    const urgentAvailable = available.filter(d => getStatus(d.expiryTime) === "Urgent")

    const handleAccept = async (id) => {
        try {
            await updateDonation(id, {
                status: "Accepted",
                acceptedAt: new Date().toISOString()
            })
        } catch (err) {
            console.log(err)
            alert("Error accepting donation")
        }
    }

    return (
        <Layout title="Donation Center">

            {/* WELCOME */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-8">
                <p className="text-emerald-700 text-sm">
                    👋 Welcome, <b>{centerName}</b>. Accept food donations from restaurants below — food marked as "Sent" is ready for collection.
                </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                <div className="bg-white p-5 rounded-2xl shadow">
                    <p className="text-gray-500 text-sm">Available to Collect</p>
                    <h2 className="text-2xl font-bold text-emerald-600">{available.length}</h2>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow">
                    <p className="text-gray-500 text-sm">Accepted</p>
                    <h2 className="text-2xl font-bold text-blue-600">{accepted.length}</h2>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow">
                    <p className="text-gray-500 text-sm">Urgent Available</p>
                    <h2 className="text-2xl font-bold text-red-500">{urgentAvailable.length}</h2>
                </div>

            </div>

            {/* TABS */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setTab("available")}
                    className={`px-5 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${tab === "available"
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-gray-600 hover:bg-green-50"
                    }`}
                >
                    Available Donations
                    {available.length > 0 && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tab === "available" ? "bg-white text-emerald-600" : "bg-emerald-100 text-emerald-600"}`}>
                            {available.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setTab("accepted")}
                    className={`px-5 py-2 rounded-lg font-semibold transition ${tab === "accepted"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-blue-50"
                    }`}
                >
                    Accepted Donations
                </button>
            </div>

            {/* AVAILABLE */}
            {tab === "available" && (
                <div className="grid gap-4">
                    {available.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl shadow text-center">
                            <div className="text-4xl mb-3">🍽</div>
                            <p className="text-gray-500 text-lg mb-1">No donations available right now</p>
                            <p className="text-gray-400 text-sm">Restaurants will appear here once they mark food as sent</p>
                        </div>
                    ) : (
                        available.map(item => (
                            <div
                                key={item._id}
                                className={`bg-white p-5 rounded-2xl shadow flex justify-between items-center ${
                                    getStatus(item.expiryTime) === "Urgent" ? "border-l-4 border-red-400" : ""
                                }`}
                            >
                                <div>
                                    <h3 className="text-lg font-bold">{item.food}</h3>
                                    <p className="text-gray-600 text-sm">{item.quantity} • 📍 {item.location}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-gray-400 text-xs">Expires in:</span>
                                        <CountdownBadge expiryTime={item.expiryTime} />
                                    </div>
                                    {item.sentAt && (
                                        <p className="text-gray-400 text-xs mt-1">
                                            Posted: {new Date(item.sentAt).toLocaleString()}
                                        </p>
                                    )}
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
                                        onClick={() => handleAccept(item._id)}
                                        className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition text-sm font-semibold"
                                    >
                                        Accept
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* ACCEPTED */}
            {tab === "accepted" && (
                <div className="grid gap-4">
                    {accepted.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl shadow text-center">
                            <div className="text-4xl mb-3">✅</div>
                            <p className="text-gray-500">No accepted donations yet</p>
                            <p className="text-gray-400 text-sm mt-1">Accept available donations to track them here</p>
                        </div>
                    ) : (
                        accepted.map(item => (
                            <div
                                key={item._id}
                                className="bg-green-50 p-5 rounded-2xl shadow flex justify-between items-center border border-green-100"
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-emerald-600 font-bold">✓</span>
                                        <h3 className="text-lg font-bold">{item.food}</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm">{item.quantity} • 📍 {item.location}</p>
                                    {item.sentAt && (
                                        <p className="text-gray-400 text-xs mt-1">
                                            📤 Sent by restaurant: {new Date(item.sentAt).toLocaleString()}
                                        </p>
                                    )}
                                    {item.acceptedAt && (
                                        <p className="text-emerald-600 text-xs mt-1">
                                            ✓ Accepted: {new Date(item.acceptedAt).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                                <span className="bg-green-100 text-emerald-600 text-sm font-semibold px-3 py-1 rounded-full">
                                    Accepted
                                </span>
                            </div>
                        ))
                    )}
                </div>
            )}

        </Layout>
    )
}

export default Center
