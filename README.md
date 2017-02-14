# Vulnerability search engine 

An automated vulnerability search engine compatible for changes and adaption to any project for **NodeJS**.

## Getting Started

In order to have this project up and running, git clone the repository. Then a few lines of installing dependencies will be prompted, in order to run the project.

### Prerequisites

To run the project the following **commands** are a necessity:

```
npm install
npm update
```

## The Project
The main page is the core of the project from where navigation starts:
<img width="737" alt="front" src="https://cloud.githubusercontent.com/assets/18006842/22466221/a23d5b76-e7bf-11e6-8c91-51b8f8c4be92.png">

* Decide a vulnerability to search for
* Select sources 
* Enjoy the results

The following picture illustrates an example of the view: _Add to database_.
<img width="500" alt="search" src="https://cloud.githubusercontent.com/assets/18006842/22480507/ed2d35c0-e7f1-11e6-9286-6bb0305879bb.png">

In this case an article from NVD - [National Vulnerability Database](https://nvd.nist.gov/).

## Integrating your own sources

Altering the sources for the project is made as effortlessly as possible to have the user create his own version of the engine. There are **three possible** ways, either beneath the class CVE, Newspapers or Forums in the file "index.html". Then just add your source as the snippet instructs you to do. The code is located at around row 50.
```
<input  type="checkbox" value="Your source" ng-model="sources['Your source']">   Name of your source

```
However, this project uses Unfluff as a package, hence the problems for Unfluff are inherited to this project. See more [here](https://github.com/ageitgey/node-unfluff#what-is-broken).

**If** you want to add your own API and not sure how to do, don't hesitate to contact us at har12gry@student.lu.se, guidance will be provided.

To optimize the search, you have to manually add CVE with its AKA in the CVE table in the database.

## Deployment

In order to deploy the project, all that needs to be done is uploading the project to your own web server. Have you not done this before? Then we **recommend** the tutorial DigitalOcean has provided for uploading a NodeJS application. Please see [here](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)

## Built With

* [Unfluff](https://github.com/ageitgey/node-unfluff) - "An automatic web page content extractor for Node.js!"
* [Bootstrap](http://getbootstrap.com/) - Bootstrap design
* [ExpressJS](http://expressjs.com/) - Server Framework
* [MySQL-node](https://www.npmjs.com/package/mysql) - Database 
* [AngularJS](https://angularjs.org/) -  Front end 
* [NodeJS](https://nodejs.org/en/) - The core of the project


## Authors

* **Gustav Ryrlén ** - *Project development* - [Gustav](https://github.com/gustavryrlen/)
* **Jacob Hegelund ** - *Project development* - [Jacob](https://github.com/Jhegelund)
* **Alexander Ljungqvist ** - *Project development* - [Alexander](https://github.com/AlexanderLjungqvist)

## License

Free for all.

## Acknowledgments

* Unfluff package.
* Google API.
* Twitter  API.
