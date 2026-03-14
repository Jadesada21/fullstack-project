import { useEffect, useState } from 'react'
import { api } from '../../AxiosInstance'

interface Product {
    id: number
    name: number
    description: string
    price: number
    stock: number
    reward_points: number
    roast_level: string
    taste: string
    is_active: boolean
    total_images: number
    created_at: string
    updated_at: string
}

export default function AdminProduct() {

    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [error, setError] = useState("")

    const fetchProducts = async () => {
        try {
            const res = await api.get(`/products?page=${page}`)
            setProducts(res.data.data)

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [page])

    const handleSearch = async () => {
        try {
            setError("")

            if (!search.trim()) {
                const res = await api.get('/products?page=1')
                setProducts(res.data.data)
                return
            }

            const res = await api.get(`/products/${search}`)

            setProducts([res.data.data])
        } catch (err: any) {

            if (err.response?.status === 404) {
                setProducts([])
                setError("Product not found")
            }
        }


    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="font-baskerville">

            <div className="flex justify-between  mb-6">

                <h1 className="text-2xl font-semibold">
                    Products
                </h1>

                <div>
                    <input
                        type="text"
                        placeholder="Search Product ID"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-3 py-2 rounded"
                    />

                    <button
                        onClick={handleSearch}
                        className="bg-emerald-500 text-white px-4 py-2 rounded ml-5"
                    >
                        Search
                    </button>
                </div>
            </div>



            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="">
                    {products.length === 0 && error && (
                        <tr>
                            <td colSpan={3} className="p-6 text-gray-500">
                                Product not found
                            </td>
                        </tr>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-100 h-15">
                            <tr>
                                <th className="text-left pl-2">Product ID</th>
                                <th className="text-left pl-2">Product Name</th>
                                <th className="text-left pl-2">Price</th>
                                <th className="text-left pl-2">Stock</th>
                                <th className="text-left pl-2">Reward Points</th>
                                <th className="text-left pl-2">Roaste Level</th>
                                <th className="text-left pl-2">Is Active</th>
                                <th className="text-left pl-2">Create</th>
                                <th className="text-left pl-2">Update</th>
                                <th className="text-left pl-2">Image</th>
                            </tr>
                        </thead>



                        {products.map(product => (

                            <tr key={product.id} className="border-t border-gray-300">

                                <td className="py-4 px-2 ">
                                    {product.id}
                                </td>

                                <td className="py-4 px-2">
                                    {product.name}
                                </td>

                                <td className="py-4 px-2 ">
                                    ฿ {product.price}
                                </td>

                                <td className="py-4 px-2">
                                    {product.stock}
                                </td>

                                <td className="py-4 px-2">
                                    {product.reward_points} pts
                                </td>

                                <td className="py-4 px-2">
                                    {product.roast_level.toUpperCase()}
                                </td>

                                <td className="py-4 px-2">
                                    {product.is_active ? "Active" : "Inactive"}
                                </td>

                                <td className="py-4 px-2">
                                    {new Date(product.created_at).toLocaleDateString()}
                                </td>

                                <td className="py-4 px-2">
                                    {new Date(product.updated_at).toLocaleDateString()}
                                </td>

                                <td className="py-4 px-2">
                                    {product.total_images}
                                </td>

                            </tr>

                        ))}

                    </table>
                </div>
            </div>
            <div className="flex gamt-6 pt-4">

                <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    className="px-4 py-2 bg-gray-200 rounded"
                >
                    Prev
                </button>

                <span className="px-4 py-2">
                    Page {page}
                </span>

                <button
                    onClick={() => setPage(prev => prev + 1)}
                    className="px-4 py-2 bg-gray-200 rounded"
                >
                    Next
                </button>

            </div>


        </div>
    )
}