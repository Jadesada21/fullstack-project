import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import eye from '../../assets/eye.svg'


export default function LoginModal({ close }: { close: () => void }) {

    const { loginAndRedirect } = useAuth()
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errorUserName, setErrorUserName] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)


    const [isSelected, setIsSelected] = useState('login')

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        await loginAndRedirect(username, password, navigate)

        close()
    }

    return (
        <div className="fixed top-0 left-0 w-full h-screen bg-[rgba(37,37,37,0.5)] md:bg-[rgba(26,26,26,0.8)] z-50 overflow-y-auto opacity-0transition-all duration-100 pt-16 px-4 pb-4 md:pt-29.5 md:px-8 md:pb-8 xl:pt-20">
            <div className="w-full max-w-89.5 md:w-151.25 md:max-w-none mx-auto bg-white px-6 py-10 md:px-16 md:py-10 rounded-3xl shadow-[0px_100px_80px_0px_rgba(0,0,0,0.07),0px_64.815px_46.852px_0px_rgba(0,0,0,0.05),0px_38.519px_25.481px_0px_rgba(0,0,0,0.04),0px_20px_13px_0px_rgba(0,0,0,0.04),0px_8.148px_6.519px_0px_rgba(0,0,0,0.03),0px_1.852px_3.148px_0px_rgba(0,0,0,0.02)]">
                <div className="mx-auto">

                    {/* tab */}
                    <div className="flex items-start justify-between px-4 mb-10">

                        {/* login */}
                        <div
                            onClick={() => setIsSelected("login")}
                            className="flex-1 flex flex-col gap-2.5 items-center cursor-pointer">
                            <button
                                type="button"
                                className={`text-body-14 text-gray-400 w-full text-center font-baskerville
                                    ${isSelected === "login" ? "text-gray-600" : "text-gray-400"}`}
                            >Login
                            </button>
                            <div className="w-full h-1 relative">
                                <div className={`absolute top-0.5 left-0 right-0 h-0.5 
                                ${isSelected === "login" ? "bg-red-500" : "bg-gray-200"}`}
                                ></div>
                            </div>
                        </div>

                        {/* sign up */}
                        <div
                            onClick={() => setIsSelected("signup")}
                            className="flex-1 flex flex-col gap-2.5 items-center cursor-pointer">
                            <button
                                type="button"
                                className={`text-body-14 text-gray-400 w-full text-center font-baskerville
                                ${isSelected === "signup" ? "text-gray-600" : "text-gray-400"}`}
                            >Sign up
                            </button>
                            <div className="w-full h-1 relative">
                                <div className={`absolute top-0.5 left-0 right-0 h-0.5
                                ${isSelected === "signup" ? "bg-red-500" : "bg-gray-200"}
                                `}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* title */}
                    <div>
                        <div className="flex items-center flex-col">
                            <h2 className="text-xl font-semibold mb-2 font-baskerville">
                                Log in to you Account
                            </h2>
                            <p className="text-center font-baskerville">
                                Enter your account details to access your dashboard <br /> and coffee preferences.
                            </p>
                        </div>

                        {/* form */}
                        <div>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
                                <div className="w-full mb-4">
                                    <div className={`relative flex items-center w-full h-14 px-4 bg-surface-white border rounded-lg transition-colors duration-200
                                         ${errorUserName ? "border-red-500" : "border-gray-200 focus-within:border-gray-600"}
                                        `}>
                                        <input
                                            type="text"
                                            placeholder='username'
                                            value={username}
                                            onChange={(e) => {
                                                setUsername(e.target.value)
                                                if (errorUserName) setErrorUserName("")
                                            }}
                                            className="w-full bg-transparent placeholder-gray-400 text-[14px] focus:outline-none font-baskerville"
                                            onBlur={() => {
                                                if (!username.trim()) {
                                                    setErrorUserName("Please enter your username")
                                                }
                                            }}
                                        />

                                    </div>
                                    {errorUserName && (
                                        <p className="mt-2 text-[12px] font-bold text-red-500 font-baskerville">{errorUserName}</p>
                                    )}
                                </div>

                                <div className="w-full mb-4">
                                    <div className={`relative flex items-center w-full h-14 px-4 border rounded-lg transition-colors duration-200 
                                        ${errorPassword ? "border-red-500" : "border-gray-200 focus-within:border-gray-600"}
                                        `}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder='password'
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value)
                                                if (errorPassword) setErrorPassword("")
                                            }}
                                            className="w-full bg-transparent placeholder-gray-400 text-[14px] focus:outline-none font-baskerville"
                                            onBlur={() => {
                                                if (!username.trim()) {
                                                    setErrorPassword("Please enter a valid password")
                                                }
                                            }}
                                        />
                                        <button
                                            type='button'
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="shrink-0 w-4 h-4 ml-4 p-0 border-0 bg-transparent cursor-pointer hover:opacity-70 transition-opacity"
                                        >
                                            <img src={eye} alt="eye" className="w-5 h-5" />
                                        </button>

                                    </div>
                                    {errorPassword && (
                                        <p className="mt-2 text-[12px] font-bold text-red-500 font-baskerville">{errorPassword}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-4">
                                    <button
                                        type="submit"
                                        className="w-full h-13 px-6 bg-black  text-body-16 rounded-lg hover:bg-gray-500 transition-colors flex items-center justify-center text-white font-baskerville"
                                    >Login</button>

                                    <button
                                        type='button'
                                        onClick={close}
                                        className="w-full h-13 px-6 border border-[rgba(37,37,37,0.25)] text-gray-600 text-body-16 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center font-baskerville"
                                    > Close
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}