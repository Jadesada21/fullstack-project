export type Role = "admin" | "customer"

export interface CreateCustomerInput {
    username : string
    password : string
    email : string
    first_name : string
    last_name : string
    role :Role
}

export interface CustomerResponse {
    id : number
    username : string
    password : string
    email : string
    first_name : string
    last_name : string
    role :Role
    is_active : boolean
    total_points : number
    created_at : Date
    updated_at : Date
}