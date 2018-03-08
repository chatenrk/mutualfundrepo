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
      var postdata, _fPanel, _tPanel;
      return BaseController
        .extend(
          "simple_hello.Controller.addmultiinv", {
            onInit: function() {

              this._fPanel = this.getView().byId("filePanel");
              this._fPanel.setExpandable(true);
              this._fPanel.setExpanded(true);

              this._tPanel = this.getView().byId("tablePanel");
              this._tPanel.setExpandable(true);
              this._tPanel.setExpanded(false);

              // Set the collection for Filter List
              var oFilterList = {

              };

            },

            onStartUpload: function(oEvent) {
              // var fU = this.getView().byId("idfileUploader");
              // var domRef = fU.getFocusDomRef();
              // var file = domRef.files[0];
              this._getUserDetails();
              // this._parserestcall(file);

            },

            _getUserDetails: function() {
              /**
               * @desc This helper method retrieves all the users from the database and shows them as a POP-UP
               */
              var that = this;
              GatewayHelper._getUserDetails().then(function(data) {
                that._getusrdtlssuccess(data, that);
              }, function(err) {
                that._getusrdtlsfailure(err, that);
              });

            },
            _getusrdtlssuccess: function(data, that) {

              // Set the data to the model(usrdetls_model)
              if (data.length > 0) {
                var oJSONModel = ModelHelpers._setModelData(this, "usrdetls_model", data);
                OtherHelpers._showDialogViaFragment("simple_hello.view.userselect", "usrdetls_model", oJSONModel, this);
              } else {

              }

            },

            handleClose: function(oEvent) {
              var ConfirmText, ConfirmYes = "Yes",
                ConfirmNo = "No",
                that = this;
              var aContexts = oEvent.getParameter("selectedContexts");
              if (aContexts && aContexts.length) {
                this._selusrname = aContexts.map(function(oContext) {
                  return oContext.getObject().name;
                });
                ConfirmText = "Do you want to post the Investments from the file for user " + this._selusrname;
                MessageHelpers._showConfirmDialog(ConfirmText, ConfirmYes, ConfirmNo).then(function(data) {
                  if (data === ConfirmYes) {
                    // Post the file data for the selected user

                    var fU = that.getView().byId("idfileUploader");
                    var domRef = fU.getFocusDomRef();
                    var file = domRef.files[0];
                    that._parserestcall(file,that._selusrname);

                  }
                });
              }
              oEvent.getSource().getBinding("items").filter([]);

            },


            _getusrdtlsfailure: function(err, that) {},

            _parserestcall: function(file,user) {

              // instantiate dialog
              if (!this._dialog) {
                this._dialog = sap.ui.xmlfragment("simple_hello.view.busydialog", this);
                this.getView().addDependent(this._dialog);
              }

              // open dialog
              var oJSONModel = this.getJSONModel();
              var data = {
                title: "Parse Investment Details File",
                text: "Parsing the Investment Details File. Please wait"
              }

              oJSONModel.setData(data);
              this.getView().setModel(oJSONModel, "busyDialog");

              jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
              this._dialog.open();

              var that = this;
              GatewayHelper._postMultiInvest(file,user).then(function(data) {
                that._postschdetsuccess(data, that);
              }, function(err) {
                that._postschdetfailure(err, that);
              });
            },

            _postschdetsuccess: function(data, that) {
              // Close the busy dialog
              if (that._dialog) {
                that._dialog.close();
              }

              this._fPanel.setExpanded(false);
              this._tPanel.setExpanded(true);

              // Add the data to model
              var parseData = that.parseSuccessData(data);


              // Set data for the tableparseSuccessData
              var pnav_model = that.getView().getModel("post_nav_model");
              pnav_model.setData(parseData);

              if (parseData.length > 50) {
                MessageToast.show(parseData.length + " records processed.Please use download functionality to check posting info in detail")
              } else {
                MessageToast.show(parseData.length + " records processed");
              }


            },
            _postschdetfailure: function(err, that) {
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
                    parseData.msg = errmsg;
                    pdata.push(parseData);
                    parseData = {};
                  }
                } else {
                  // Successfully inserted into DB

                  parseData.scode = data[i].operation.scode;
                  parseData.sname = data[i].operation.sname;
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
                    name: "Category",
                    template: {
                      content: "{category}"
                    }
                  },
                  {
                    name: "Assets",
                    template: {
                      content: "{assets}"
                    }
                  },
                  {
                    name: "Assets as on Date",
                    template: {
                      content: "{assetdate}"
                    }
                  },
                  {
                    name: "Assets Currency",
                    template: {
                      content: "{assetcurr}"
                    }
                  },
                  {
                    name: "Assets Currency Qualifier",
                    template: {
                      content: "{assetqual}"
                    }
                  },
                  {
                    name: "Expense Ratio",
                    template: {
                      content: "{expense}"
                    }
                  },
                  {
                    name: "Expense Ratio as on Date",
                    template: {
                      content: "{expensedate}"
                    }
                  },
                  {
                    name: "Fund House",
                    template: {
                      content: "{fhouse}"
                    }
                  },
                  {
                    name: "Launch Date",
                    template: {
                      content: "{ldate}"
                    }
                  },
                  {
                    name: "BenchMark",
                    template: {
                      content: "{bmark}"
                    }
                  },
                  {
                    name: "Risk",
                    template: {
                      content: "{risk}"
                    }
                  },
                  {
                    name: "Return",
                    template: {
                      content: "{return}"
                    }
                  },
                  {
                    name: "Return since launch",
                    template: {
                      content: "{rlaunch}"
                    }
                  },
                  {
                    name: "Min Investment",
                    template: {
                      content: "{mininv}"
                    }
                  },
                  {
                    name: "Min Additional Investment",
                    template: {
                      content: "{minaddinv}"
                    }
                  },
                  {
                    name: "Min Withdrawal",
                    template: {
                      content: "{minwith}"
                    }
                  },
                  {
                    name: "Min SWP Withdrawal",
                    template: {
                      content: "{minswpwith}"
                    }
                  },
                  {
                    name: "Min Balance",
                    template: {
                      content: "{minbal}"
                    }
                  },
                  {
                    name: "Exit Load",
                    template: {
                      content: "{exitload}"
                    }
                  },
                  {
                    name: "Plan Type",
                    template: {
                      content: "{ptype}"
                    }
                  },
                  {
                    name: "Scheme Type",
                    template: {
                      content: "{schtype}"
                    }
                  },
                  {
                    name: "Image Path",
                    template: {
                      content: "{imgpath}"
                    }
                  },
                  {
                    name: "Scheme URL",
                    template: {
                      content: "{schurl}"
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

              // OtherHelpers._populateColumnsExcelExtract(oExport,data);
              // download exported file
              oExport.saveFile().catch(function(oError) {
                MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
              }).then(function() {
                oExport.destroy();
              });


            } // Data Export Function end


          }); // Controller extend end
    }); // Main function end
