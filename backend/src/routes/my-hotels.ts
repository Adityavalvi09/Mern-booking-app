import express, { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary'; // Import the Cloudinary configuration
import Hotel from '../models/hotel';
import { HotelType } from '../shared/types';
import verifyToken from '../middleware/auth';
import { body } from 'express-validator';

const router = express.Router();
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fieldNameSize: 5 * 1024 * 1024,
    },
});

router.post(
    '/',
    verifyToken,
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('city').notEmpty().withMessage('City is required'),
        body('country').notEmpty().withMessage('Country is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('type').notEmpty().withMessage('Hotel type is required'),
        body('pricePerNight').notEmpty().isNumeric().withMessage('Price per night is required and must be a number'),
        body('facilities').notEmpty().isArray().withMessage('Facilities are required'),
    ],
    upload.array('imageFiles', 6),
    async (req: Request, res: Response) => {
        try {
            const imageFiles = req.files as Express.Multer.File[];
            const newHotel: HotelType = req.body;

            const imageUrls = await uploadImages(imageFiles);

            newHotel.imageUrls = imageUrls;
            newHotel.lastUpdated = new Date();
            newHotel.userId = req.userId;

            const hotel = new Hotel(newHotel);
            await hotel.save();

            res.status(201).send(hotel);
        } catch (e) {
            console.log('Error creating hotel', e);
            res.status(500).json({ message: 'Something went wrong' });
        }
    }
);

router.get("/" , verifyToken , async(req:Request , res: Response)=>{
  
    try {
        const hotels = await Hotel.find({userId: req.userId});
        res.json(hotels);
     
    }catch(error){
        res.status(500).json({message : "Error fetching hotels"})
    }

})

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id.toString();
    try {
      const hotel = await Hotel.findOne({
        _id: id,
        userId: req.userId,
      });
      res.json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Error fetching hotels" });
    }
  });


  router.put("/:hotelId" , verifyToken , upload.array("imageFiles"),async (req: Request , res:Response)=>{
        try{
            const updateHotel: HotelType = req.body;
            updateHotel.lastUpdated=new Date();

            const hotel = await Hotel.findOneAndUpdate({
                _id: req.params.hotelId,
                userId : req.userId,
            },
            updateHotel,
            {new:true}
        );
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
          }

          const files = req.files as Express.Multer.File[];
          const updatedImageUrls = await uploadImages(files);

          hotel.imageUrls = [
            ...updatedImageUrls,
            ...(updateHotel.imageUrls || []),
          ];
          
          await hotel.save();
          res.status(201).json(hotel)

        }catch(error){
            res.status(500).json({message : "something went wrong"})
        }
  })


async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = image.buffer.toString('base64');
        const dataURI = `data:${image.mimetype};base64,${b64}`;
        const uploadResponse = await cloudinary.uploader.upload(dataURI);
        return uploadResponse.secure_url;
    });

    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}

export default router;