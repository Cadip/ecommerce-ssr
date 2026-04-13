export interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    image_url: string
    rating: number
    stock: number
    created_at: string
    updated_at: string
}

export interface CartItem extends Product {
    quantity: number
}

export interface OrderData {
    orderId: string
    name: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    items: CartItem[]
    total: number
    createdAt: string
}