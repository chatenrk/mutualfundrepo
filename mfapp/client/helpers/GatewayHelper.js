sap.ui.define([], function() {
  "use strict";

  return {

    /*
    *---------------------------------------------------------------------*
    * Mutual Fund Investment Handling Methods
    *---------------------------------------------------------------------*

    */

    _getInvBySchCodeInvFor: function(scode, invBy, invFor)
    {
      /**
       * @desc This is a helper function which recieves the scheme code and InvFor(Goal) and Invested By
       * @param scode: scheme code of the selected scheme
       * @param invBy: User for the investment
       * @param: invFor: Goal of the selected investment
       * @return promise
       */


       var invdeturl = "http://localhost:3000/mfinv/mfinvdet?scode="+scode+"&invBy="+invBy+"&invFor="+invFor;
       var that = this;
       var deferred = jQuery.Deferred();


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
    getInvestFor: function(username) {

      /**
      * @desc This method will be called on the initialization of this view.
      *       It is used to fetch the Goals that are created for the particular user
      *       It performs an AJAX call and fetches the data
      *       If no data is found for the user, it uses generic goals

      * @param This receieves username as an input
      * @return This returns the values found for the user in the database(InvGoals collection)
      *         If nothing found then it returns the data for others

      */

      var authurl = "http://localhost:3000/goal/goaldet?inv_for=" + username;
      var that = this;
      var deferred = jQuery.Deferred();


      $.ajax({
        url: authurl,
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
    getInvSchemeAggr: function(invBy) {
      /**
       * @desc This helper method is used to fetch aggregated scheme data for the logged in user
       *       It performs an AJAX call and fetches the data
       * @param invBy referring to the user who has logged in
       * @return This returns the scheme data aggregations as a JSON Array
       */

       var schagrurl = "http://localhost:3000/mfinv/aggr?invBy=" + invBy;
       var that = this;
       var deferred = jQuery.Deferred();


       $.ajax({
         url: schagrurl,
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

    /*
    *---------------------------------------------------------------------*
    * AMC Handling Methods
    *---------------------------------------------------------------------*

    */

    getAMCs: function() {

      /**
       * @desc This helper method is used to fetch all the AMC's from the database
       *       It performs an AJAX call and fetches the data
       * @return This returns the AMC's found in the database(amcs collection) as a JSON Array
       */

      var that = this;
      var deferred = jQuery.Deferred();

      var amcurl = "http://localhost:3000/amc/all";

      $.ajax({
        url: amcurl,
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

    /*
    *---------------------------------------------------------------------*
    * Scheme Handling Methods
    *---------------------------------------------------------------------*

    */

    getSchemes: function(amccode) {
      /**
       * @desc This helper method is used to fetch all the schemes from the database
       *       It performs an AJAX call and fetches the data
       * @param amccode referring to the selected AMC Code
       * @return Returns a promise object
       */

      var that = this;
      var deferred = jQuery.Deferred();

      var schurl = "http://localhost:3000/schemes/sdet/amc";

      var data = {
        amccode: amccode
      };

      $.ajax({
        url: schurl,
        type: 'GET',
        data: data,
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

    _postSchemeDetailsMulti:function(file)
    {
      /**
       * @desc This helper method is used to post multiple scheme details to the database
       * @param file referring to the CSV File
       * @return Returns a promise object
       */

      var that = this;
      var deferred = jQuery.Deferred();
      var schdetposturl = "http://localhost:3000/schemes/csvSchDet";

      var fd = new FormData();
      fd.append('file', file);

      $.ajax({
        url: schdetposturl,
        processData: false, // important
        contentType: false, // important
        data: fd,
        type: 'POST',
        cache: false,


        success: function(data) {
          deferred.resolve(data);

        },
        error: function(err) {
          deferred.reject(err);

        }

      }); //AJAX call close

        return deferred.promise();
    },


    /*
    *---------------------------------------------------------------------*
    * NAV Handling Methods
    *---------------------------------------------------------------------*

    */

    getFewNav: function(scode, limit, sorder) {
      /**
       * @desc This helper method is used to fetch first/ last N nav values from the database
       * @param scode referring to the Scheme Code
       * @param limit referring to the number of documents to be retrieved
       * @param sorder referring to the sort order(Ascending / Descending)
       * @return Returns a promise object
       */

      var that = this;
      var deferred = jQuery.Deferred();

      var fewnavurl = "http://localhost:3000/nav/navlimit?scode=" + scode + "&limit=" + limit + "&sorder=" + sorder;

      $.ajax({
        url: fewnavurl,
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

    }

  }
});
