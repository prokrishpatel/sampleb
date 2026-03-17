import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiErrors } from "../utils/ApiErros.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponce } from "../utils/ApiResponce.js"

const registerUser = asyncHandler(async (req, res) => {

    const {fullName, email, username, password} = req.body;
    console.log(fullName, email, username, password);


    if([fullName, email, username, password].some(field => field.trim() === "")){
        throw new ApiErrors(400, "All fields are required")
    }


    const existedUser = await User.findOne({
        $or: [
            {username}, {email}
        ]
    });

    if(existedUser){
        throw new ApiErrors(409, "User already exists")
    }


    const avatarLocalPath = req.files.avatar[0]?.path;
    const coverImageLocalPath = req.files.coverImage[0]?.path;

    console.log(avatarLocalPath, coverImageLocalPath);

    if(!avatarLocalPath){
        throw new ApiErrors(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiErrors(400, "Avatar is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || '',
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiErrors(500, "Something went wrong while creating user")
    }

    return res.status(201).json(
        new ApiResponce(200, createdUser, "User registered successfully")
    )
})


export {registerUser}