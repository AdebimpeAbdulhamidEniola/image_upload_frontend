import { DropzoneRootProps } from "react-dropzone";
import { DropzoneInputProps } from "react-dropzone";

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

export interface UploadBoxProps {
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T
  getInputProps:  <T extends DropzoneInputProps>(props?: T) => T
  isDragActive: boolean
}

export interface UploadedImageDisplayProps {
  imageUrl: string;
}

export interface ImageUploadData {
  imageURL: string;
}

export interface ImageUploadResponse {
  status: number;
  message: string;
  data: ImageUploadData;
}

export type Theme = 'light' | 'dark';

export interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}
