'use client'

import Navigation from '@/components/Navigation'
import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { Trash2, Plus, Minus } from 'lucide-react'

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()

    if (items.length === 0) {
        return (
            <>
                <Navigation />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center py-16">
                        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                        <p className="text-gray-600 mb-8">Add some products to get started!</p>
                        <Link
                            href="/home"
                            className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition inline-block"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </main>
            </>
        )
    }

    return (
        <>
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border rounded-lg p-4 flex gap-4"
                            >
                                {/* Image */}
                                <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.image_url}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <Link
                                        href={`/products/${item.id}`}
                                        className="font-semibold hover:text-gray-500 block mb-1 text-black"
                                    >
                                        {item.name}
                                    </Link>
                                    <p className="text-sm text-gray-400 mb-2">{item.category}</p>
                                    <p className="font-bold text-black">{formatPrice(item.price)}</p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex flex-col items-end justify-between">
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>

                                    <div className="flex items-center space-x-2 border rounded-lg text-black">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-2 hover:bg-gray-300 rounded-l-lg"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center font-semibold">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-2 hover:bg-gray-300 rounded-r-lg"
                                            disabled={item.quantity >= item.stock}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <p className="font-bold text-lg text-black">
                                        {formatPrice(item.price * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border rounded-lg p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-4 text-black">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold text-gray-700">{formatPrice(getTotalPrice())}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-semibold text-gray-700">
                                        {getTotalPrice() >= 500000 ? 'FREE' : formatPrice(50000)}
                                    </span>
                                </div>
                                <div className="border-t pt-3 flex justify-between">
                                    <span className="text-lg font-bold text-black">Total</span>
                                    <span className="text-lg font-bold text-black">
                                        {formatPrice(
                                            getTotalPrice() >= 500000
                                                ? getTotalPrice()
                                                : getTotalPrice() + 50000
                                        )}
                                    </span>
                                </div>
                            </div>

                            {getTotalPrice() < 500000 && (
                                <p className="text-xs text-gray-500 mb-4">
                                    Add {formatPrice(500000 - getTotalPrice())} more for FREE shipping
                                </p>
                            )}

                            <Link
                                href="/checkout"
                                className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition block text-center"
                            >
                                Proceed to Checkout
                            </Link>

                            <Link
                                href="/home"
                                className="w-full text-center text-gray-600 hover:text-gray-900 mt-4 block"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}