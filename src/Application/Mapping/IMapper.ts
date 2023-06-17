export interface DTO<T>
{
    
}

export interface IMapper<T, U>
{
    to(obj: T) : U
    from(mapped: U) : T
}