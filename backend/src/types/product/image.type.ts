

export interface ProductImageResponse {
    id: number
    product_id: number
    image_url: string
    is_primary: boolean
    sort_order: number
    created_at: string
    updated_at: string
}

export interface ProductImageInput {
    image_url: string
    is_primary: boolean
    sort_order: number
}