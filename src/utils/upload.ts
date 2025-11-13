import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import config from "config";
import { Readable } from "stream";
import sharp from "sharp";

// ✅ Define Cloudinary result type
export interface CloudinaryUploadResult {
  url: string;
  public_id: string;
}

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: config.get<string>("CLOUDINARY_CLOUD_NAME"),
  api_key: config.get<string>("CLOUDINARY_API_KEY"),
  api_secret: config.get<string>("CLOUDINARY_API_SECRET"),
});

// ✅ Use memory storage (fast)
const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
];

// ✅ Multer setup
export const uploader = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, and PDF files are allowed!"));
    }
    cb(null, true);
  },
});

// ✅ Upload to Cloudinary directly from buffer
export const uploadfile = async (
  fileBuffer: Buffer,
  folder?: string
): Promise<CloudinaryUploadResult | null> => { // 👈 explicit return type
  try {
    const isPdf = Buffer.from(fileBuffer.subarray(0, 4)).toString() === "%PDF";
      let processedBuffer = fileBuffer;
    if (!isPdf) {
      processedBuffer = await sharp(fileBuffer)
        .resize({ width: 1000, withoutEnlargement: true }) // max 1000px width
        .jpeg({ quality: 80 }) // convert/compress to JPEG with 80% quality
        .toBuffer();
    }
    return await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: isPdf ? "raw" : "auto",
          folder: folder || "uploads",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload failed:", error.message);
            return reject(error);
          }

          if (!result?.secure_url || !result?.public_id) {
            return reject(new Error("Invalid Cloudinary response"));
          }

          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      // Convert buffer to readable stream and pipe to Cloudinary
      const stream = Readable.from(fileBuffer);
      stream.pipe(uploadStream);
    });
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
};
