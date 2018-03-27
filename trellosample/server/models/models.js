const mongoose = require('mongoose');

// Create a schema to fetch the key and token for usage with Trello API
var qauthSchema = mongoose.Schema({

  userid: String,
  key: String,
  token: String
});

var qauthModel = mongoose.model('qauth', qauthSchema);

//This route gets the Query Auth parameters for usage with Trello
// At this moment there is only one user in the database so it fetches only that
// Incase of multiple user scenario, then this needs to be tweaked
async function find(query) {

  try {
    let quath
    qauth = await qauthModel.find(query);
    return qauth;
  } catch (err) {

    return err;
  }
};

module.exports.find = find;
