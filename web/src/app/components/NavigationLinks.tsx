// components/NavigationLinks.tsx
import Link from 'next/link'

export interface NavigationLinksProps {
  items: Array<{
    href: string
    label: string
  }>
}

const NavigationLinks: React.FC<NavigationLinksProps> = ({ items }) => {
  return (
    <div className="hidden md:flex space-x-4">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-gray-600 hover:text-blue-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}

export default NavigationLinks