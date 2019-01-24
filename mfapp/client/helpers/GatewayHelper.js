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

    getSchemes: function(amccode) {
      /**
       * @desc This helper method is used to fetch all the schemes from the database
       *       It performs an AJAX call and fetches the data
       * @param amccode referring to the selected AMC Code
       * @return This returns the AMC's found in the database(amcs collection) as a JSON Array
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

    getFewNav: function(scode,limit,sorder)
    {
      /**
       * @desc This helper method is used to fetch first/ last N nav values from the database
       * @param scode referring to the Scheme Code
       * @param limit referring to the number of documents to be retrieved
       * @param sorder referring to the sort order(Ascending / Descending)
       * @return This returns the NAV's in the database(navdetls collection) as a JSON Array
       */

       var that = this;
       var deferred = jQuery.Deferred();

       var fewnavurl = "http://localhost:3000/nav/navlimit?scode="+scode+"&limit="+limit+"&sorder="+sorder;

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

    },

    gatewayfailure: function(err, busyDialog) {

    },

    getChartDetails: function(amccode) {
      /**
       * @desc This helper method is used to fetch all the schemes from the database
       *       It performs an AJAX call and fetches the data
       * @param amccode referring to the selected AMC Code
       * @return This returns the AMC's found in the database(amcs collection) as a JSON Array
       */

      var that = this;
      var deferred = jQuery.Deferred();

      var schurl = "http://localhost:3000/proj/projchartdet";

     

      $.ajax({
        url: schurl,
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

  }
});
