export interface DTO<T>
{
}
export interface IMapper<T, U extends DTO<T>>
{
    to(obj : T) : U
    from(dto: U) : T
}