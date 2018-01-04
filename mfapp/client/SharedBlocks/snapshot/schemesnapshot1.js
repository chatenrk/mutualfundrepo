sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var schemesnapshot1 = BlockBase.extend("simple_hello.SharedBlocks.snapshot.schemesnapshot1", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "simple_hello.SharedBlocks.snapshot.schemesnapshot1",
					type: "XML"
				},
				Expanded: {
					viewName: "simple_hello.SharedBlocks.snapshot.schemesnapshot1",
					type: "XML"
				}
			}
		}
	});
	return schemesnapshot1;
}, true);