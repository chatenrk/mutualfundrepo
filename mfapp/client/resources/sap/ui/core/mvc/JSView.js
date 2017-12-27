/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/library','./View','sap/ui/base/ManagedObject'],function(q,l,V,M){"use strict";var J=V.extend("sap.ui.core.mvc.JSView",{metadata:{library:"sap.ui.core"}});(function(){var r={};J.asyncSupport=true;sap.ui.jsview=function(i,v,a){var s={},o;if(v&&typeof(v)=="string"){s.viewName=v;if(typeof arguments[2]=="boolean"){s.async=a;}else if(typeof arguments[2]=="object"){s.controller=arguments[2];s.async=!!arguments[3];}o=new J(i,s);return o;}else if(v&&typeof(v)=="object"){r[i]=v;q.sap.declare({modName:i,type:"view"},false);}else if(arguments.length==1&&typeof i=="string"||arguments.length==2&&typeof arguments[0]=="string"&&typeof arguments[1]=="boolean"){s.viewName=arguments[0];s.async=!!arguments[1];o=s.id?new J(s.id,s):new J(s);return o;}else{throw new Error("Wrong arguments ('"+i+"', '"+v+"')! Either call sap.ui.jsview([sId,] sViewName) to instantiate a View or sap.ui.jsview(sViewName, oViewImpl) to define a View type.");}};J.prototype.initViewSettings=function(s){var p;if(!r[s.viewName]&&s.async){p=new Promise(function(a){var m=q.sap.getResourceName(s.viewName,".view");sap.ui.require([m],a);});}else if(!r[s.viewName]){q.sap.require({modName:s.viewName,type:"view"});}q.extend(this,r[s.viewName]);if(s.async){return p||Promise.resolve();}};J.prototype.onControllerConnected=function(c){var t=this;var p={};if(this.getAutoPrefixId()){p.id=function(i){return t.createId(i);};}p.settings=this._fnSettingsPreprocessor;M.runWithPreprocessors(function(){t.applySettings({content:t.createContent(c)});},p);};J.prototype.getAutoPrefixId=function(){return false;};}());return J;});
