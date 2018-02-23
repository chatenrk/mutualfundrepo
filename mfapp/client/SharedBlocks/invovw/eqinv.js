sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var allinv = BlockBase.extend("simple_hello.SharedBlocks.invovw.eqinv", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "simple_hello.SharedBlocks.invovw.eqinv",
					type: "XML"
				},
				Expanded: {
					viewName: "simple_hello.SharedBlocks.invovw.eqinv",
					type: "XML"
				}
			}
		}
	});
	return allinv;
}, true);
