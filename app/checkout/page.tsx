'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function CheckoutPage() {
    const router = useRouter()
    const { items, getTotalPrice, clearCart } = useCartStore()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (items.length === 0) {
        return (
            <>
                <Navigation />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center py-16">
                        <h1 className="text-3xl font-bold mb-4">No Items in Cart</h1>
                        <Link
                            href="/"
                            className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition inline-block"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </main>
            </>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const updatePromises = items.map(async (item) => {
                const newStock = item.stock - item.quantity

                if (newStock < 0) {
                    throw new Error(`Insufficient stock for ${item.name}`)
                }

                const { error } = await supabase
                    .from('products')
                    .update({
                        stock: newStock,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', item.id)

                if (error) throw error
            })

            await Promise.all(updatePromises)

            const orderId = 'ORD-' + Date.now()

            const orderData = {
                orderId,
                ...formData,
                items,
                total: getTotalPrice() >= 500000 ? getTotalPrice() : getTotalPrice() + 50000,
                createdAt: new Date().toISOString(),
            }

            sessionStorage.setItem('lastOrder', JSON.stringify(orderData))

            clearCart()

            router.push('/confirmation')
        } catch (error: any) {
            alert(`Error placing order: ${error.message}`)
            console.error('Checkout error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <>
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white border rounded-lg p-6 text-black">
                                <h2 className="text-xl font-bold mb-4">Shipping Information</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Address *
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                required
                                                disabled={isSubmitting}
                                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-100"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Postal Code *
                                            </label>
                                            <input
                                                type="text"
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={handleChange}
                                                required
                                                disabled={isSubmitting}
                                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-100"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Processing Order...' : 'Place Order'}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border rounded-lg p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-4 text-black">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Items ({items.length})</span>
                                    <span className="font-semibold text-gray-700">{formatPrice(getTotalPrice())}</span>
                                </div>
                                <div className="flex justify-between text-sm">
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

                            {/* Stock Warning */}
                            {items.some(item => item.quantity > item.stock) && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-red-800 font-medium">
                                        Some items exceed available stock
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}