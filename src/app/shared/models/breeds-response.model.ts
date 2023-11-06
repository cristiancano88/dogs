import { Breeds } from "./breeds.model";

export interface BreedsResponse<T> {
    message: T;
    status: string
}