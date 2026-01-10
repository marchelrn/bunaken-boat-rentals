const CLOUDINARY_CLOUD_NAME = "donzu56gt";
const CLOUDINARY_UPLOAD_PRESET = "bunaken_uploads";

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  original_filename: string;
}

export interface CloudinaryError {
  message: string;
  error?: {
    message: string;
  };
}

/**
 * Upload image to Cloudinary using unsigned upload
 * @param file - File to upload
 * @param folder - Optional folder name in Cloudinary
 * @returns Promise with upload response
 */
export const uploadToCloudinary = async (
  file: File,
  folder: string = "bunaken-packages"
): Promise<CloudinaryUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData: CloudinaryError = await response.json();
    throw new Error(
      errorData.error?.message || errorData.message || "Upload failed"
    );
  }

  return response.json();
};

/**
 * @param publicId - Public ID of the image to delete
 */
export const deleteFromCloudinary = async (
  _publicId: string
): Promise<void> => {
  throw new Error("Delete operation requires backend API");
};

/**
 * Get optimized image URL with transformations
 * @param publicId - Public ID or full URL
 * @param options - Transformation options
 */
export const getOptimizedImageUrl = (
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: "auto" | number;
    format?: "auto" | "webp" | "jpg" | "png";
  } = {}
): string => {
  if (url.includes("cloudinary.com")) {
    const { width, height, quality = "auto", format = "auto" } = options;

    const transforms: string[] = [];
    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);
    transforms.push(`q_${quality}`);
    transforms.push(`f_${format}`);

    const transformStr = transforms.join(",");
    return url.replace("/upload/", `/upload/${transformStr}/`);
  }

  return url;
};

/**
 */
export const getCloudName = (): string => CLOUDINARY_CLOUD_NAME;
