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

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        try {
            await loginAndRedirect(username, password, navigate)
            close()
        } catch (err) {
            setErrorPassword("Invalid username or password")
        }
    }



    return (
        // title
        < div >
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
                                placeholder='Username'
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
                                placeholder='Password'
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    if (errorPassword) setErrorPassword("")
                                }}
                                className="w-full bg-transparent placeholder-gray-400 text-[14px] focus:outline-none font-baskerville"
                                onBlur={() => {
                                    if (!password.trim()) {
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
        </div >
    )
}