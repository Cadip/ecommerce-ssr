import { supabase } from '@/lib/supabase'
import Navigation from '@/components/Navigation'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types/product'

// FORCE SSR
export const dynamic = 'force-dynamic'

export default async function HomePage() {
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600">Error loading products: {error.message}</p>
            </div>
        )
    }

    return (
        <>
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        ALL YOUR FAVORITES
                        <br />
                        IN ONE PLACE
                    </h1>
                    <p className="text-white">
                        Explore our curated range of products to elevate every part of your life.
                    </p>
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <p className="text-sm text-white">
                            Showing {products?.length} products
                        </p>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products?.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </main>
        </>
    )
}