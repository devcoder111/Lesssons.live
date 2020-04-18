# Lessons.Live App - React, Redux, Firebase


## How to use

Clone this repository:

	git clone git@github.com:joeleckroth/lessons.live.git

Install dependencies:

	cd lessons.live
	npm install

Build Webpack DLL dependencies(If necessary):

	npm run build:dll

Run App:

	npm start

The process should be take about 1-2 minutes.

Local Site will be running at `http://localhost:3000`


## Build Production

First you need to build the production assets first:

	npm run build

It usually takes longer time than development to generate and compress production code. The generated files will be placed in `build/`

Then start the app

	npm run start:prod
  
## Staging Deploy

If you want to deploy from your local you need first connect target to Firebase site

	  firebase target:apply hosting prod lessons-live

	  firebase target:apply hosting staging lessons
	  
	  firebase use --add

and then:

	firebase deploy --only hosting:staging

