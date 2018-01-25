sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var allinv = BlockBase.extend("simple_hello.SharedBlocks.invovw.debtinv", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "simple_hello.SharedBlocks.invovw.debtinv",
					type: "XML"
				},
				Expanded: {
					viewName: "simple_hello.SharedBlocks.invovw.debtinv",
					type: "XML"
				}
			}
		}
	});
	return allinv;
}, true);
