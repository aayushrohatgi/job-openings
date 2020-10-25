const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PositionSchema = new Schema({
    'code': String,
    'project': String,    
    'client': String,    
    'technologies': String,    
    'role': String,    
    'description': String,    
    'status': String,    
    'author': String,    
});

module.exports = mongoose.model('Positions', PositionSchema);