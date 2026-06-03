import React, { useState } from 'react'
import Layout from '../components/Layout'

const Settings = () => {

    const [notifications, setNotifications] = useState(true)
    const [emailAlerts, setEmailAlerts] = useState(true)
    const [autoUrgentTag, setAutoUrgentTag] = useState(true)

    const handleSave = () => {
        alert("Settings saved (frontend only)")
    }

    return (
        <Layout title="Settings">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* SETTINGS CARD */}
                <div className="bg-white p-6 rounded-2xl shadow">

                    <h2 className="text-xl font-bold mb-6">
                        App Preferences
                    </h2>

                    <div className="space-y-5">

                        {/* Notifications */}
                        <div className="flex justify-between items-center">
                            <span>Enable Notifications</span>
                            <input
                                type="checkbox"
                                checked={notifications}
                                onChange={() => setNotifications(!notifications)}
                                className="w-5 h-5 accent-emerald-600"
                            />
                        </div>

                        {/* Email Alerts */}
                        <div className="flex justify-between items-center">
                            <span>Email Alerts</span>
                            <input
                                type="checkbox"
                                checked={emailAlerts}
                                onChange={() => setEmailAlerts(!emailAlerts)}
                                className="w-5 h-5 accent-emerald-600"
                            />
                        </div>

                        {/* Auto Urgent Tag */}
                        <div className="flex justify-between items-center">
                            <span>Auto Urgent Tagging</span>
                            <input
                                type="checkbox"
                                checked={autoUrgentTag}
                                onChange={() => setAutoUrgentTag(!autoUrgentTag)}
                                className="w-5 h-5 accent-emerald-600"
                            />
                        </div>

                    </div>

                    <button
                        onClick={handleSave}
                        className="mt-6 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
                    >
                        Save Settings
                    </button>

                </div>

                {/* INFO CARD */}
                <div className="bg-white p-6 rounded-2xl shadow">

                    <h2 className="text-xl font-bold mb-4">
                        System Info
                    </h2>

                    <div className="space-y-4 text-gray-600">

                        <p>
                            DAKO Donations helps restaurants reduce food waste by connecting surplus food to donation centers.
                        </p>

                        <p>
                            Your account is currently configured as a <b>Restaurant</b> role.
                        </p>

                        <p>
                            All settings changes are saved locally in this demo version.
                        </p>

                    </div>

                </div>

            </div>

        </Layout>
    )
}

export default Settings