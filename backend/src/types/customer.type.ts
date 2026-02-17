export type Role = "admin" | "customer"

export interface CreateCustomerInput {
    username: string
    password: string
    email: string
    first_name: string
    last_name: string
    role: Role
    phone_num: string
}

export interface CustomerResponse {
    id: number
    username: string
    password: string
    email: string
    first_name: string
    last_name: string
    role: Role
    is_active: boolean
    phone_num: string
    total_points: number
    created_at: string
    updated_at: string
}

export interface UpdateCustomerPhoneInput {
    phone_num: string
}

