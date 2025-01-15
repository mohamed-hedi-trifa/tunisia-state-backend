import prisma from "../lib/prisma.js"

import bcryp from "bcrypt"

export const getUsers = async (req, res) => {
    try
    {   
        const users = await prisma.user.findMany()
        res.status(200).json(users)

    }catch(err){
        console.log(err)
        res.status(500).json({message: "failed to get users!"})
    }
}

export const getUser = async (req, res) => {
    const id = req.params.id;
    try
    {

        const users = await prisma.user.findUnique({
            where:{id}
        });
        res.status(200).json(users)

    }catch(err){
        console.log(err)
        res.status(500).json({message: "failed to get users!"})
    }
}

export const updateUser = async (req, res) => {

    const id = req.params.id;

    const tokenUserId = req.userId
    const {password, avatar, ...inputs} = req.body;
    const body = req.body;

    if(id !== tokenUserId ) {
        return  res.status(403).json({message: "Not Authorized!"})
    }

    let udpatedPassword = null
    try
    {
        if(password){
            udpatedPassword = await bcryp.hash(password, 10)
        }

        const updatedUser = await prisma.user.update({
            where:{id},
            data:{
                ...inputs, 
                ...(udpatedPassword && {password: udpatedPassword}),
                ...(avatar && {avatar})
            },

        })

        const {password: userPassword, ...rest} = updatedUser
        res.status(200).json(rest)

    }catch(err){
        console.log(err)
        res.status(500).json({message: "failed to get users!"})
    }
}

export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId


    try
    {

        await prisma.user.delete({
            where:{id}
        });
        res.status(200).json({ message :"User deleted"})

    }catch(err){
        console.log(err)
        res.status(500).json({message: "failed to get users!"})
    }
}