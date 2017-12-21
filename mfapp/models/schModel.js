var mongoose = require('mongoose');

var mfschemeSchema = mongoose.Schema({

    scode: Number,
    sname: String
});
 
var mfschemesModel = mongoose.model('schemes', mfschemeSchema);

//This route gets all the documents inside the schemes collection in MongoDB
async function findAll()
{
try{
      let schemes 	    
      schemes = await mfschemesModel.find();
    
      return schemes;
  } catch (err) 
  {
	
    return err;
  }
};


module.exports.findAll = findAll; 

