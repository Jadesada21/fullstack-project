import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom";
import { FilterSidebar } from '../../components/FilterSidebar'
import RoastLevelFilter from "./filter-details/RoastlevelFilter"
import PriceFilter from "./filter-details/PriceFilter"
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


    const price = searchParams.get("price") || "any"
    const roast_level = searchParams.get("roast_level") ?? undefined

    const fetchProducts = async () => {
        const res = await api.get("/products", {
            params: {
                price,
                roast_level
            }
        })
        setProducts(res.data.data)
    }

    useEffect(() => {
        fetchProducts()
    }, [searchParams])

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
            <main className="w-full h-full px-60 py-15 mb-10 md:px-30">
                {/* Upper */}
                <div className="flex font-baskerville items-center">
                    <Link to='/'>Home</Link>
                    <img src="https://res.cloudinary.com/dbraczg5a/image/upload/v1773165802/right-arrow-svgrepo-com_mhdnwz.svg"
                        alt="right-vector"
                        className="pl-2 h-6 w-7" />
                    <p className="pl-2 font-semibold">All Specialty Coffee</p>
                </div>

                <div className="mt-40 text-6xl font-baskerville">
                    All Specialty Coffee
                </div>

                <div className="mt-6 font-baskerville">
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

                                <p className="text-xl font-semibold font-baskerville">Filters</p>

                            </div>

                            <button
                                onClick={() => setSearchParams({})}
                                className="text-xl font-semibold font-baskerville text-[#f45048] underline cursor-pointer"
                            >
                                Clear
                            </button>
                        </div>

                    </div>
                </div>

                {/* Product Section */}
                <section className="flex gap-12 pt-8">

                    {/* Filter Sidebar */}
                    <div className="w-75 font-baskerville">
                        <FilterSidebar
                            filters={filters}
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                        />
                    </div>

                    {/* Product Grid */}
                    <div className="grid xl:grid-cols-4 gap-10 font-baskerville md:grid-cols-3">
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
            </main>
        </>
    )
}