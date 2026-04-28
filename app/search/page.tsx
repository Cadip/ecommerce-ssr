'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navigation from '@/components/Navigation'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types/product'
import { Search, Loader2 } from 'lucide-react'

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            setProducts([])
            setHasSearched(false)
            return
        }

        setLoading(true)
        setHasSearched(true)

        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
                .order('created_at', { ascending: false })

            if (error) throw error

            setProducts(data || [])
        } catch (error) {
            console.error('Search error:', error)
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch(searchQuery)
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchQuery])

    return (
        <>
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Search Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-6">Search Products</h1>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for products, categories, or descriptions..."
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-400 rounded-lg focus:border-gray-600 focus:outline-none text-lg"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        <span className="ml-2 text-gray-400">Searching...</span>
                    </div>
                )}

                {/* Results */}
                {!loading && hasSearched && (
                    <>
                        <div className="mb-6">
                            <p className="text-gray-300">
                                {products.length > 0
                                    ? `Found ${products.length} ${products.length === 1 ? 'result' : 'results'} for "${searchQuery}"`
                                    : `No results found for "${searchQuery}"`
                                }
                            </p>
                        </div>

                        {products.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}

                        {products.length === 0 && searchQuery && (
                            <div className="text-center py-12">
                                <p className="text-xl text-gray-300 mb-4">No products found</p>
                                <p className="text-gray-400 mb-6">
                                    Try different keywords or browse our categories
                                </p>
                                <a
                                    href="/"
                                    className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition inline-block"
                                >
                                    View All Products
                                </a>
                            </div>
                        )}
                    </>
                )}

                {/* Initial State */}
                {!hasSearched && !loading && (
                    <div className="text-center py-12">
                        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-xl text-gray-400 mb-2">Start typing to search</p>
                        <p className="text-gray-300">
                            Search by product name, category, or description
                        </p>
                    </div>
                )}

                {/* Popular Searches */}
                {!hasSearched && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold mb-6">Popular Searches</h2>
                        <div className="flex flex-wrap gap-3">
                            {['Electronics', 'Fashion', 'Beauty', 'Sports', 'Books', 'Toys'].map((term) => (
                                <button
                                    key={term}
                                    onClick={() => setSearchQuery(term)}
                                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition text-black"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </main >
        </>
    )
}