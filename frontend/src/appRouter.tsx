import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"

import Term from "./pages/Term";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";

import Home from "./pages/HomePage"
import ShopPage from "./pages/shop/ShopPage"
import RewardPage from "./pages/reward/RewardPage"




export default function AppRouter() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col">

                <Navbar />

                <main className="grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/shops" element={<ShopPage />} />
                        <Route path="/rewards" element={<RewardPage />} />

                        <Route path="/term" element={<Term />} />
                        <Route path="/cookies" element={<Cookies />} />
                        <Route path="/privacy" element={<Privacy />} />

                    </Routes>
                </main>

                <Footer />
            </div>
        </BrowserRouter >
    )
}

