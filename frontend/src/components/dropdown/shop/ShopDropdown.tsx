import CoffeeSet from '../../../assets/CoffeeSet.webp'
import { shopLinkslist } from '../datalink/data';
import ShopLinks from "./ShopLink";
import ShopPicture from "./ShopPicture";


export default function ShopDropdown() {

    return (
        <div className="grid grid-cols-3 gap-6 p-6 h-full">
            <ShopLinks links={shopLinkslist} title="Shop All" />
            <ShopPicture
                image={CoffeeSet}
                title={"Shop Gifts"}
                text={"It’s more than great coffee, it’s the joy of discovering something new."}
                to="/"
            />
        </div>
    )
}