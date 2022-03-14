export class ResponseDto {
    meta: Meta
    data: IData
    static ok(data: IData, request_id?: string): ResponseDto {
        const res = new ResponseDto()
        res.meta = Meta.success(request_id)
        res.data = data
        return res
    }

    static err(code: string ,request_id?: string): ResponseDto {
        const res = new ResponseDto()
        res.meta = Meta.err(code, request_id)
        return res
    }
}

export class Meta {
    request_id: string
    code: string
    message?: string
    query: QueryResponse
    static success(request_id: string): Meta {
        const mt = new Meta()
        mt.code = "200"
        mt.message= "ok"
        mt.request_id = request_id
        return mt
    }

    static err(code: string,request_id:string): Meta {
        const mt = new Meta()
        mt.code = code
        mt.request_id = request_id
        return mt
    }
}

export interface QueryResponse {
    totalRecords: number
    totalPages: number
    page: number
    limit: number
    data: Array<any>
}
   

export interface IData {

}

