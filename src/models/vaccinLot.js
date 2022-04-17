const mongoose = require('mongoose');
const { schemaOptions } = require('./modelOptions');
const Schema = mongoose.Schema;

const vaccineLotSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    quanlity: {
        type: Number,
        required: true,
    },
    vaccinated: {
        type: Number,
        required: true,
        default: 0,
    },
    vaccine: {
        type: Schema.Types.ObjectId
    }
}, schemaOptions);

module.exports = mongoose.model('VaccineLot', vaccineLotSchema);