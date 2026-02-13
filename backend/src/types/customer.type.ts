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

export interface UpdateCustomerAddressInput {
    address_line?: string
    province?: string
    postal_code?: string
    country?: string
    district?: string
    subdistrict?: string
    is_default?: boolean
}

export interface AddCustomerAddressByIdInput {
    address_line: string
    province: string
    postal_code: string
    country: string
    district: string
    subdistrict: string
    is_default: boolean
}

export interface CustomerAddressResponse {
    id: number
    customer_id: number
    address_line: string
    province: string
    postal_code: string
    country: string
    district: string
    subdistrict: string
    is_default: boolean
    created_at: string
    updated_at: string
}