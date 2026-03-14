import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import { useAuth } from './context/AuthContext'
import { useState } from 'react'

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"
import Search from "./components/Search";


import TermPage from "./pages/Term";
import PrivacyPage from "./pages/Privacy";
import CookiesPage from "./pages/Cookies";

import HomePage from "./pages/HomePage"
import ShopPage from "./pages/shop/ShopPage"
import RewardPage from "./pages/reward/RewardPage"
import AboutUsPage from "./pages/AboutUs";
import ContactUsPage from "./pages/ContactUs";
import ProfilesPage from "./pages/profiles/ProfilesPage";

import ShopDetailPage from "./pages/shop/ShopDetailPage"
import PaymentPage from "./pages/payment/PaymentPage";
import PremiumPage from "./pages/shop/PremiumPage"

import RewardDetailPage from "./pages/reward/RewardDetailPage";

import ProfileForm from "./pages/profiles/ProfileForm";
import AddressForm from "./pages/profiles/AddressForm";
import PaymentHis from "./pages/profiles/PaymentHis";
import PaymentDetails from "./pages/profiles/details/PaymentDetailPage";
import OrderHis from "./pages/profiles/OrderHis";
import OrderDetails from "./pages/profiles/details/OrderDetailPage";
import RewardHis from "./pages/profiles/RewardHis";
import RedeemRewardDetails from "./pages/profiles/details/RedeemRewardPage";

import RedeemHis from "./pages/profiles/RedeemHis";
import PointHis from "./pages/profiles/PointHis";


import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/details/AdminOrderDetails";
import AdminProducts from "./pages/admin/AdminProducts";



export default function AppRouter() {
    const { loading } = useAuth()

    const [openSearch, setOpenSearch] = useState(false)


    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <BrowserRouter>
            <ScrollToTop />

            <Routes>

                {/* User layout */}
                <Route element={
                    <div className="min-h-screen flex flex-col bg-[#f7f5ef]">
                        <Navbar setOpenSearch={setOpenSearch} />

                        <Search
                            open={openSearch}
                            setOpen={setOpenSearch}
                        />

                        <main className="flex-1">
                            <Outlet />
                        </main>

                        <Footer />

                    </div>
                }>

                    <Route path="/" element={<HomePage />} />

                    <Route path="/shops" element={<ShopPage />} />
                    <Route path="/shops/:id" element={<ShopDetailPage />} />
                    <Route path="/shops/special" element={<PremiumPage />} />

                    <Route path="/rewards" element={<RewardPage />} />
                    <Route path='/rewards/:id' element={<RewardDetailPage />} />

                    <Route path="/about-us" element={<AboutUsPage />} />
                    <Route path="/contact-us" element={<ContactUsPage />} />
                    <Route path="/payments/:id" element={<PaymentPage />} />


                    <Route
                        path="/profile"
                        element={<ProtectedRoute>
                            <ProfilesPage />
                        </ProtectedRoute>
                        }
                    >
                        <Route index element={<ProfileForm />} />
                        <Route path="address" element={<AddressForm />} />
                        <Route path="payments" element={<PaymentHis />} />
                        <Route path="payments/:id" element={<PaymentDetails />} />
                        <Route path="orders" element={<OrderHis />} />
                        <Route path="orders/:id" element={<OrderDetails />} />
                        <Route path="rewards-redeem" element={<RewardHis />} />
                        <Route path="rewards-redeem/:id" element={<RedeemRewardDetails />} />
                        <Route path="redeems" element={<RedeemHis />} />
                        <Route path="points" element={<PointHis />} />

                    </Route>



                    <Route path="/term" element={<TermPage />} />
                    <Route path="/cookies" element={<CookiesPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />

                </Route>


                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }
                >

                    <Route index element={<AdminDashboard />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="orders/detail/:id" element={<AdminOrderDetails />} />
                    <Route path="products" element={<AdminProducts />} />
                    {/* <Route path="rewards" element={<AdminRewards />} />
                     <Route path="users" element={<AdminUsers />} />  */}
                </Route>




            </Routes>
        </BrowserRouter >
    )
}

