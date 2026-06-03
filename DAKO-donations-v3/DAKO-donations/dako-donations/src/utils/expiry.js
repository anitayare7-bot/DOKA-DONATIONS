// Returns remaining seconds from an ISO datetime string.
// "0" means no expiry → returns Infinity
export function getSecondsLeft(expiryTime) {
    if (!expiryTime || expiryTime === "0") return Infinity
    const diff = new Date(expiryTime).getTime() - Date.now()
    return Math.max(0, Math.floor(diff / 1000))
}

// Format seconds into a human-readable countdown
export function formatCountdown(seconds) {
    if (seconds === Infinity) return "No expiry"
    if (seconds <= 0) return "Expired"
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) return `${h}h ${m}m`
    if (m > 0) return `${m}m ${s}s`
    return `${s}s`
}

// Status derived from live seconds
export function getStatus(expiryTime) {
    const secs = getSecondsLeft(expiryTime)
    if (secs === Infinity) return "Active"
    if (secs <= 0) return "Expired"
    if (secs <= 3600) return "Urgent"   // under 1 hour
    return "Active"
}
