MEANS
=====

Mongo+Express+Angular+Node+Sails

===============


Repos used in this project
===============
https://github.com/DanWahlin/CustomerManagerStandard
#### https://github.com/fnakstad/angular-client-side-auth
#### https://github.com/irlnathan/activityoverlord

![Customer Management App](https://raw.github.com/DanWahlin/CustomerManager/master/CustomerManager/Content/images/customerApp.png)

The AngularJS portion of the app is structured using the following folders:

![Customer Management App Structure](https://github.com/johntom/crm-MEANS/blob/master/docs/crm-Means1.jpg)


## Requirements:

###If you're using Node.js/Express/MongoDB/Sails

If you don't already have Node.js on your machine install it from http://nodejs.org. You'll also need to install MongoDB from http://www.mongodb.org if you don't have it already and get it configured and running using the instructions on their site.

In the crm-MEANS directory execute 'npm install' to install Express, MongoDB and SAILS (package.json).

Load sample data into MongoDB by performing the following steps:

* Execute 'mongod' to start the MongoDB daemon
* Navigate to the CustomerManager directory (the one that has initMongoCustData.js in it) then execute 'mongo' to start the MongoDB shell
* Enter the following in the mongo shell to load the seed files:
 * use crm
 * load("initMongoUserData.js")
 * load("initMongoSettingsData.js")
 * load("initMongoStateData.js")

Start the Node/Express server:
* navigate to the CustomerManager/server directory then execute 'sails lift'

View the application at http://localhost:1337

