sap.ui.define([], function() {
  "use strict";

  return {
    _deleteInvDet: function(id) {
      /**
       * @desc This is a helper function which recieves the id and deletes the entry in the mfinvdetls collection of the
       *       mfdb database
       * @param MongoDB Object ID id
       * @return promise
       */

      var invdelurl = "http://localhost:3000/mfinv/delinv?id=" + id;
      var that = this;
      var deferred = jQuery.Deferred();

      var that = this;

      $.ajax({
        url: invdelurl,
        type: 'DELETE',
        success: function(data) {
          deferred.resolve(data);

        },
        error: function(err) {
          deferred.reject(err);

        }

      }); //AJAX call close

      return deferred.promise();
    },

    _getOwnInvestments: function(invBy) {

      /**
      * @desc This is a helper function which recieves the invested By and gets all the investments for that user
      * @param string invBy
      * @return promise
      */

      var deferred = jQuery.Deferred();
        var invdeturl = "http://localhost:3000/mfinv/mfinvdet?invBy=" + invBy;
        var that = this;

        $.ajax({
          url: invdeturl,
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


    },
    getInvestFor:function(username){

      /**
      * @desc This method will be called on the initialization of this view.
      *       It is used to fetch the Goals that are created for the particular user
      *       It performs an AJAX call and fetches the data
      *       If no data is found for the user, it uses generic goals

      * @param This receieves username as an input
      * @return This returns the values found for the user in the database(InvGoals collection)
      *         If nothing found then it returns the data for others

      */

      var authurl = "http://localhost:3000/goal/goaldet?inv_for="+username;
      var that = this;
      var deferred = jQuery.Deferred();


      $.ajax(
              {
                url:authurl,
                type: 'GET',
                dataType:'json',
                success:function(data)
                {
                  deferred.resolve(data);

                },
                error:function(err)
                {
                    deferred.reject(err);
                }

              });			//AJAX call close
              return deferred.promise();

    },

    gatewayfailure:function(err,busyDialog)
    {
      
    }

  }
});

// _getOwnInvestments: function(invBy) {
//   /**
//    * @desc This is a helper function which recieves the invested By and gets all the investments for that user
//    * @param string invBy
//    * @return promise
//    */
//
//   var deferred = jQuery.Deferred();
//   var invdeturl = "http://localhost:3000/mfinv/mfinvdet?invBy=" + invBy;
//   var that = this;
//
//   $.ajax({
//     url: invdeturl,
//     type: 'GET',
//     dataType: 'json',
//     success: function(data) {
//       deferred.resolve(data);
//     },
//     error: function(err) {
//       deferred.reject(err);
//
//     }
//
//   }); //AJAX call close
//
//   return deferred.promise();
// }
