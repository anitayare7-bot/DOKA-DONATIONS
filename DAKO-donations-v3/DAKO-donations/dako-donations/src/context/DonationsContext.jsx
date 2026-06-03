import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const DonationsContext = createContext(null)

export const DonationsProvider = ({ children }) => {
    const [donations, setDonations] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchDonations = useCallback(async () => {
        try {
            const res = await axios.get('/api/donations')
            setDonations(res.data)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchDonations()
        const poll = setInterval(fetchDonations, 20000)
        return () => clearInterval(poll)
    }, [fetchDonations])

    const addDonation = async (data) => {
        const res = await axios.post('/api/donations', data)
        setDonations(prev => [res.data, ...prev])
        return res.data
    }

    const deleteDonation = async (id) => {
        await axios.delete(`/api/donations/${id}`)
        setDonations(prev => prev.filter(d => d._id !== id))
    }

    const updateDonation = async (id, data) => {
        const res = await axios.patch(`/api/donations/${id}`, data)
        setDonations(prev => prev.map(d => d._id === id ? res.data : d))
        return res.data
    }

    return (
        <DonationsContext.Provider value={{ donations, loading, fetchDonations, addDonation, deleteDonation, updateDonation }}>
            {children}
        </DonationsContext.Provider>
    )
}

export const useDonations = () => useContext(DonationsContext)
