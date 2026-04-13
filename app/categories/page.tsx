import { supabase } from '@/lib/supabase'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import Image from 'next/image'

// FORCE SSR
export const dynamic = 'force-dynamic'

const categories = [
    { name: 'Automotive', image: 'automotive.jpg' },
    { name: 'Beauty', image: 'beauty.jpg' },
    { name: 'Books', image: 'books.jpg' },
    { name: 'Electronics', image: 'electronics.jpg' },
    { name: 'Fashion', image: 'fashion.jpg' },
    { name: 'Food & Beverage', image: 'food_beverage.jpg' },
    { name: 'Home & Living', image: 'home_living.jpg' },
    { name: 'Medical', image: 'medical.jpg' },
    { name: 'Sports', image: 'sports.jpg' },
    { name: 'Toys', image: 'toys.jpg' },
]

export default async function CategoriesPage() {
    const categoryCounts = await Promise.all(
        categories.map(async (cat) => {
            const { count } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('category', cat.name)

            return { ...cat, count: count || 0 }
        })
    )

    return (
        <>
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Shop by Category
                    </h1>
                    <p className="text-gray-400">
                        Explore our curated collections across all categories
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {categoryCounts.map((category) => (
                        <Link
                            key={category.name}
                            href={`/categories/${category.name}`}
                            className="group"
                        >
                            <div className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="relative aspect-square bg-gray-100">
                                    <Image
                                        src={`https://mdrdpxfnboirmtwqtzmi.supabase.co/storage/v1/object/public/product-images/${category.image}`}
                                        alt={category.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        unoptimized
                                    />
                                </div>
                                <div className="p-4 text-center">
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {category.count} products
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </>
    )
}