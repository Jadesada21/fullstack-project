import { useEffect, useState } from 'react'
import { api } from '../../AxiosInstance'

export default function ProfileForm() {

    const [isEditing, setIsEditing] = useState(false)


    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        phone: "",
        point: "",
        email: ""

    })

    const [loading, setLoading] = useState(true)

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/me')

            const user = res.data.user

            setForm({
                firstname: user.first_name ?? "",
                lastname: user.last_name ?? "",
                phone: user.phone_num ?? "",
                point: user.points ?? "",
                email: user.email ?? ""

            })
        } catch (err) {
            console.log("Fetch Profile error", err);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])




    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        if (name === 'phone') {

            const numbers = value.replace(/\D/g, "").slice(0, 10)
            const match = numbers.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/)

            const formatted = match
                ? [match[1], match[2], match[3]].filter(Boolean).join("-")
                : value

            setForm({
                ...form,
                phone: formatted
            })
            return
        }

        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async () => {
        try {
            await api.patch('/users/update', {
                first_name: form.firstname,
                last_name: form.lastname,
                phone_num: form.phone
            })

            await fetchProfile()
            setIsEditing(false)

        } catch (err) {
            console.error("Update profile failed", err)
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-3xl mb-10">


            {/* header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold font-baskerville"
                >Personal Information ,
                    <span className="text-red-500 "> Point : {form.point}

                    </span>
                </h2>

                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="border px-4 py-2 rounded font-baskerville"
                    >
                        Edit
                    </button>
                )}
            </div>

            {/* fields */}
            <div className="space-y-6">

                <div>
                    <label className="block mb-2 font-baskerville">First name</label>
                    <input
                        type='text'
                        name="firstname"
                        value={form.firstname}
                        onChange={handleChange}
                        maxLength={30}
                        disabled={!isEditing}
                        className="w-full rounded border border-gray-300 h-10 pl-2 font-baskerville"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-baskerville">Last name</label>
                    <input
                        type='text'
                        name="lastname"
                        value={form.lastname}
                        onChange={handleChange}
                        maxLength={30}
                        disabled={!isEditing}
                        className="w-full rounded border border-gray-300 h-10 pl-2 font-baskerville"
                    />
                </div>

                <div>
                    <h1 className="block mb-2 font-baskerville">Email</h1>
                    <p className="flex items-center w-full rounded 
                    border border-gray-300 h-10 pl-2 font-baskerville bg-gray-300">
                        {form.email}
                    </p>
                </div>

                <div>
                    <label className="block mb-2 font-baskerville">Phone number</label>
                    <input
                        type='text'
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder='xxx-xxx-xxxx'
                        disabled={!isEditing}
                        className="w-full rounded border border-gray-300 h-10 pl-2 font-baskerville"
                    />
                </div>

            </div>

            {/* buttons */}
            {isEditing && (
                <div className="flex gap-4 mt-8">

                    <button
                        onClick={handleSubmit}
                        className="bg-black text-white px-6 py-2 rounded font-baskerville"
                    >
                        Save
                    </button>

                    <button
                        onClick={() => setIsEditing(false)}
                        className="border px-6 py-2 rounded font-baskerville"
                    >
                        Cancel
                    </button>
                </div>
            )}

        </div>
    )
}