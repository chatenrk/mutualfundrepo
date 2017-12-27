/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Element','./Splitter','./AssociativeSplitter'],function(q,l,E,S,A){"use strict";var P=E.extend("sap.ui.layout.PaneContainer",{metadata:{library:"sap.ui.layout",properties:{orientation:{type:"sap.ui.core.Orientation",group:"Behavior",defaultValue:sap.ui.core.Orientation.Horizontal}},defaultAggregation:"panes",aggregations:{panes:{type:"sap.ui.core.Element",multiple:true,singularName:"pane"}}}});P.prototype.init=function(){this._oSplitter=new A({orientation:this.getOrientation(),height:"100%"});this._oSplitter._bUseIconForSeparator=false;};P.prototype.setOrientation=function(o){this._oSplitter.setOrientation(o);return this.setProperty("orientation",o,true);};P.prototype._getPanesInInterval=function(f){return this.getPanes().filter(function(p){return p instanceof sap.ui.layout.SplitPane&&p._isInInterval(f);});};P.prototype.setLayoutData=function(L){return this._oSplitter.setLayoutData(L);};P.prototype.insertPane=function(o,i){var r=this.insertAggregation("panes",o,i),e={onAfterRendering:function(){this.triggerResize();this.removeEventDelegate(e);}};if(o instanceof P&&o._oSplitter){o._oSplitter.addEventDelegate(e,o._oSplitter);}return r;};P.prototype.removePane=function(o){var r=this.removeAggregation("panes",o),e={onAfterRendering:function(){this.triggerResize();this.removeEventDelegate(e);}};this.getPanes().forEach(function(p){if(p instanceof P&&p._oSplitter){p._oSplitter.addEventDelegate(e,p._oSplitter);}});return r;};return P;},true);
