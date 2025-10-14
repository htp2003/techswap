import { initCloudinary } from '../config/cloudinary';
import { AppError } from '../middleware/errorHandler';

export const uploadToCloudinary = async (
    fileBuffer: Buffer,
    folder: string = 'techswap/products'
): Promise<string> => {
    // Khởi tạo cloudinary trước khi upload
    const cloudinary = initCloudinary();

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'auto',
                transformation: [
                    { width: 1200, height: 1200, crop: 'limit' },
                    { quality: 'auto:good' }
                ]
            },
            (error, result) => {
                if (error) {
                    console.error('❌ Cloudinary upload error:', error);
                    reject(new AppError('Failed to upload image: ' + error.message, 500));
                } else {
                    console.log('✅ Uploaded:', result!.secure_url);
                    resolve(result!.secure_url);
                }
            }
        );

        uploadStream.end(fileBuffer);
    });
};

export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
    try {
        const cloudinary = initCloudinary();
        const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
    }
};