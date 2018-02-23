sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var allinv = BlockBase.extend("simple_hello.SharedBlocks.invovw.allinv", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "simple_hello.SharedBlocks.invovw.allinv",
					type: "XML"
				},
				Expanded: {
					viewName: "simple_hello.SharedBlocks.invovw.allinv",
					type: "XML"
				}
			}
		}
	});
	return allinv;
}, true);
