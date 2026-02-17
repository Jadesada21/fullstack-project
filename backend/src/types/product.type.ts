export type RoastLevel = 'light' | 'medium' | 'dark'

export interface ProductResponse {
    id: number
    name: string
    description: string
    short_description: string
    price: number
    stock: number
    category_id: number
    roast_level: RoastLevel
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface CreateProductInput {
    name: string
    description: string
    short_description: string
    price: number
    stock: number
    category_id: number
    roast_level: RoastLevel
}

