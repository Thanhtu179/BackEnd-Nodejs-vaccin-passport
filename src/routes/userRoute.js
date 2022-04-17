const express = require('express');
const router = express.Router();
const tokenHandler = require('../handlers/tokenHandler');
const { userController } = require('../controllers')

router.post(
  "/",
  tokenHandler.verifyAdminToken,
  userController.create
);

router.get(
  "/",
  tokenHandler.verifyAdminToken,
  userController.getAll
);

router.get(
  "/:id",
  tokenHandler.verifyAdminToken,
  userController.getOne
);

router.put(
  "/:id",
  tokenHandler.verifyAdminToken,
  userController.update
);

router.delete(
  "/:id",
  tokenHandler.verifyAdminToken,
  userController.delete
);

//add vaccine to users
router.post(
  "/vaccinted",
  tokenHandler.verifyAdminToken,
  userController.vaccinated
);

//get place of user
router.get(
  "/:userId/places",
  tokenHandler.verifyToken,
  userController.getAllPlace
);

router.post(
  "/checkin-place",
  tokenHandler.verifyToken,
  userController.checkInPlace
);

router.get(
  "/:userId/places-visited",
  tokenHandler.verifyToken,
  userController.placeVisited
);

module.exports = router;
