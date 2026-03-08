import { useState } from 'react'
import eye from '../../assets/eye.svg'
import { api } from '../../AxiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';




export default function SignupModal({ close }: { close: () => void }) {
    const { loginAndRedirect } = useAuth()
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")

    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, "")

        if (digits.length <= 3) return digits
        if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    }
    const [phone, setPhone] = useState("")

    const [errorUserName, setErrorUserName] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [errorEmail, setErrorEmail] = useState("")
    const [errorFirstname, setErrorFirstname] = useState("")
    const [errorLastname, setErrorLastname] = useState("")
    const [errorPhone, setErrorPhone] = useState("")

    const [showPassword, setShowPassword] = useState(false)



    const handleSubmit = async (e: any) => {
        e.preventDefault()

        const phonePattern = /^\d{3}-\d{3}-\d{4}$/

        if (!phonePattern.test(phone)) {
            setErrorPhone("Phone number must be xxx-xxx-xxxx")
            return
        }
        try {
            await api.post('/register', {
                username,
                password,
                email,
                first_name: firstname,
                last_name: lastname,
                phone_num: phone
            })

            // auto login
            await loginAndRedirect(username, password, navigate)

            close()
        } catch (err: any) {
            const message = err.response?.data?.message || ""

            if (message.includes("Username")) {
                setErrorUserName("Username already exists")
            }

            if (message.includes("Email")) {
                setErrorEmail("Email already exists")
            }
        }
    }
    return (
        // title
        < div >
            <div className="flex items-center flex-col ">
                <h2 className="text-xl font-semibold mb-2 font-baskerville">
                    Create your account
                </h2>
                <p className="text-center font-baskerville">
                    Join Trade to easily manage your dashboard, <br /> update coffee preferences, edit deliveries, and more!
                </p>
            </div>

            {/* form */}
            <div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">
                    <div className="flex flex-2 gap-2">
                        {/* username */}
                        <div className="w-full mb-1">
                            <div className={`relative flex items-center w-full h-12 px-4 bg-surface-white border rounded-lg transition-colors duration-200
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
                                <p className=" text-[12px] font-bold text-red-500 font-baskerville">{errorUserName}</p>
                            )}
                        </div>

                        {/* password */}
                        <div className="w-full mb-1">
                            <div className={`relative flex items-center w-full h-12 px-4 border rounded-lg transition-colors duration-200 
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
                                <p className=" text-[12px] font-bold text-red-500 font-baskerville">{errorPassword}</p>
                            )}
                        </div>
                    </div>

                    {/* email */}
                    <div className="w-full mb-1">
                        <div className={`relative flex items-center w-full h-12 px-4 bg-surface-white border rounded-lg transition-colors duration-200
                                         ${errorEmail ? "border-red-500" : "border-gray-200 focus-within:border-gray-600"}
                                        `}>
                            <input
                                type="email"
                                placeholder='Email'
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    if (errorEmail) setErrorEmail("")
                                }}
                                className="w-full bg-transparent placeholder-gray-400 text-[14px] focus:outline-none font-baskerville"
                                onBlur={() => {
                                    if (!email.trim()) {
                                        setErrorEmail("Please enter a valid email")
                                    }
                                }}
                            />

                        </div>
                        {errorEmail && (
                            <p className=" text-[12px] font-bold text-red-500 font-baskerville">{errorEmail}</p>
                        )}
                    </div>

                    <div className="flex flex-2 gap-2">

                        {/* fistname */}
                        <div className="w-full mb-1">
                            <div className={`relative flex items-center w-full h-12 px-4 bg-surface-white border rounded-lg transition-colors duration-200
                                         ${errorFirstname ? "border-red-500" : "border-gray-200 focus-within:border-gray-600"}
                                        `}>
                                <input
                                    type="text"
                                    placeholder='Firstname'
                                    value={firstname}
                                    onChange={(e) => {
                                        setFirstname(e.target.value)
                                        if (errorFirstname) setErrorFirstname("")
                                    }}
                                    className="w-full bg-transparent placeholder-gray-400 text-[14px] focus:outline-none font-baskerville"
                                    onBlur={() => {
                                        if (!firstname.trim()) {
                                            setErrorFirstname("Please enter your firstname")
                                        }
                                    }}
                                />

                            </div>
                            {errorFirstname && (
                                <p className=" text-[12px] font-bold text-red-500 font-baskerville">{errorFirstname}</p>
                            )}
                        </div>

                        {/* lastname */}
                        <div className="w-full mb-1">
                            <div className={`relative flex items-center w-full h-12 px-4 bg-surface-white border rounded-lg transition-colors duration-200
                                         ${errorLastname ? "border-red-500" : "border-gray-200 focus-within:border-gray-600"}
                                        `}>
                                <input
                                    type="text"
                                    placeholder='Lastname'
                                    value={lastname}
                                    onChange={(e) => {
                                        setLastname(e.target.value)
                                        if (errorLastname) setErrorLastname("")
                                    }}
                                    className="w-full bg-transparent placeholder-gray-400 text-[14px] focus:outline-none font-baskerville"
                                    onBlur={() => {
                                        if (!lastname.trim()) {
                                            setErrorLastname("Please enter your lastname")
                                        }
                                    }}
                                />

                            </div>
                            {errorLastname && (
                                <p className=" text-[12px] font-bold text-red-500 font-baskerville">{errorLastname}</p>
                            )}
                        </div>
                    </div>

                    {/* phoneNumber */}
                    <div className="w-full mb-1">
                        <div className={`relative flex items-center w-full h-12 px-4 bg-surface-white border rounded-lg transition-colors duration-200
                                         ${errorPhone ? "border-red-500" : "border-gray-200 focus-within:border-gray-600"}
                                        `}>
                            <input
                                type="text"
                                placeholder='123-456-7890'
                                value={phone}
                                onChange={(e) => {
                                    const formatted = formatPhone(e.target.value)
                                    setPhone(formatted)
                                    if (errorPhone) {
                                        setErrorPhone("")
                                    }
                                }}
                                className="w-full bg-transparent placeholder-gray-400 text-[14px] focus:outline-none font-baskerville"
                                onBlur={() => {
                                    if (!phone.trim()) {
                                        setErrorPhone("Please enter your phone number")
                                    }
                                }}
                            />

                        </div>
                        {errorPhone && (
                            <p className=" text-[12px] font-bold text-red-500 font-baskerville">{errorPhone}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            type="submit"
                            className="w-full h-13 px-6 bg-black  text-body-16 rounded-lg hover:bg-gray-500 transition-colors flex items-center justify-center text-white font-baskerville"
                        >Create Account</button>

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