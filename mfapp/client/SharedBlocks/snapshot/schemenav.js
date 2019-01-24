sap.ui.define(['sap/uxap/BlockBase','sap/m/MessageToast'], function (BlockBase,MessageToast) {
	"use strict";

	var schemenav = BlockBase.extend("simple_hello.SharedBlocks.snapshot.schemenav", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "simple_hello.SharedBlocks.snapshot.schemenav",
					type: "XML"
				},
				Expanded: {
					viewName: "simple_hello.SharedBlocks.snapshot.schemenav",
					type: "XML"
				}
			}
		}
	});
	return schemenav;
}, true);
