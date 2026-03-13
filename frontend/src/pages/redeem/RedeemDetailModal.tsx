import { useNavigate } from "react-router-dom"
import { api } from "../../AxiosInstance"


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

interface Props {
    redeem: Redeem | null
    onClose: () => void
    onRedeem?: () => void
    onCancel?: () => void
}

export default function RedeemDetailModal({
    redeem,
    onClose,
    onRedeem,
    onCancel
}: Props) {

    const navigate = useNavigate()
    if (!redeem) return null

    const subtotal = redeem.items?.reduce(
        (sum, item) => sum + item.points_required * item.quantity, 0
    ) ?? 0

    const handleCancel = async () => {
        try {

            await api.patch(`/redeems/${redeem.id}/status`, {
                status: 'cancelled'
            }

            )

            // ** อย่าลืมเปลี่ยน path หลังสร้าง redeem reward his เสร็จ
            navigate('/profile/orders')
        } catch (err) {
            console.error(err)
        }
    }


    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-125 max-h-[80vh] overflow-y-auto rounded-xl p-6 shadow-lg">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        Redeem #{redeem.id}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black"
                    >
                        ✕
                    </button>
                </div>

                {/* Status */}
                <div className="mb-4 text-sm text-gray-600">
                    <p>Status: <span className="font-medium">{redeem.status}</span></p>
                    <p>Date: {new Date(redeem.created_at).toLocaleString()}</p>
                </div>

                {/* Items */}
                <div className="border-t border-b py-4 mb-4">
                    <h3 className="font-semibold mb-3">Items</h3>

                    {redeem.items?.map((item, index) => (
                        <div
                            key={index}
                            className="flex justify-between text-sm mb-2"
                        >
                            <div>
                                <p>{item.reward_name}</p>
                                <p className="text-gray-500">
                                    {item.quantity} × {item.points_required}
                                </p>
                            </div>

                            <p className="font-medium">
                                {item.points_required * item.quantity}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Subtotal</span>
                        <span>{subtotal} ฿</span>
                    </div>

                    <div className="flex justify-between font-semibold mt-2">
                        <span>Total</span>
                        <span>{redeem.total_points_used} ฿</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">

                    <div className="gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                    {redeem.status === "pending" && (
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Cancel Order
                            </button>

                            <button
                                onClick={() => navigate(`/redeems/${redeem.id}`)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Redeem Now
                            </button>
                        </div>
                    )}

                </div>

            </div >
        </div >
    )
}