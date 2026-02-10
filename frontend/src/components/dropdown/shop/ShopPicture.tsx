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
                <img src={image} className="rounded-xl w-full h-30" />
                <p className="font-semibold">{title}</p>
                <p className="text-[12px] mt-2">{text}</p>
            </Link>
        </div>
    )

}
