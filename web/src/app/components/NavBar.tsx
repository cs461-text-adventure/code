// components/Navbar.tsx
"use client"

//import Link from 'next/link'

import Logo from "./logo"
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
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        < div className="flex justify-between items-center py-4">
          <Logo />
          <NavigationLinks items={menuItems} />
        </div>
      </div>
    </nav>
  )
}

export default Navbar;