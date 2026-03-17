import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.COULDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        console.log("File uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    }
    catch (error) {
        fs.unlinkSync(localFilePath);
        console.log("Error uploading file on cloudinary", error.message);
        return null;
    }
}

export {uploadOnCloudinary};