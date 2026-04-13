'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Search, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useState, useEffect } from 'react'


const categories = [
    'Automotive',
    'Beauty',
    'Books',
    'Electronics',
    'Fashion',
    'Food & Beverage',
    'Home & Living',
    'Medical',
    'Sports',
    'Toys'
]

export default function Navigation() {
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const totalItems = useCartStore((state) => state.getTotalItems())
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <>
            {/* Main Navigation */}
            <nav className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 text-black">
                        {/* Logo */}
                        <Link href="/home" className="text-2xl font-bold">
                            SSR E-COMMERCE
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-8">
                            <Link
                                href="/home"
                                className={`font-medium ${pathname === '/home' ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'}`}
                            >
                                DISCOVER
                            </Link>

                            {/* Categories Dropdown */}
                            <div className="relative group pb-2">
                                <button className="text-gray-700 hover:text-gray-900 font-medium">
                                    CATEGORIES
                                </button>
                                <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg mt-2 py-2 w-48 text-black">
                                    <Link
                                        href="/categories"
                                        className="block px-4 py-2 text-sm hover:bg-gray-100 font-semibold border-b"
                                    >
                                        All Categories
                                    </Link>
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat}
                                            href={`/categories/${cat}`}
                                            className={`block px-4 py-2 text-sm hover:bg-gray-100 ${pathname === `/categories/${cat}` ? 'bg-gray-50 font-semibold' : ''
                                                }`}
                                        >
                                            {cat}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Menu */}
                        <div className="flex items-center space-x-6">
                            <Link
                                href="/search"
                                className={pathname === '/search' ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'}
                            >
                                <Search className="w-5 h-5" />
                            </Link>

                            <Link href="/cart" className="relative">
                                <ShoppingBag className={`w-5 h-5 ${pathname === '/cart' ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'}`} />
                                {mounted && totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                className="md:hidden"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t">
                        <div className="px-4 py-4 space-y-3">
                            <Link
                                href="/"
                                className="block text-gray-700 hover:text-gray-900"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                DISCOVER
                            </Link>

                            <Link
                                href="/categories"
                                className="block text-gray-700 hover:text-gray-900 font-semibold"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                ALL CATEGORIES
                            </Link>

                            <div className="space-y-2">
                                <p className="font-semibold text-sm text-gray-500">CATEGORIES</p>
                                {categories.map((cat) => (
                                    <Link
                                        key={cat}
                                        href={`/categories/${cat}`}
                                        className="block pl-4 text-gray-700 hover:text-gray-900"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    )
}