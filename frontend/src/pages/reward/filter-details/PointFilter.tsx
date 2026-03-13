

interface PointsFilterProps {
    selected: string[]
    onChange: (value: string[]) => void
}

export default function PointsFilter({
    selected,
    onChange
}: PointsFilterProps) {

    const points = [
        "any",
        "100-200 pts",
        "201-300 pts",
        "301-800 pts"
    ]

    return (
        <div>

            <div className="space-y-3">

                {points.map((point) => (
                    <label
                        key={point}
                        className="flex items-center gap-3 cursor-pointer"
                    >

                        <input
                            type="radio"
                            name="point"
                            checked={selected.includes(point)}
                            onChange={() => onChange([point])}
                        />

                        <span>{point}</span>

                    </label>
                ))}

            </div>

        </div>
    )
}