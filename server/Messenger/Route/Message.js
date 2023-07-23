import express from "express"
import Messages from "../Modal/Message.js";

const router = express.Router();
//add
router.post("/", async (req, res) => {
    const newMessage = new Messages(req.body);
  
    try {
      const savedMessage = await newMessage.save();
      res.status(200).json({message:savedMessage});
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //get
  router.get("/:conversationId", async (req, res) => {
    try {
      const messages = await Messages.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).send({succes:true,messages});
    } catch (err) {
      res.status(500).json(err);
    }
  });

  export default router