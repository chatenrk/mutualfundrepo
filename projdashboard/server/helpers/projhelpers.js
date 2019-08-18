const mongoose = require('mongoose');

var projSchema = mongoose.Schema({
  schcat: String,
  scode: Number,
  sname: String,
  reffund: String
});


var projModel = mongoose.model('projections', projSchema);

/**
 * @desc This method gets the all projections based on the query
 * @param {JSON} query - query to pass to the projections collection
 * @return {JSON} projdet - Details of projections fetched based on query
 */
async function findAll(query) {
  
    try {
        let projdet;
        projdet = await projModel.find(query);
        return projdet;
    } catch (err) {
        return err;
    }
};



/**
 * @desc This method gets the reference/non reference fund for a scheme category
 * @param {string} schcat - scheme category
 * @param {string} isRefFund - Boolean indicator indicating whether to fetch reference / non-reference fund
 * @return {JSON} refscheme - Reference Category of the scheme
 */
async function findRefScheme(schcat,isRefFund) {
 
    var id = {
        "schcat": schcat,
        "reffund": isRefFund 
    };

    try {
        let refscheme
        refscheme = await projModel.find(id);
        return refscheme;

    } catch (err) {
        return err;
    }

}

module.exports.findAll = findAll;
module.exports.findRefScheme = findRefScheme;
