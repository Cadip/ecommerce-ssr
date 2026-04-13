import { supabase } from '@/lib/supabase'
import Navigation from '@/components/Navigation'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/components/AddToCartButton'

// FORCE SSR
export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { id } = await params

    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !product) {
        notFound()
    }

    return (
        <>
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image */}
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>

                    {/* Product Info */}
                    <div>
                        <p className="text-sm text-gray-300 uppercase tracking-wide mb-2">
                            {product.category}
                        </p>

                        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

                        <div className="flex items-center space-x-4 mb-6">
                            <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
                            <div className="flex items-center space-x-1">
                                <span className="text-yellow-400">⭐</span>
                                <span className="text-lg">{product.rating.toFixed(1)}</span>
                            </div>
                        </div>

                        <p className="text-gray-200 mb-8">{product.description}</p>

                        <div className="mb-8">
                            <p className="text-sm text-gray-400 mb-2">
                                Stock: <span className="font-semibold">{product.stock} available</span>
                            </p>
                        </div>

                        <AddToCartButton product={product} />
                    </div>
                </div>
            </main>
        </>
    )
}