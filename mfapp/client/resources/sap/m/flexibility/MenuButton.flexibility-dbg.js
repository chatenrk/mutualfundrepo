/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/m/changeHandler/SplitMenuButton",
	"sap/ui/fl/changeHandler/BaseRename"
], function (SplitMenuButtonsHandler, BaseRename) {
	"use strict";

	return {
		"splitMenuButton": SplitMenuButtonsHandler,
		"rename": BaseRename.createRenameChangeHandler({
			propertyName: "text",
			translationTextType: "XFLD"
		})
	};
}, /* bExport= */ true);