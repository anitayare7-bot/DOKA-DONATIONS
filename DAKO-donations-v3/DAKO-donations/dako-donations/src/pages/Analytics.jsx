import React from 'react'
import Layout from '../components/Layout'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useDonations } from '../context/DonationsContext'
import { getStatus } from '../utils/expiry'

const COLORS = ["#059669", "#ef4444", "#3b82f6", "#f59e0b"]

const Analytics = () => {

    const { donations } = useDonations()

    const activeDonations = donations.filter(d => d.status !== "Sent" && d.status !== "Accepted")
    const sentDonations = donations.filter(d => d.status === "Sent" || d.status === "Accepted")
    const acceptedDonations = donations.filter(d => d.status === "Accepted")
    const urgentDonations = activeDonations.filter(d => getStatus(d.expiryTime) === "Urgent")

    const foodSaved = sentDonations.length
    const total = donations.length
    const urgentRate = total > 0 ? Math.round((urgentDonations.length / total) * 100) : 0
    const activeRate = total > 0 ? Math.round((activeDonations.length / total) * 100) : 0

    // Weekly donations bar chart
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const counts = Array(7).fill(0)
    donations.forEach(d => {
        const day = new Date(d.createdAt).getDay()
        counts[day]++
    })
    const today = new Date().getDay()
    const weeklyData = []
    for (let i = 6; i >= 0; i--) {
        const idx = (today - i + 7) % 7
        weeklyData.push({ day: days[idx], donations: counts[idx] })
    }

    // Pie chart: status breakdown
    const pieData = [
        { name: "Active", value: activeDonations.length },
        { name: "Urgent", value: urgentDonations.length },
        { name: "Sent", value: sentDonations.filter(d => d.status === "Sent").length },
        { name: "Accepted", value: acceptedDonations.length },
    ].filter(d => d.value > 0)

    return (
        <Layout title="Analytics">

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

                <div className="bg-white p-5 rounded-2xl shadow">
                    <p className="text-gray-500 text-sm">Total Donations</p>
                    <h2 className="text-2xl font-bold text-emerald-600">{total}</h2>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow">
                    <p className="text-gray-500 text-sm">Food Batches Saved</p>
                    <h2 className="text-2xl font-bold text-emerald-600">{foodSaved}</h2>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow">
                    <p className="text-gray-500 text-sm">Urgent Rate</p>
                    <h2 className="text-2xl font-bold text-red-500">{urgentRate}%</h2>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow">
                    <p className="text-gray-500 text-sm">Active Rate</p>
                    <h2 className="text-2xl font-bold text-emerald-600">{activeRate}%</h2>
                </div>

            </div>

            {/* CHARTS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                {/* WEEKLY BAR */}
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h2 className="text-xl font-bold mb-4">Donations This Week</h2>
                    {total === 0 ? (
                        <div className="h-[200px] flex items-center justify-center text-gray-400">
                            No data yet
                        </div>
                    ) : (
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData}>
                                    <XAxis dataKey="day" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="donations" fill="#059669" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* STATUS PIE */}
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h2 className="text-xl font-bold mb-4">Donation Status Breakdown</h2>
                    {pieData.length === 0 ? (
                        <div className="h-[200px] flex items-center justify-center text-gray-400">
                            No data yet
                        </div>
                    ) : (
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

            </div>

            {/* INSIGHT */}
            <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-xl font-bold mb-4">Insights</h2>
                {total === 0 ? (
                    <p className="text-gray-500">Add your first donation to start seeing insights.</p>
                ) : (
                    <div className="space-y-2 text-gray-600">
                        <p>• You have posted <b>{total}</b> donation{total !== 1 ? "s" : ""} total.</p>
                        {foodSaved > 0 && <p>• <b>{foodSaved}</b> batch{foodSaved !== 1 ? "es" : ""} of food have been sent to or accepted by donation centers.</p>}
                        {urgentDonations.length > 0 && (
                            <p className="text-red-500">• ⚠️ <b>{urgentDonations.length}</b> donation{urgentDonations.length !== 1 ? "s are" : " is"} expiring within the hour — act fast!</p>
                        )}
                        {urgentDonations.length === 0 && activeDonations.length > 0 && (
                            <p>• All active donations have time to spare. Great planning!</p>
                        )}
                    </div>
                )}
            </div>

        </Layout>
    )
}

export default Analytics
