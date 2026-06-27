'use client'

import { useRouter } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'

export default function SplashPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-6">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            SSR E-COMMERCE
          </h1>
          <p className="text-gray-600 mb-8">
            Temukan semua yang kamu butuhkan dalam satu tempat.
          </p>

          {/* CTA */}
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Mulai Belanja
          </button>
        </div>
      </div>
    </main>
  )
}