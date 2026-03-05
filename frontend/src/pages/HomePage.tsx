


export default function HomePage() {
    return (
        <div className="max-w-7xl flex flex-col mt-20 px-6 mx-auto text-left ">
            <h1 className="pt-5 font-semibold text-6xl font-baskerville">Find your new favorite </h1>
            <h1 className="pt-5 font-semibold text-6xl font-baskerville">coffee, again and again</h1>

            <button className="flex justify-center items-center 
            mt-12 text-left ml-10 w-40 h-15 bg-black rounded-3xl">
                <p className="text-white font-bold font-baskerville">GRIND HERE</p>
            </button>


            <div className="mt-20 overflow-hidden">
                <video className="w-full h-137.5 object-cover rounded-3xl" loop autoPlay muted >
                    <source
                        src="https://res.cloudinary.com/dbraczg5a/video/upload/v1772739066/BrandRefresh_xiqgcd.mp4"
                        type="video/mp4"
                    />
                </video>
            </div>


            <div className="mt-30 mb-10">
                <div className="flex items-center flex-col">
                    <h1 className="font-mono mb-3 text-2xl">The Bean Difference</h1>
                    <h1 className="font-baskerville text-4xl font-bold mt-4">We're coffee nerds, so you</h1>
                    <h1 className="font-baskerville text-4xl font-bold mb-10">don't have to be</h1>
                </div>
            </div>
            <div>

                <div>

                </div>
            </div>
        </div >


    )
}