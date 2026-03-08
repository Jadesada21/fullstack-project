import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../AxiosInstance'

type User = {
    id: number
    username: string
    role: string
}

type AuthContextType = {
    user: User | null
    loginAndRedirect: (
        username: string,
        password: string,
        navigate: (path: string) => void
    ) => Promise<void>
    logout: (navigate: (path: string) => void) => Promise<void>
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
                const res = await api.get('/me')

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
    const loginAndRedirect = async (
        username: string,
        password: string,
        navigate: (path: string) => void
    ) => {
        try {
            const res = await api.post("/login", { username, password })

            const user = res.data.user
            setUser(user)

            if (user.role === 'admin') {
                navigate('/admin')
            } else {
                navigate('/')
            }
        } catch (err) {
            console.error("Login failed", err);
            throw err
        }
    }

    const logout = async () => {
        try {
            await api.post("/logout")
        } catch (err) {
            console.error(err)
        }
        // clear user
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{ user, loginAndRedirect, logout, loading }}>
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

