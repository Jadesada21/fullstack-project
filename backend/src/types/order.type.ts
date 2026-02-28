export type Status = "completed" | 'cancelled' | 'pending'

export interface OrderResponse {
    id: number
    user_id: number
    order_number: string
    total_price: number
    earned_points: number
    status: Status
    created_at: string
    updated_at: string
}

export interface CreateOrderInput {
    items: OrderItemInput[]
    loginUserId: number
}

export interface OrderItemInput {
    product_id: number
    quantity: number
}
