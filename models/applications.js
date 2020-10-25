const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
    'position': String,    
    'employee': String,    
});

module.exports = mongoose.model('Applications', ApplicationSchema);