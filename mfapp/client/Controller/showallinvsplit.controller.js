sap.ui.define([
		'jquery.sap.global',
		"simple_hello/Controller/BaseController",
		'sap/m/MessageToast',
		'sap/ui/core/Fragment',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/Filter',
		'sap/ui/model/json/JSONModel'
	], function(jQuery,BaseController, MessageToast, Fragment, Controller, Filter, JSONModel) {
	"use strict";
	var _invBy;
	var CController = BaseController.extend("simple_hello.Controller.showallinvsplit", {

		onInit: function()
		{
			var oRouter = this.getRouter();
			oRouter.attachRouteMatched(this._handleRouteMatched, this);

		},
		_handleRouteMatched:function(oEvt)
		{
			 if (oEvt.getParameter("name") !== "dispallinv") {
					 return;
				 }

			 this._getAggregation("Goals");
		},
		_getAggregation:function(aggrtype,invFor)
		{
			// Get Login Data
				var logindata = this._getLoginData();
				if(logindata)
				{
					var invBy = logindata.user.name;
					this._invBy = invBy;
					if(aggrtype === "Goals")
					{
						this._getGoalsAggr(invBy);
					}
					else if(aggrtype === "GlsSchemes")
					{
						this._getGoalsSchemesAggr(invBy,invFor);
					}
				}

		},
		_getGoalsAggr:function(invBy)
		{
			var goalAggrUrl = "http://localhost:3000/mfinv/aggr?invBy="+invBy;
			var that = this;

			$.ajax(
							{
								url:goalAggrUrl,
								type: 'GET',
								dataType:'json',
								success:function(data)
								{
									that._getGoalsAggrSuccess(data,that);

								},
								error:function(err)
								{
								 that._getGoalsAggrFailure(err,that);

								}

							});

		},
		_getGoalsAggrSuccess:function(data,that)
		{
			var parr = this._parseData(data,"Goals");
			// this.sortArray(parr,"name");

			var spappmodel = this.getOwnerComponent().getModel("splitapp");
			spappmodel.setData([]);
			spappmodel.setData(parr);
			spappmodel.updateBindings();

		},
		_getGoalsAggrFailure:function(err,that){},
		_getGoalsSchemesAggr:function(invBy,invFor)
		{
			var goalAggrUrl = "http://localhost:3000/mfinv/aggr?invBy="+invBy+"&invFor="+invFor;
			var that = this;

			$.ajax(
							{
								url:goalAggrUrl,
								type: 'GET',
								dataType:'json',
								success:function(data)
								{
									that._getGoalsSchemesAggrSuccess(data,that);

								},
								error:function(err)
								{
								 that._getGoalsSchemesAggrFailure(err,that);

								}

							});
		},
		_getGoalsSchemesAggrSuccess:function(data,that)
		{
			var parr = this._parseData(data,"GlsSchemes");

			var spappmodel = this.getOwnerComponent().getModel("splitapp");
			spappmodel.setData([]);
			spappmodel.setData(parr);
			spappmodel.updateBindings();
		},
		_getGoalsSchemesAggrFailure:function(err,that)
		{

		},
		_parseData:function(data,caller)
		{
			var pobj = {},parr = [];
			if(caller === "Goals")
			{
				for(var i=0;i<data.length;i++)
				{
					pobj.name = data[i]._id;
					pobj.total = data[i].total;
					pobj.count = data[i].count;
					pobj.curr = 'INR';
					parr.push(pobj);
					pobj = {};
				}
				return parr;
			}
			else if (caller === "GlsSchemes")
			{
				for(var i=0;i<data.length;i++)
				{
					pobj.name = data[i]._id.sname;
					pobj.total = data[i].total;
					pobj.count = data[i].count;
					pobj.scode = data[i]._id.scode;
					pobj.curr = 'INR';
					parr.push(pobj);
					pobj = {};
				}
				return parr;
			}
		},
    onMasterPress:function(oEvt)
    {
			var invFor = oEvt.getSource().getBindingContext("splitapp").getProperty("name");
			this._getAggregation("GlsSchemes",invFor);
    },
		onOrientationChange: function(oEvent) {
			var bLandscapeOrientation = oEvent.getParameter("landscape"),
				sMsg = "Orientation now is: " + (bLandscapeOrientation ? "Landscape" : "Portrait");
			MessageToast.show(sMsg, {duration: 5000});
		},

		onPressNavToDetail : function(oEvent) {
			this.getSplitAppObj().to(this.createId("detailDetail"));
		},

		onPressDetailBack : function() {
			this.getSplitAppObj().backDetail();
		},

		onPressMasterBack : function()
		{
			this.getSplitAppObj().backMaster();
		},

		onPressGoToMaster : function() {
			this.getSplitAppObj().toMaster(this.createId("master2"));
		},

		onListItemPress : function(oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();

			this.getSplitAppObj().toDetail(this.createId(sToPageId));
		},

		onPressModeBtn : function(oEvent) {
			var sSplitAppMode = oEvent.getSource().getSelectedButton().getCustomData()[0].getValue();

			this.getSplitAppObj().setMode(sSplitAppMode);
			MessageToast.show("Split Container mode is changed to: " + sSplitAppMode, {duration: 5000});
		},

		getSplitAppObj : function() {
			var result = this.byId("SplitAppDemo");
			if (!result) {
				jQuery.sap.log.info("SplitApp object can't be found");
			}
			return result;
		}

	});

});
