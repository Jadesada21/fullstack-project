import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { api } from "../../AxiosInstance"
import { useAuth } from "../../context/AuthContext"
import BoxModal from "../login-signup/BoxModal"
import RedeemDetailModal from "../redeem/RedeemDetailModal"


interface Reward {
    id: number
    name: string
    description: string
    short_description: string
    points_required: number
    image_url: string
    category: string
}

interface redeemItem {
    reward_name: string
    points_required: number
    quantity: number
}

interface Redeem {
    id: number
    status: string
    created_at: string
    total_points_used: number
    items: redeemItem[]
}

export default function ShopDetailPage() {
    const { id } = useParams()

    const { user } = useAuth()

    const navigate = useNavigate()

    const [reward, setReward] = useState<Reward | null>(null)
    const [qty, setQty] = useState(1)

    const [open, setOpen] = useState(false)
    const [redeem, setRedeem] = useState<Redeem | null>(null)
    const [openLoginModal, setOpenLoginModal] = useState(false)

    const fetchReward = async () => {
        const res = await api.get(`/rewards/${id}`)
        setReward(res.data.data)
    }

    useEffect(() => {
        fetchReward()
    }, [id])


    const handleRedeem = async () => {
        try {

            if (!user) {
                setOpenLoginModal(true)
                return
            }

            const res = await api.post("/redeems", {
                items: [
                    {
                        reward_id: reward?.id,
                        quantity: qty
                    }
                ]
            })

            setRedeem({
                ...res.data.data,
                items: [
                    {
                        reward_name: reward?.name,
                        points_per_item: reward?.points_required,
                        quantity: qty,
                        total_points_used: qty * (reward?.points_required ?? 0)
                    }
                ]
            })

            setOpen(true)

        } catch (err) {
            console.log(err)
        }
    }

    const handleCancel = async () => {
        if (!redeem) return null

        try {

            await api.patch(`/redeems/${redeem.id}/cancel`)

            setRedeem({
                ...redeem,
                status: 'cancelled'
            })

            setOpen(false)
        } catch (err) {
            console.log(err)
        }
    }

    const handleRedeemNow = async () => {
        if (!redeem) return

        setOpen(false)

        // ** อย่าลืมเปลี่ยน path หลังสร้าง redeem reward his เสร็จ
        navigate(`/payments/${redeem.id}`)
    }


    if (!reward) return <div>Loading...</div>

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 font-baskerville">

            <div className="flex font-baskerville items-center pb-10">
                <Link to='/'>Home</Link>
                <img src="https://res.cloudinary.com/dbraczg5a/image/upload/v1773165802/right-arrow-svgrepo-com_mhdnwz.svg"
                    alt="right-vector"
                    className="pl-2 h-6 w-7" />
                <Link to='/shops'><p className="pl-2 ">All Reward</p></Link>
                <img src="https://res.cloudinary.com/dbraczg5a/image/upload/v1773165802/right-arrow-svgrepo-com_mhdnwz.svg"
                    alt="right-vector"
                    className="pl-2 h-6 w-7" />
                <p className="font-semibold">{reward.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-16">

                {/* Image */}
                <div className="bg-gray-100 rounded-2xl flex items-center justify-center p-10">
                    <img
                        src={reward.image_url}
                        className="w-120 object-contain rounded-2xl"
                    />
                </div>

                {/* Detail */}
                <div>

                    <p className="text-sm tracking-widest text-gray-500 uppercase">
                        {reward.category}
                    </p>

                    <h1 className="text-4xl font-serif mt-2">
                        {reward.name}
                    </h1>

                    <p className="text-2xl mt-4 font-medium">
                        {reward.points_required} pts
                    </p>

                    <p className="mt-6 leading-relaxed">
                        {reward.short_description}
                    </p>

                    {/* Roast */}
                    <div className="mt-6">
                        <p className="text-xl mb-2">
                            {reward.description}
                        </p>
                    </div>

                    {/* Quantity */}
                    <div className="mt-8">Quantity</div>

                    <div className="mt-3 flex items-center gap-4 border rounded-lg w-30">
                        <button
                            onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                            className="w-10 h-10 text-2xl pb-1"
                        >
                            -
                        </button>

                        <span className="text-lg">
                            {qty}
                        </span>

                        <button
                            onClick={() => setQty(qty + 1)}
                            disabled={qty >= 2}
                            className="w-10 h-10 text-2xl pb-1"
                        >
                            +
                        </button>
                    </div>



                    <button
                        onClick={handleRedeem}
                        className="mt-8 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800"
                    >
                        Redeem Now
                    </button>

                    {open && (
                        <RedeemDetailModal
                            redeem={redeem}
                            onClose={() => setOpen(false)}
                            onRedeem={handleRedeemNow}
                            onCancel={handleCancel}
                        />
                    )}
                </div>

                {openLoginModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl w-105">
                            <BoxModal close={() => setOpenLoginModal(false)} />
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}