import { supabase } from '@/lib/supabase'
import Navigation from '@/components/Navigation'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types/product'
import { notFound } from 'next/navigation'
import Link from 'next/link'

// FORCE SSR
export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ category: string }>
}

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

export default async function CategoryPage({ params }: PageProps) {
    const { category } = await params

    const decodedCategory = decodeURIComponent(category)

    if (!categories.includes(decodedCategory)) {
        notFound()
    }

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', decodedCategory)
        .order('created_at', { ascending: false })

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
                {/* Category Header */}
                <div className="mb-12">
                    <nav className="text-sm text-gray-300 mb-4">
                        <Link href="/" className="hover:text-gray-400">
                            Home
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium">{decodedCategory}</span>
                    </nav>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {decodedCategory}
                    </h1>

                    <p className="text-gray-400">
                        {products?.length || 0} products available
                    </p>
                </div>

                {/* Category Filter Chips */}
                <div className="mb-8 overflow-x-auto">
                    <div className="flex space-x-3 pb-4">
                        {categories.map((cat) => (
                            <Link
                                key={cat}
                                href={`/categories/${cat}`}
                                className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition ${cat === decodedCategory
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product: Product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-xl text-gray-600 mb-4">
                            No products found in this category
                        </p>
                        <Link
                            href="/"
                            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition inline-block"
                        >
                            View All Products
                        </Link>
                    </div>
                )}

                {/* Category Description (Optional) */}
                <div className="mt-16 bg-gray-50 rounded-lg p-8">
                    <h2 className="text-2xl font-bold mb-4 text-black">About {decodedCategory}</h2>
                    <p className="text-gray-600 leading-relaxed">
                        {getCategoryDescription(decodedCategory)}
                    </p>
                </div>
            </main>
        </>
    )
}

function getCategoryDescription(category: string): string {
    const descriptions: Record<string, string> = {
        'Automotive': 'Discover high-quality automotive products including car accessories, maintenance tools, and performance parts. Keep your vehicle running smoothly with our curated selection of automotive essentials.',
        'Beauty': 'Explore our premium beauty collection featuring skincare, makeup, haircare, and wellness products. Find everything you need for your daily beauty routine from trusted brands.',
        'Books': 'Dive into our extensive book collection covering fiction, non-fiction, educational materials, and more. Whether you\'re a casual reader or a bookworm, find your next great read here.',
        'Electronics': 'Shop the latest electronics including smartphones, laptops, tablets, and accessories. Stay connected and productive with cutting-edge technology at competitive prices.',
        'Fashion': 'Express your style with our fashion collection featuring clothing, footwear, and accessories for all occasions. From casual wear to formal attire, find pieces that match your personality.',
        'Food & Beverage': 'Indulge in our selection of premium food and beverage products. From gourmet snacks to healthy options, discover flavors that delight your taste buds.',
        'Home & Living': 'Transform your living space with our home essentials. Find everything from furniture to decorative items that make your house feel like home.',
        'Medical': 'Prioritize your health with our medical and wellness products. From first aid supplies to health monitoring devices, we\'ve got you covered.',
        'Sports': 'Get active with our sports and fitness equipment. Whether you\'re a beginner or a pro athlete, find gear that helps you reach your fitness goals.',
        'Toys': 'Bring joy to children with our toy collection. From educational toys to action figures, find safe and fun products for kids of all ages.'
    }

    return descriptions[category] || `Explore our ${category} collection and find the perfect products for your needs.`
}