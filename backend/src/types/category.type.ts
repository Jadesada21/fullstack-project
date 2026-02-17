

export interface CategoryResponse {
    id: number
    name: string
    parent_id: number | null
    created_at: string
    updated_at: string
}

export interface CreateCategoryInput {
    name: string
    parent_id?: number | null
}

