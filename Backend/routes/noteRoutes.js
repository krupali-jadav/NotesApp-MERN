const express = require("express");
const router = express.Router();
const Note = require("../models/Notes");
const authMiddleware = require("../middleware/authMiddleware");

//add note
router.post("/add",authMiddleware, async(req,res)=>{
    try {
        const{title,content}= req.body;
        const note =  new Note({
            title,
            content,
            userId:req.user._id,
        })

        await note.save();
        res.json({message:"Note added successfully",note})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});

//get all notes
router.get("/", authMiddleware, async(req,res)=>{
    try {
        const notes = await Note.find({userId:req.user._id});
        res.json(notes)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

//update note
router.put("/update/:id",authMiddleware,async(req,res)=>{
    try {
        const{title,content} = req.body;
        const note = await Note.findOneAndUpdate(
            {_id:req.params.id,userId:req.user._id},
            {title,content},
            {new:true}
        );

        res.json({ message:"note updated",note})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});

//delete note
router.delete("/delete/:id",authMiddleware,async(req,res)=>{
    try {
        await Note.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        })
        res.json({message:"Note deleted successfully"})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

module.exports = router;