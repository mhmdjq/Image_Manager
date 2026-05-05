export interface ImageResponseDto {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  width: number;
  height: number;
  overlayText?: string;
  createdAt: string;
}

const API_BASE = "http://localhost:5000/api/Images";

export const imageApi = {
  getAll: async (): Promise<ImageResponseDto[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Failed to fetch images");
    return res.json();
  },

  upload: async (formData: FormData): Promise<ImageResponseDto> => {
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  },
};