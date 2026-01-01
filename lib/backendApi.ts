import { APIResponse } from "@/types";
import { api } from "./api";
import { ImageUploadData } from "@/types";

export const createImage = async(payload: FormData) : Promise<APIResponse<ImageUploadData>> => {
    
    const resp = await api.post("/upload", payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    console.log(process.env.NEXT_PUBLIC_BACKEND_LINK)
    return resp.data
}