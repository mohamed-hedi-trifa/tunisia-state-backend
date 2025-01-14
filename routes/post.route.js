import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
    console.log("router worksss");
    res.send("Router is working!"); 
});

// router.get("/test", (req, res) => {
//     console.log("router worksss");
//     res.send("Router is working!"); 
// });

// router.get("/test", (req, res) => {
//     console.log("router worksss");
//     res.send("Router is working!"); 
// });
export default router;