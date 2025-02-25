// components/Navbar.tsx
"use client"

//import Link from 'next/link'

import Logo from "./logo/logo"
import NavigationLinks from './NavigationLinks';
//import Logo from './Logo'

export interface MenuItem {
  href: string
  label: string
}

interface NavbarProps {
  menuItems?: MenuItem[]
  logoText?: string
}

const defaultMenuItems: MenuItem[] = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Browse' },
  { href: '/forge', label: 'Editor' },
  { href: '/about', label: 'About' },
  { href: '/login', label: 'Login' }
]

const Navbar: React.FC<NavbarProps> = ({
  menuItems = defaultMenuItems
}) => {
  return (
    <nav className="bg-white shadow-md mt-5 mb-5">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-10">
          <div className="flex-shrink-0">
            <Logo />
          </div>
          <div className="flex justify-end">
            <NavigationLinks items={menuItems} />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;