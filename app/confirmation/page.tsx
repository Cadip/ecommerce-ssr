'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { formatPrice } from '@/lib/utils'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { OrderData } from '@/types/product'

export default function ConfirmationPage() {
    const router = useRouter()
    const [orderData, setOrderData] = useState<OrderData | null>(null)

    useEffect(() => {
        const data = sessionStorage.getItem('lastOrder')
        if (data) {
            setOrderData(JSON.parse(data))
        } else {
            router.push('/')
        }
    }, [router])

    if (!orderData) {
        return null
    }

    return (
        <>
            <Navigation />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
                    <p className="text-gray-400">
                        Thank you for your purchase. Your order has been received.
                    </p>
                </div>

                <div className="bg-white border rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4 text-black">Order Details</h2>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                        <div>
                            <p className="text-gray-500">Order Number</p>
                            <p className="font-semibold text-gray-700">{orderData.orderId}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Date</p>
                            <p className="font-semibold text-gray-700">
                                {new Date(orderData.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="border-t pt-4 mb-4">
                        <h3 className="font-semibold mb-2 text-black">Shipping Address</h3>
                        <p className="text-sm text-gray-600">
                            {orderData.name}<br />
                            {orderData.address}<br />
                            {orderData.city}, {orderData.postalCode}<br />
                            {orderData.phone}
                        </p>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-3 text-black">Items Ordered</h3>
                        <div className="space-y-2">
                            {orderData.items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm text-gray-500">
                                    <span>
                                        {item.name} x {item.quantity}
                                    </span>
                                    <span className="font-semibold">
                                        {formatPrice(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t mt-4 pt-4">
                        <div className="flex justify-between font-bold text-lg text-black">
                            <span>Total</span>
                            <span>{formatPrice(orderData.total)}</span>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        href="/home"
                        className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition inline-block"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </main>
        </>
    )
}