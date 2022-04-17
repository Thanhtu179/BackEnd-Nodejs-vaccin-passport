const router = require('express').Router();
const { adminController } = require('../controllers');
const tokenHandler = require('../handlers/tokenHandler');


router.post("/login", adminController.login);

router.get(
    "/summay",
    tokenHandler.verifyToken,
    adminController.summary
);


module.exports = router;