export interface UploadedFile {
    file: File;
    preview: string
}

export interface APIResponse<T> {
    status: number,
    message: string,
    data: T
}

export interface Payload {
    originalname: string,
    path: string,
    mimetype: string,
    filetype: string
}