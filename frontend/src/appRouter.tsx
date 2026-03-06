import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useAuth } from './context/AuthContext'
import LoginModal from "./pages/login-out/LoginModal"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"

import Term from "./pages/Term";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";

import Home from "./pages/HomePage"
import ShopPage from "./pages/shop/ShopPage"
import RewardPage from "./pages/reward/RewardPage"
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import ProtectedRoute from "./routes/ProtectedRoute";
import Profiles from "./pages/Profiles"
import { useState } from "react";



export default function AppRouter() {

    const [openLogin, setOpenLogin] = useState(false)

    const { loading } = useAuth()

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col">

                <Navbar openLogin={() => setOpenLogin(true)} />

                {openLogin && (
                    <LoginModal close={() => setOpenLogin(false)} />
                )}


                <main className="grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/shops" element={<ShopPage />} />
                        <Route path="/rewards" element={<RewardPage />} />
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route path="/contact-us" element={<ContactUs />} />

                        <Route path="/profile" element={<ProtectedRoute>
                            <Profiles />
                        </ProtectedRoute>} />

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

