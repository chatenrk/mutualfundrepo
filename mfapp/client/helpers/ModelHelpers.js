sap.ui.define([], function() {
  "use strict";

  return {

    _getModel(that, modelname) {
      /**
       * @desc This is a helper function which gets the model object bound to the view.
       * @param that {object}: Reference to the "this" object of the calling view
       * @param modelname {string}: Reference to the modelname defined in the manifest
       * @return oJSONModel{object}: JSON Model Object
       */

      var oOwnerComponent = that.getOwnerComponent();
      var oJSONModel = oOwnerComponent.getModel(modelname);
      return oJSONModel;
    },
    _setModelData(that, modelname, data) {
      /**
       * @desc This is a helper function which gets the model object bound to the view.
       *       If data object is passed it will bind the data object to the model
       * @param that {object}: Reference to the "this" object of the calling view
       * @param data {array}: This refers to the data that needs to be bound. Might be empty
       */

      var oJSONModel = this._getModel(that, modelname);

      if (data) {
        oJSONModel.setData([]); // Initialise the data setting before setting the data
        oJSONModel.setData(data);
        oJSONModel.updateBindings;
      }
      return oJSONModel;
    }
  }
});
