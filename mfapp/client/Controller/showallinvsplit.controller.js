sap.ui.define([
  'jquery.sap.global',
  "simple_hello/Controller/BaseController",
  'sap/m/MessageToast',
  'sap/ui/core/Fragment',
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/Filter',
  "sap/ui/model/FilterOperator",
  'sap/ui/model/json/JSONModel',
  "../helpers/GatewayHelper"
], function(jQuery, BaseController, MessageToast, Fragment, Controller, Filter, FilterOperator, JSONModel, GatewayHelper) {
  "use strict";
  var _invBy;
  var CController = BaseController.extend("simple_hello.Controller.showallinvsplit", {

    onInit: function() {
      var oRouter = this.getRouter();
      oRouter.attachRouteMatched(this._handleRouteMatched, this);

    },
    _handleRouteMatched: function(oEvt) {
      if (oEvt.getParameter("name") !== "dispallinv") {
        return;
      }

      this._getAllInvestments();
    },
    _getAllInvestments: function() {
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
        //check and insert item
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

    },
    _getSchemesAggr: function(invBy) {
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
      // Close the busy dialog
      if (that._dialog) {
        that._dialog.close();
      }

      // Parse Data
      var pdata = this._parseData(data);
      // Set the data to scheme model
      var manageinv_model = this.getView().getModel("manageinv_model");
      manageinv_model.setData(pdata);
      manageinv_model.updateBindings();
    },

    _getInvSchemeAggrfailure: function(err, that) {
      // Close the busy dialog
      if (that._dialog) {
        that._dialog.close();
      }
    },
    _parseData: function(data) {
      var pobj = {},
        parr = [];
      for (var i = 0; i < data.length; i++) {
        pobj.scode = data[i]._id.scode;
        pobj.sname = data[i]._id.sname;
        pobj.invFor = data[i]._id.invFor;
        pobj.count = data[i].count;
        pobj.total = data[i].total;
        parr.push(pobj);
        pobj = {};
      }
      return parr;
    },
    onUpdateFinished: function(oEvent) {

      // Get the goals model data
      var goaldata = this.getView().getModel("mfinvfor_model").getData().invFor;

    },

    onQuickFilter: function(oEvt) {
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

        iconTabBar.insertItem(oIconTabFilter, iconIndex);

      }

    }



  });

});
