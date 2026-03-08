import { useState } from "react";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignupModal"

export default function BoxModal({ close }: { close: () => void }) {
    const [selectedModal, setSelectedModal] = useState<'login' | 'signup'>('login')

    return (
        <div className="fixed inset-0 bg-[rgba(37,37,37,0.5)] md:bg-[rgba(26,26,26,0.8)] 
        z-50 flex items-center justify-center px-4"
            onClick={close}
        >
            <div className="w-full max-w-89.5 md:w-151.25 md:max-w-none mx-auto bg-white px-6 
            py-10 md:px-16 md:py-10 rounded-3xl shadow-[0px_100px_80px_0px_rgba(0,0,0,0.07),
            0px_64.815px_46.852px_0px_rgba(0,0,0,0.05),0px_38.519px_25.481px_0px_rgba(0,0,0,0.04),
            0px_20px_13px_0px_rgba(0,0,0,0.04),0px_8.148px_6.519px_0px_rgba(0,0,0,0.03),
            0px_1.852px_3.148px_0px_rgba(0,0,0,0.02)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mx-auto">

                    {/* tab */}
                    <div className="flex items-start justify-between px-4 mb-10">

                        {/* login */}
                        <div
                            onClick={() => setSelectedModal("login")}
                            className="flex-1 flex flex-col gap-2.5 items-center cursor-pointer">
                            <button
                                type="button"
                                className={`text-body-14 text-gray-400 w-full text-center font-baskerville
                                    ${selectedModal === "login" ? "text-gray-600" : "text-gray-400"}`}
                            >Login
                            </button>
                            <div className="w-full h-1 relative">
                                <div className={`absolute top-0.5 left-0 right-0 h-0.5 
                                ${selectedModal === "login" ? "bg-red-500" : "bg-gray-200"}`}
                                ></div>
                            </div>
                        </div>

                        {/* sign up */}
                        <div
                            onClick={() => setSelectedModal("signup")}
                            className="flex-1 flex flex-col gap-2.5 items-center cursor-pointer">
                            <button
                                type="button"
                                className={`text-body-14 text-gray-400 w-full text-center font-baskerville
                                ${selectedModal === "signup" ? "text-gray-600" : "text-gray-400"}`}
                            >Sign up
                            </button>
                            <div className="w-full h-1 relative">
                                <div className={`absolute top-0.5 left-0 right-0 h-0.5
                                ${selectedModal === "signup" ? "bg-red-500" : "bg-gray-200"}
                                `}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* content */}
                    {selectedModal === "login" && <LoginModal close={close} />}
                    {selectedModal === "signup" && <SignUpModal close={close} />}
                </div>
            </div>
        </div>
    )
}