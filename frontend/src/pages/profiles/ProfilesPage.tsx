import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useState } from "react"

import ProfileForm from "./ProfileForm"
import AddressForm from "./AddressForm"


export default function ProfilesPage() {

    const [selectedMenu, setSelectedMenu] = useState("profile")

    const [openProfilesMenu, setOpenProfilesMenu] = useState(false)

    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleLogout = async () => {
        await logout(navigate)
    }

    const menus = [
        { id: "payment", label: "Payment History" },
        { id: "order", label: "Order History" },
        { id: "redeem", label: "Redeem Code History" },
        { id: "point", label: "Point History" },
    ]

    const capitalize = (text?: string) => {
        if (!text) return ""
        return text.charAt(0).toUpperCase() + text.slice(1)
    }

    return (
        <div className="flex h-full ">

            {/* sidebar */}

            <div className="w-75 bg-white/60 flex flex-col border-r border-gray-200 pt-20 items-center space-y-4">

                <button
                    onClick={() => setOpenProfilesMenu(!openProfilesMenu)}
                    className="text-xl border-b border-transparent hover:border-black font-baskerville"
                >Profiles
                </button>

                {openProfilesMenu && (
                    <div className="flex flex-col items-center space-y-2 text-lg">
                        <button
                            onClick={() => setSelectedMenu("profile")}
                            className={`border-b ${selectedMenu === "profile" ? "border-black" : "border-transparent font-baskerville"
                                }`}
                        >
                            Personal Info
                        </button>

                        <button
                            onClick={() => setSelectedMenu("address")}
                            className={`border-b ${selectedMenu === "address" ? "border-black" : "border-transparent font-baskerville"
                                }`}
                        >
                            Address
                        </button>
                    </div>
                )}
                {menus.map((menu) => (
                    <button
                        key={menu.id}
                        onClick={() => setSelectedMenu(menu.id)}
                        className={` text-xl border-b pt-4 font-baskerville
                                ${selectedMenu === menu.id
                                ? "border-black"
                                : "border-transparent"
                            }`}
                    >
                        {menu.label}
                    </button>
                ))}

                <div className="pt-4">
                    <button
                        onClick={handleLogout}
                        className="border px-4 py-2 rounded font-bold font-baskerville"
                    >
                        Log Out
                    </button>
                </div>
            </div>


            {/* content */}
            <main className="flex-1 bg-gray-100 pl-30 pt-20">

                {selectedMenu === 'profile' && (
                    <div>
                        <div className="text-2xl font-bold font-baskerville">
                            Hi, {capitalize(user?.username)}!
                        </div>
                        <div className="mt-20 rounded">
                            <ProfileForm />
                        </div>
                    </div>
                )}


                {selectedMenu === 'address' && (
                    <div>
                        <div className="text-2xl font-bold font-baskerville">
                            Hi, {capitalize(user?.username)}!
                        </div>
                        <div className="mt-20 rounded">
                            <AddressForm />
                        </div>
                    </div>
                )}

                {selectedMenu === 'order' && (
                    <div className="text-2xl font-bold font-baskerville">
                        Hello order history
                    </div>
                )}

                {selectedMenu === 'payment' && (
                    <div className="text-2xl font-bold font-baskerville">
                        Hello payment history
                    </div>
                )}

                {selectedMenu === 'redeem' && (
                    <div className="text-2xl font-bold font-baskerville">
                        Hello redeem history
                    </div>
                )}

                {selectedMenu === 'point' && (
                    <div className="text-2xl font-bold font-baskerville">
                        Hello point history
                    </div>
                )}

            </main>
        </div >
    )
}