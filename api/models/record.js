const mongoose = require('mongoose');

const recordSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    login: {type: String, required: true },
    round: {type: Number, required: true }
});

module.exports = mongoose.model('Record', recordSchema);