

import { AccountContext } from "@/contexts/account"
import { useContext } from "react"
import { FaRegCircleUser } from "react-icons/fa6"
import Link from "next/link"

import { usePathname } from "next/navigation"

const LoginButton = () => {

    const path = usePathname()

    const { isConnected, redirectToAuthUrl, logout }: any = useContext(AccountContext)

    return (
        <>
        
        {!isConnected && (
                <button onClick={() => {
                    redirectToAuthUrl()
                }} className={`hidden md:block cursor-pointer bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-xl transition `}>
                    Login <span className="hidden md:inline-block">with Google</span>
                </button>
            )}

            {isConnected && (
                <Link href="/account" className="w-[150px]"> 
                    <FaRegCircleUser size={24} className={`my-auto mx-auto cursor-pointer mb-0.5 ${path === "/account" ? "text-purple-400" : "text-white hover:text-purple-400"} `} />
                </Link>
            )}
        </> 
    )
}

export default LoginButton