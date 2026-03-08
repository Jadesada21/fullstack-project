export type Role = "admin" | "customer" | "guest"

export interface CreateUsersInput {
    username: string
    password: string
    email: string
    first_name: string
    last_name: string
    role: Role
    phone_num: string
}

export interface UsersResponse {
    id: number
    username: string
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

export interface UpdateUsersPhoneInput {
    first_name: string
    last_name: string
    phone_num: string
}

