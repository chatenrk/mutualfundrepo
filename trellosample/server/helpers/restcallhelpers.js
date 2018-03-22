const axios = require('axios');

async function getBoardsForUser(authparams) {
  debugger;
  const getBoardsURL = "https://api.trello.com/1/members/" + authparams.userid + "/boards?key=" + authparams.key + "&token=" + authparams.token;
  var boards;
  try {
    boards = await axios.get(getBoardsURL);
    return boards;
  } catch (err) {
    return err;
  }
}

module.exports.getBoardsForUser = getBoardsForUser;
