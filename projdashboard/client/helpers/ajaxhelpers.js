sap.ui.define([], function () {
    "use strict";

    return {

           /**
             * @desc This gets all the NAV from ChartDB / navlinedetls
             * @return Returns a promise object
             */
        _getMulLineData: function () {
         
            var that = this;
            var deferred = jQuery.Deferred();

            var url = "http://localhost:3000/chtdata/testprojinfo"

            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    deferred.resolve(data);

                },
                error: function (err) {
                    deferred.reject(err);

                }

            }); //AJAX call close

            return deferred.promise();

        }
    }
});