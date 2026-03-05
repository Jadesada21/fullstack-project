import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

import { api } from '../axiosInstance'

type User = {
    id: number
    username: string
    role: string
}

type AuthContextType = {
    user: User | null
    login: (username: string, password: string) => Promise<void>
    logout: () => void
    loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // check login when refresh or close tab
    useEffect(() => {

        const fetchUser = async () => {
            try {
                const res = await api.get('/auth/me')

                setUser(res.data.user)
            } catch (err) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    // login 
    const login = async (username: string, password: string) => {
        const res = await api.post("/auth/login",
            { username, password })
        setUser(res.data.user)
    }

    const logout = async () => {
        await api.post(
            "/auth/logout"
        )
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context
}

