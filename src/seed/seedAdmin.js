const CryptoJS = require('crypto-js');
const { Admin } = require('../models');


exports.createAdmin = async () => {
    const username = process.env.DEFAULF_ADMIN_NAME;
    const password = process.env.DEFAULF_ADMIN_PASSWORD;
    try {
        const admin = await Admin.findOne({ username: username });
        if (admin !== null) {
            return true;
        }

        const newAdmin = new Admin({
            username: username,
            password: CryptoJS.AES.encrypt(
                password,
                process.env.PASSWORD_SECRET_KEY
            )
        });
        await newAdmin.save();
        console.log("------------------------------")
        console.log("Admin created with")
        console.log(`username: ${username}`);
        console.log(`password: ${password}`);
        console.log("------------------------------")
    } catch (err) {
        console.log(err);
        return false;
    }
}