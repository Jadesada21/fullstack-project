

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

export interface DeleteProductImagesInput {
    image_ids: number[]
}

export interface setPrimaryImageInput {
    image_id: number
}

export interface setSortOrderImageInput {
    image_ids: number[]
}

export interface UploadImageBody {
    images: ProductImageInput[]
}