export class AppError extends Error {
    public statusCode: number
    public status: string

    constructor(message: string, statusCode: number) {
        super(message)

        this.statusCode = statusCode
        this.status = statusCode >= 400 && statusCode < 500 ? "Fail" : "Error"

        Object.setPrototypeOf(this, AppError.prototype)

        Error.captureStackTrace(this)
    }
}