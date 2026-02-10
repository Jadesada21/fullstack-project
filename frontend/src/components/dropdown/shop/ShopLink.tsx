import { Link } from "react-router-dom";

interface ShopLinksProps {
    title: String
    links: { label: string; to: string }[]
}

export default function ShopLinks({ title, links }: ShopLinksProps) {
    return (
        <div>
            <p className="mb-4 text-gray-500">
                {title}
            </p>

            <ul className="space-y-3">
                {links.map((l) => (
                    <li key={l.to}>
                        <Link
                            to={l.to}
                            className="relative inline-block cursor-pointer
                        after:absolute after:left-0 after:-bottom-0.5
                        after:h-px after:w-full after:bg-black
                        after:origin-left after:scale-x-0
                        after:transition-transform after:duration-300
                        hover:after:scale-x-100"
                        >
                            {l.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}