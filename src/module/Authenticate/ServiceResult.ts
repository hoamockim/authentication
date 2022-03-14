export class SignInData {
    accessToken: string
}

export enum ResultType {
    Success,
    Error
}

export class ServiceResult {
    message: string
    type: ResultType
    data: any

    constructor(type: ResultType, message: string, data: {}) {
        this.type = type
        this.message = message
        this.data = data
    }
}


export const OK = "OK"
