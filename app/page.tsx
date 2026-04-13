'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [name, setName] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (name.trim()) {
      localStorage.setItem('userName', name.trim())
      router.push('/home')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-gray-900">
              Welcome to SSR E-COMMERCE
            </h1>
            <p className="text-gray-600">
              Enter your name to continue shopping
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>
          </form>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              localStorage.setItem('userName', 'Guest')
              router.push('/home')
            }}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Continue as Guest →
          </button>
        </div>
      </div>
    </main>
  )
}