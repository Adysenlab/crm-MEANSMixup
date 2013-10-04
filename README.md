MEANS
=====

Mongo+Express+Angular+Node+Sails
crm sample

===============
# Demo Site
http://sample4.gtz.com:8001/

================================
Repos used in this project
===============
#### https://github.com/DanWahlin/CustomerManagerStandard
#### https://github.com/fnakstad/angular-client-side-auth
#### https://github.com/irlnathan/activityoverlord


Additional repos and references
##### http://ryanlanciaux.github.io/blog/2013/06/04/learning-angularjs/

###The Sails portion of the app is structured using the following folders:
![crm-MEANS App Structure]
(docs/crm-Means2.jpg))

###The AngularJS portion of the app is structured using the following folders:
![crm-MEANS App Structure]
(docs/crm-Means1.jpg)


## Requirements:

###You will be using Node.js/Sails Express/MongoDB...

If you don't already have Node.js on your machine install it from http://nodejs.org. You'll also need to install MongoDB from http://www.mongodb.org if you don't have it already and get it configured and running using the instructions on their site.

In the crm-MEANS directory execute 'npm install' which will all dependencies (package.json).
Note: This project uses Passport and Bcrpt for Authentication and encryption.
Bcrprt require Python 2.X and can be rather diffiult to install. Please follow the following wwebsites

https://npmjs.org/package/bcrypt
Follow dependencies section carefully

https://github.com/TooTallNate/node-gyp/
Follow Installtion section carefully

Python (v2.7.3 recommended, v3.x.x is not supported)
Windows XP/Vista/7:
Microsoft Visual Studio C++ 2010 (Express version works well)
For 64-bit builds of node and native modules you will also need the Windows 7 64-bit SDK
If the install fails, try uninstalling any C++ 2010 x64&x86 Redistributable that you have installed first.
If you get errors that the 64-bit compilers are not installed you may also need the compiler update for the Windows SDK 7.1

run npm install. If you dont have any errors your good to go

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

