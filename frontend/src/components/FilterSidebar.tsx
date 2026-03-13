import { useState } from 'react'

interface FilterConfig {
    key: string
    label: string
    component: any
}

interface FilterSidebarProps {
    filters: FilterConfig[]
    searchParams: URLSearchParams
    setSearchParams: (params: any) => void
}



export function FilterSidebar({
    filters,
    searchParams,
    setSearchParams
}: FilterSidebarProps) {

    const [openFilter, setOpenFilter] = useState<string | null>(null)

    const handleChange = (key: string, value: string) => {

        const params: any = Object.fromEntries(searchParams.entries())

        if (!value || value === "any") {
            delete params[key]
        } else {
            params[key] = value
        }

        setSearchParams(params)
    }

    return (
        <>
            {/* ===== Filter + Product layout ===== */}
            <div className="flex border-t border-gray-300">

                {/* Filters sidebar */}
                <div className="w-75">
                    {filters.map((filter) => {

                        const FilterComponent = filter.component
                        const isOpen = openFilter === filter.key
                        const selected = searchParams.get(filter.key) || "any"

                        return (
                            <div key={filter.key} className="border-b border-gray-300">

                                {/* Header */}
                                <button
                                    onClick={() =>
                                        setOpenFilter(isOpen ? null : filter.key)
                                    }
                                    className="flex justify-between items-center w-full py-6"
                                >

                                    <span className={`
                                    font-baskerville text-lg 
                                    ${isOpen ? "text-black font-semibold" : "text-gray-500"
                                        }`}
                                    >
                                        {filter.label}
                                    </span>

                                    <span className="text-2xl">
                                        {isOpen ? "x" : "+"}
                                    </span>

                                </button>

                                {/* filter content */}
                                {isOpen && (
                                    <div className="pb-6">

                                        <FilterComponent
                                            selected={[selected]}
                                            onChange={(value: string[]) => {
                                                handleChange(filter.key, value[0])
                                            }}
                                        />
                                    </div>
                                )}

                            </div>
                        )
                    })}
                </div>
            </div >
        </>
    )
}