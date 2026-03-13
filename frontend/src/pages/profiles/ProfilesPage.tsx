import { Outlet, useNavigate, useLocation } from "react-router-dom"

import { useAuth } from "../../context/AuthContext"
import { useState } from "react"

export default function ProfilesPage() {

    const [openProfilesMenu, setOpenProfilesMenu] = useState(false)

    const location = useLocation()

    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleLogout = async () => {
        await logout(navigate)
    }

    const capitalize = (text?: string) => {
        if (!text) return ""
        return text.charAt(0).toUpperCase() + text.slice(1)
    }

    return (
        <div className="flex h-full">

            {/* sidebar */}

            <div className="pb-6 md:w-75 w-90 bg-white/60 flex flex-col border-r border-gray-200 pt-20 items-center space-y-4">

                <button
                    onClick={() => {
                        setOpenProfilesMenu(!openProfilesMenu)
                        navigate("/profile")
                    }}
                    className={`cursor-pointer text-xl border-b font-baskerville
                        ${location.pathname === "/profile"
                            ? "border-black"
                            : "border-transparent hover:border-black"
                        }`}
                >Profiles
                </button>

                {openProfilesMenu && (
                    <div className="flex flex-col items-center space-y-2 text-lg">
                        <button
                            onClick={() => navigate("/profile")}
                            className="cursor-pointer border-b border-transparent font-baskerville"
                        >
                            Personal Info
                        </button>

                        <button
                            onClick={() => navigate("/profile/address")}
                            className={`cursor-pointer text-xl pt-4 font-baskerville border-b
                        ${location.pathname.startsWith("/profile/address")
                                    ? "border-black"
                                    : "border-transparent"
                                }`}
                        >
                            Address
                        </button>
                    </div>
                )}

                <button
                    onClick={() => navigate("/profile/payments")}
                    className={`cursor-pointer text-xl pt-4 font-baskerville border-b
                        ${location.pathname.startsWith("/profile/payment")
                            ? "border-black"
                            : "border-transparent"
                        }`}
                >
                    Payment History
                </button>

                <button
                    onClick={() => navigate("/profile/orders")}
                    className={`cursor-pointer text-xl pt-4 font-baskerville border-b
                        ${location.pathname.startsWith("/profile/orders")
                            ? "border-black"
                            : "border-transparent"
                        }`}
                >
                    Order History
                </button>

                <button
                    onClick={() => navigate("/profile/redeems")}
                    className={`cursor-pointer text-xl pt-4 font-baskerville border-b
                        ${location.pathname.startsWith("/profile/redeem")
                            ? "border-black"
                            : "border-transparent"
                        }`}
                >
                    Redeem Code History
                </button>

                <button
                    onClick={() => navigate("/profile/points")}
                    className={`cursor-pointer text-xl pt-4 font-baskerville border-b
                        ${location.pathname.startsWith("/profile/points")
                            ? "border-black"
                            : "border-transparent"
                        }`}
                >
                    Point History
                </button>


                <div className="pt-4">
                    <button
                        onClick={handleLogout}
                        className="cursor-pointer border px-4 py-2 rounded font-bold font-baskerville"
                    >
                        Log Out
                    </button>
                </div>
            </div>


            {/* content */}
            <main className="flex-1 bg-gray-100 md:pl-35 pt-20 pl-50">

                <div className="text-2xl font-bold font-baskerville mb-10">
                    Hi, {capitalize(user?.username)}!
                </div>

                <Outlet />

            </main>
        </div >
    )
}