

interface CategoryFilterProps {
    selected: string[]
    onChange: (value: string[]) => void
}

export default function CategoryFilter({
    selected,
    onChange
}: CategoryFilterProps) {

    const category = [
        "light",
        "medium",
        "dark"
    ]

    return (
        <div className="flex flex-col gap-4">

            {category.map((items) => (
                <label key={items} className="flex items-center gap-3">

                    <input
                        type="radio"
                        name="roast_level"
                        checked={selected.includes(items)}
                        onChange={() => onChange([items])}
                        className="w-5 h-5"
                    />

                    <span>{items.charAt(0).toUpperCase() + items.slice(1)}</span>

                </label>
            ))}
        </div>
    )
}