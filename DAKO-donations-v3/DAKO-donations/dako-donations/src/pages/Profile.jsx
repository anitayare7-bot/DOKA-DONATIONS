import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useDonations } from '../context/DonationsContext'
import { getStatus } from '../utils/expiry'

const Profile = () => {

    const { donations } = useDonations()

    const [name, setName] = useState(localStorage.getItem("dakoName") || "")
    const [email, setEmail] = useState(localStorage.getItem("dakoEmail") || "")
    const [location, setLocation] = useState(localStorage.getItem("dakoLocation") || "")
    const [phone, setPhone] = useState(localStorage.getItem("dakoPhone") || "")

    const role = localStorage.getItem("dakoRole") || "restaurant"

    const handleSave = () => {
        localStorage.setItem("dakoName", name)
        localStorage.setItem("dakoEmail", email)
        localStorage.setItem("dakoLocation", location)
        localStorage.setItem("dakoPhone", phone)
        alert("Profile updated!")
    }

    const activeDonations = donations.filter(d => d.status !== "Sent" && d.status !== "Accepted")
    const sentDonations = donations.filter(d => d.status === "Sent" || d.status === "Accepted")
    const urgentDonations = activeDonations.filter(d => getStatus(d.expiryTime) === "Urgent")

    return (
        <Layout title="Profile">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* PROFILE INFO CARD */}
                <div className="bg-white p-6 rounded-2xl shadow">

                    <h2 className="text-xl font-bold mb-1">
                        {role === "restaurant" ? "Restaurant Profile" : "Donation Center Profile"}
                    </h2>
                    <p className="text-gray-400 text-sm mb-4">Your details on the DAKO platform</p>

                    <div className="space-y-4">

                        <input
                            type="text"
                            placeholder={role === "restaurant" ? "Restaurant Name" : "Center Name"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border p-3 rounded-lg outline-none focus:border-emerald-600"
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border p-3 rounded-lg outline-none focus:border-emerald-600"
                        />

                        <input
                            type="text"
                            placeholder="Location / Address"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full border p-3 rounded-lg outline-none focus:border-emerald-600"
                        />

                        <input
                            type="text"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border p-3 rounded-lg outline-none focus:border-emerald-600"
                        />

                        <div className="flex items-center gap-3 bg-emerald-50 p-3 rounded-lg">
                            <span className="text-emerald-700 text-sm font-semibold">Account type:</span>
                            <span className="text-emerald-600 text-sm">
                                {role === "restaurant" ? "🍽 Restaurant" : "🏠 Donation Center"}
                            </span>
                        </div>

                        <button
                            onClick={handleSave}
                            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
                        >
                            Save Profile
                        </button>

                    </div>

                </div>

                {/* STATS CARD */}
                <div className="bg-white p-6 rounded-2xl shadow">

                    <h2 className="text-xl font-bold mb-4">Impact Summary</h2>

                    <div className="space-y-4">

                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Total Donations Posted</span>
                            <span className="font-bold text-emerald-600">{donations.length}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Active Right Now</span>
                            <span className="font-bold text-emerald-600">{activeDonations.length}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Food Batches Saved</span>
                            <span className="font-bold text-emerald-600">{sentDonations.length}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Urgent Items</span>
                            <span className="font-bold text-red-500">{urgentDonations.length}</span>
                        </div>

                    </div>

                </div>

            </div>

        </Layout>
    )
}

export default Profile
