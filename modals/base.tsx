import { X } from "react-feather"


interface IBaseModal {
    visible: boolean
    title: string
    close: () => void
    children: any
    borderColor?: string
    maxWidth?: string
}

const BaseModal = ({
    visible,
    title,
    close,
    children, 
    maxWidth = "max-w-2xl"
}: IBaseModal) => {
    return (
        <>
            {visible && (
                <div className="fixed inset-0 flex items-center justify-center z-10">
                <div className="absolute inset-0 bg-neutral-900 opacity-60"></div>
                <div className={`relative mx-2 bg-gray-900 rounded-lg p-6 w-full  ${maxWidth}   text-white `} data-aos="zoom-in" data-aos-duration="400">
                    <h5 className="text-xl font-bold mb-2">{title}</h5>
                    <button className="absolute top-3 right-3 cursor-pointer" onClick={close}>
                        <X />
                    </button>
                    {children}
                </div>
            </div>
            )}
        </>
    )
}

export default BaseModal