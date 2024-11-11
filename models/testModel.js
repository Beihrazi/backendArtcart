const mongoose = require('mongoose')

const testSchema = mongoose.Schema({
    profileDp: {
        type: String, 
        required: true,
    },
    aadhaarDoc: {
        type: String, 
        required: true,
    }
})
module.exports = mongoose.model('testModel', testSchema)