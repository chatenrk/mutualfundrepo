sap.ui.define([], function() {
  "use strict";

  return {

    _getAllDashboards:function(user)
    {
      /**
       * @desc This is a helper function which gets the user details from database. If no user is supplied
       *       get all the user data from the database
       * @param user: user object
       * @return promise
       */

      // if user is not available, get all user details
      if(user)
      {
        var getBoardsURL = "http://localhost:3000/qauth/getallboards?userid="+user;
        var that = this;
        var deferred = jQuery.Deferred();


        $.ajax({
          url: getBoardsURL,
          type: 'GET',
          dataType: 'json',
          success: function(data) {
            deferred.resolve(data);

          },
          error: function(err) {
            deferred.reject(err);
          }

        }); //AJAX call close
        return deferred.promise();

      }else {
          deferred.reject("Please pass user details");
      }
    }

  }
});
