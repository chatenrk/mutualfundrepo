const express = require('express');
const router = express.Router();

const qauthmodel = require('../models/models');
const RCHelpers = require('../helpers/restcallhelpers');

//Route to find Query Auth Paramaters
router.get('/qauthdet', async (req, res, next) => {

  try {
    qauth = await qauthmodel.find();
    res.send(qauth);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/getallboards', async (req, res, next) => {
      const userid = req.query.userid;
      debugger;
      if (!userid) {
        return res.status(400).send("Please provide username of Trello Login");
      } else {

        // Get the query auth parameters
        const query = {
          userid: userid
        }
        try {
          qauth = await qauthmodel.find(query);
          let boards = await RCHelpers.getBoardsForUser(qauth[0]);
          res.send(boards.data);
        } catch (err) {
          debugger;
          return res.status(500).send(err);
        }
      }
    });


    module.exports = router;
