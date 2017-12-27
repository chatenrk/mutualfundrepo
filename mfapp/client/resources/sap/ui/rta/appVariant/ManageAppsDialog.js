/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/ManagedObject','sap/ui/core/ComponentContainer','sap/m/Dialog','sap/ui/rta/appVariant/manageApps/webapp/Component',"sap/ui/fl/Utils"],function(M,C,D,a,F){"use strict";var _;var b=M.extend("sap.ui.rta.appVariant.ManageAppsDialog",{metadata:{properties:{rootControl:{name:"rootControl",type:"object"}},events:{"opened":{},"close":{}}},constructor:function(){_=arguments[0].rootControl;M.prototype.constructor.apply(this,arguments);}});b.prototype.init=function(){this._oTextResources=sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");this._oDialog=new D("manageAppsDialog");var r=_;var A=F.getAppDescriptor(r);var i=A["sap.app"].id;var o={title:A["sap.app"].title,subTitle:A["sap.app"].subTitle||'',description:A["sap.app"].description||'',icon:A["sap.ui"].icons.icon||'',componentName:A["sap.ui5"].componentName,idAppAdapted:i};this.oManageAppsComponent=new a("manageApps",{adaptedAppProperties:o});this.oManageAppsComponentContainer=new C({component:this.oManageAppsComponent});this._oDialog.addContent(this.oManageAppsComponentContainer);var B=this._createButton();this._oDialog.addButton(B);this._oDialog.setContentWidth("1000px");this._oDialog.setContentHeight("300px");this._oDialog.setShowHeader(false);};b.prototype.open=function(){return new Promise(function(r){this._oDialog.oPopup.attachOpened(function(){this.fireOpened();r(this);}.bind(this));this._oDialog.open();}.bind(this));};b.prototype._createButton=function(){var c=new sap.m.Button({text:this._oTextResources.getText("MAA_CLOSE_BUTTON"),press:[this._closeDialog,this]});return c;};b.prototype._closeDialog=function(){return new Promise(function(r){this._oDialog.oPopup.attachClosed(function(){this._oDialog.destroy();r(true);}.bind(this));this._oDialog.close();this.fireClose();}.bind(this));};b.prototype.exit=function(){this._oDialog.destroy();};return b;},true);
