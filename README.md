# hacked2017

**Requirements**
* [NodeJS](https://nodejs.org/en/download/)
* [Yarn](https://yarnpkg.com/lang/en/docs/install/)

**Setup with your own App**

Create an Intuit developer app [here](https://developer.intuit.com)  
Under MyApps - Create New App  
Go to your app and unders keys you will find the Client ID and Client Secret  
Add a config/secrets.json file containing the following:
```
{
    "client_id": "***********************",
    "client_secret": "**********************"
}
```

Also, update the client_id here: https://github.com/HackathonExamples/hacked2017/blob/master/html/index.html#L19

**Development Setup**
```
git clone git@github.com:HackathonExamples/hacked2017.git
yarn
node src/app.js
```