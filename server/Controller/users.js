import User from "../Models/userSchema.js";

/* FETCHING PROFILE BY USING ID */
export const getUser = async(req,resp)=>{
    try {
        const {id,myId} = req.params
        const user = await User.findById(id)
        const allUser = await User.find({})
        
        /*CHECK WE ARE FRIENDS OR NOT*/
        const follow = user.friends.includes(myId)
        const suggested = []
        allUser.map((suggest)=>{
            if( suggest?.coursename.toUpperCase() === user?.coursename.toUpperCase() || suggest?.collegename.toUpperCase() === user?.collegename.toUpperCase() ){
                if((suggest._id.equals(myId)) ){
                    suggested.push(suggest);
                }
            }
          });
    
        const formatteSuggested = suggested.map(
          ({_id, username, coursename , profilePic , stream})=>{
            return {_id, username, coursename, profilePic , stream}
          }
        );
        resp.status(201).send({success:true,follow,message:"profile found Successfully",user,suggestions:formatteSuggested});
    } catch (error) {
        resp.status(404).send({success:false,message:error.message})
        console.log("Something Went Wrong");
    }

}

export const getMyProfile = async(req,resp) =>{
    try {

        const user = await User.findById(req.params.id)
        const allUser = await User.find({})
        
        const suggested = []
        allUser.map((suggest)=>{
            if( suggest?.coursename.toUpperCase() === user?.coursename.toUpperCase() || suggest?.collegename.toUpperCase() === user?.collegename.toUpperCase() ){
                if(!(suggest._id.equals(req.params.id)) ){
                    suggested.push(suggest);
                }
            }
          });
    
        const formatteSuggested = suggested.map(
          ({_id, username, coursename , profilePic , stream})=>{
            return {_id, username, coursename, profilePic , stream}
          }
        );
        resp.status(201).send({success:true,message:"profile found Successfully",user,suggestions:formatteSuggested});
    } catch (error) {
        resp.status(404).send({success:false,message:error.message})
        console.log("Something Went Wrong");     
    }
}

// FETCHING MY FRIENDSLIST   // NOT IN WORK
export const getUserFriends = async(req,resp)=>{
    try {
        const { id , myId } = req.params;
        const user = await User.findById(id);
        
        const allFriends = user.friends((item)=>item)
        let weFrieind = false;
        user?.friends?.map((item)=>{
            console.log("comparison ",item._id === myId);
        })
        

        // const formatteFriends = friends.map(
        //     ({_id, username, collegename , coursename , profilePic})=>{
        //         return {_id, username, collegename , coursename, profilePic}
        //     }
        // );
        // resp.status(200).send(formatteFriends)
    } catch (error) {
        resp.status(404).send({success:false,message:error.message})
        console.log("Something Went Wrong");
    }
}

/* UPDATE - ADDING AND REMOVING FRIEND */
export const addRemoveFriends = async(req,resp)=>{
    try {
        
        const { myId , friendId } = req.params
        
        const user = await User.findById(myId)
        const friend = await User.findById(friendId)
    
        /* REMOVING FRIEND AND FROM FRIEND ACCOUNT ME */
        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id)=> id !== friendId)
            friend.friends = friend.friends.filter((id) => id !== myId)
            await user.save();
            await friend.save();
            resp.status(200).send({success:true,follow:false,message:"Friend Removed",user})
        } else {
            /* ADDING FRIEND AND IN FRIEND ACCOUNT ME */
            user.friends.push(friendId)
            friend.friends.push(myId)
            await user.save();
            await friend.save();
            resp.status(200).send({success:true,follow:true,message:"Friend Added",user})
        }
    } catch (error) {
        resp.status(404).send({success:false,message:error.message})
        console.log("Something Went Wrong");
    }
}

// SEARCHING FRIEND BY KEYWORD/USERNAME
export const searchFriend = async(req,resp) =>{
    try {
        const {keyword} = req.params;
        const result = await User.find({
            $or:[
                {username:{$regex:keyword, $options:"i"}},
                {stream:{$regex:keyword, $options:"i"}},
                {coursename:{$regex:keyword, $options:"i"}},
                {collegename:{$regex:keyword, $options:"i"}}
              ]
        });
        console.log("search users : ",result);
        const accounts = result.filter((accound)=>!(accound._id.equals(req.params.id)))
        // console.log("search users : ",accounts);
        resp.status(201).send({success:true,search:accounts})
    } catch (error) {
    console.log("Error in searching product",error);
    resp.status(404).send({
        success:false,
        message:"Something Went Wrong",
        error
    })
    }
}

export const getSuggested = async(req,resp)=>{
    try {
        const allUser = await User.find({});
        const user = await User.findById(req.params.id)
        // FILTERINING THE USERS BY SAME COURSE OR COLLEGE FOR SHOW IN SUGGETIONS
        const suggested = await Promise.all(
        allUser.map((suggest)=>{
            if( suggest.coursename === user.coursename || suggest.collegename === user.collegename || suggest.stream === user.stream ){
                return suggest;
            }
        })
        );

        const formatteSuggested = suggested.map(
            ({_id, username, coursename , profilePic})=>{
                return {_id, username, coursename, profilePic}
            }
        );
        
        resp.status(201).send({ success:true,suggestion:formatteSuggested})
    } catch (error) {
        resp.status(404).send({success:false,message:"suggested use found",error:error.message})
    }
}