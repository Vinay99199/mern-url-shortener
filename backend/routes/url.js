import express from "express";
import { nanoid } from "nanoid";
import Url from "../models/Url.js";

const router = express.Router();

router.post("/shorter", async(req,res)=>{
    try{
        const {originalUrl }=req.body;
        if (!originalUrl){
            return res.status(400).json({error:"original URL is required"});
        }
        try{
            new URL(originalUrl);
        }catch{
            return res.status(400).json({error:"invalid URL"});
        }
        let shortId;
        let exists= true;
        while(exists){
            shortId=nanoid(7);
            exists = await Url.findOne({shortId});
        }

        const url=await Url.create({
            shortId,originalUrl

        });

        res.json({
            shortId:url.shortId,
            shortUrl:`${process.env.BASE_URL}/${url.shortId}`
        })

        }catch(error){
            console.log(error);
            res.status(500).json({error: "server error"});
        }
})

router.get("/:shortId",async(req,res)=>{
    try{
        const {shortId}=req.params;
        const url = await Url.findOne({shortId});
        if (!url){
            return res.status(404).json({error:"URL not found"});

        }
        url.clicks++;
        await url.save();
        return res.redirect(url.originalUrl);

    }catch(error){
        console.log(error);
        res.status(500).json({error:"server error"});
    }
})
export default router;