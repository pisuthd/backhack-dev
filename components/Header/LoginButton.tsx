

import { AccountContext } from "@/contexts/account"
import { useContext, useState } from "react"
import { FaRegCircleUser } from "react-icons/fa6"
import Link from "next/link"

import { usePathname } from "next/navigation"
import BaseModal from "@/modals/base"
import { ArrowRight } from "react-feather"
import { AiFillGoogleCircle } from "react-icons/ai";

const LoginButton = () => {

    const [modal, setModal] = useState<boolean>(false)

    const path = usePathname()

    const { isConnected, redirectToAuthUrl, logout }: any = useContext(AccountContext)

    return (
        <>

            <BaseModal
                visible={modal}
                close={() => setModal(false)}
                title="Select Authentication Method"
                maxWidth="max-w-sm"
            >
                <p className="text-gray-300">
                    Choose an available option below to sign in via zkLogin
                </p>
                <div>
                    <button onClick={() => {
                        redirectToAuthUrl()
                    }} className="mt-4 w-full flex flex-row cursor-pointer  bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg transition">

                        <AiFillGoogleCircle size={30} />
                        <div className="my-auto ml-2">
                             Sign in with Google 
                        </div>
                        <ArrowRight className="ml-auto my-auto"/>
                       
                    </button>
                </div>

            </BaseModal>

            {!isConnected && (
                <button onClick={() => {
                    setModal(true) 
                }} className={`hidden md:block cursor-pointer bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-xl transition `}>
                    Login <span className="hidden md:inline-block">with zkLogin</span>
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