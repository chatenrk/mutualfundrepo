sap.ui.define([], function() {
  "use strict";

  return {
    /*
     *---------------------------------------------------------------------*
     *---------------------------------------------------------------------*
     * User Handling Methods
     *---------------------------------------------------------------------*
     *---------------------------------------------------------------------*
     */

    /*---------------------------------------------------------------------*
     * Get Request Methods
     *---------------------------------------------------------------------*/

    _getUserDetails: function(user) {
      /**
       * @desc This is a helper function which gets the user details from database. If no user is supplied
       *       get all the user data from the database
       * @param user: user object
       * @return promise
       */

      // if user is not available, get all user details
      if (!user) {
        var userdeturl = "http://localhost:3000/users/userdet";
        var that = this;
        var deferred = jQuery.Deferred();

        $.ajax({
          url: userdeturl,
          type: "GET",
          dataType: "json",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(err) {
            deferred.reject(err);
          }
        }); //AJAX call close
        return deferred.promise();
      }
    },

    /*---------------------------------------------------------------------*
     * Post Requests Methods
     *---------------------------------------------------------------------*/

    /*---------------------------------------------------------------------*
     * Delete Requests Methods
     *---------------------------------------------------------------------*/

    /*
     *---------------------------------------------------------------------*
     *---------------------------------------------------------------------*
     * Mutual Fund Investment Handling Methods
     *---------------------------------------------------------------------*
     *---------------------------------------------------------------------*
     */

    /*---------------------------------------------------------------------*
     * Get Request Methods
     *---------------------------------------------------------------------*/
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
        type: "GET",
        dataType: "json",
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
       * @return promise
       */

      var authurl = "http://localhost:3000/goal/goaldet?inv_for=" + username;
      var that = this;
      var deferred = jQuery.Deferred();

      $.ajax({
        url: authurl,
        type: "GET",
        dataType: "json",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(err) {
          deferred.reject(err);
        }
      }); //AJAX call close
      return deferred.promise();
    },

    _getInvBySchCodeInvFor: function(scode, invBy, invFor, desc) {
      /**
       * @desc This is a helper function which recieves the scheme code and InvFor(Goal) and Invested By
       * @param scode: scheme code of the selected scheme
       * @param invBy: User for the investment
       * @param: invFor: Goal of the selected investment
       * @param: desc referring to Descending order when supplied as true
       * @return promise
       */

      var invdeturl =
        "http://localhost:3000/mfinv/mfinvdet?scode=" +
        scode +
        "&invBy=" +
        invBy +
        "&invFor=" +
        encodeURIComponent(invFor) +
        "&desc=" +
        desc;
      var that = this;
      var deferred = jQuery.Deferred();

      $.ajax({
        url: invdeturl,
        type: "GET",
        dataType: "json",
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
       * @return promise
       */

      var schagrurl = "http://localhost:3000/mfinv/aggr?invBy=" + invBy;
      var that = this;
      var deferred = jQuery.Deferred();

      $.ajax({
        url: schagrurl,
        type: "GET",
        dataType: "json",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(err) {
          deferred.reject(err);
        }
      }); //AJAX call close
      return deferred.promise();
    },

    getCurrentValue: function(scode, units) {
      /**
       * @desc This method is a gateway helper to retrieve the current value of an investment
       *       based on scheme code and total units
       * @param {string} scode refering to scheme code
       * @param {string} units refering to total units
       * @return promise
       */

      var authurl =
        "http://localhost:3000/mfinv/currval?scode=" +
        scode +
        "&units=" +
        units;
      var that = this;
      var deferred = jQuery.Deferred();

      $.ajax({
        url: authurl,
        type: "GET",
        dataType: "json",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(err) {
          deferred.reject(err);
        }
      }); //AJAX call close

      return deferred.promise();
    },

    /*---------------------------------------------------------------------*
     * Post Requests Methods
     *---------------------------------------------------------------------*/
    postOneInvest: function(logdata) {
      /**
       * @desc This helper method is used to post one Investment details of a user to the database
       * @param logdata referring to data that needs to be inserted
       * @return Returns a promise object
       */
      var that = this;
      var deferred = jQuery.Deferred();

      var authurl = "http://localhost:3000/mfinv/pone";
      var that = this;

      $.ajax({
        url: authurl,
        type: "POST",
        data: logdata,
        dataType: "json",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(err) {
          deferred.reject(err);
        }
      }); //AJAX call close
      return deferred.promise();
    },
    _postMultiInvest: function(file, user) {
      /**
       * @desc This helper method is used to post multiple Investment details of a user to the database
       * @param file referring to the CSV File
       * @return Returns a promise object
       */

      var that = this;
      var deferred = jQuery.Deferred();
      var multiinvposturl = "http://localhost:3000/mfinv/csvinv?user=" + user;

      var fd = new FormData();
      fd.append("file", file);

      $.ajax({
        url: multiinvposturl,
        processData: false, // important
        contentType: false, // important
        data: fd,
        type: "POST",
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

    /*---------------------------------------------------------------------*
     * Delete Requests Methods
     *---------------------------------------------------------------------*/
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
        type: "DELETE",
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
     *---------------------------------------------------------------------*
     * AMC Handling Methods
     *---------------------------------------------------------------------*
     *---------------------------------------------------------------------*
     */

    /*---------------------------------------------------------------------*
     * Get Requests Methods
     *---------------------------------------------------------------------*/

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
        type: "GET",
        dataType: "json",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(err) {
          deferred.reject(err);
        }
      }); //AJAX call close
      return deferred.promise();
    },

    /*---------------------------------------------------------------------*
     * Post Requests Methods
     *---------------------------------------------------------------------*/

    /*---------------------------------------------------------------------*
     * Delete Requests Methods
     *---------------------------------------------------------------------*/

    /*
     *---------------------------------------------------------------------*
     *---------------------------------------------------------------------*
     * Scheme Handling Methods
     *---------------------------------------------------------------------*
     *---------------------------------------------------------------------*
     */

    /*---------------------------------------------------------------------*
     * Get Requests Methods
     *---------------------------------------------------------------------*/

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
        type: "GET",
        data: data,
        dataType: "json",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(err) {
          deferred.reject(err);
        }
      }); //AJAX call close
      return deferred.promise();
    },

    getAllSchemes: function() {
      /**
       * @desc This helper method gets all the schemes that are present in the database
       * @return Returns a promise object
       */

      var that = this;
      var deferred = jQuery.Deferred();

      var allschurl = "http://localhost:3000/schemes/all";
      $.ajax({
        url: allschurl,
        type: "GET",
        dataType: "json",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(err) {
          deferred.reject(err);
        }
      }); //AJAX call close
      return deferred.promise();
    },

    _getSchemeDetails: function(scode) {
      /**
       * @desc This helper method is used to fetch all the Scheme Details from the database
       *       It performs an AJAX call and fetches the data
       * @param scode referring to the selected scheme code
       * @return Returns a promise object
       */

      var that = this;
      var deferred = jQuery.Deferred();

      var schurl = "http://localhost:3000/schemes/sdet?scode=" + scode;

      $.ajax({
        url: schurl,
        type: "GET",
        dataType: "json",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(err) {
          deferred.reject(err);
        }
      }); //AJAX call close
      return deferred.promise();
    },

    /*---------------------------------------------------------------------*
     * Post Requests Methods
     *---------------------------------------------------------------------*/

    _postSchemeDetailsMulti: function(file) {
      /**
       * @desc This helper method is used to post multiple scheme details to the database
       * @param file referring to the CSV File
       * @return Returns a promise object
       */

      var that = this;
      var deferred = jQuery.Deferred();
      var schdetposturl = "http://localhost:3000/schemes/csvSchDet";

      var fd = new FormData();
      fd.append("file", file);

      $.ajax({
        url: schdetposturl,
        processData: false, // important
        contentType: false, // important
        data: fd,
        type: "POST",
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

    updateSchemeData: function(schupddata) {
      var that = this;
      var deferred = jQuery.Deferred();

      var url = "http://localhost:3000/schemes/pschupdt";
      var that = this;

      $.ajax({
        url: url,
        type: "POST",
        data: schupddata,
        dataType: "json",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(err) {
          deferred.reject(err);
        }
      }); //AJAX call close
      return deferred.promise();
    },

    /*---------------------------------------------------------------------*
     * Delete Requests Methods
     *---------------------------------------------------------------------*/

    /*
    *---------------------------------------------------------------------*
    *---------------------------------------------------------------------*
    * NAV Handling Methods
    *---------------------------------------------------------------------*
    *---------------------------------------------------------------------*

    */

    /*---------------------------------------------------------------------*
     * Get Requests Methods
     *---------------------------------------------------------------------*/

    getNavData: function(scode, invdate) {
      /**
       * @desc This helper method is used to get the NAV data for a combination of scheme and investment date
       * @param scode referring to the Scheme Code
       * @param invdate referring to date of investment
       * @return Returns a promise object
       */

      var that = this;
      var deferred = jQuery.Deferred();

      var authurl =
        "http://localhost:3000/nav/navdet?scode=" + scode + "&date=" + invdate;
      var that = this;

      $.ajax({
        url: authurl,
        type: "GET",
        dataType: "json",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(err) {
          deferred.reject(err);
        }
      }); //AJAX call close
      return deferred.promise();
    },

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

      var fewnavurl =
        "http://localhost:3000/nav/navlimit?scode=" +
        scode +
        "&limit=" +
        limit +
        "&sorder=" +
        sorder;

      $.ajax({
        url: fewnavurl,
        type: "GET",
        dataType: "json",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(err) {
          deferred.reject(err);
        }
      }); //AJAX call close
      return deferred.promise();
    },

    getNavBtwn: function(scode, sdate, edate) {
      /**
       * @desc This helper method is used to fetch NAV for a scheme between 2 dates
       * @param scode referring to the Scheme Code
       * @param sdate as starting date for NAV fetch
       * @param edate as starting date for NAV fetch
       * @return Returns a promise object
       */

      var that = this;
      var deferred = jQuery.Deferred();

      var navbetnurl =
        "http://localhost:3000/nav/navbetn?scode=" +
        scode +
        "&sdate=" +
        sdate +
        "&edate=" +
        edate;

      $.ajax({
        url: navbetnurl,
        type: "GET",
        dataType: "json",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(err) {
          deferred.reject(err);
        }
      }); //AJAX call close
      return deferred.promise();
    },

    /*---------------------------------------------------------------------*
     * Post Requests Methods
     *---------------------------------------------------------------------*/

    _postMultiNAV: function(file) {
      /**
       * @desc This helper method is post multiple NAV data to the database
       * @param file referring to the TXT file that has the details of NAV
       * @return Returns a promise object
       */
      var that = this;
      var deferred = jQuery.Deferred();

      var authurl = "http://localhost:3000/nav/navfile";

      var fd = new FormData();
      fd.append("file", file);

      $.ajax({
        url: authurl,
        processData: false, // important
        contentType: false, // important
        data: fd,
        type: "POST",
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
    *---------------------------------------------------------------------*
    * Projection Methods
    *---------------------------------------------------------------------*
    *---------------------------------------------------------------------*

    */

    /*---------------------------------------------------------------------*
     * Get Requests Methods
     *---------------------------------------------------------------------*/

    /**
     * @desc This helper method gets all the Projection Scheme Categories
     * @return Returns a promise object
     */

    _getProjSchCat: function() {
      var that = this;
      var deferred = jQuery.Deferred();

      var url = "http://localhost:3000/proj/projschcat";

      $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(err) {
          deferred.reject(err);
        }
      }); //AJAX call close
      return deferred.promise();
    },

    /**
     * @desc This helper method gets all the projection categories and its funds
     * @return Returns a promise object
     */

    _getprojcatandfunds: function() {
      var that = this;
      var deferred = jQuery.Deferred();

      var url = "http://localhost:3000/proj/schcat";

      $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(err) {
          deferred.reject(err);
        }
      }); //AJAX call close
      return deferred.promise();
    },
    _getinvvscurrval: function(scode, invBy, invFor) {
      /**
       * @desc This helper method gets the investment versus current value figures for a scheme code-user-goal combination
       * @param scode referring to the Scheme Code
       * @param invBy referring to user for whom investment data is being requested
       * @param invFor referring to goal of investment
       * @return Returns a promise object
       */

      var that = this;
      var deferred = jQuery.Deferred();

      var url =
        "http://localhost:3000/proj/invvscurr?scode=" +
        scode +
        "&invFor=" +
        encodeURIComponent(invFor) +
        "&invBy=" +
        invBy;

      $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(err) {
          deferred.reject(err);
        }
      }); //AJAX call close
      return deferred.promise();
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
        type: "GET",
        dataType: "json",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(err) {
          deferred.reject(err);
        }
      }); //AJAX call close
      return deferred.promise();
    }
  };
});
