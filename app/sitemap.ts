import { supabase } from '@/lib/supabase'
import { MetadataRoute } from 'next'

const BASE_URL = 'https://ecommerce-ssr-five.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { data: products } = await supabase
        .from('products')
        .select('id')

    const { data: categories } = await supabase
        .from('products')
        .select('category')

    const productUrls = products?.map(p => ({
        url: `${BASE_URL}/products/${p.id}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    })) ?? []

    const categoryUrls = categories?.map(c => ({
        url: `${BASE_URL}/categories/${encodeURIComponent(c.category)}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
    })) ?? []

    return [
        {
            url: `${BASE_URL}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/home`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        ...productUrls,
        ...categoryUrls,
    ]
}