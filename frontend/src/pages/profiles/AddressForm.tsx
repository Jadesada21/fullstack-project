import { useEffect, useState } from 'react'
import { api } from '../../AxiosInstance'

interface Address {
    id: number
    user_id: number
    address_line: string
    province: string
    postal_code: string
    country: string
    district: string
    subdistrict: string
    is_default: boolean
    created_at: string
    updated_at: string
}

export default function AddressForm() {

    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [showOtherHeader, setShowOtherHeader] = useState(true)

    const [defaultAddress, setDefaultAddress] = useState<Address | null>(null)
    const [otherAddresses, setOtherAddresses] = useState<Address[]>([])

    const [form, setForm] = useState({
        address_line: "",
        province: "",
        postal_code: "",
        country: "",
        district: "",
        subdistrict: ""

    })

    const [loading, setLoading] = useState(true)

    const fetchAddress = async () => {
        try {
            const res = await api.get('/addresses/me')
            const data: Address[] = res.data.data

            const defaultAddr = data.find(a => a.is_default) || null

            const others = data.filter(a => !a.is_default)


            setDefaultAddress(defaultAddr)
            setOtherAddresses(others)

            if (defaultAddr) {
                setForm({
                    address_line: defaultAddr.address_line ?? "",
                    province: defaultAddr.province ?? "",
                    postal_code: defaultAddr.postal_code ?? "",
                    country: defaultAddr.country ?? "",
                    district: defaultAddr.district ?? "",
                    subdistrict: defaultAddr.subdistrict ?? ""

                })
            }

        } catch (err) {
            console.log("Fetch address error", err);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAddress()
    }, [])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async () => {
        try {
            if (!editingId) {
                console.error("editingId is null")
                return
            }

            let payload

            if (editingId === defaultAddress?.id) {
                payload = form
            } else {

                const addr = otherAddresses.find(a => a.id === editingId)

                if (!addr) {
                    console.error("Address not found")
                    return
                }

                payload = {
                    address_line: addr.address_line,
                    province: addr.province,
                    postal_code: addr.postal_code,
                    country: addr.country,
                    district: addr.district,
                    subdistrict: addr.subdistrict
                }
            }

            await api.patch(`/addresses/update/${editingId}`, payload)

            await fetchAddress()

            setIsEditing(false)
            setEditingId(null)
            setShowOtherHeader(true)

        } catch (err) {
            console.error("Update profile failed", err)
        }
    }

    const handleAddressChange = (
        id: number,
        field: keyof Address,
        value: string
    ) => {
        setOtherAddresses(prev =>
            prev.map(addr =>
                addr.id === id
                    ? { ...addr, [field]: value }
                    : addr
            )
        )
    }

    if (loading) {
        return <div>Loading...</div>
    }



    return (
        <div>
            <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-3xl mb-10">
                {/* header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold font-baskerville"
                    >Personal Addresses
                    </h2>

                    {!isEditing && (
                        <button
                            onClick={() => {
                                setEditingId(defaultAddress?.id || null)
                                setIsEditing(true)
                            }}
                            className="border px-4 py-2 rounded font-baskerville"
                        >
                            Edit
                        </button>
                    )}
                </div>

                {/* fields */}
                <div className="space-y-4">

                    <div>
                        <label className="block mb-2 font-baskerville">address</label>
                        <input
                            type='text'
                            name="address_line"
                            value={form.address_line}
                            onChange={handleChange}
                            placeholder='address'
                            maxLength={60}
                            disabled={!isEditing}
                            className="w-full rounded border border-gray-300 h-10 pl-2 font-baskerville"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-baskerville">subdistrict</label>
                            <input
                                type='text'
                                name="subdistrict"
                                value={form.subdistrict}
                                onChange={handleChange}
                                placeholder='subdistrict'
                                maxLength={30}
                                disabled={!isEditing}
                                className="w-full rounded border border-gray-300 h-10 pl-2 font-baskerville"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-baskerville">district</label>
                            <input
                                type='text'
                                name="district"
                                value={form.district}
                                onChange={handleChange}
                                placeholder='district'
                                maxLength={20}
                                disabled={!isEditing}
                                className="w-full rounded border border-gray-300 h-10 pl-2 font-baskerville"
                            />
                        </div>
                    </div>



                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-baskerville">province</label>
                            <input
                                type='text'
                                name="province"
                                value={form.province}
                                onChange={handleChange}
                                placeholder='province'
                                maxLength={20}
                                disabled={!isEditing}
                                className="w-full rounded border border-gray-300 h-10 pl-2 font-baskerville"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-baskerville">postal_code</label>
                            <input
                                type='text'
                                name="postal_code"
                                value={form.postal_code}
                                onChange={handleChange}
                                placeholder='postalcode'
                                maxLength={5}
                                disabled={!isEditing}
                                className="w-full rounded border border-gray-300 h-10 pl-2 font-baskerville"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 font-baskerville">country</label>
                        <input
                            type='text'
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            placeholder='country'
                            maxLength={30}
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


            {/* other address */}
            {otherAddresses.length > 0 && (
                <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-3xl mb-10">

                    {otherAddresses.map(addr => {
                        const isAddressEditing = editingId === addr.id

                        return (

                            <div key={addr.id} className="space-y-4">
                                {/* header */}
                                {showOtherHeader && (
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-2xl font-bold font-baskerville">Other Address</h3>

                                        <button
                                            onClick={() => {
                                                setShowOtherHeader(false)
                                                setEditingId(addr.id)
                                            }}
                                            className="border px-4 py-2 rounded"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                )}

                                {/* address line */}
                                <div>
                                    <label className="block mb-2 font-baskerville">address</label>
                                    {isAddressEditing ? (
                                        <input
                                            type="text"
                                            value={addr.address_line}
                                            onChange={(e) =>
                                                handleAddressChange(addr.id, 'address_line', e.target.value)
                                            }
                                            placeholder='Address'
                                            maxLength={100}
                                            className="w-full rounded border border-gray-300 h-10 pl-2 font-baskerville"
                                        />
                                    ) :
                                        (
                                            <p>{addr.address_line}</p>
                                        )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2 font-baskerville">subdistrict</label>
                                        {isAddressEditing ? (
                                            <input
                                                type='text'
                                                value={addr.subdistrict}
                                                onChange={(e) =>
                                                    handleAddressChange(addr.id, 'subdistrict', e.target.value)
                                                }
                                                placeholder='subdistrict'
                                                maxLength={30}
                                                className="w-full rounded border border-gray-300 h-10 pl-2 font-baskerville"
                                            />
                                        ) : (
                                            <p>{addr.subdistrict}</p>
                                        )}

                                    </div>

                                    <div>
                                        <label className="block mb-2 font-baskerville">district</label>
                                        {isAddressEditing ? (
                                            <input
                                                type='text'
                                                value={addr.district}
                                                onChange={(e) =>
                                                    handleAddressChange(addr.id, 'district', e.target.value)
                                                }
                                                placeholder='district'
                                                maxLength={20}
                                                className="w-full rounded border border-gray-300 h-10 pl-2 font-baskerville"
                                            />
                                        ) : (
                                            <p>{addr.district}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2 font-baskerville">province</label>
                                        {isAddressEditing ? (
                                            <input
                                                type='text'
                                                value={addr.province}
                                                onChange={(e) =>
                                                    handleAddressChange(addr.id, 'province', e.target.value)
                                                }
                                                placeholder='province'
                                                maxLength={20}
                                                className="w-full rounded border border-gray-300 h-10 pl-2 font-baskerville"
                                            />
                                        ) : (
                                            <p>{addr.province}</p>
                                        )}

                                    </div>

                                    <div>
                                        <label className="block mb-2 font-baskerville">postal_code</label>
                                        {isAddressEditing ? (
                                            <input
                                                type='text'
                                                value={addr.postal_code}
                                                onChange={(e) =>
                                                    handleAddressChange(addr.id, 'postal_code', e.target.value)
                                                }
                                                placeholder='postalcode'
                                                maxLength={5}
                                                className="w-full rounded border border-gray-300 h-10 pl-2 font-baskerville"
                                            />
                                        ) : (
                                            <p>{addr.postal_code}</p>
                                        )}

                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-2 font-baskerville">country</label>
                                    {isAddressEditing ? (
                                        <input
                                            type='text'
                                            value={addr.country}
                                            onChange={(e) =>
                                                handleAddressChange(addr.id, 'country', e.target.value)
                                            }
                                            placeholder='country'
                                            maxLength={30}
                                            className="w-full rounded border border-gray-300 h-10 pl-2 font-baskerville"
                                        />
                                    ) : (
                                        <p>{addr.country}</p>
                                    )}
                                </div>

                                {editingId === addr.id && (
                                    <div className="flex gap-4 mt-8">

                                        <button
                                            onClick={() => {
                                                handleSubmit()
                                                setEditingId(null)
                                                setShowOtherHeader(true)
                                            }}
                                            className="bg-black text-white px-6 py-2 rounded font-baskerville"
                                        >
                                            Save
                                        </button>

                                        <button
                                            onClick={() => {
                                                setEditingId(null)
                                                setShowOtherHeader(true)
                                            }}
                                            className="border px-6 py-2 rounded font-baskerville"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )
            }
        </div >
    )
}