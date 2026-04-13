'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/product'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        addItem(product)
    }

    return (
        <Link href={`/products/${product.id}`} className="group">
            <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Image */}
                <div className="relative aspect-square bg-gray-100">
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                    />

                    {/* Quick Add to Cart */}
                    <button
                        onClick={handleAddToCart}
                        className="absolute bottom-4 right-4 bg-gray-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-600 hover:text-white"
                    >
                        <ShoppingBag className="w-5 h-5" />
                    </button>
                </div>

                {/* Info */}
                <div className="p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        {product.category}
                    </p>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                        {product.name}
                    </h3>

                    <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-gray-900">
                            {formatPrice(product.price)}
                        </p>
                        <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-sm text-gray-600">
                                {product.rating.toFixed(1)}
                            </span>
                        </div>
                    </div>

                    {product.stock < 10 && product.stock > 0 && (
                        <p className="text-xs text-orange-600 mt-2">
                            Only {product.stock} left!
                        </p>
                    )}

                    {product.stock === 0 && (
                        <p className="text-xs text-red-600 mt-2">Out of stock</p>
                    )}
                </div>
            </div>
        </Link>
    )
}