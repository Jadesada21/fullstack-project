

export interface PromoCodeTypeResponse {
    id: number
    code: string
    points: number
    max_usage: number
    used_count: number
    is_active: boolean
    created_at: string
}

export interface PromoCodeTypeInput {
    code: string
    points: number
    max_usage: number
}