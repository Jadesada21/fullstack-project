import { Link } from 'react-router-dom';
import searchIcon from "../assets/search-img.svg";
import cart from '../assets/cart.svg';
import profile from '../assets/profile.svg';
import OpenBox from "./isopen/OpenBox";
import ShopDropdown from './dropdown/shop/ShopDropdown';

export default function Navbar() {
    return (
        <div className="flex items-center justify-between py-5 px-10 w-full h-20 border-b border-gray-400 bg-[#f7f5ef] ">
            <div className="flex justify-center gap-15 items-center ml-15 ">
                <Link to="/">
                    <p className="font-bold text-4xl font-baskerville">BEAN</p>
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

            <div className="flex justify-center gap-15  items-center mr-20">
                <button>
                    <img src={searchIcon} alt="search" className="w-9" />
                </button>

                <button>
                    <img src={profile} alt="profile" className="w-8" />
                </button>

                <button>
                    <img src={cart} alt="profile" className="w-9" />
                </button>
            </div>

        </div >
    )
}