const jwt = require('jsonwebtoken');
const { User, UserVaccine, UserPlace, Vaccine, VaccineLot, Place, } = require('../models');
const userVaccine = require('../models/userVaccine');

exports.create = async (req, res, next) => {
    const {
        phoneNumber,
        idNumber,
    } = req.body;
    try {
        let user = await User.findOne({ phoneNumber: phoneNumber });
        if (user) return res.status(403).json("phone number already registered for another account");

        user = await User.findOne({ idNumber: idNumber });
        if (user) return res.status(403).json("id Number already registered for another account");

        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        const token = jwt.sign({
            id: savedUser._id,
        }, process.env.TOKEN_SECRET_KEY);

        res.status(201).json({
            user: savedUser,
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.getAll = async function (req, res) {
    try {
        const list = await User.find({}).sort("-createAt");
        for (const user of list) {
            const vaccine = await UserVaccine.find({
                user: user._id
            }).sort("-createAt")
            user._doc.vaccine = vaccine;
        }

        res.status(200).json(list);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.getOne = async function (req, res) {
    try {
        const user = await User.findById(req.params.id);
        const userVaccine = await UserVaccine.find({
            user: req.params.id
        }).populate("vaccine").populate("vaccineLot").sort("-createAt");

        const userPlaceVisit = await UserPlace.find({
            user: req.params.id
        }).populate("place").sort("-createAt");

        user._doc.vaccinated = userVaccine;
        user._doc.placeVisited = userPlaceVisit;

        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.update = async function (req, res) {
    const {
        phoneNumber,
        idNumber,
    } = req.body;
    try {
        let user = await User.findOne({ phoneNumber: phoneNumber });
        if (user) return res.status(403).json("phone number already registered for another account");

        user = await User.findOne({ idNumber: idNumber });
        if (user) return res.status(403).json("id Number already registered for another account");

        const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            }
        );
        res.status(200).json(updateUser);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.delete = async function (req, res) {
    try {
        const { id } = req.params;
        await UserVaccine.deleteMany({ user: id });
        await UserPlace.deleteMany({ user: id });
        await User.findByIdAndDelete(id);
        res.status(200).json("Delete");
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

//add vaccinated to user
exports.vaccinated = async (req, res) => {
    try {
        const {
            userId,
            vaccineId,
            vaccineLotId
        } = req.body;
        const newVaccine = new userVaccine({
            user: userId,
            vaccine: vaccineId,
            vaccineLot: vaccineLotId
        });
        const savedVaccine = await newVaccine.save();
        await VaccineLot.findOneAndUpdate(
            { _id: vaccineLotId },
            { $inc: { vaccinated: +1 } }
        );
        savedVaccine._doc.Vaccine = await Vaccine.findById(vaccineId);
        savedVaccine._doc.VaccineLot = await VaccineLot.findById(vaccineLotId);
        res.status(201).json(savedVaccine);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

//get place of user
exports.getAllPlace = async (req, res) => {
    try {
        const list = await Place.find({
            creator: req.params.userId
        })
        res.status(200).json(list);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}


//user check in place
exports.checkInPlace = async (req, res) => {
    try {
        const newVisit = new UserPlace({
            user: req.user._id,
            place: req.body.placeId
        })
        const savedUserPlace = await newVisit.save();
        res.status(201).json(savedUserPlace);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

//get place that user checked in
exports.placeVisited = async (req, res) => {
    try {
        const list = await UserPlace.find({ user: req.params.userId }).populate("place");
        res.status(200).json(list);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

