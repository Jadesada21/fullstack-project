import { Link } from 'react-router-dom'

interface ShopPictureProps {
    image: string
    to: string
    title: string
    text: string
}

export default function ShopPicture({ image, to, title, text }: ShopPictureProps) {
    return (
        <div>
            <Link to={to} className="block group ">
                <img src={image} className="rounded-xl w-full h-38" />
                <p className="font-baskerville font-bold">{title}</p>
                <p className="text-[13px] mt-2 font-baskerville">{text}</p>
            </Link>
        </div>
    )

}
