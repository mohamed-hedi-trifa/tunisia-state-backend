import prisma from "../lib/prisma.js"
import jwt from "jsonwebtoken"
export const getPosts = async (req, res) => {

    const query = req.query;
    
    try {
        const posts = await prisma.post.findMany({
            where: {
              city: query.city && query.city !== "" ? query.city : undefined,
              type: query.type && query.type !== "" ? query.type : undefined,
              property: query.property && query.property !== "" ? query.property : undefined,
              bedroom: query.bedroom ? parseInt(query.bedroom) : undefined,
              price: {
                gte: query.minPrice ? parseInt(query.minPrice) : 0, // Default to 0 if not provided
                lte: query.maxPrice ? parseInt(query.maxPrice) : 100000, // Default to 100000 if not provided
              },
            },
          });
          
          
        res.status(200).json(posts)
   
        // console.log("before")
        // setTimeout( () => {
        //     console.log("after")
            
        // }, 3000);
        

    }catch(err){
        console.log(err)
        res.status(500).json({message: "failed to get posts!"})
    }
}

export const getPost = async (req, res) => {
  
    const id = req.params.id;

    try{
     
        const post = await prisma.post.findUnique({
            where:{id},
            include: {
                postDetail: true,
                user: {
                    select: {
                        username:true,
                        avatar:true
                    }

                }
            }
        });
       
        let userId;
        const token = req.cookies?.token;

        if (!token) {
            userId = null;
        }else {
           jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
               if(err)
               {
                   userId = null;
               }
               else {
                  userId = payload.id
               }
           })
        }

     
        const saved = await prisma.savedPost.findUnique({
            where: {
                userId_postId: {
                    postId:id, 
                    userId
                }
            }
        })


        res.status(200).json({...post, isSaved: saved ? true : false})

    }catch(err){
        console.log(err)
        res.status(500).json({message: "failed to get post!"})
    }
}


export const addPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;
    try {
        const newPost = await prisma.post.create({
            data: {
                ...body.postDat, 
                userId: tokenUserId,
                postDetail: {    
                    create: body.postDetail, 
                },
            },
        });
        res.status(200).json(newPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "failed to add post!" });
    }
};


export const updatePost = async (req, res) => {
    try{
        res.status(500).json()
    }catch(err){
        console.log(err)
        res.status(500).json({message: "failed to update post!"})
    }
}

export const deletePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserid = req.userId
    try{
        const post = await prisma.post.findUnique ({
            where:{id}
        })
        if(post.userId !== tokenUserid) {
            return  res.status(403).json({message: "Not Authorized!"})
        }

        await prisma.post.delete({
            where:{id}
        });
        res.status(200).json({ message :"Post deleted"})
    }catch(err){
        console.log(err)
        res.status(500).json({message: "failed to delete post!"})
    }
}
