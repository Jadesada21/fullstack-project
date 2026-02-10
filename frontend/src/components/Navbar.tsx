import { Link } from 'react-router-dom'
import logo from "../assets/logo.png";
import OpenBox from "./isopen/OpenBox";
import ShopDropdown from './dropdown/shop/ShopDropdown';

export default function Navbar() {
    return (
        <div className="flex items-center justify-between py-5 px-10 w-full h-35">
            <div className="flex justify-center gap-20 items-center">
                <Link to="/">
                    <img src={logo} alt="logo" className="w-17 h-17 items-center rounded-4xl" />
                </Link>
                <OpenBox label="Shop" >
                    <ShopDropdown />
                </OpenBox>
                <OpenBox label="Rewards" >
                    {/* <ShopDropdown /> */}
                </OpenBox>
                <OpenBox label="About Us" >
                    {/* <ShopDropdown /> */}
                </OpenBox>

            </div>


            <div>

            </div>
        </div >
    )
}