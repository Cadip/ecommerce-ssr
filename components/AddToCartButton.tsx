'use client'

import { Product } from '@/types/product'
import { useCartStore } from '@/store/cartStore'
import { ShoppingBag } from 'lucide-react'
import { useState } from 'react'

export default function AddToCartButton({ product }: { product: Product }) {
    const addItem = useCartStore((state) => state.addItem)
    const [added, setAdded] = useState(false)

    const handleAddToCart = () => {
        addItem(product)
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
            <ShoppingBag className="w-5 h-5" />
            <span>{added ? 'Added to Cart!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>
    )
}