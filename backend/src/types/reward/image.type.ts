

export interface rewardImageResponse {
    id: number
    reward_id: number
    image_url: string
    is_primary: boolean
    sort_order: number
    created_at: string
    updated_at: string
}

export interface rewardImageInput {
    reward_id: number
    image_url: string
    is_primary: boolean
    sort_order: number
}