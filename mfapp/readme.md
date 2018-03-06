# Mutual Fund App

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
- `server.js`
- `package.json`
#### Routes
#### Models
#### Helpers
#### Config

### Client side Coding
The important files in the client side code, which is housed in the [client](https://github.com/chatenrk/mutualfundrepo/blob/master/mfapp/client) folder of the app are as follows
    - `index.html`
    - `Component.js`
    - `manifest.js`
#### Controllers
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

### Node JS and NPM
### Express
### MongoDB
### Mongoose
