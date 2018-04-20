sap.ui.define(["simple_hello/libs/Moment"], function(Moment) {
  "use strict";

  return {
    _isodatetodate: function(isodate) {
      var pdate = moment(isodate).utcOffset("+05:30").format('DD-MMM-YYYY');
      return pdate;
    },
    datetoisodate: function(date) {

    },
    _currentDate: function() {
      var currdate = moment().utcOffset("+05:30").format('DD-MMM-YYYY');
      return currdate;
    }
  }
});
