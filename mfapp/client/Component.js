sap.ui.define([ "sap/ui/core/UIComponent" ],

function(UIComponent) {
	"use strict";
	return UIComponent.extend("simple_hello.Component", {

		init :function() {
			

			var oJSONModel =  new sap.ui.model.json.JSONModel();
			oJSONModel.loadData("models/navbar.json", "",false);
			this.setModel(oJSONModel,"navbar_model");
			
			UIComponent.prototype.init.apply(this, arguments);
			
			
            // create the views based on the url/hash
            this.getRouter().initialize();

		},

		metadata : {
			manifest :"json"
		}

	});
});