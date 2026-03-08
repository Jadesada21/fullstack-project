import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"


export default function ProfilesPage() {

    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleLogout = async () => {
        await logout(navigate)
    }
    return (
        <div>
            <div className="text-5xl">Hello Profiles{user?.username}</div>

            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Logout
            </button>
        </div >
    )
}