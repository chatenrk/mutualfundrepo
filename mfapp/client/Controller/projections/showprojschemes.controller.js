sap.ui.define(
  [
    "simple_hello/Controller/BaseController",
    "sap/m/MessageToast",
    "	sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "../../helpers/GatewayHelper",
    "../../helpers/OtherHelpers",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV"
  ],
  function(
    BaseController,
    MessageToast,
    Sorter,
    Filter,
    GatewayHelper,
    OtherHelpers,
    Export,
    ExportTypeCSV
  ) {
    "use strict";
    var _dialog;
    return BaseController.extend(
      "simple_hello.Controller.projections.showprojschemes",
      {
        onInit: function() {
          var oRouter = this.getRouter();
          oRouter.attachRouteMatched(this._handleRouteMatched, this);

          // Set the selection panel to expanded and the table panel to collapsed
          this._showschselPanel = this.getView().byId("showschsel");
          this._showschselPanel.setExpandable(true);
          this.setPanelExpanded(this._showschselPanel, true); //Method invoked from Parent Controller

          this._showschtblPanel = this.getView().byId("showschtbl");
          this._showschtblPanel.setExpandable(true);
          this.setPanelExpanded(this._showschtblPanel, false); //Method invoked from Parent Controller
        },

        _handleRouteMatched: function(oEvt) {
          if (oEvt.getParameter("name") !== "showprojschemes") {
            return;
          }

          this._handleRefreshOnRouting();

          //Get Scheme Details for binding
          this._getProjSchemes();
        },

        /**
        * @desc This is a helper method that performs the refresh and toggle of the panels on routing
        *       It toggles the file panel to expanded,and the table panel to collapsed
        *       It also refreshes the file panel upload file name and sets the table contents to empty
        */

        _handleRefreshOnRouting: function() {
          this._fPanel = this.getView().byId("showschsel");
          this._fPanel.setExpandable(true);
          this._fPanel.setExpanded(true);

          this._tPanel = this.getView().byId("showschtbl");
          this._tPanel.setExpandable(true);
          this._tPanel.setExpanded(false);

          // Remove the value of the AMC
          this.getView()
            .byId("cbfname")
            .setValue("");

          // Set the table data to empty
          var pnav_model = this.getOwnerComponent().getModel("fewnavmodel");
          pnav_model.setData([]);
          pnav_model.updateBindings();
        },

        /**
        * @desc This method uses the helper class to get all the projection schemes from database
        */

        _getProjSchemes: function() {
          var that = this;
          GatewayHelper._getprojcatandfunds().then(
            function(data) {
              that._getprojsuccess(data, that);
            },
            function(err) {
              that._getprojfailure(err, that);
            }
          );
        },

        /**
        * @desc This method is the success event handler for the AMC ajax call.
        * @param data referring to the json array of data
        * Data obtained is set to the view's model
        */

        _getprojsuccess: function(data, that) {
          // Filter the data for unique values
          var fdata = OtherHelpers._findUnique(data, "schcat");

          // Set the scheme data to projection
          var projSchCatModel = this.getView().getModel("projschcatfilt_model");
          projSchCatModel.setData(fdata);
          projSchCatModel.updateBindings();

          // Set complete projection data
          var projModel = this.getView().getModel("projschcat_model");
          projModel.setData(data);
          projModel.updateBindings();
        },

        /**
         * @desc This method is the failure event handler for the AMC ajax call.
         * @param err referring to the error passed by the AJAX Call
         */
        _getprojfailure: function(err, that) {},

        /**
         * @desc This method acts as the event handler listening for the change in Scheme Category combo box
         * @param This uses a oEvt variable which has the data for the selected entry
         * This invokes the call to retrieve all the schemes for the scheme Category
         */

        onFHChange: function(oEvt) {
          // Get the current selected key
          var projSchCat = oEvt.getParameter("selectedItem").getKey();
          this.projSchCat = projSchCat;
        },
        onFilterProjection: function() {
          this._filterProjections();
        },

        _filterProjections: function() {
          var that = this;
          var projTempData = [];
          var projModel = this.getView().getModel("projschcat_model");
          var projModelData = projModel.getData();

          projModelData.map(function(projData) {
            if (projData.schcat === that.projSchCat)
              projTempData.push(projData);
          });

          var projSchemeModel = this.getView().getModel("projscheme_model");
          projSchemeModel.setData(projTempData);
          projSchemeModel.updateBindings();

          // Collapse the input panel and Expand the table panel
          this.setPanelExpanded(this._showschselPanel, false);
          this.setPanelExpanded(this._showschtblPanel, true);
        },

        // handleSearch: function(oEvent) {
        //   /**
        //        * @desc This method is the event handler for the search of pop-up for schemes.
        //        * @param oEvent referring to the selected scheme in the pop-up
        //        */

        //   var sValue = oEvent.getParameter("value");
        //   var oFilter = new sap.ui.model.Filter(
        //     "sname",
        //     sap.ui.model.FilterOperator.Contains,
        //     sValue
        //   );

        //   var oBinding = oEvent.getSource().getBinding("items");
        //   oBinding.filter([oFilter]);
        // },

        onRefresh: function() {
          this.getView()
            .byId("cbfname")
            .setValue("");
          this.getView()
            .byId("mfname")
            .setValue("");

          // Set the table binding to empty
          var mfinsmodel = this.getView().getModel("fewnavmodel");
          mfinsmodel.setData([]);
          mfinsmodel.updateBindings();

          // Collapse the table panel and Expand the input panel
          this.setPanelExpanded(this._showschselPanel, true);
          this.setPanelExpanded(this._showschtblPanel, false);
        },

        onDataExport:
          sap.m.Table.prototype.exportData ||
          function(oEvent) {
            var oExport = new Export({
              // Type that will be used to generate the content. Own ExportType's can be created to support other formats
              exportType: new ExportTypeCSV({
                separatorChar: ";"
              }),

              // Pass in the model created above
              models: this.getView().getModel("fewnavmodel"),

              // binding information for the rows aggregation
              rows: {
                path: "/"
              },

              // column definitions with column name and binding info for the content

              columns: [
                {
                  name: "Scheme Code",
                  template: {
                    content: "{scode}"
                  }
                },
                {
                  name: "Scheme Name",
                  template: {
                    content: "{sname}"
                  }
                },
                {
                  name: "Net Asset Value",
                  template: {
                    content: "{nav}"
                  }
                },

                {
                  name: "Date of NAV",
                  template: {
                    content: "{datefmtd}"
                  }
                }
              ] // Columns end
            }); // Export end

            // OtherHelpers._populateColumnsExcelExtract(oExport,data);
            // download exported file
            oExport
              .saveFile()
              .catch(function(oError) {
                MessageBox.error(
                  "Error when downloading data. Browser might not be supported!\n\n" +
                    oError
                );
              })
              .then(function() {
                oExport.destroy();
              });
          } // Data Export Function end
      }
    );
  }
);
