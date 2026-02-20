export interface UpdateUsersAddressInput {
    address_line?: string
    province?: string
    postal_code?: string
    country?: string
    district?: string
    subdistrict?: string
    is_default?: boolean
}

export interface AddUsersAddressByIdInput {
    address_line: string
    province: string
    postal_code: string
    country: string
    district: string
    subdistrict: string
    is_default: boolean
}

export interface UsersAddressResponse {
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

