sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "simple_hello/libs/Moment",
	"simple_hello/libs/Underscore"
  ],
  function(Controller, History, Moment,Underscore) {
    "use strict";
    var _oRouter;
    var _lgndata;
    return Controller.extend("simple_hello.Controller.BaseController", {
      onInit: function() {
        this.ownerComponent = this.getOwnerComponent();
      },

	 
	  /** 
	   * @desc This provides the login user information.
	   *  Data retrieved is bound to a global variable of the view
	   * */
      _getLoginData: function() {
        

        // Since this is being invoked from init(), we get the model from Owner Component
        var loginuser = this.getOwnerComponent().getModel("loggedin_user");
        this._lgndata = loginuser.getData();
        return this._lgndata;
      },

	  /*
	  * @desc This method will be called on the initialization of this view.
	  *       It is used to fetch the Goals that are created for the particular user
	  *       It performs an AJAX call and fetches the data
	  *       If no data is found for the user, it uses generic goals
      * @param This receieves username as an input
	  * @return This returns the values found for the user in the database(InvGoals collection)
	  *         If nothing found then it returns the data for others
      */

      _getInvestFor: function(username) {
        

        var authurl = "http://localhost:3000/goal/goaldet?inv_for=" + username;
        var that = this;

        $.ajax({
          url: authurl,
          type: "GET",
          dataType: "json",
          success: function(data) {
            that._goalsuccess(data, that);
          },
          error: function(err) {
            that._goalfailure(err, that);
          }
        }); //AJAX call close
      },


	    /**
		* @desc This is the success handler for Goals details.
		* If details are receieved then they are bound to the model, for display on the view
		* If no details are recieved, repeat the getInvestFor method with username as Others
		* @param data: data sent from the server
		* @param that: reference to the this variable of the view
		*/
      _goalsuccess: function(data, that) {
       
        if (data.length > 0) {
          var mfinvformodel = this.getView().getModel("mfinvfor_model");
          var assetdata = this.getView()
            .getModel("mfasset_model")
            .getData();
          var bindingdata = {};

          bindingdata.invFor = data; // Assign the goals data from server to invFor
          bindingdata.assetType = assetdata; // This is asset type data read from local models

          mfinvformodel.setData(bindingdata);
          mfinvformodel.updateBindings();
        } else {
          // No data recieved, repeat the ajax request
          that._getInvestFor("Others");
        }
      },
      _goalfailure: function(err, that) {},
      _isodatetodate: function(isodate) {
        var pdate = moment(isodate)
          .utcOffset("+05:30")
          .format("DD-MMM-YYYY");
        return pdate;
      },
      getJSONModel: function() {
        return new sap.ui.model.json.JSONModel();
      },
      getRouter: function() {
        return sap.ui.core.UIComponent.getRouterFor(this);
      },

      setPanelExpanded: function(panelName, expanded) {
        if (panelName.getExpanded() !== expanded) {
          panelName.setExpanded(expanded);
        }
      },
      sortArray: function(arr, key) {
        var a1, b1;
        arr.sort(function(a, b) {
          a1 = a[key];
          b1 = b[key];
          return a1 - b1;
        });
      },
      onNavBack: function(oEvent) {
        var oHistory, sPreviousHash;
        oHistory = History.getInstance();
        sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          this.getRouter().navTo(
            "appHome",
            {},
            true );
        }
      },

      arrayGroupBy: function(array,key) 
	  {
		  var grpArr = _.groupBy(array,key);
		  return grpArr;
	  }
    });
  }
);
