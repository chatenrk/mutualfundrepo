/* global moment:true */
sap.ui
  .define(
    ["simple_hello/Controller/BaseController",
      "sap/m/MessageToast",
      "sap/m/UploadCollectionParameter",
      "../utils/helpers",
      "simple_hello/libs/Moment",
      "sap/ui/core/util/Export",
      "sap/ui/core/util/ExportTypeCSV",
      "../helpers/GatewayHelper",
      "../helpers/ModelHelpers",
      "../helpers/OtherHelpers",
      "../helpers/MessageHelpers"
    ],
    function(BaseController, MessageToast, UploadCollectionParameter, Helpers, Moment, Export, ExportTypeCSV, GatewayHelper, ModelHelpers, OtherHelpers, MessageHelpers) {
      "use strict";
      var postdata, _fPanel, _tPanel, _filename;
      return BaseController
        .extend(
          "simple_hello.Controller.addnav", {
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

            _handleRouteMatched: function(oEvt) {

              /**
               * @desc This it the event callback method that is registered for the handleRouteMatched event
               *       It triggers on every route match. Any data fetches/refreshes can be performed in this method
               * @param oEvt{object} referencing to the route matched event triggered via navigation
               */

              if (oEvt.getParameter("name") !== "addnav") {
                return;

              }

              this._handleRefreshOnRouting();
            },

            _handleRefreshOnRouting: function() {

              /**
               * @desc This is a helper method that performs the refresh and toggle of the panels on routing
               *       It toggles the file panel to expanded,and the table panel to collapsed
               *       It also refreshes the file panel upload file name and sets the table contents to empty
               */

              this._fPanel = this.getView().byId("filePanel");
              this._fPanel.setExpandable(true);
              this._fPanel.setExpanded(true);

              this._tPanel = this.getView().byId("tablePanel");
              this._tPanel.setExpandable(true);
              this._tPanel.setExpanded(false);

              // Remove the value of the file name field
              this.getView().byId("idfileUploader").setValue("");

              // Set the table data to empty
              var pnav_model = this.getOwnerComponent().getModel("post_nav_model");
              pnav_model.setData([]);
              pnav_model.updateBindings();

              // Set the collection for Filter List
              var oFilterList = {

              };

            },

            onStartUpload: function(oEvent) {
              /**
               * @desc This is a event callback method that is invoked when the upload button is clicked.
               *       This retrieves the file that is attached and passed it onto the parse method for processing
               */

              var fU = this.getView().byId("idfileUploader");
              var domRef = fU.getFocusDomRef();
              var file = domRef.files[0];

              // Store the file name for further processing
              this._filename = file.name.split(".")[0]

              this._parserestcall(file);

            },

            _parserestcall: function(file) {
              /**
               * @desc This is a helper method that recieves the file, ana calls the GatewayHelper method to post the
               *       same to the database
               */

              // instantiate dialog
              if (!this._dialog) {
                this._dialog = sap.ui.xmlfragment("simple_hello.view.busydialog", this);
                this.getView().addDependent(this._dialog);
              }

              // open dialog
              var oJSONModel = this.getJSONModel();
              var data = {
                title: "Parse NAV File",
                text: "Parsing the NAV File. Please wait"
              }

              oJSONModel.setData(data);
              this.getView().setModel(oJSONModel, "busyDialog");

              jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
              this._dialog.open();

              var that = this;

              GatewayHelper._postMultiNAV(file).then(function(data) {
                that._postnavsuccess(data, that);
              }, function(err) {
                that._pfailure(err, that);
              });

            },

            _postnavsuccess: function(data, that) {
              // Close the busy dialog
              if (that._dialog) {
                that._dialog.close();
              }

              this._fPanel.setExpanded(false);
              this._tPanel.setExpanded(true);

              // Add the data to model

              var parseData = that.parseSuccessData(data);


              // Set data for the table
              var pnav_model = that.getView().getModel("post_nav_model");
              pnav_model.setData(parseData);

              if (parseData.length > 50) {
                MessageToast.show(parseData.length + " records processed.Please use download functionality to check posting info in detail")
              } else {
                MessageToast.show(parseData.length + " records processed");
              }


            },
            _postnavfailure: function(err, that) {
              // Close the busy dialog
              if (that._dialog) {
                that._dialog.close();
              }
            },
            parseSuccessData: function(data) {
              var parseData = {};

              var pdata = [];
              var dupkeyerr = "duplicate key error";
              var errmsg = "Data already exists in database. No operation performed";
              var succmsg = "Data inserted successfully into database";
              for (var i = 0; i < data.length; i++) {
                // perform required array operations

                if (data[i].opsuccess === false) {
                  // Error during insertion
                  if (data[i].message.includes(dupkeyerr)) {
                    // Record already exists in DB
                    parseData.scode = data[i].operation.scode;
                    parseData.sname = data[i].operation.sname;
                    parseData.nav = data[i].operation.nav;


                    // Convert date to DD-MM-YYYY format
                    var pdate = moment(data[i].operation.date).utcOffset("+05:30").format('DD-MMM-YYYY');
                    parseData.date = pdate;


                    //                                        				 parseData.date = data[i].operation.date;
                    parseData.msg = errmsg;
                    pdata.push(parseData);
                    parseData = {};


                  }
                } else {
                  // Successfully inserted into DB

                  parseData.scode = data[i].operation.scode;
                  parseData.sname = data[i].operation.sname;
                  parseData.nav = data[i].operation.nav;


                  // Convert date to DD-MM-YYYY format
                  var pdate = moment(data[i].operation.date).utcOffset("+05:30").format('DD-MMM-YYYY');
                  parseData.date = pdate;



                  parseData.msg = succmsg;
                  pdata.push(parseData);
                  parseData = {};


                }
              }
              return pdata;
            },

            onDataExport: sap.m.Table.prototype.exportData || function(oEvent) {
              var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                  separatorChar: ";"
                }),

                // Pass in the model created above
                models: this.getView().getModel("post_nav_model"),

                // binding information for the rows aggregation
                rows: {
                  path: "/"
                },

                // column definitions with column name and binding info for the content

                columns: [{
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
                    name: "NAV",
                    template: {
                      content: "{nav}"
                    }
                  },
                  {
                    name: "Date",
                    template: {
                      content: "{date}"
                    }
                  },
                  {
                    name: "Posting Message",
                    template: {
                      content: "{msg}"
                    }
                  }
                ] // Columns end
              }); // Export end

              // download exported file
              var expfilename = "Processed File - " + this._filename;
              oExport.saveFile(expfilename).catch(function(oError) {
                MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
              }).then(function() {
                oExport.destroy();
              });


            } // Data Export Function end


          }); // Controller extend end
    }); // Main function end
