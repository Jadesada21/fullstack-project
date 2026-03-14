import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../AxiosInstance"
import { FilterSidebar } from '../../components/FilterSidebar'
import { ItemCard } from "../../components/ItemCard";
import PointsFilter from "./filter-details/PointFilter";


interface Reward {
    id: number
    name: string
    points_required: number
    image_url: string
}

export default function ShopPage() {

    const [searchParams, setSearchParams] = useSearchParams()

    const [rewards, setRewards] = useState<Reward[]>([])


    const points = searchParams.get("points") || "any"
    const category = searchParams.get("category") ?? undefined

    const fetchRewards = async () => {
        const res = await api.get("/rewards", {
            params: {
                points,
                category
            }
        })
        setRewards(res.data.data)
    }

    useEffect(() => {
        fetchRewards()
    }, [searchParams])

    const filters = [
        {
            key: "points",
            label: "Points",
            component: PointsFilter
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
                    <p className="pl-2 font-semibold">All Reward</p>
                </div>

                <div className="mt-40 text-6xl font-baskerville">
                    All Reward
                </div>

                <div className="mt-6 font-baskerville">
                    Discover exclusive rewards you can redeem with your points.
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

                {/* Reward Section */}
                <section className="flex gap-12 pt-8">

                    {/* Filter Sidebar */}
                    <div className="w-75 font-baskerville">
                        <FilterSidebar
                            filters={filters}
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                        />
                    </div>

                    {/* Reward Grid */}
                    <div className="grid gap-10 font-baskerville grid-cols-3">
                        {rewards.map((reward) => (
                            <Link key={reward.id} to={`/rewards/${reward.id}`}>
                                <ItemCard
                                    variant="reward"
                                    image={reward.image_url}
                                    name={reward.name}
                                    points={reward.points_required}
                                />
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </>
    )
}