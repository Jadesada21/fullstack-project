export type Status = 'pending' | 'confirm' | 'cancelled'

export interface RedeemResponse {
    id: number
    user_id: number
    reward_id: number
    status: Status
    points_used: number
    created_at: string
}

export interface CreateRedeemInput {
    items: RedeemItemInput[]
    loginUserId: number
}


export interface RedeemItemInput {
    reward_id: number
    quantity: number
}