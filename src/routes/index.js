const express = require('express');
const router = express.Router();

router.use("/admin", require("./adminRoute"));
router.use("/users", require("./userRoute"));
router.use("/places", require("./placeRoute"));
router.use("/vaccines", require("./vaccineRoute"));

module.exports = router;
