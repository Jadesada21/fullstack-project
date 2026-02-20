import { Role } from "./users.type"

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number
                role: Role
            }
        }
    }
}

export { }