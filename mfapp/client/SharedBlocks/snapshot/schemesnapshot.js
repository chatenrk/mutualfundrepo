sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var schemesnapshot = BlockBase.extend("simple_hello.SharedBlocks.snapshot.schemesnapshot", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "simple_hello.SharedBlocks.snapshot.schemesnapshot",
					type: "XML"
				},
				Expanded: {
					viewName: "simple_hello.SharedBlocks.snapshot.schemesnapshot",
					type: "XML"
				}
			}
		}
	});
	return schemesnapshot;
}, true);