import { Dogs } from "./dogs.model";

export interface DogsResponse {
    message: Dogs;
    status: string
}