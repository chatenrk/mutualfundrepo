sap.ui
  .define(
    ["sap/ui/core/Fragment", "../helpers/MessageHelpers", "../helpers/GatewayHelper", "sap/m/MessageBox", "simple_hello/Controller/BaseController", "sap/m/MessageToast", "	sap/ui/model/Sorter", "sap/ui/model/Filter", 'simple_hello/libs/Moment'],
    function(Fragment, MessageHelpers, GatewayHelper, MessageBox, BaseController, MessageToast, Sorter, Filter, Moment) {
      "use strict";
      var _oMessageStrip, _invBy;
      var _dialog;
      return BaseController
        .extend(
          "simple_hello.Controller.manageinv", {
            onInit: function() {
              var oRouter = this.getRouter();
              _oMessageStrip = this.getView().byId("msgstrp");
              oRouter.attachRouteMatched(this._handleRouteMatched, this);
            },
            _handleRouteMatched: function(oEvt) {
              if (oEvt.getParameter("name") !== "manageinv") {
                return;
              }

              //  Get logged in user
              var logindata = this._getLoginData();
              if (logindata) {
                this._invBy = logindata.user.name;
                this._getMFGoals(this._invBy);
                this._getOwnInvestments(this._invBy);
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
                var mfinvformodel = this.getView().getModel("mfinvfor_model");
                var assetdata = this.getView().getModel("mfasset_model").getData();
                var bindingdata = {};

                bindingdata.invFor = data; // Assign the goals data from server to invFor
                bindingdata.assetType = assetdata; // This is asset type data read from local models


                mfinvformodel.setData(bindingdata);
                mfinvformodel.updateBindings();
              } else // No data recieved, repeat the ajax request
              {
                that._getMFGoals("Others");
              }
            },
            _getgoalsfailure: function(err, that) {

            },
            _getOwnInvestments: function(invBy) {
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
              this._owninvrestcall(invBy);
            },
            _owninvrestcall: function(invBy) {
              var that = this;
              GatewayHelper._getOwnInvestments(invBy).then(function(data) {
                that._getowninvsuccess(data, that);
              }, function(err) {
                that._getowninvfailure(err, that);
              });

            },

            _getowninvsuccess: function(data, that) {
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

            _getowninvfailure: function(err, that) {
              // Close the busy dialog
              if (that._dialog) {
                that._dialog.close();
              }
            },

            handleViewSettingsDialogButtonPressed: function(oEvent) {
              if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment("simple_hello.view.TableViewSettingsDialog", this);
              }
              // toggle compact style
              jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
              this._oDialog.open();
            },
            handleVSConfirm: function(oEvent) {
              // This is called when the OK button is pressed in the view settings dialog

              var oView = this.getView();
              var oTable = oView.byId("manageinvtable");

              var mParams = oEvent.getParameters();
              var oBinding = oTable.getBinding("items");

              var sPath;
              var bDescending;
              var aSorters = [];

              sPath = mParams.sortItem.getKey();
              bDescending = mParams.sortDescending;
              aSorters.push(new Sorter(sPath, bDescending));
              oBinding.sort(aSorters);

            },
            onInvSearch: function(oEvent) {

              // add filter for search
              var aFilters = [];
              var sQuery = oEvent.getSource().getValue();
              if (sQuery && sQuery.length > 0) {
                var filter = new Filter("sname", sap.ui.model.FilterOperator.Contains, sQuery);
                aFilters.push(filter);
              }

              var oView = this.getView();
              var oTable = oView.byId("manageinvtable");
              var oBinding = oTable.getBinding("items");
              oBinding.filter(aFilters, "Application");
            },

            _parseData: function(data) {
              var pobj = {},
                parr = [];
              for (var i = 0; i < data.length; i++) {
                pobj = data[i];
                pobj.invdatefmtd = moment(data[i].invdate).utcOffset("+05:30").format('DD-MMM-YYYY');
                parr.push(pobj);
                pobj = {};
              }
              return parr;
            },
            handleDeleteRow: function(oEvt) {
              var that = this;
              // Get id of the row selected for delete
              var id = oEvt.getSource().getBindingContext("manageinv_model").getProperty("_id");
              that.id = id;
              var sname = oEvt.getSource().getBindingContext("manageinv_model").getProperty("sname")
              var invdate = oEvt.getSource().getBindingContext("manageinv_model").getProperty("invdatefmtd")
              if (id !== "") {
                // Confirm row deletion
                MessageBox.confirm("Delete investment in " + sname + " invested on " + invdate, {
                  title: "Delete Investment Confirmation",
                  onClose: function(oAction) {
                    that._invdeloutcome(oAction, that);
                  }
                });
              }
            },
            _invdeloutcome: function(oAction, that) {
              // Process further based on the action

              if (oAction === MessageBox.Action.OK) {
                // Deletion is confirmed, delete the entry from the database and refresh the investment data
                this._delinv(that.id);
              }

            },

            _delinv: function(id) {
              var that = this;
              GatewayHelper._deleteInvDet(id).then(function(data) {
                if (data.ok === 1) {
                  if (data.n === 0) {
                    // No documents deleted in MongoDB
                    MessageHelpers._msgstripdisp(_oMessageStrip, "No data found for deletion");
                  } else {

                    // Now that the investment is deleted, retrigger the getInvestments method
                    that._getOwnInvestments(that._invBy);

                    var alrtmsg = data.n + " record(s) deleted from database";
                    var alrttitle = "Delete Successful"
                    MessageHelpers._msgbox("alert", alrtmsg, alrttitle);
                  }
                } else {
                  MessageHelpers._msgstripdisp(_oMessageStrip, "No data found for deletion");
                }
              }, function(err) {

              });
            },

            handleCopyRow: function(oEvt) {

              // Get the popover and change the content
              if (this._oPopover) {
                // Get the content from the invdetl fragment and add it to the popover
                if (!this._invcopy) {
                  this._invcopy = sap.ui.xmlfragment("investdetl", "simple_hello.view.invcopy", this);
                }
                var popoverContent = Fragment.byId("investdetl", "invdeltcopyVBOX");

                //remove all content
                this._oPopover.removeAllContent();
                this._oPopover.insertContent(popoverContent);



                this._cpybutton.setVisible(false);
                this._delbutton.setVisible(false);
                this._svbutton.setVisible(true);

              }
              // this._showpopover("change", oEvt);

            },

            handlePopOverPress: function(oEvt) {
              this._showpopover("display", oEvt);
            },

            disablePointerEvents: function() {
              this.byId("manageinvtable").$().css("pointer-events", "none");
            },

            enablePointerEvents: function() {
              this.byId("manageinvtable").$().css("pointer-events", "all");
            },

            _showpopover: function(type, oEvt) {

              if (!this._oPopover) {
                this._oPopover = sap.ui.xmlfragment("investpopover", "simple_hello.view.invpopover", this);
                this.getView().addDependent(this._oPopover);
                this._oPopover.attachAfterOpen(function() {
                  this.disablePointerEvents();
                }, this);
                this._oPopover.attachAfterClose(function() {
                  this.enablePointerEvents();
                }, this);
              }

              // // First check if the popover is open. If so close it
              // if(this._oPopover.isOpen() === true)
              // {
              //   this._oPopover.close();
              // }


              var oCtx = oEvt.getSource().getBindingContext("manageinv_model");
              var sPath = oCtx.getPath();
              this._oPopover.bindElement({
                path: sPath,
                model: "manageinv_model"
              });


              // var dispCont =
              // var dispVBox = Fragment.byId("investpopover","dispVBox");
              // var changeVBox = Fragment.byId("investpopover","changeVBox");
              this._svbutton = Fragment.byId("investpopover", "save");
              this._cpybutton = Fragment.byId("investpopover", "copy");
              this._delbutton = Fragment.byId("investpopover", "delete");


              //remove all content
              // this._oPopover.removeAllContent();

              if (type === "display") {
                // Get the content from the invdetl fragment and add it to the popover
                if (!this._invdetl) {
                  this._invdetl = sap.ui.xmlfragment("investdetl", "simple_hello.view.invdetl", this);
                }

                var popoverContent = Fragment.byId("investdetl", "invdeltdispVBOX");

                //remove all content
                this._oPopover.removeAllContent();
                this._oPopover.insertContent(popoverContent);

                this._cpybutton.setVisible(true);
                this._delbutton.setVisible(true);
                this._svbutton.setVisible(false);
              }

              // delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
              var oControl = oEvt.getSource();
              this._oPopover.openBy(oControl);
            },
            handleClose: function(oEvt) {
              if (this._oPopover) {
                this._oPopover.close();
              }
            }


          });
    });
