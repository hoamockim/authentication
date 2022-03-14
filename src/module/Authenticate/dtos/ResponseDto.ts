import { HttpStatus } from "@nestjs/common"


export class ResponseDto {
    code: number
    message: string
    data: any

    public static error(code: number, message: string): ResponseDto {
        const res = new ResponseDto()
        res.code = code
        res.message = message
        return res
    }

    public static success(data: any): ResponseDto {
        const res = new ResponseDto()
        res.code =  HttpStatus.OK
        res.data = data
        return res
    }
}