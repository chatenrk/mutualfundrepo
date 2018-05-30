sap.ui.define([
  'jquery.sap.global',
  "simple_hello/Controller/BaseController",
  'sap/ui/model/Filter',
  "sap/ui/model/FilterOperator",
  "../helpers/GatewayHelper",
  "../helpers/ParsingHelpers"
], function(jQuery, BaseController, Filter, FilterOperator, GatewayHelper, ParsingHelpers) {
  "use strict";
  var _invBy;
  var CController = BaseController.extend("simple_hello.Controller.showallinvsplit", {

    /*
    -----------------------------------------------------------------------------------------------
    * Life cycle hook methods
    -----------------------------------------------------------------------------------------------
    */

    onInit: function() {

      /**
       * @desc This is a lifecycle hook method that is called when the view is initialized
       * Useful for initialization of the any parameters, adding dependent event handlers etc
       * Here it is used to subscribe to the handleRouteMatched event of the router
       *
       */
      var oRouter = this.getRouter();
      oRouter.attachRouteMatched(this._handleRouteMatched, this);

    },

    /*
    -----------------------------------------------------------------------------------------------
    * Routing related methods
    -----------------------------------------------------------------------------------------------
    */

    _handleRouteMatched: function(oEvt) {

      /**
       * @desc This it the event callback method that is registered for the handleRouteMatched event
       *       It triggers on every route match. Any data fetches/refreshes can be performed in this method
       *       In this case, it gets all the goals(portfolios) and Scheme Aggregation for a user
       * @param oEvt{object} referencing to the route matched event triggered via navigation
       */

      if (oEvt.getParameter("name") !== "dispallinv") {
        return;
      }

      this._getAllInvestments();
    },


    /*
    -----------------------------------------------------------------------------------------------
    * View Event Handler Methods
    -----------------------------------------------------------------------------------------------
    */

    onQuickFilter: function(oEvt) {

      /**
       * @desc This is a event handler that handles the filtering of the iconTabBar based on the goals clicked
       * @param oEvt: Refers to the event generated based on the icon tab clicked
       */

      var sKey = oEvt.getParameter("key");
      var aFilter = [];

      if (sKey !== "All") {
        aFilter.push(new Filter("invFor", FilterOperator.Contains, sKey));
      }

      // filter binding
      var oList = this.byId("invtable");
      var oBinding = oList.getBinding("items");
      oBinding.filter(aFilter);
    },

    onPressScheme: function(oEvt) {

      /**
       * @desc This is a event handler that handles the click event of the table navigation
       * @param oEvt: Refers to the event generated based on the list item clicked
       */

      var that = this;
      var source = oEvt.getSource();
      var oBindingContext = source.getBindingContext("manageinv_model");

      var scode = oBindingContext.getProperty("scode");
      var invFor = oBindingContext.getProperty("invFor");


      var oRouter = this.getRouter();
      oRouter.navTo("schdet", {
        query: {
          scode: scode,
          invFor: invFor,
          invBy: that._invBy
        }
      }, false);

    },

    onSearch: function(oEvt) {

      // add filter for search
      var aFilters = [];
      var sQuery = oEvt.getSource().getValue();
      if (sQuery && sQuery.length > 0) {
        var filter = new Filter("sname", sap.ui.model.FilterOperator.Contains, sQuery);
        aFilters.push(filter);
      }

      var oView = this.getView();
      var oTable = oView.byId("invtable");
      var oBinding = oTable.getBinding("items");
      oBinding.filter(aFilters, "Application");
    },


    /*
    -----------------------------------------------------------------------------------------------
    * View Helper methods
    -----------------------------------------------------------------------------------------------
    */

    _getAllInvestments: function() {

      /**
       * @desc This is helper method that gets the login details of the user(using the base controller method),
       *       and calls the helper method for getting Goals(portfolios) and Scheme Aggregations of the user
       */

      // Get Login Data
      var logindata = this._getLoginData();

      if (logindata) {
        var invBy = logindata.user.name;
        this._invBy = invBy;
        this._getMFGoals(this._invBy);
        this._getSchemesAggr(invBy);
      }

    },
    _getMFGoals: function(invBy) {

      /**
      * @desc This is helper method that gets the goals(portfolios) for a user. It invokes the
      *       getInvestFor method of the GatewayHelper class. It has 2 event handler methods for
              success(_getgoalssuccess) and failure(_getgoalsfailure)
      * @param invBy{string} referencing to the user logged in
      */

      var that = this;
      GatewayHelper.getInvestFor(invBy).then(function(data) {
        that._getgoalssuccess(data, that);
      }, function(err) {
        that._getgoalsfailure(err, that);
      });
    },
    _getgoalssuccess: function(data, that) {

      /**
       * @desc This is the success handler for Goals details.
       * If details are receieved then they are bound to the model,for display on the view
       * If no details are recieved, repeat the getInvestFor method with username as Others
       * @param data: data sent from the server
       * @param that: reference to the this variable of the view
       */
      if (data.length > 0) {

        // Use this to map the Icon Tabs
        var iconTabBar = this.getView().byId("iconTabBar");

        // check and insert item
        this._checkAndInsertItem(iconTabBar, "All", "All Investments", 0);

        for (var i = 0; i < data.length; i++) {
          this._checkAndInsertItem(iconTabBar, data[i].key, data[i].text, i + 1);
        }

      } else // No data recieved, repeat the ajax request
      {
        that._getMFGoals("Others");
      }
    },

    _getgoalsfailure: function(err, that) {

      /**
       * @desc This is the failure handler for Goals details.
       * Any error details that are sent back from the server need to be updated on the screen(WIP)
       * @param err{object}: data sent from the server
       * @param that{object}: reference to the this variable of the view
       */

    },
    _getSchemesAggr: function(invBy) {

      /**
      * @desc This is helper method that gets the aggregate scheme data for a user. It invokes the
      *       getInvSchemeAggr method of the GatewayHelper class. It has 2 event handler methods for
              success(_getInvSchemeAggrsuccess) and failure(_getInvSchemeAggrfailure)
      * @param invBy{string} referencing to the user logged in
      */


      // instantiate dialog
      if (!this._dialog) {
        this._dialog = sap.ui.xmlfragment("simple_hello.view.busydialog", this);
        this.getView().addDependent(this._dialog);
      }

      // open dialog
      var oJSONModel = this.getJSONModel();
      var data = {
        title: "Get Own Investments",
        text: "Retrieving own investments from Database. Please wait"
      }

      oJSONModel.setData(data);
      this.getView().setModel(oJSONModel, "busyDialog");

      jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
      this._dialog.open();

      //Query and get the data

      var that = this;
      GatewayHelper.getInvSchemeAggr(invBy).then(function(data) {
        that._getInvSchemeAggrsuccess(data, that);
      }, function(err) {
        that._getInvSchemeAggrfailure(err, that);
      });
    },

    _getInvSchemeAggrsuccess: function(data, that) {

      /**
       * @desc This is the success handler for Scheme Aggregation details.
       * If details are receieved then they are bound to the model(manageinv_model),for display on the view
       * @param data{object}: data sent from the server
       * @param that{object}: reference to the this variable of the view
       */

      // Close the busy dialog
      if (that._dialog) {
        that._dialog.close();
      }

      // Parse Data
      // var pdata = this._parseData(data);
      var pdata = ParsingHelpers._parseInvSchemeAggrData(data);


      // Set the data to scheme model
      var manageinv_model = this.getView().getModel("manageinv_model");
      manageinv_model.setData(pdata);
      manageinv_model.updateBindings();
    },

    _getInvSchemeAggrfailure: function(err, that) {

      /**
       * @desc This is the failure handler for Scheme Aggregation details.
       * Any error details that are sent back from the server need to be updated on the screen(WIP)
       * @param err{object}: data sent from the server
       * @param that{object}: reference to the this variable of the view
       */


      // Close the busy dialog
      if (that._dialog) {
        that._dialog.close();
      }
    },




    _checkAndInsertItem: function(iconTabBar, iconFilterKey, iconFilterText, iconIndex) {

      /**
       * @desc This is a helper method for checking and inserting a Icon Tab Filter
       * It checks if an item is already present and does not insert it if it is already present
       * @param iconTabBar: Refers to the iconTabBar which holds the filters
       * @param iconFilterKey: Refers to the key of the IconTabFilter
       * @param iconFilterText: Refers to the text of the IconTabFilter
       */

      if (iconTabBar) {
        // Get all items
        var oitems = iconTabBar.getItems();

        // Find if the item already exists
        for (var i = 0; i < oitems.length; i++) {
          if (oitems[i].getKey() === iconFilterKey) {
            return;
          }
        }

        //Item is not found, insert the same
        var oIconTabFilter = new sap.m.IconTabFilter({
          key: iconFilterKey,
          text: iconFilterText,
          icon: "sap-icon://sys-find",
          design: "Vertical"

        });

        var IconFilterSepKey = "IconTabSeparator" + iconIndex;
        var oIconTabSeparator = new sap.m.IconTabSeparator({
          key: IconFilterSepKey,
          icon: "sap-icon://vertical-grip"
        });

        iconTabBar.insertItem(oIconTabFilter, iconIndex);
        // if (iconIndex !== 0) {                          //Do not insert separator for first Item
        //   iconTabBar.insertItem(oIconTabSeparator);
        // }

      }

    }

  });

});
