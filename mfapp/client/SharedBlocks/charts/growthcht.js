sap.ui.define(['sap/uxap/BlockBase','sap/m/MessageToast'], function (BlockBase,MessageToast) {
	"use strict";

	var growthcht = BlockBase.extend("simple_hello.SharedBlocks.charts.growthcht", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "simple_hello.SharedBlocks.charts.growthcht",
					type: "XML"
				},
				Expanded: {
					viewName: "simple_hello.SharedBlocks.charts.growthcht",
					type: "XML"
				}
			}
		}
	});
	return growthcht;
}, true);
