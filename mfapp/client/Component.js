sap.ui.define([ "sap/ui/core/UIComponent",'simple_hello/libs/Moment' ],

function(UIComponent,Moment) {
	"use strict";
	return UIComponent.extend("simple_hello.Component", {

		init :function() {


			var oJSONModel =  new sap.ui.model.json.JSONModel();
			oJSONModel.loadData("models/navbar.json", "",false);
			this.setModel(oJSONModel,"navbar_model");

			UIComponent.prototype.init.apply(this, arguments);

			// set the current date to the model
			var datemodel = this.getModel("current_date");
			var date = moment().format("DD-MMM-YYYY");
			var currdate = {};
			currdate.date = date;
			datemodel.setData(currdate);
			datemodel.updateBindings();

      // create the views based on the url/hash
      this.getRouter().initialize();

		},

		_adjustNavItems:function(usr_log_flag)
		{


			var nbar_model = this.getModel("navbar_model");
        	var data = nbar_model.getData();

        	var nview_model = new sap.ui.model.json.JSONModel();

        	var itms = [];

        	for(var i=0;i<data.length;i++){
        		if(data[i].usr_log_flag === usr_log_flag)
        		{
        			itms.push(data[i]);
        		}
        	}



			nview_model.setData(itms);
			this.setModel(nview_model,"nview_model");
		},

		_adjustButtons:function(usrlgndata)
		{
			var usrlgnmodel = this.getModel("usrlgn_model");
			usrlgnmodel.setData(null);
			usrlgnmodel.setData(usrlgndata);

		},

		metadata : {
			manifest :"json"
		}

	});
});
