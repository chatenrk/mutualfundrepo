var mongoose = require('mongoose');

var projSchema = mongoose.Schema({
    schcat: String,
    scode: Number,
    sname: String,
    reffund: String
});

var projModel = mongoose.model('projections', projSchema);

