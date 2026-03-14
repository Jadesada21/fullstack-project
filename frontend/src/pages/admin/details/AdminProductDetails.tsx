import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../../../AxiosInstance"


interface OrderItem {
    product_id: number
    name: string
    quantity: string
    price_per_items: number
    total_points: number
}

interface OrderUser {
    id: number
    first_name: string
    last_name: string
    email: string
}

interface OrderDetail {
    order_id: number
    order_number: number
    status: string
    total_price: number
    earned_points: number
    created_at: string
    user: OrderUser
    items: OrderItem[]
}


export default function AdminOrderDetails() {

    const { id } = useParams()

    const navigate = useNavigate()

    const [order, setOrder] = useState<OrderDetail | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchOrderDetail = async () => {
        try {
            const { data } = await api.get(`/admin/orders/detail/${id}`)
            setOrder(data.data)
        } catch (err) {
            console.error('Error fetching order detail:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchOrderDetail()
        }
    }, [id])

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-GB')
    }

    const formatPrice = (price: number) => {
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

    if (!order) return <div>Order not found</div>


    if (loading) {
        return <div>loading...</div>
    }




    return (
        <div></div>
    )
}