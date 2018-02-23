sap.ui
        .define(
                [ "simple_hello/Controller/BaseController", "sap/m/MessageToast", 'sap/m/Popover','sap/m/Button',
                	'sap/m/MessageStrip','sap/m/MessageToast','sap/ui/model/Filter','simple_hello/libs/Moment'],
                function(BaseController, MessageToast,Popover,Button,MessageStrip,Filter,Moment) {
                    "use strict";

                    var _oStorage,_oMessageStrip,_amcdata,_schdata,_sname,_scode,_amccode,_navdata;
                    var _invdetPanel,_invtabPanel;
                    var _lgndata;
                    jQuery.sap.require("jquery.sap.storage");
                    return BaseController
                            .extend(
                                    "simple_hello.Controller.mfinvlog",
                                    {


                                        onInit : function()
                                        {
                                        	this._oMessageStrip = this.getView().byId("msgstrp");
                                        	var oRouter = this.getRouter();
                                        	oRouter.attachRouteMatched(this._handleRouteMatched, this);
                                        	this.oSF = this.getView().byId("searchField");

                                        	this._invdetPanel = this.getView().byId("mfinvdet");
                                        	this._invdetPanel.setExpandable(true);
                                        	this.setPanelExpanded(this._invdetPanel,true);

                                        	this._invtabPanel = this.getView().byId("mfinvtab");
                                        	this._invtabPanel.setExpandable(true);
                                        	this.setPanelExpanded(this._invtabPanel,false);

                                          this._getLoginData();
                                          if (this._lgndata.user.name!=="")
                                          {
                                            // Invoke the AJAX call for retrieving the Goals data
                                              this._getInvestFor(this._lgndata.user.name);
                                          }


                                        },
                                    	onExit : function ()
                                    	{
                                			if (this._oDialog)
                                			{
                                				this._oDialog.destroy();
                                			}
                                		},

                                        _handleRouteMatched:function(oEvt)
                                        {
                                        	 if (oEvt.getParameter("name") !== "mfinvlog") {

                                                 return;

                                             }
                                           this.onRefresh();
                                        	 this._getAMCs();


                                        },

                                        _getAMCs:function(){

                                        	var authurl = "http://localhost:3000/amc/all";
                                			var that = this;

                                			$.ajax(
                                				      {
                                				        url:authurl,
                                				        type: 'GET',
                                				        dataType:'json',
                                				        success:function(data)
                                				        {
                                				        	that._getamcsuccess(data,that);

                                				        },
                                				        error:function(err)
                                				        {
                                				         that._getamcfailure(err,that);

                                				        }

                                				      });			//AJAX call close

                                        },

                                        _getamcsuccess: function(data,that){



                                       	 // Set the data to AMC model
                                       	var amcModel =  this.getView().getModel("amc_model");
                                       	amcModel.setData(data);
                                       	amcModel.updateBindings();
                                        },
                                        _getamcfailure:function(err,that)
                                        {
                                        },
                                        onFHChange:function(oEvt){
                                        	// Get the current selected key
                                           var amccode = oEvt.getParameter("selectedItem").getKey();
                                           this._amccode = amccode;
                                          this._getSchemes(amccode);
                                        },


                                        _getSchemes:function(amccode)
                                        {
                                        	var authurl = "http://localhost:3000/schemes/sdet/amc";
                                			var that = this;

                                			var data = {
                                						amccode:amccode
                                						};

                                			$.ajax(
                              				      {
                              				        url:authurl,
                              				        type: 'GET',
                              				        data:data,
                              				        dataType:'json',
                              				        success:function(data)
                              				        {
                              				        	that._getschsuccess(data,that);

                              				        },
                              				        error:function(err)
                              				        {
                              				         that._getschfailure(err,that);

                              				        }

                              				      });			//AJAX call close

                                        },

                                        _getschsuccess:function(data,that)
                                        {

                                        	this._schdata = data;
                                        	// Set the data to Scheme model
                                           	var selschModel =  this.getView().getModel("selSchModel");
                                           	selschModel.setData([]);
                                           	selschModel.setData(data);
                                           	selschModel.updateBindings();

                                           	this._showSchemesPopup(selschModel);

                                        },

                                        _showSchemesPopup:function(selschModel){

                                        	if (!this._oDialog) {
                                				this._oDialog = sap.ui.xmlfragment("simple_hello.view.schemeselect", this);
//                                				this.getView().addDependent(this._oDialog);
                                			}

                                        	this._oDialog.setModel(null,"selschModel");
                                        	this._oDialog.setModel(selschModel,"selschModel");

                                			// toggle compact style
                                			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
                                			this._oDialog.open();

                                        },

                                        handleSearch: function(oEvent) {
                                			var sValue = oEvent.getParameter("value");
                                			var oFilter = new sap.ui.model.Filter("sname", sap.ui.model.FilterOperator.Contains, sValue);

                                			var oBinding = oEvent.getSource().getBinding("items");
                                			oBinding.filter([oFilter]);
                                		},
                                		handleClose: function(oEvent) {
                                			var aContexts = oEvent.getParameter("selectedContexts");
                                			if (aContexts && aContexts.length)
                                			{
                                				var mfname = this.getView().byId("mfname");
                                				this._sname = aContexts.map(function(oContext) { return oContext.getObject().sname; });
                                				mfname.setValue(this._sname);
                                				this._scode = aContexts.map(function(oContext) { return oContext.getObject().scode; });
                                			}
                                			oEvent.getSource().getBinding("items").filter([]);
                                		},
                                        onBeforeRendering:function()
                                        {
                                        	this._destroyMsgStrip(false);
                                        },

                                        onSubmit: function(oEvt){

                                        	var data = {};
                                        	var that = this;
                                          data.transaction = this.getView().byId("cbtran").getValue();
                                          data.amccode = this._amccode;
                                        	data.amcname = this.getView().byId("cbfname").getValue();
                                        	data.scode = this._scode[0];
                                        	data.sname = this.getView().byId("mfname").getValue();
                                    		  data.invdate = this.getView().byId("mfinvdate").getValue();
                                          data.amount = this.getView().byId("amntinv").getValue();
                                          if (data.transaction === "Sell")
                                          {
                                              data.amount = data.amount * -1;
                                          }
                                    		  // data.amount = this.getView().byId("amntinv").getValue();

                                    		  data.remarks = this.getView().byId("remarks").getValue();
                                    		  data.invFor = this.getView().byId("cbinvfor").getValue();
                                    		  data.assetType = this.getView().byId("cbassettype").getValue();




                                          if (this._lgndata.user.name === "")
                                          {
                                            var lgnerrflg = 'X';

                                          }
                                          else
                                          {
                                            data.invBy = this._lgndata.user.name;

                                          }



                                    			if (data.transaction === "" || data.amcname === "" || data.mfname === "" ||data.invdate === ""||data.amntinv === ""||data.invfor === ""||data.assettype === "")
                                            	{
                                            		this._generateMsgStrip("Please provide all the details on the form");
                                            	}
                                              else if(lgnerrflg === 'X')
                                              {
                                                lgnerrflg = '';
                                                this._generateMsgStrip("Issue with gettting data for logged in user. Please contact Admin");
                                              }
                                            	else
                                            	{
                                            		//NAV data
                                            		var navdata = this._getNAVData(data.scode,data.invdate);

                                            		navdata.done(function(pdata)
                                            				{
                                            					if(pdata.length>0)
                                            					{
                                            						data.nav = pdata[0].nav;

                                            					}
                                            					else
                                            					{
                                            						//Error fetching NAV Data. Popup for entry by user
                                                        data.nav  = that._launchOWNNAVPopup();
                                            					}
                                                      data.units = data.amount / data.nav;
                                                      that._destroyMsgStrip(false);
                                                      that._invrestcall(data);
                                            				});

                                            	}

                                  },
                                        _getNAVData:function(scode,invdate)
                                        {

                                        	var authurl = "http://localhost:3000/nav/navdet?scode="+scode+"&date="+invdate;
                                			var that = this;


                                			 return $.ajax(
                              				      {
                              				        url:authurl,
                              				        type: 'GET',
                              				        dataType:'json',
                              				        success:function(data)
                              				        {


                              				        },
                              				        error:function(err)
                              				        {


                              				        }

                              				      });			//AJAX call close



                                        },

                                        onRefresh: function()
                                        {
                                        this._destroyMsgStrip(false);
                                        this.getView().byId("cbtran").setValue("");
                                        this.getView().byId("cbfname").setValue("");
                                    		this.getView().byId("mfname").setValue("");
                                    		this.getView().byId("mfinvdate").setValue("");
                                    		this.getView().byId("amntinv").setValue("");
                                    		this.getView().byId("remarks").setValue("");
                                    		this.getView().byId("cbinvfor").setValue("");
                                    		this.getView().byId("cbassettype").setValue("");

                                        // Set the table binding to empty
                                        var mfinsmodel = this.getView().getModel("mfins_model");
                                			  mfinsmodel.setData([]);
                                				mfinsmodel.updateBindings();

                                        // Collapse the table panel and Expand the input panel
                                        this.setPanelExpanded(this._invdetPanel,true);
                                        this.setPanelExpanded(this._invtabPanel,false);
                                        },

                                	    _generateMsgStrip: function (msgtext,visible) {

                                			if(this._oMessageStrip){
                                				this._oMessageStrip.setVisible(visible);
                                				this._oMessageStrip.setText(msgtext);
                                			}

                                		},

                                		_destroyMsgStrip: function(visible)
                                		{
                                			if(this._oMessageStrip)
                                			{
                                				this._oMessageStrip.setVisible(visible);

                                			}
                                		},
                                		_invrestcall:function(logdata)
                                		{

                                			var authurl = "http://localhost:3000/mfinv/pone";
                                			var that = this;

                                			$.ajax(
                                				      {
                                				        url:authurl,
                                				        type: 'POST',
                                				        data: logdata,
                                				        dataType:'json',
                                				        success:function(data)
                                				        {
                                				        	that._invsuccess(data,that);

                                				        },
                                				        error:function(err)
                                				        {
                                				         that._invfailure(err,that);

                                				        }

                                				      });			//AJAX call close
                                		},
                                		_invsuccess: function(data,that)
                                		{
                                			// Change date from ISODate format to normal date. We are using the Moment JS framewrok for this
                                			data.operation.pdate = this._isodatetodate(data.operation.invdate);

                                			var pdata = that._parseData(data,that);
                                		var mfinsmodel = this.getView().getModel("mfins_model");
                            			  mfinsmodel.setData(data);
                            				mfinsmodel.updateBindings();
                            				this.setPanelExpanded(this._invdetPanel,false);
                            				this.setPanelExpanded(this._invtabPanel,true);

                                		},
                                		_invfailure:function(err,that)
                                		{


                                		},
                                		_parseData:function(data,that)
                                		{



                                			if(data.opsuccess === false)

                                			{
                                				switch(data.errcode)
                                				{
                                				case 11000:
                                					// Error inserting data. Display the same in the message strip
                                					data.msg = "Data already exists for combination of "+data.operation.sname +" and "+data.operation.pdate+". Please recheck"
                                					break;
                                				default:
                                					data.msg = "Error Occured. Please contact Admin"
                                				}
                                				that._generateMsgStrip(data.msg,true)
                                			}
                                			else
                                			{
                                				// Data inserted successfully
                                				var pdata ={};
                                				that._destroyMsgStrip(false);
                                        pdata.amcname = data.operation.transaction;
                                				pdata.amcname = data.operation.amcname;
                                				pdata.sname = data.operation.sname;
                                				pdata.date = data.operation.pdate;
                                				pdata.nav = data.operation.nav;
                                				pdata.units = data.operation.units;
                                				pdata.invFor = data.operation.invFor;
                                				pdata.assetType = data.operation.assetType;
                                				return pdata;

                                			}
                                		},

                                		_isodatetodate:function(isodate)
                                		{
                                			 var pdate = moment(isodate).utcOffset("+05:30").format('DD-MMM-YYYY');
                                			 return pdate;
                                		},

                                    _getInvestFor:function(username)
                                    {
                                      /**
                                      * @desc This method will be called on the initialization of this view.
                                      *       It is used to fetch the Goals that are created for the particular user
                                      *       It performs an AJAX call and fetches the data
                                      *       If no data is found for the user, it uses generic goals

                                      * @param This receieves username as an input
                                      * @return This returns the values found for the user in the database(InvGoals collection)
                                      *         If nothing found then it returns the data for others

                                      */

                                      var authurl = "http://localhost:3000/goal/goaldet?inv_for="+username;
                                      var that = this;

                                      $.ajax(
                                              {
                                                url:authurl,
                                                type: 'GET',
                                                dataType:'json',
                                                success:function(data)
                                                {
                                                  that._goalsuccess(data,that);

                                                },
                                                error:function(err)
                                                {
                                                 that._goalfailure(err,that);

                                                }

                                              });			//AJAX call close




                                    },

                                    _goalsuccess:function(data,that)
                                    {
                                      /**
                                      * @desc This is the success handler for Goals details.
                                      * If details are receieved then they are bound to the model, for display on the view
                                      * If no details are recieved, repeat the getInvestFor method with username as Others
                                      * @param data: data sent from the server
                                      * @param that: reference to the this variable of the view
                                      */
                                      if(data.length>0)
                                      {
                                        var mfinvformodel = this.getView().getModel("mfinvfor_model");
                                        var assetdata = this.getView().getModel("mfasset_model").getData();
                                        var bindingdata = {};

                                        bindingdata.invFor = data;            // Assign the goals data from server to invFor
                                        bindingdata.assetType = assetdata;    // This is asset type data read from local models


                                        mfinvformodel.setData(bindingdata);
                            				    mfinvformodel.updateBindings();
                                      }
                                      else  // No data recieved, repeat the ajax request
                                      {
                                        that._getInvestFor("Others");
                                      }
                                    },
                                    _goalfailure:function(err,that)
                                    {

                                    },
                                    _getLoginData:function()
                                    {
                                      /**
                                      * @desc This provides the login user information.
                                      * Data retrieved is bound to a global variable of the view
                                      */

                                      // Since this is being invoked from init(), we get the model from Owner Component

                                        var loginuser = this.getOwnerComponent().getModel("loggedin_user");
                                        this._lgndata = loginuser.getData();

                                    },
                                    _launchOWNNAVPopup:function()
                                    {
                                      // create popover
                                			if (!this._oPopover)
                                      {
                                				this._oPopover = sap.ui.xmlfragment("simple_hello.view.ownnav", this);
                                				this.getView().addDependent(this._oPopover);

                                			}

                                      this._oPopover.attachAfterClose(this._oPopoverclose);

                                      // delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
                                        var odateinv = this.getView().byId("mfinvdate");
                                        jQuery.sap.delayedCall(0, this, function ()
                                        {
                                				      this._oPopover.openBy(odateinv);
                                			  });
                                    },
                                    handleCancelPress:function()
                                    {
                                      this._oPopover.close();
                                      this._generateMsgStrip("Error fetching NAV. Please contact Admin")
                                    },
                                    handleSubmitPress:function()
                                    {
                                      var onavval = this.getView().byId("ownnavval");

                                    },
                                    _oPopoverclose:function(oEvt)
                                    {

                                    }

                                    });
                });
