const express=require('express')
const {protect}=require('../middleware/auth')
const {register,login,getMe,updateDetails,updatePassword,forgotPassword,resetPassword}=require('../controllers/auth')

const router=express.Router()
router.post('/register',register)
router.post('/login',login)
router.get('/me',protect,getMe)
router.put('/updatedetails',protect,updateDetails)
router.put('/updatepassword',protect,updatePassword)
router.post('/forgotpassword',forgotPassword)
router.put('/resetpassword/:resettoken',resetPassword)

module.exports=router 