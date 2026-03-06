import { Link } from 'react-router-dom';
import searchIcon from "../assets/search-img.svg";
import cart from '../assets/cart.svg';
import profile from '../assets/profile.svg';
import OpenBox from "./isopen/OpenBox";
import ShopDropdown from './dropdown/shop/ShopDropdown';

import LoginModal from '../pages/login-out/LoginModal';

export default function Navbar({ openLogin }: { openLogin: () => void }) {


    return (
        <div className="flex items-center justify-between py-5 px-10 w-full h-20 border-b border-gray-400 bg-[#f7f5ef] ">
            <div className="flex justify-center gap-15 items-center ml-20 ">
                <Link to="/">
                    <p className="font-bold text-4xl font-baskerville">BEAN</p>
                </Link>

                <OpenBox label="Shop" >
                    <ShopDropdown />
                </OpenBox>

                <Link to="/rewards">
                    <p className="font-baskerville text-[18px] relative inline-block 
                    after:content-[''] after:absolute after:left-0 after:-bottom-px
                    after:h-px after:w-0 after:bg-black 
                    after:transition-all after:duration-300 
                    hover:after:w-full">
                        Rewards
                    </p>
                </Link>

                <Link to="/about-us">
                    <p className="font-baskerville text-[18px] relative inline-block 
                    after:content-[''] after:absolute after:left-0 after:-bottom-px
                    after:h-px after:w-0 after:bg-black 
                    after:transition-all after:duration-300 
                    hover:after:w-full" >
                        About Us</p>
                </Link>
            </div>

            <div className="flex justify-center gap-15  items-center mr-20">
                <button>
                    <img src={searchIcon} alt="search" className="w-9" />
                </button>

                <button onClick={(openLogin)}>
                    <img src={profile} alt="profile" className="w-8" />
                </button>

                <button>
                    <img src={cart} alt="profile" className="w-9" />
                </button>
            </div>

        </div >
    )
}