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
  - [Excel Templates](#excel-templates)
  - [Further Reading](#further-reading)
    - [OpenUI5](#openui5)
    - [MVC Architecture in OpenUI5](#mvc-architecture-in-openui5)
    - [Node JS and NPM](#node-js-and-npm)
      - [Express](#express)
      - [Mongoose](#mongoose)
    - [MongoDB](#mongodb)
      - [Components](#Components)
      - [Utilities](#Utilities)
      - [Mongo Backup](#mongo-backup)
      - [Mongo Restore](#mongo-restore)  
      - [Sample Code Snippets](#sample-code-snippets)
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
The following route files are used at the server end.
- **amcroutes.js** - This handles all the routing related to AMC Data. The corresponding model is **amcmodel.js**
- **goalroutes.js** - This handles all the routing related to goals(Portfolio's). The corresponding model is **invfor.js**
- **mfinvroutes.js** - This handles all the routing related to investments made by the user. The corresponding model is **mfinvModel.js**
- **navroutes.js** - This handles all the routing related to nav details of the schemes. The corresponding model is **navModel.js**
- **projroutes.js** - This is WIP
- **schroutes.js** - This handles all the routing related to scheme data(scheme code and scheme details). The corresponding model is **schModel.js**
- **users.js** - This handles all the routing related to user data(login,registration etc). The corresponding model is **userModel.js**
#### Models
The following model helper are used at the server end.
- **amcmodel.js** - This is model helper class for AMC Data.
- **invfor.js** - This is model helper class for goals(Portfolio's)
- **mfinvModel.js** - This is model helper class for investments made by the user
- **navModel.js** - This is model helper class for NAV(Net Asset Value) details of the schemes.
- **schModel.js** - This is model helper class for scheme data(scheme code and scheme details)
- **userModel.js** - This is model helper class for user data(login,registration etc).
#### Helpers
The following helper files are used at the server end, which contain reusable code that can be used across models and routes.
- **Helpers.js**
This helper class is using the following functions
  - parseOutput
  - csvtojson - Used for converting the CSV file received from the client, to JSON array
  - asyncForEach - This provides a async For Loop functionality, useful when we need an async functionality for multiple records, like posting multiple records
  - checkpwd
  - parsetextNAV
  - findInArray
  - sumtotal
  - datetoisodate - Converts date to ISO Format using the moment framework
  - isodatetodate - Converts the isodate to date format using the moment framework
  - getNAV - Get the NAV for a scheme and date combo

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
This is the controller corresponding to the `showallinvsplit` view.

Dependencies for this controller are
- **jquery.sap.global**,
- **simple_hello/Controller/BaseController** - This is a reference to the basecontroller that was created,
- **sap/ui/model/Filter** - Used for filter operation on table binding,
- **sap/ui/model/FilterOperator** - Used for defining a filter operator(EQ,LT,GT etc.),
- **../helpers/GatewayHelper** - Reference to the gateway helper class

Methods used in this controller
- **onPressScheme** - This is a event handler that handles the click event of the table navigation

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

## Excel Templates
The following excel templates can be used in conjunction with the app to automate the day-to-day transaction.

### NAV Text file creation and processing
- Sample file for uploading NAV as a text file can be found [here](https://github.com/chatenrk/mutualfundrepo/tree/myinvbranch/mfapp/Excel%20Templates)

- This file retrieves the data from AMFI website for the AMC's that are mentioned in the **AMCsForRetrieval** sheet. Please ensure this sheet has the correct AMC code that is corresponding to the AMC mentioned, as this is used for retrieval
- Also ensure that the date range is not more than 3 months. If data needs to be extracted for a lengthier period, break it down into 3 months periods and run each period separately
- Once the data has been retrieved, it is stored as a .txt file with UTF-8 encoding. The excel would prompt for a folder where the said folder needs to be stored. On selecting the folder the file is created in that folder.
- Once all the requisite data files are created, they can be used as input for the **Add NAV** functionality of the app. At this moment the file needs to be in the app folder for the functionality to work as expected, so if the file is stored in a different folder, then it needs to be copied into the app folder

### Investments text file creation and processing

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
#### NPM Related
##### NPM Proxy Setting
Use the following code to set the NPM Proxy
```
For HTTP:
npm config set proxy http://proxy_host:port
For HTTPS:
npm config set https-proxy http://proxy.company.com:8080

To remove proxy use:
npm config rm https-proxy

```
#### Express
#### Mongoose

### MongoDB

#### COMPONENTS

- mongod - The database server.
- mongos - Sharding router.
- mongo  - The database shell (uses interactive javascript).

#### UTILITIES

- mongodump         - Create a binary dump of the contents of a database.
- mongorestore      - Restore data from the output created by mongodump.
- mongoexport       - Export the contents of a collection to JSON or CSV.
- mongoimport       - Import data from JSON, CSV or TSV.
- mongofiles        - Put, get and delete files from GridFS.
- mongostat         - Show the status of a running mongod/mongos.
- bsondump          - Convert BSON files into human-readable formats.
- mongoreplay       - Traffic capture and replay tool.
- mongotop          - Track time spent reading and writing data.
- install_compass   - Installs MongoDB Compass for your platform.


#### Mongo Backup
To take a backup of a MongoDB database, ensure that the Mongo Database is connected. Further run the following command

```
mongodump --gzip
```
The above command creates a **Dump** folder, where all the database are backed up in zipped format.The following are useful options that can be used along with the above command

```
--gzip
Compresses the output. If  mongodump  outputs to the dump directory, the new feature compresses the individual files. The files have the suffix  **.gz**.

--out <path>, -o <path>
Specifies the directory where mongodump will write BSON files for the dumped databases. By default, mongodump saves output files in a directory named **dump** in the current working directory.

--db <database>,-d <database>

Specifies a database to backup. If you do not specify a database,  mongodump  copies all databases in this instance into the dump files.

--collection <collection>, -c <collection>
Specifies a collection to backup. If you do not specify a collection, this option copies all collections in the specified database or instance to the dump files

```

#### Mongo Restore
To restore the backup to database, navigate to the dump folder and run the following command. Before running ensure that the zipped folder is unzipped

```
mongorestore --gzip
```

#### Sample Code Snippets
In all the code snippets below replace <collectionname> with actual name of collection in the database. Replace field with actual name of the field in the collection

##### Index creation and display

Use the following piece of code to create a index for a collection. In the below snippet, field1 and field2 is sorted on Ascending Order(1), and unique signifies no duplicate entries
```
db.<collectionname>.createIndex(
{field1:1,field2:1},{unique:true})
```

Use the following code to find indexes created for a collection
```
db.<collectionname>.getIndexes()
```

##### Find Documents in MongoDB
```
db.<collectionname>.find(
    { "field" : value}
).pretty()


db.<collectionname>.find(
    { "field" : "value",
      "field1" : "value1"}
).pretty()

```
##### Update document in a collection

Use the following piece of code to update a document in a collection. In the below code, field1 is the match condition, and field2 signifies the field which needs to be updated for the matched document
```
db.<collectionname>.update(
    { "field1" : value1},
    {
      $set: {
		"field2":"value2"

	    }

    }
)
```

##### Count documents in a collection
```
db.<collectionname>.count()
```

##### Delete documents in a collections
```
db.<collectionname>.deleteMany(
   { "field1" : value1}) 
```

### Moment
### JavaScript API documentation and comment standards
For error checking JavaScript files use [JSHint](http://jshint.com/)
For comments refer to JSDoc dcoumentation at [JSDoc](http://usejsdoc.org/)
