# Mutual Fund App

**[Table of Contents]**
- [Mutual Fund App](#mutual-fund-app)
  - [Introduction](#introduction)
  - [Components](#components)
    - [Server side Coding](#server-side-coding)
      - [Routes](#routes)
      - [Models](#models)
      - [Helpers](#helpers)
      - [Config](#config)
    - [Client side Coding](#client-side-coding)
      - [Controllers](#controllers)
      - [Views](#views)
      - [Models](#models)
      - [Routing](#routing)
      - [Local Datasources](#local-datasources)
      - [i18n Internationalization](#i18n-internationalization)
      - [CSS stylesheets](#css-stylesheets)
      - [Third party Libraries](#third-party-libraries)
      - [Helper Classes](#helper-classes)
  - [Further Reading](#further-reading)
    - [OpenUI5](#openui5)
    - [MVC Architecture in OpenUI5](#mvc-architecture-in-openui5)
    - [Node JS and NPM](#node-js-and-npm)
      - [Express](#express)
      - [Mongoose](#mongoose)
    - [MongoDB](#mongodb)
    - [Moment](#moment)


## Introduction
Mutual Fund App is a demo app that is built using the following technologies
- [Open UI5](#openui5) for the front end development
- [Node.js](#node-js-and-npm) and [Express.js](#express) for the server side development and
- [MongoDB](#mongodb) as the database

## Components
This app has the following major components
- Server side coding which involves
    - Routing to send and receive data from MongoDB database
    - Models, which include [Mongoose](#mongoose) schemas, models
    - server.js file which houses the
    - package.json file
- Client side coding which involves
    - MVC Architecture for rendering the view, controller for sending and getting the data from the server, using JQuery AJAX requests, and models to hold the data on which the operations are performed

### Server side Coding
The important files in the server side code are as follows
- **server.js**
- **package.json**
#### Routes
#### Models
#### Helpers
#### Config

### Client side Coding
The important files in the client side code, which is housed in the [client](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client) folder of the app are as follows
- **index.html**
- **Component.js**
- **manifest.js**
#### Controllers
A controller contains methods that define how model and view interact. For more info refer to the [section](#mvc-architecture-in-openui5)

This app uses the following Controllers
##### [BaseController.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/BaseController.js)
This is the generic helper controller. It houses the most routinely used functions, that are re-used across various other controllers. This also acts as the parent controller for all other controllers created in the app.

Dependencies for this controller are
- **sap/ui/core/mvc/Controller** - This is used to define the extend the standard controller object
- **sap/ui/core/routing/History** - Useful for getting the history object, for back navigation
- **simple_hello/libs/Moment** - This is reference to third party Moment library(#moment), which is used for working with dates

Methods used in this controller
- **onInit** - This is a lifecycle hook method which is called when a view is instantiated and its controls (if available) have already been created; used to modify the view before it is displayed to bind event handlers and do other one-time initialization
- **_getLoginData** - This is a helper method that retrieves the login data for the user
- **_getInvestFor** - This is a helper method to get the Goals for the logged user
- **_goalsuccess** - This is the event handler success method for `_getInvestFor`
- **_goalfailure** - This is the event handler failure method for `_getInvestFor`
- **_isodatetodate**
    ```javascript
    // Convert ISO Date to DD-MMM-YYYY format and set it to IST Timezone
    var pdate = moment(isodate).utcOffset("+05:30").format('DD-MMM-YYYY');
    return pdate;
    ```
- **getJSONModel** - returns a new JSON Model
- **getRouter** - returns the router defined in Component.js
- **setPanelExpanded** - Helper method to set panel to expanded / collapsed based on the input passed to it
- **onNavBack** - This is the event callback method, taht is invoked when history routing is invoked, because the user has clicked on the back button
**Code snippet**
    ```javascript
    var oHistory, sPreviousHash;
    oHistory = History.getInstance();
    sPreviousHash = oHistory.getPreviousHash();
    if (sPreviousHash !== undefined) {
        window.history.go(-1);
    } else {
	    this.getRouter().navTo("appHome", {}, true /* * no
    												  * history
    												 */);
    }
    ```
##### [addamcs.controller.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/addamcs.controller.js)
##### [addmultnav.controller.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/addmultnav.controller.js)
##### [addnav.controller.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/addnav.controller.js)
##### [addschemes.controller.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/addschemes.controller.js)
##### [admin.controller.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/admin.controller.js)
##### [allinvovw.controller.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/allinvovw.controller.js)
##### [app.controller.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/app.controller.js)
##### [chatenmfdashboard.controller.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/chatenmfdashboard.controller.js)
##### [dashboard.controller.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/dashboard.controller.js)
##### [getamcs.controller.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/getamcs.controller.js)
##### [getschemes.controller.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/getschemes.controller.js)
##### [invdetldisp.controller.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/invdetldisp.controller.js)
##### [login.controller.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/login.controller.js)
##### [manageinv.controller.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/manageinv.controller.js)
##### [manageinv.controller.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/manageinv.controller.js)
##### [register.controller.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/register.controller.js)
##### [schdetails.controller.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/schdetails.controller.js)
##### [showallinv.controller.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/showallinv.controller.js)
##### [showallinvsplit.controller.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/showallinvsplit.controller.js)
##### [shownavsch.controller.js](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client/Controller/shownavsch.controller.js)


#### Views
#### Models
#### Routing
#### Local Datasources
#### i18n Internationalization
#### CSS stylesheets
[Custom CSS File](../client/css/style.css)
#### Third party Libraries
#### Helper Classes

## Further Reading
### OpenUI5
[Open UI5](https://openui5.hana.ondemand.com/) is an open source JavaScript UI library, maintained by SAP and available under the Apache 2.0 license. OpenUI5 lets you build enterprise-ready web applications, responsive to all devices, running on almost any browser of your choice. It’s based on JavaScript, using JQuery as its foundation, and follows web standards. It eases your development with a client-side HTML5 rendering library including a rich set of controls, and supports data binding to different models (JSON, XML and OData).

It is a JavaScript UI library consisting of a feature-rich core and a really large number of UI controls which are organized in a handful of libraries.

By “feature-rich” I mean stuff like data binding and models for different data sources, an efficient engine for creating and updating the HTML of the controls, support for a Model-View-Controller concept, support for declarative UI construction and HTML templates, automatic loading of the appropriate language resources and many other features along these lines.

SAP is using this UI library for business applications, where standards like security and supportability are crucial, so protection against cross-site scripting and other attacks and a powerful error analysis/inspection tool is integrated. And for sure SAP is investing a lot into automated and manual tests, from unit tests to screenshot comparisons.

UI5 is based on jQuery, which of course can be directly used in UI5 applications, but there’s a lot on top of it, so most of the time you might rather find yourself working with the controls.

Many other Open Source libraries are used in UI5 and come bundled with it, e.g. LESS, the famous CSS processor, or datajs, the OData library.

For more info refer to this [blog](https://blogs.sap.com/2013/12/11/what-is-openui5-sapui5/)

### MVC Architecture in OpenUI5
The Model View Controller (MVC) concept is used in SAPUI5 to separate the representation of information from the user interaction. This separation facilitates development and the changing of parts independently.

Model, view, and controller are assigned the following roles:

- The view is responsible for defining and rendering the UI.
- The model manages the application data.
- The controller reacts to view events and user interaction by modifying the view and model.

![alt text](https://help.sap.com/doc/saphelp_scm700_ehp03/7.0.3/en-US/ec/699e0817fb46a0817b0fa276a249f8/loio99b4be76a3f94db18172e67e730fb7fb_LowRes.png)

The purpose of data binding in the UI is to separate the definition of the user interface (view), the data visualized by the application (model), and the code for the business logic for processing the data (controller). The separation has the following advantages: It provides better readability, maintainability, and extensibility and it allows you to change the view without touching the underlying business logic and to define several views of the same data.

Views and controllers often form a 1:1 relationship, but it is also possible to have controllers without a UI, these controllers are called application controllers. It is also possible to create views without controllers. From a technical position, a view is a SAPUI5 control and can have or inherit a SAPUI5 model.

View and controller represent reusable units, and distributed development is highly supported.

### Node JS and NPM
#### Express
#### Mongoose

### MongoDB

### Moment
