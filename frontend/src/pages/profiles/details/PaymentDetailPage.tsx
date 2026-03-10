import { useEffect, useState } from 'react'
import { api } from '../../../AxiosInstance'
import { useNavigate, useParams } from 'react-router-dom'

interface PaymentDetail {
    id: number
    order_id: number
    amount: number
    transaction_ref: string
    created_at: string
    payment_provider: string
    paid_at: string
    status: string
    user_id: number
}

export default function PaymentDetails() {

    const { id } = useParams()

    const navigate = useNavigate()

    const [payment, setPayment] = useState<PaymentDetail | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchPaymentDetail = async () => {
        try {
            const res = await api.get(`payments/${id}`)
            setPayment(res.data.data)
        } catch (err) {
            console.error('Error fetching payment detail:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchPaymentDetail()
        }
    }, [id])

    const formatDate = (date?: string) => {
        if (!date) return "-"
        return new Date(date).toLocaleDateString("en-GB")
    }

    const formatPrice = (price?: number) => {
        if (!price) return "0"
        return price.toLocaleString()
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "completed":
                return "text-green-600"
            case "cancelled":
                return "text-red-600"
            case "pending":
                return "text-yellow-600"
            default:
                return "text-gray-600"
        }
    }

    if (loading) {
        return <div>loading...</div>
    }

    if (!payment) return <div>Payment not found</div>



    return (
        <div>
            <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-3xl mb-10 h-full">
                <h2 className="text-xl font-semibold mb-4 font-baskerville">
                    Payment #{payment.id}
                </h2>

                <p className={`mb-2 font-baskerville ${getStatusStyle(payment.status)}`}>
                    {payment.status}
                </p>

                <p className="text-gray-500 mb-6 font-baskerville">
                    {formatDate(payment.created_at)}
                </p>

                <div className="space-y-4">
                    <div className="flex justify-between border-b pb-3 font-baskerville">
                        <p>Provider</p>
                        <p>{payment.payment_provider}</p>
                    </div>

                    <div className="flex justify-between border-b pb-3 font-baskerville">
                        <p>Transaction</p>
                        <p>{payment.transaction_ref}</p>
                    </div>

                    <div className="flex justify-between border-b pb-3 font-baskerville">
                        <p>Amount</p>
                        <p>฿ {formatPrice(payment.amount)}</p>
                    </div>

                    <div className="flex justify-between border-b pb-3 font-baskerville">
                        <p>Paid At</p>
                        <p>{formatDate(payment.paid_at)}</p>
                    </div>

                    <div className="flex justify-between font-baskerville">
                        <p>Order</p>
                        <button
                            onClick={() => navigate(`/profile/orders/${payment.order_id}`)}
                            className="text-blue-600 hover:underline font-baskerville"
                        >
                            #{payment.order_id}
                        </button>
                    </div>
                </div>

                <div className="flex justify-between mt-6 font-semibold text-lg font-baskerville">

                    <p>Total</p>

                    <p>฿ {formatPrice(payment.amount)}</p>
                </div>

            </div>
        </div>
    )
}