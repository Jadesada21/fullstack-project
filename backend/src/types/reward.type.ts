

export interface RewardResponse {
    id: number
    name: string
    description: string
    short_description: string
    price: number
    stock: number
    category_id: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface CreateRewardInput {
    name: string
    description: string
    short_description: string
    price: number
    stock: number
    category_id: number

}

