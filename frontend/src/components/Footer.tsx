import { Link } from 'react-router-dom';


export default function Footer() {
    return (
        <footer className="bg-zinc-800 text-white px-60 pt-10 pb-5">

            {/* <!-- top --> */}
            <div className="flex justify-between">

                {/* <!-- left --> */}
                <div className="grid grid-cols-3 gap-25 w-225">

                    <div>
                        <h3 className="font-bold mb-4 text-xl font-baskerville">Shop</h3>
                        <ul className="space-y-2 text-xl ">
                            <li className="pt-3 hover:underline decoration-1 font-baskerville"><Link to="">Bean</Link></li>
                            <li className="pt-3 hover:underline decoration-1 font-baskerville"><Link to="">Roast Level</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 text-xl font-baskerville">Reward</h3>
                        <ul className="space-y-2 text-xl ">
                            <li className="pt-3 hover:underline decoration-1 font-baskerville"><Link to="">Equipment</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 text-xl font-baskerville">Support</h3>
                        <ul className="space-y-2 text-xl ">
                            <li className="pt-3 hover:underline decoration-1 font-baskerville"> <Link to="">Contact Us</Link></li>
                            <li className="pt-3 hover:underline decoration-1 font-baskerville"><Link to="">About Us</Link></li>
                        </ul >
                    </div>

                </div>

                {/* <!-- right --> */}
                <div className="flex items-center justify-center w-150 mt-25" >
                    <h2 className="text-8xl font-bold font-baskerville">
                        BEAN
                    </h2>

                </div>

            </div>

            {/* <!-- bottom --> */}
            <div className="mt-16 text-xl text-gray-400 flex gap-6" >
                <Link to="/term" className="hover:underline decoration-1 font-baskerville">Terms</Link>
                <Link to="/privacy" className="hover:underline decoration-1 font-baskerville">Privacy</Link>
                <Link to="/cookies" className="hover:underline decoration-1 font-baskerville">Cookies</Link>
            </div>

            <div className="mt-2 text-xl text-gray-400 flex gap-6 " >
                <span className="font-baskerville">Copyright © Bean Inc. 2026 All Rights Reserved</span>
            </div>


        </footer>
    )
}
