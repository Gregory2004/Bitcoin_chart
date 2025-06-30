const express = require('express')
const router = express.Router()
const controller = require('../controllers/dateController')

router.post('/data',controller.getData)
 
module.exports = router