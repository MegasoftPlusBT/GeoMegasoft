* Main code editor used with markdown preview: Atom Editor
-----
# Project Name: HASELT.Ionic.Skeleton

-----
## Development Team
* ###### Jovica Saveski
    * HASELT (www.haselt.com)

-----
##* Steps to install:
  * Npm install
  * Bower install
  * (install cordova and ionic npm packages if not installed)
  * Start using the ionic project folder: Restore the ionic project state
  * Change project name in 'ionic.project', 'config.xml', and 'package.json'
  * Continue with development

-----
##* Project includes

* dev folder which using gulp is compiled and minified and set into www folder
* FOLDER-BY-FEATURE Angular Structure inside the dev folder
* INCLUDES SERVICES:
    * WEB Service
    * SQLite Service (db created in 'app.config.js')
    * Network connection services
    * 'Content' service that uses the SQLite Service, and executes SQL commands..

#### (You can use these as they are, and/or adapt them according to the project requirements.)
-----
### GULP flow

##### Read the gulp tasks and get to know them.
* To run on android device run:

      gulp run-android

* To run on ios device run:

            gulp build-device

  After that

            ionic build ios

  And continue with xCode.
  
  ionic serve
-----

# Development flow

* Use the 'dev' folder to develop
* Use gulp tasks accordingly
