
import asyncHandler from '../utils/asyncHandler.js'
import { Subscription } from "../models/subscription.models.js"
import { User } from "../models/user.models.js"
import apiError from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js" 


const toggglesubscription = asyncHandler(async(req,res)=>{
    //check krenge ki ham login hai ya nah -> middleware krdega
    //uski id lenge params se and check krna hai ki jo channel hai uski subscriber me m hu ya nahi
    //to basically sabse phle muhje documents me apne app ko find out krna hia
     // maych krna hai ki vo channel wha par exists krta hai ya nahi bbs

     /*
     const {channelId} = req.params
     const registeredChannel = await User.findById(channelId)
     if(!registeredChannel){
        throw new apiError(400,"channel which u have subscribed haven not registered")
     }

     const objectsIamIncluded = await Subscription.aggregate([
        {
            $match:{
                subscriber:req.user.username,
                channel:registeredChannel.username
            }
        },
     ])
     if(!objectsIamIncluded){
       return res.status(201).json(
        new apiResponse(
            200,
            false,
            "User have unsubscribed the channel"
        )
)}
     else{
        return res.status(200).json(
            new apiResponse(
                201,
                true,
                "User have subscribed the channel"
            )
    )}
     }
     */
     

    }
)

const subscribeToaChannel = asyncHandler(async(req,res)=>{
     // sabse phle me lunga params se id jo mujhe krna hai subscribe
     //me check krunga ki vo exist krta hai ya nahi
     //fir me check krunga ki vo user phle se subscribed hai ya nahi us users se
     //fir me use subscriebe krunga abb me id store krunga'
     // and then me abb push krunga array me


     const {channelId} = req.params;

     const registeredUser = await User.findById(channelId)
     if(!registeredUser){
         throw new apiError(400,"channel which u are trying to acces for ubscribe doesnot exist")
      }

    const userExisted =  await Subscription.find(
        {
            subscriber:req.user?._id,
            channel:channelId,
        }
        )
        // console.log(userExisted)

        if(userExisted.length >0){
        // throw new apiError(400,"you have already subscribed to a channel");
         throw new apiError(200,"you have already subscribed")

        }

        const subscriberr = await User.findById(req.user?._id)
        const channel = await User.findById(channelId)


       const subcribed =  await Subscription.create({
            subscriber:subscriberr,
            channel:channel,
        })

        if(!subcribed){
        throw new apiError(400,"there is a error when u are trying to subscribe to a channel");

        }
        

        await User.findByIdAndUpdate(
            channelId,
            {
            //   
            $push:{
                subscriber:subscriberr
            }},
            {new:true}
        )

        await User.findByIdAndUpdate(
            req.user?._id,
            {
                $push:{
                    subscribeTo:channel
                }
            },
            {new:true}
        )


        return res.status(200).json(
            new apiResponse(
                200,
                subcribed,
                "succesfully subscribed channel"
            ) 
         )
})

const unsubscribeaChannel = asyncHandler(async(req,res)=>{
    const {channelId} = req.params

    const registeredUser = await User.findById(channelId)
    if(!registeredUser){
        throw new apiError(400,"channel which u are trying to acces for unsubscribe doesnot exist")
     }

     console.log(registeredUser?._id);
     
     const unsubscribe = await Subscription.findOneAndDelete({
        channel: registeredUser._id,
        subscriber: req.user?._id,
      });

      console.log(unsubscribe);

    if(!unsubscribe)
    {
       throw new apiError(400,"unsubscribe failed")
    }

    
    await User.findByIdAndUpdate(
        channelId,
        {
        //   
        $pull:{
            subscriber:channelId
        }},
        {new:true}
    )

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            
                $pull:{
                subscribeTo:registeredUser._id
            },
        },
        {new:true}
    )
 

    
    return res.status(200).json(
       new apiResponse(
           200,
           unsubscribe,
           "succesfully unsubscribed channel"
       )
    )
    


})

const getuserchannelsubscriber = asyncHandler(async(req,res)=>{
    const {subscriberId} = req.params
    const registeredUser = await User.findById(subscriberId)
    if(!registeredUser){
        throw new apiError(400,"subscriber id doesnot exists")
     }


    const user = await Subscription.aggregate([
        {
            $match:{
                channel:registeredUser?._id
            },
        },
        {
            $project:{
                channel:1,




            }
        }
    ])

    return res.status(200).json(
        new apiResponse(
            200,
            user,
            "list pf subscriber found "
        )
     )

})

const getsubscribedchannels = asyncHandler(async(req,res)=>{
    const {channelId} = req.params

    const registeredUser = await User.findById(channelId)
    if(!registeredUser){
        throw new apiError(400,"channel which u are trying to acces for getting list doesnot exist")
     }

     const user = await Subscription.aggregate([
        {
            $match:{
                subscriber:registeredUser?._id
            }
        },
        {
            $project:{
                subscriber:1
            }
        }
    ])

    return res.status(200).json(
        new apiResponse(
            200,
            user,
            "list pf channe i subscribed found "
        )
     )
     
})

export {
    toggglesubscription,
    subscribeToaChannel,
    unsubscribeaChannel,
    getuserchannelsubscriber,
    getsubscribedchannels,

}