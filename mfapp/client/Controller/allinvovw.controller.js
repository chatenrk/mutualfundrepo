sap.ui
        .define(
                [ "simple_hello/Controller/BaseController", "sap/m/MessageToast","sap/ui/model/json/JSONModel" ],
                function(BaseController, MessageToast,JSONModel) {
                    "use strict";
                    var _ownerComponent;
                    return BaseController
                            .extend(
                                    "simple_hello.Controller.allinvovw",
                                    {
                                        onInit : function()
                                        {

                                          var oRouter = this.getRouter();
                                          oRouter.attachRouteMatched(this._handleRouteMatched, this);
                                        },

                                        _handleRouteMatched:function(oEvt)
                                        {
                                           if (oEvt.getParameter("name") !== "dispallinv")
                                             {
                                               return;
                                             }
                                             this._getLoginData();
                                             if(this._lgndata && this._lgndata.user && this._lgndata.user.name !== '')
                                             {
                                               this._getinvrestcall(this._lgndata.user.name);
                                             }

                                        },

                                        _getinvrestcall:function(user)
                                        {
                                          var authurl =  "http://localhost:3000/mfinv/aggr?id=$amcname&totcol=$amount&invBy="+user;
                                			    var that = this;

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
                                          var pdata = this._parseData(data);
                                          var allinvModel = this.getView().getModel("allinvModel");
                                          allinvModel.setData([]);
                                          allinvModel.setData(pdata);
                                          allinvModel.updateBindings();
                                        },
                                        _getinvfailure:function(data,that)
                                        {

                                        },
                                        _parseData:function(data)
                                        {
                                          var parseobhdr = {},parseob={};
                                          var parseArray = [];

                                          for(var i=0;i<data.length;i++)
                                          {
                                            parseobhdr.amcname = data[i]._id;
                                            parseobhdr.total = data[i].total;
                                            parseobhdr.count = data[i].count;

                                            for(var j=0;j<data[i].schdet.length;j++)
                                            {
                                              parseob.amcname = parseobhdr.amcname;
                                              parseob.total = parseobhdr.total;
                                              parseob.count = parseobhdr.count;
                                              parseob.transaction = data[i].schdet[j].transaction;
                                              parseob.amccode = data[i].schdet[j].amccode;
                                              parseob.scode = data[i].schdet[j].scode;
                                              parseob.sname = data[i].schdet[j].sname;
                                              parseob.amount = data[i].schdet[j].amount;
                                              parseob.assetType = data[i].schdet[j].assetType;
                                              parseob.invFor = data[i].schdet[j].invFor;
                                              parseob.dnav = this._isodatetodate(data[i].schdet[j].invdate);
                                              parseob.nav = data[i].schdet[j].nav;
                                              parseob.units = data[i].schdet[j].units;
                                              parseArray.push(parseob);
                                              parseob = {};
                                            }
                                            parseobhdr = {};

                                          }
                                          return parseArray;

                                        }

                                    });
                });
