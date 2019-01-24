sap.ui.define([], function() {
  "use strict";

  return {
    _getAllNAV: function() {
      /**
       * @desc This gets all the NAV from ChartDB / navlinedetls
       * @return Returns a promise object
       */
      var that = this;
      var deferred = jQuery.Deferred();

      var navdetlurl = "http://localhost:3000/chtdata/allnav";



      $.ajax({
        url: navdetlurl,
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

    _getAllPie: function() {
      /**
       * @desc This gets all the NAV from ChartDB / navlinedetls
       * @return Returns a promise object
       */
      var that = this;
      var deferred = jQuery.Deferred();

      var navdetlurl = "http://localhost:3000/chtdata/piedetails";



      $.ajax({
        url: navdetlurl,
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

    _getMulLineData: function(scode) {
      /**
       * @desc This gets all the NAV from ChartDB / navlinedetls
       * @return Returns a promise object
       */
      var that = this;
      var deferred = jQuery.Deferred();

      if (scode && scode != "") {
        var navdetlurl = "http://localhost:3000/chtdata/mullinedata?scode=" + scode;
      } else {
        var navdetlurl = "http://localhost:3000/chtdata/mullinedata";
      }


      $.ajax({
        url: navdetlurl,
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
    _getLegendData: function() {
      /**
       * @desc This gets all legend ChartDB / legenddetls
       * @return Returns a promise object
       */
      var that = this;
      var deferred = jQuery.Deferred();

      var navdetlurl = "http://localhost:3000/chtdata/legenddata";



      $.ajax({
        url: navdetlurl,
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
