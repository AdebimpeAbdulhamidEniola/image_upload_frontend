import { APIResponse } from "@/types";
import { api } from "./api";

export const createImage = async(payload: FormData) : Promise<APIResponse<string>> => {
    
    const resp = await api.post("/upload", payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return resp.data
}