import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import eye from '../../assets/eye.svg'


export default function LoginModal({ close }: { close: () => void }) {

    const { loginAndRedirect } = useAuth()
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        await loginAndRedirect(username, password, navigate)

        close()
    }

    return (
        <div className="fixed top-0 left-0 w-full h-screen bg-[rgba(37,37,37,0.5)] md:bg-[rgba(26,26,26,0.8)] z-102 overflow-y-auto opacity-0 invisible transition-all duration-100 pt-16 px-4 pb-4 md:pt-29.5 md:px-8 md:pb-8 xl:pt-20 js-account-modal is-active">
            <div className="w-full max-w-89.5 md:w-151.25 md:max-w-none mx-auto bg-white px-6 py-10 md:px-16 md:py-10 rounded-24 shadow-[0px_100px_80px_0px_rgba(0,0,0,0.07),0px_64.815px_46.852px_0px_rgba(0,0,0,0.05),0px_38.519px_25.481px_0px_rgba(0,0,0,0.04),0px_20px_13px_0px_rgba(0,0,0,0.04),0px_8.148px_6.519px_0px_rgba(0,0,0,0.03),0px_1.852px_3.148px_0px_rgba(0,0,0,0.02)]">
                <div className="mx-auto">

                    {/* tab */}
                    <div className="flex items-start justify-between px-4 mb-10">
                        <div className="flex-1 flex flex-col gap-2.5 items-center cursor-pointer">
                            <button
                                type="button"
                                className="text-body-14 font-bold text-charcoal-600 w-full text-center">
                                Login
                            </button>
                            <div className="w-full h-0 relative">
                                <div className="absolute -top-0.5 left-0 right-0 h-0.5 bg-trade-red"></div>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-2.5 items-center cursor-pointer">
                            <button className="text-body-14 text-charcoal-400 w-full text-center js-signup-tab-text">
                                Sign up
                            </button>
                            <div className="w-full h-0 relative">
                                <div className="absolute -top-0.5 left-0 right-0 h-0.5 bg-charcoal-200 js-signup-tab-indicator"></div>
                            </div>
                        </div>
                    </div>

                    {/* title */}
                    <div>
                        <div className="flex items-center flex-col">
                            <h2 className="text-xl font-semibold mb-2">
                                Log in to you Account
                            </h2>
                            <p>
                                Enter your account details to access your dashboard
                            </p>
                            <p>
                                and coffee preferences.
                            </p>
                        </div>

                        {/* form */}
                        <div>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
                                <div className="w-full mb-4">
                                    <div className="relative flex items-center w-full h-14 px-4 bg-surface-white border border-charcoal-200 focus-within:border-charcoal-600 rounded-lg transition-colors duration-200 ">
                                        <input
                                            type="text"
                                            placeholder='username'
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="flex-1 w-full h-full pt-0 pb-0 border-0 bg-transparent text-body-16 text-charcoal-600 outline-none focus:outline-none focus-visible:outline-none transition-[padding] duration-200 placeholder:text-transparent focus:pt-4 peer"
                                        />
                                        <p className="mt-2 text-body-12 font-bold text-trade-red"></p>
                                    </div>
                                </div>

                                <div className="w-full mb-4">
                                    <div className="relative flex items-center w-full h-14 px-4 bg-surface-white border border-charcoal-200 focus-within:border-charcoal-600 rounded-lg transition-colors duration-200 ">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder='password'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="flex-1 w-full h-full pt-0 pb-0 border-0 bg-transparent text-body-16 text-charcoal-600 outline-none focus:outline-none focus-visible:outline-none transition-[padding] duration-200 placeholder:text-transparent focus:pt-4 peer js-form-input "
                                        />
                                        <button
                                            type='button'
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="shrink-0 w-4 h-4 ml-4 p-0 border-0 bg-transparent cursor-pointer hover:opacity-70 transition-opacity"
                                        >
                                            <img src={eye} alt="eye" className="w-5 h-5" />
                                        </button>
                                        <p className="mt-2 text-body-12 font-bold text-trade-red"></p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <button
                                        type="submit"
                                        className="w-full h-13 px-6 bg-charcoal-600 text-white text-body-16 rounded-lg hover:bg-charcoal-500 transition-colors flex items-center justify-center"
                                    >Login</button>

                                    <button
                                        type='button'
                                        onClick={close}
                                        className="w-full h-13 px-6 border border-[rgba(37,37,37,0.25)] text-charcoal-600 text-body-16 rounded-lg hover:bg-charcoal-50 transition-colors flex items-center justify-center"
                                    > Close
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}