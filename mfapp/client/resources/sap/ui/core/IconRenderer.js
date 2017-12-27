/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./IconPool','./library'],function(q,I,l){"use strict";var a=l.IconColor;var b={};b.render=function(r,c){var i=I.getIconInfo(c.getSrc()),w=c.getWidth(),h=c.getHeight(),C=c.getColor(),B=c.getBackgroundColor(),s=c.getSize(),n=c.getNoTabStop(),L=c.getAriaLabelledBy(),A=c._getAccessibilityAttributes(),t=c._getOutputTitle(),o=c.getAggregation("_invisibleText");r.write("<span");r.writeControlData(c);r.writeAccessibilityState(c,A);if(t){r.writeAttributeEscaped("title",t);}if(c.hasListeners("press")&&!n){r.writeAttribute("tabindex",0);}if(i){r.writeAttributeEscaped("data-sap-ui-icon-content",i.content);r.addStyle("font-family","'"+q.sap.encodeHTML(i.fontFamily)+"'");}if(w){r.addStyle("width",w);}if(h){r.addStyle("height",h);r.addStyle("line-height",h);}if(C&&!(C in a)){r.addStyle("color",q.sap.encodeHTML(C));}if(B&&!(B in a)){r.addStyle("background-color",q.sap.encodeHTML(B));}if(s){r.addStyle("font-size",s);}r.addClass("sapUiIcon");if(i&&!i.suppressMirroring){r.addClass("sapUiIconMirrorInRTL");}if(c.hasListeners("press")){r.addClass("sapUiIconPointer");}r.writeClasses();r.writeStyles();r.write(">");if(L.length&&o){r.renderControl(o);}r.write("</span>");};return b;},true);
