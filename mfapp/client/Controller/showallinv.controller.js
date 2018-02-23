sap.ui
        .define(
                [ "simple_hello/Controller/BaseController", "sap/m/MessageToast","sap/ui/model/json/JSONModel" ],
                function(BaseController, MessageToast,JSONModel) {
                    "use strict";
                    var _ownerComponent,_invdata;
                    return BaseController
                            .extend(
                                    "simple_hello.Controller.showallinv",
                                    {
                                        onInit : function()
                                        {
                                          var oRouter = this.getRouter();
                                        	oRouter.attachRouteMatched(this._handleRouteMatched, this);
                                          this._ownerComponent = this.getOwnerComponent();

                                        },

                                        _handleRouteMatched:function(oEvt)
                                        {
                                        	 if (oEvt.getParameter("name") !== "showallinv")
                                             {
                                               return;
                                             }
                                             this._getLoginData();
                                             if(this._lgndata && this._lgndata.user && this._lgndata.user.name !== '')
                                             {
                                                this._attachfragment("grpfname",this._lgndata.user.name);

                                             }

                                        },

                                        _getinvrestcall:function(user,authurl,tabId)
                                        {

                                			    var that = this;
                                          that.tabId = tabId;
                                			       $.ajax(
                                				      {
                                				        url:authurl,
                                				        type: 'GET',
                                				        dataType:'json',
                                				        success:function(data)
                                				        {
                                				        	that._getinvsuccess(data,that);

                                				        },
                                				        error:function(err)
                                				        {
                                				         that._getinvfailure(err,that);

                                				        }

                                				      });			//AJAX call close
                                        },
                                        _getinvsuccess:function(data,that)
                                        {
                                          this._invdata = data;

                                          var allinvModel = this.getView().getModel("allinvModel");
                                          var pdata = this._parseData(data,that.tabId)
                                          allinvModel.setData(pdata);
                                          allinvModel.updateBindings();

                                          this._bindcontenttofrag(that.tabId);

                                        },
                                        _getinvfailure:function(data,that)
                                        {

                                        },
                                        _parseData:function(data,tabId)
                                        {
                                            var parray = []
                                            var pdata = {};

                                              for(var i=0;i<data.length;i++)
                                              {
                                                pdata.group = data[i]._id;
                                                pdata.tamnt = data[i].total;
                                                pdata.count = data[i].count;
                                                pdata.tabId = tabId;
                                                pdata.schdet = data[i].schdet;
                                                // pdata.transaction = data[i].transaction;
                                                // pdata.amccode = data[i].amccode;
                                                // pdata.amcname = data[i].amcname;
                                                // pdata.scode = data[i].scode;
                                                // pdata.sname = data[i].sname;
                                                // pdata.invdate = thistoa._isodatetodate(data[i].invdate);
                                                // pdata.nav = data[i].nav;
                                                // pdata.units = data[i].units;
                                                // pdata.amount = data[i].amount;
                                                // pdata.remarks = data[i].remarks;
                                                // pdata.invFor = data[i].invFor;
                                                // pdata.assetType = data[i].assetType;
                                                // pdata.invBy = data[i].invBy;
                                                parray.push(pdata);
                                                pdata = {};
                                              }
                                              return parray;

                                          },
                                          _parseSchData:function(data)
                                          {
                                              var parray = []
                                              var pdata = {};

                                              

                                          },
                                          onItemSelected: function(oEvent)
                                          {
                                            /**
                                            * @desc This is the handler method for item selection.
                                            * Content is dynamically changed based on item that is selected
                                            */

                                            var tabpressed = oEvent.getSource().getSelectedKey();
                                            var tabarray = tabpressed.split("-");
                                            this._attachfragment(tabarray[2],this._lgndata.user.name);

                                          },
                                          _attachfragment:function(tabId,user)
                                          {
                                            /**
                                            * @desc Attach the fragment to the selected content.
                                            * Content is dynamically changed based on item that is selected
                                            */
                                            var authurl;
                                            switch (tabId)
                                            {

                                              case "grpfname":
                                                                authurl = "http://localhost:3000/mfinv/aggr?id=$sname&totcol=$amount&invBy="+user;
                                                                this._getinvrestcall(this._lgndata.user.name,authurl,"grpfname");
                                                                break;
                                              case "grpasttype":
                                                                authurl = "http://localhost:3000/mfinv/aggr?id=$assetType&totcol=$amount&invBy="+user;
                                                                this._getinvrestcall(this._lgndata.user.name,authurl,"grpasttype");
                                                                break;
                                              case "grpgoal":
                                                                authurl = "http://localhost:3000/mfinv/aggr?id=$invFor&totcol=$amount&invBy="+user;
                                                                this._getinvrestcall(this._lgndata.user.name,authurl,"grpgoal");
                                                                break;
                                              default:

                                            }


                                          },
                                          _bindcontenttofrag:function(tabId)
                                          {
                                            if (!this._oinvfrag)
                                            {
                                              this._oinvfrag = sap.ui.xmlfragment(this.getView().getId(),"simple_hello.view.invdisp", this);
                                              this.getView().addDependent(this._oinvfrag);

                                            }

                                            var oTab = this.getView().byId(tabId);
                                            oTab.removeContent();
                                            oTab.addContent(this._oinvfrag);



                                          },
                                          handleColumnPress:function(oEvent)
                                          {
                                            /**
                                            * @desc This is event handler for the column press event.
                                            * This function will process the click based on
                                            */

                                            var source = oEvent.getSource();
                                            var oBindingContext = source.getBindingContext("allinvModel");
                                            var tabId = oBindingContext.getProperty("tabId");
                                            var grpItem = oBindingContext.getProperty("group");


                                            var schdet = oBindingContext.getProperty("schdet");
                                            var parseData = this._parseSchData(schdet);
                                            var oModel = this.getView().getModel("dispinvdetl");
                                            oModel.setData([]);
                                            oModel.setData(parseData);
                                            oModel.updateBindings();

                                            // Navigate to show details
                                            var oRouter = this.getRouter();
                                            oRouter.navTo("invdetldisp");



                                            // switch (tabId) {
                                            //   case "grpfname":
                                            //                     authurl = "http://localhost:3000/mfinv/aggr?id=$sname&totcol=$amount&invBy="+user;
                                            //                     this._getinvrestcall(this._lgndata.user.name,authurl,"grpfname");
                                            //                     break;
                                            //   case "grpasttype":
                                            //                     authurl = "http://localhost:3000/mfinv/aggr?id=$assetType&totcol=$amount&invBy="+user;
                                            //                     this._getinvrestcall(this._lgndata.user.name,authurl,"grpasttype");
                                            //                     break;
                                            //   case "grpgoal":
                                            //                     authurl = "http://localhost:3000/mfinv/aggr?id=$invFor&totcol=$amount&invBy="+user;
                                            //                     this._getinvrestcall(this._lgndata.user.name,authurl,"grpgoal");
                                            //                     break;
                                            //   default:


                                            // }

                                          }

                                    });
                });
