'use client';

import { useState } from 'react'
import { Menu, X } from "react-feather"
import { usePathname } from "next/navigation"
import Link from "next/link"
import LoginButton from './LoginButton';

const Header = () => {

  const path = usePathname()

  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-gray-950 text-white py-4 shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <Link href="/">
          <img src="/images/backhack-logo.png" alt="Logo" className="h-[65px]" />
        </Link>


        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-[40px]   ">
          <Link href="/" className={`  ${path === "/" ? "text-purple-400" : "hover:text-purple-400"} `}>
            Home
          </Link>
          <Link href="/hackathons" className={`  ${path === "/hackathons" ? "text-purple-400" : "hover:text-purple-400"} `}>
            Hackathons
          </Link>
          <Link href="https://github.com/pisuthd/backhack-dev" target="_blank" className={`  hover:text-purple-400 `}>
            Github
          </Link>
          {/* <Link href="/teams" className={`  ${path === "/teams" ? "text-purple-400" : "hover:text-purple-400"} `}>
            Teams
          </Link> */}
          {/* <Link href="/betting" className={`  ${path === "/betting" ? "text-purple-400" : "hover:text-purple-400"} `}>
            Betting
          </Link> */}
        </nav>

        {/* Connect Wallet Button */}
        <LoginButton />

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 text-white py-4">
          <nav className="flex flex-col items-center space-y-4">
            <Link href="/" className="hover:text-purple-400 transition">
              Home
            </Link>
            <Link href="/hackathons" className="hover:text-purple-400 transition">
              Hackathons
            </Link>
            {/* <Link href="/teams" className="hover:text-purple-400 transition">
              Teams
            </Link> */}
            {/* <Link href="/betting" className="hover:text-purple-400 transition">
              Betting
            </Link> */}
            <LoginButton />
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header