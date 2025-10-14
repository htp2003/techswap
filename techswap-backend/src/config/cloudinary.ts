import { v2 as cloudinary } from 'cloudinary';

// Hàm khởi tạo config (gọi khi cần)
export const initCloudinary = () => {
    if (!cloudinary.config().cloud_name) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        console.log('☁️  Cloudinary initialized:', {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'MISSING'
        });
    }

    return cloudinary;
};

export default cloudinary;