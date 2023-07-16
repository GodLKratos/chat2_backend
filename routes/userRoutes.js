const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController")

router.get('/',(req,res)=>{
    res.send("hii");
})

router.post("/signup",(UserController.Register));

router.post("/login",(UserController.login));

router.post("/detail",(UserController.Detail));

router.post("/getdetails",(UserController.getDetails));

router.post("/updatedetails",(UserController.updateDetails));

router.post("/resetpass",(UserController.passwordReset));

router.post("/deleteAcc",(UserController.deleteAcc));




module.exports = router;