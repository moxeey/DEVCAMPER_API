const express=require('express')
const router=express.Router()
const User=require('../models/User')

const {createUser,getUser,getUsers,deleteUser,updateUser}=require('../controllers/users')
const advancedResults=require('../middleware/advancedResults')
const {protect,authorize}=require('../middleware/auth')

// middlewares
router.use(protect)
router.use(authorize('admin'))

router.route('/')
    .get(advancedResults(User),getUsers)
    .post(createUser)

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

module.exports=router