import {IResponse} from "../types/IResponse"

export function createResponse<T>(body: T): IResponse<T> {
    return {
        content: body
    }
}
