import { useState, useRef } from 'react'

interface OpenBoxProps {
    label: string
    children: React.ReactNode
}

export default function OpenBox({ label, children }: OpenBoxProps) {
    const [open, setOpen] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handlerEnter = () => {
        if (closeTimer.current) {
            clearTimeout(closeTimer.current)
            closeTimer.current = null
        }
        setOpen(true)
    }

    const handlerLeave = () => {
        closeTimer.current = setTimeout(() => {
            setOpen(false)
        }, 50)
    }

    return (
        <p className="w-20 h-17 flex items-center justify-center text-[18px]">
            <span className="relative inline-block">
                {/* TEXT */}
                <span
                    className={` relative  inline-block  cursor-pointer after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full  after:bg-black after:origin-left after:transition-transform after:duration-300
                        ${open ? "after:scale-x-100" : "after:scale-x-0"}`}
                    onMouseEnter={handlerEnter}
                // onMouseLeave={handlerLeave}
                >
                    {label}
                </span>

                {/* DROPDOWN */}
                {open && (
                    <div
                        className="absolute top-13 left-74 -translate-x-1/2 mt-3 w-170 h-75 bg-[#f3efe7] rounded-3xl shadow-lg z-20"
                        onMouseEnter={handlerEnter}
                    // onMouseLeave={handlerLeave}
                    >
                        {children}
                        {/* เมนูข้างใน */}
                    </div>
                )}
            </span>
        </p>
    )
}