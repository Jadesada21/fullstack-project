import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { api } from "../../AxiosInstance"
import { useCart } from "../../context/CartContext"
import OrderDetailModal from "../order/OrderDetailModal"
import { useAuth } from "../../context/AuthContext"
import BoxModal from "../login-signup/BoxModal"


interface Product {
    id: number
    name: string
    description: string
    price: number
    reward_points: number
    image_url: string
    roast_level: string
    category: string
    taste: string
    bag_size: string
}

interface OrderItem {
    product_name: string
    price: number
    quantity: number
}

interface Order {
    id: number
    status: string
    created_at: string
    total_amount: number
    items: OrderItem[]
}

export default function ShopDetailPage() {
    const { id } = useParams()

    const { user } = useAuth()
    const { addToCart } = useCart()

    const navigate = useNavigate()

    const [product, setProduct] = useState<Product | null>(null)
    const [qty, setQty] = useState(1)

    const [open, setOpen] = useState(false)
    const [order, setOrder] = useState<Order | null>(null)
    const [openLoginModal, setOpenLoginModal] = useState(false)

    const fetchProduct = async () => {
        const res = await api.get(`/products/${id}`)
        setProduct(res.data.data)
    }

    useEffect(() => {
        fetchProduct()
    }, [id])


    const handleAddToCart = () => {

        if (!user) {
            setOpenLoginModal(true)
            return
        }

        if (!product) return

        addToCart(product.id, qty)
    }


    const handleBuyNow = async () => {
        try {

            if (!user) {
                setOpenLoginModal(true)
                return
            }

            const res = await api.post("/orders", {
                items: [
                    {
                        product_id: product?.id,
                        quantity: qty
                    }
                ]
            })

            setOrder({
                ...res.data.data,
                items: [
                    {
                        product_name: product?.name,
                        price: product?.price,
                        quantity: qty
                    }
                ]
            })

            setOpen(true)

        } catch (err) {
            console.log(err)
        }
    }

    const handleCancel = async () => {
        if (!order) return null

        try {

            await api.patch(`/orders/${order.id}/cancel`)

            setOrder({
                ...order,
                status: 'cancelled'
            })

            setOpen(false)
        } catch (err) {
            console.log(err)
        }
    }

    const handlePayNow = async () => {
        if (!order) return

        setOpen(false)

        navigate(`/payments/${order.id}`)
    }


    if (!product) return <div>Loading...</div>

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 font-baskerville">

            <div className="flex font-baskerville items-center pb-10">
                <Link to='/'>Home</Link>
                <img src="https://res.cloudinary.com/dbraczg5a/image/upload/v1773165802/right-arrow-svgrepo-com_mhdnwz.svg"
                    alt="right-vector"
                    className="pl-2 h-6 w-7" />
                <Link to='/shops'><p className="pl-2 ">All Specialty Coffee</p></Link>
                <img src="https://res.cloudinary.com/dbraczg5a/image/upload/v1773165802/right-arrow-svgrepo-com_mhdnwz.svg"
                    alt="right-vector"
                    className="pl-2 h-6 w-7" />
                <p className="font-semibold">{product.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-16">

                {/* Image */}
                <div className="bg-gray-100 rounded-2xl flex items-center justify-center p-10">
                    <img
                        src={product.image_url}
                        className="w-120 object-contain"
                    />
                </div>

                {/* Detail */}
                <div>

                    <p className="text-sm tracking-widest text-gray-500 uppercase">
                        {product.category}
                    </p>

                    <h1 className="text-4xl font-serif mt-2">
                        {product.name}
                    </h1>

                    <p className="text-2xl mt-4 font-medium">
                        ฿ {product.price}
                    </p>

                    <p className="text-2xl mt-4 font-medium">
                        {product.reward_points} pts
                    </p>

                    <p className="mt-6 leading-relaxed">
                        {product.taste}
                    </p>

                    <p className="mt-6 leading-relaxed">
                        {product.description}
                    </p>

                    {/* Roast */}
                    <div className="mt-6">
                        <p className="text-xl mb-2 uppercase font-bold">
                            {product.roast_level} ROAST
                        </p>
                    </div>

                    <p className="mt-6 text-gray-600 leading-relaxed">
                        {product.bag_size}
                    </p>

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
                            className="w-10 h-10 text-2xl pb-1"
                        >
                            +
                        </button>

                    </div>

                    {/* Add to cart */}

                    <button
                        onClick={handleAddToCart}
                        disabled={!product}
                        className="mt-6 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800"
                    >
                        Add to Cart
                    </button>

                    <button
                        onClick={handleBuyNow}
                        className="mt-6 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800"
                    >
                        Buy Now
                    </button>

                    {open && (
                        <OrderDetailModal
                            order={order}
                            onClose={() => setOpen(false)}
                            onPay={handlePayNow}
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