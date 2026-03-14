import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom";
import { FilterSidebar } from '../../components/FilterSidebar'
import RoastLevelFilter from "./Filter-details/RoastlevelFilter"
import PriceFilter from "./Filter-details/PriceFilter"
import { ItemCard } from "../../components/ItemCard";
import { api } from "../../AxiosInstance"

interface Product {
    id: number
    name: string
    taste: string
    price: number
    reward_points: number
    image_url: string
}

export default function ShopPage() {

    const [searchParams, setSearchParams] = useSearchParams()

    const [products, setProducts] = useState<Product[]>([])

    const [page, setPage] = useState(1)


    const price = searchParams.get("price") || "any"
    const roast_level = searchParams.get("roast_level") ?? undefined

    const fetchProducts = async () => {
        const res = await api.get(`/products`, {
            params: {
                price,
                roast_level,
                page
            }
        })
        setProducts(res.data.data)
    }

    useEffect(() => {
        fetchProducts()
    }, [searchParams, page])

    const filters = [
        {
            key: "roast_level",
            label: "Roast Level",
            component: RoastLevelFilter
        },
        {
            key: "price",
            label: "Price",
            component: PriceFilter
        }
    ]




    return (
        <>
            <main className="w-full h-full  py-15 mb-10 px-30 font-baskerville">
                {/* Upper */}
                <div className="flex items-center">
                    <Link to='/'>Home</Link>
                    <img src="https://res.cloudinary.com/dbraczg5a/image/upload/v1773165802/right-arrow-svgrepo-com_mhdnwz.svg"
                        alt="right-vector"
                        className="pl-2 h-6 w-7" />
                    <p className="pl-2 font-semibold">All Specialty Coffee</p>
                </div>

                <div className="mt-40 text-6xl">
                    All Specialty Coffee
                </div>

                <div className="mt-6">
                    Explore our collection of specialty coffee beans, carefully sourced and roasted fresh for the perfect cup.
                </div>

                <div className="flex-1 mx-auto gap-10 ">
                    <div className="mt-25 h-20 flex justify-between">
                        <div className="flex items-center justify-between w-75">
                            <div className="flex items-center gap-4">
                                <img src="https://res.cloudinary.com/dbraczg5a/image/upload/v1773164370/filter-list-add-svgrepo-com_wfzplr.svg"
                                    alt="filter-icon"
                                    className="w-10 h-10"
                                />

                                <p className="text-xl font-semibold">Filters</p>

                            </div>

                            <button
                                onClick={() => setSearchParams({})}
                                className="text-xl font-semibold text-[#f45048] underline cursor-pointer"
                            >
                                Clear
                            </button>
                        </div>


                        <div className="flex gap-6 pt-4 mr-18">

                            <button
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Prev
                            </button>

                            <span className="px-4 py-2 flex items-center">
                                {page}
                            </span>

                            <button
                                onClick={() => setPage(prev => prev + 1)}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Section */}
                <section className="flex gap-12 pt-8">

                    {/* Filter Sidebar */}
                    <div className="w-75">
                        <FilterSidebar
                            filters={filters}
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                        />
                    </div>

                    {/* Product Grid */}
                    <div className="grid gap-10 grid-cols-3">
                        {products.map((product) => (
                            <Link key={product.id} to={`/shops/${product.id}`}>
                                <ItemCard
                                    variant="product"
                                    image={product.image_url}
                                    name={product.name}
                                    subtitle={product.taste}
                                    points={product.reward_points}
                                    price={product.price}
                                />
                            </Link>
                        ))}
                    </div>
                </section>
            </main >
        </>
    )
}