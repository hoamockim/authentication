import { Controller, Get, Header, Scope } from "@nestjs/common"
import { Route } from "src/route"
import { ResponseDto } from "./dto"

@Controller({
    path: Route.URLV1,
    scope: Scope.REQUEST
})
export class AppController {
    constructor(){}

    @Get("/health-check")
    @Header('Content-Type', 'application/json')
    get(): ResponseDto {
        return ResponseDto.ok({});
    }
}