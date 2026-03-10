import { Link } from "react-router-dom";

export default function ShopPage() {
    return (
        <main className="w-full h-full px-25 py-15 mb-10">

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

            <div className="mt-25 h-20 flex justify-between">
                <div className="flex items-center justify-between w-75">
                    <div className="flex items-center gap-4">
                        <img src="https://res.cloudinary.com/dbraczg5a/image/upload/v1773164370/filter-list-add-svgrepo-com_wfzplr.svg"
                            alt="filter-icon"
                            className="w-10 h-10"
                        />

                        <p className="text-xl font-semibold font-baskerville">Filters</p>

                    </div>

                    <button className="text-xl font-semibold font-baskerville text-[#f45048] underline">Clear</button>
                </div>

                {/* filter & sort button */}
                <div className="flex items-center gap-5">
                    <img src="https://res.cloudinary.com/dbraczg5a/image/upload/v1773164881/sort-filter-funnel-sorting-conversion-currency-money-svgrepo-com_n5mjxa.svg"
                        alt="sort-icon"
                        className="w-10 h-10"
                    />
                    <span className="text-xl font-semibold font-baskerville">Sort</span>

                    <div className="flex items-center gap-2 px-4 h-10  border border-charcoal-200 rounded-xl">
                        <select name="" id=""
                            className="font-baskerville w-39 text-body-16 text-charcoal-600 bg-transparent appearance-none cursor-pointer outline-none p-0 m-0 border-0"
                        >
                            <option value="" >Featured</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                            <option value="newest">Newest</option>
                            <option value="popular">Most Popular</option>
                        </select>
                        <img src="https://res.cloudinary.com/dbraczg5a/image/upload/v1773165803/down-arrow2-svgrepo-com_u3ageh.svg"
                            alt="down-vector"
                            className="h-7 w-6" />
                    </div>
                </div>
            </div>

            {/* main */}
            <div className="mt-10 border-2 flex-1">

                {/* filter box */}
                <div></div>
            </div>

        </main>
    )
}