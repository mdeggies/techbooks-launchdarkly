# About

This project features an Angular UI (frontend) that displays tech books from GoodReads' API (backend). As a regular user, you'll be able to view the top 20 tech books from GoodReads, which was our app's MVP. As a QA user, you'll be able to check out our new infinite scroll feature and test it for bugs, browser compatability issues, etc. Simply scroll to the bottom of the page, and see all the new books that appear. Toggle between users to turn/off the infinite scroll functionality. 

We're using [LaunchDarkly](https://launchdarkly.com) and [LaunchDarkly's client-side node SDK](https://docs.launchdarkly.com/docs/node-client-sdk-reference#section-getting-started) for feature flag management, which gives us the flexibility to provide our users with different experiences. In this case, only QA will have access to test out our new feature. Once our infinite scroll feature has been thoroughly tested and given a big thumbs up, we'll roll it out to a small subset of our users to make sure they have a good experience as well. After that, we can keep gradually rolling out the feature until it becomes just another part of our website, or we can keep it targetted to specific subsets of users. 

GIF recording: http://g.recordit.co/DBXEvxaZhE.gif

![UI View](https://raw.githubusercontent.com/mdeggies/techbooks-launchdarkly/master/frontend/Dashboard.png)

## Pre-Req's

1. If you don't already have a LaunchDarkly account, sign up for one at [launchdarkly.com][https://launchdarkly.com). 
2. Under the `Feature Flags` menu, create a new flag called `infinite-scroll` and set the `key` and `name` to that value. Make sure you check the checkbox `Make this flag available to client-side SDKs`, as we'll be retrieving the flag's state from our client-side Angular app. 
3. Save the flag, and then click on it to navigate to the details page. Turn `Targeting` on in the `Test` environment, as we want to provide our users with different features. 
4. Under `Target individual users`, add `QA` to `true`. Under `Default rule`, make sure that `Serve` is set to `false`, as we want everyone other than `QA` to experience our stable site. Save your changes. 
5. Go to your [Account Settings Page](https://app.launchdarkly.com/settings/projects) and keep your `Test` environment's `Client-side ID` handy! We'll be using this as we set up the frontend. 

### Frontend: `launchdarkly-techbooks/frontend`

This is an Angular 8.1.1 app that makes requests to our backend to get data about tech books, and then displays those books in a scrollable component. There's a dropdown for users to select which type of user they are- either QA, Developer, Anonymous, or End-User. Only QA users will be able to check out our infinite scroll feature, which requests more books from the backend when a user scrolls all the way to the bottom of the scrollable component. These books are then displayed to the user for viewing.

#### Running the frontend server locally

1. Change your working directory to `launchdarkly-techbooks/frontend`.
2. Run `npm install` to install the required dependencies.
3. Rename the `.env-example` file to `.env`: `mv .env-example .env`.
4. In `.env`, set the value for `LAUNCH_DARKLY_API_KEY` to a real value. After creating a trial account on [LaunchDarkly](https://launchdarkly.com), you can go to [https://app.launchdarkly.com/settings/projects](https://app.launchdarkly.com/settings/projects) to view the `Client-side ID` for your `Test` environment. Our app needs these values set in order to authenticate to the API and make requests to LaunchDarkly's API, which is used for interacting with our users and feature flag states. 
5. Run `npm start` to start the server in development mode. If you make any changes to the app, they'll be picked up automatically and your browser will reload with the latest code. 
6. By default, the server will run on port 4200, and will be available at `localhost:4200`. Navigate to `localhost:4200` in your favorite browser to view the UI. 
7. Follow the steps under the `Backend` section to start your server -- this is what the frontend will call to get our books!

**NOTE** Please remember not to commit your `.env` file containing real API keys to github or any other version control system! 

### Backend: `launchdarkly-techbooks/backend`

This is a super simple node server that only has a single route, `/books`. `/books` requires a query param called page, which is used for pagination. When a call to `/books?page=XX` is called, a request is made to GoodRead's API to get data about technology books listed on their website. The data that's returned has a lot of information, but all we care about are the book's titles, authors, average user ratings, and image URL's. These are stored in an array that we return. 

Since our API calls to GoodReads don't receive an instant response, we made use of the async library. To be able to call this endpoint on our server from our Angular UI (at `localhost:4200`), we added cors support as well. This lets us make calls from `localhost:4200` to `localhost:3000`, from our default frontend port to our default backend port. 

#### Running the backend server locally

1. Change your working directory to `launchdarkly-techbooks/backend`.
2. Run `npm install` to install the required dependencies.
3. Rename the `.env-example` file to `.env`: `mv .env-example .env`.
4. In `.env`, set the values for `GOODREADS_API_KEY` and `GOODREADS_API_SECRET` to real values. After creating an account on [GoodReads](https://www.goodreads.com/), you can go to [goodreads.com/api/keys](goodreads.com/api/keys) to view your API key and secret. The server needs these values set in order to authenticate to the API and make requests to get book details from the GoodReads API.
5. Run `node server.js` to start the server. If you plan on making changes to the server file, make sure you have [nodemon](https://www.npmjs.com/package/nodemon) installed. This will automatically restart your server anytime a change is made. To use nodemon, run `nodemon server.js`.
6. By default, the server will run on port 3000, and will be available at `localhost:3000`. Try it out by making a GET request to `localhost:3000` using curl or postman, or just navigate to `localhost:3000` in your favorite browser.

**NOTE** Please remember not to commit your `.env` file containing real API keys to github or any other version control system! 

## Resources

1. [LaunchDarkly's Angular 4 Tutorial](https://launchdarkly.com/blog/integrating-feature-flags-in-angular-v4/) -- We used the same launchdarkly service and helper methods to subscribe to feature flag changes on the client, and to figure out who the current user is based on dropdown selections
2. [LaunchDarkly's client-side node SDK](https://docs.launchdarkly.com/docs/node-client-sdk-reference#section-getting-started) -- This is the library being used for feature flag management
3. [Boostrap theme](https://github.com/BlackrockDigital/startbootstrap-business-frontpage) -- We borrowed the HTML/CSS in this beautiful open-source template and repurposed it for our frontend
4. [ngx-infinite-scroller package](https://www.npmjs.com/package/ngx-infinite-scroller) -- This is toggled on when the current user is `QA` and the `infinite-scroll` feature flag in LaunchDarkly is set to `true`
5. [Angular CLI 8.1.1](https://www.npmjs.com/package/@angular/cli/v/8.1.1) -- This was used to create the app's scaffolding and tests. The CLI makes it easy to create a new Angular project, and add or remove components, routes, and services
6. [Angular CLI and OS Environment Variables](https://medium.com/@natchiketa/angular-cli-and-os-environment-variables-4cfa3b849659) -- This was used to configure environment variables

## Reach out

Any questions/comments? Feel free to open a new [Github Issue](https://github.com/mdeggies/techbooks-launchdarkly/issues) or reach out via email to mdeggies@gmail.com.
