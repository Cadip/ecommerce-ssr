'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import Navigation from '@/components/Navigation'
import { formatPrice } from '@/lib/utils'

interface OrderItem {
    id: number
    product_id: number
    product_name: string
    quantity: number
    price_at_purchase: number
}

interface Order {
    id: number
    total_amount: number
    status: string
    created_at: string
    shipping_name: string
    shipping_city: string
    order_items: OrderItem[]
}

export default function OrdersClient() {
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            const { data, error } = await supabase
                .from('orders')
                .select(`
          id, total_amount, status, created_at, shipping_name, shipping_city,
          order_items ( id, product_id, product_name, quantity, price_at_purchase )
        `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (!error && data) {
                setOrders(data as Order[])
            }
            setLoading(false)
        }

        fetchOrders()
    }, [router])

    if (loading) {
        return (
            <>
                <Navigation />
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <p className="text-gray-500">Memuat riwayat pesanan...</p>
                </main>
            </>
        )
    }

    return (
        <>
            <Navigation />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold mb-8">Riwayat Pesanan</h1>

                {orders.length === 0 && <p className="text-gray-500">Belum ada pesanan.</p>}

                <div className="space-y-6">
                    {orders.map((order, index) => (
                        <div key={order.id} className="border rounded-lg p-6 bg-white text-black">
                            <div className="flex justify-between items-start mb-4 pb-4 border-b">
                                <div>
                                    <p className="font-semibold">Order {orders.length - index}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                                <span className="text-xs font-medium px-3 py-1 bg-green-100 text-green-800 rounded-full">
                                    {order.status}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                {order.order_items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>{item.product_name} <span className="text-gray-500">x{item.quantity}</span></span>
                                        <span className="font-medium">{formatPrice(item.price_at_purchase * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between pt-3 border-t">
                                <span className="font-bold">Total</span>
                                <span className="font-bold">{formatPrice(order.total_amount)}</span>
                            </div>

                            <p className="text-xs text-gray-400 mt-2">
                                Dikirim ke: {order.shipping_name}, {order.shipping_city}
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        </>
    )
}