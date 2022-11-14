export interface IAuthedRequest<T> {
    sessionId: string,
    content: T
}

export interface IBaseRequest<T> {
    content: T
}
