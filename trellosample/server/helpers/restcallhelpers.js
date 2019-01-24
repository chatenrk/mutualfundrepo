const axios = require('axios');

async function getBoardsForUser(authparams) {

  const getBoardsURL = "https://api.trello.com/1/members/" + authparams.userid + "/boards?key=" + authparams.key + "&token=" + authparams.token;
  var boards;
  try {
    boards = await axios.get(getBoardsURL, {});
    return boards;
  } catch (err) {
    debugger;
    return err;
  }
}

async function getCardsForBoard(boardid, authparams) {
  const getCardsURL = "https://api.trello.com/1/boards/" + boardid + "/cards?key=" + authparams.key + "&token=" + authparams.token;
  var cards;
  try {
    cards = await axios.get(getCardsURL);
    return cards;
  } catch (err) {
    return err;
  }
}

module.exports.getBoardsForUser = getBoardsForUser;
module.exports.getCardsForBoard = getCardsForBoard;
