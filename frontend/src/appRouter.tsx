import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useAuth } from './context/AuthContext'

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"

import TermPage from "./pages/Term";
import PrivacyPage from "./pages/Privacy";
import CookiesPage from "./pages/Cookies";

import HomePage from "./pages/HomePage"
import ShopPage from "./pages/shop/ShopPage"
import RewardPage from "./pages/reward/RewardPage"
import AboutUsPage from "./pages/AboutUs";
import ContactUsPage from "./pages/ContactUs";
import ProfilesPage from "./pages/ProfilesPage";


import AdminPage from "./pages/AdminPage";


export default function AppRouter() {


    const { loading } = useAuth()

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col">

                <Navbar />

                <main className="grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/shops" element={<ShopPage />} />
                        <Route path="/rewards" element={<RewardPage />} />
                        <Route path="/about-us" element={<AboutUsPage />} />
                        <Route path="/contact-us" element={<ContactUsPage />} />

                        <Route path="/profile" element={<ProtectedRoute>
                            <ProfilesPage />
                        </ProtectedRoute>} />

                        <Route path="/admin" element={<AdminRoute>
                            <AdminPage />
                        </AdminRoute>} />

                        <Route path="/term" element={<TermPage />} />
                        <Route path="/cookies" element={<CookiesPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />

                    </Routes>
                </main>


                <Footer />
            </div>
        </BrowserRouter >
    )
}

