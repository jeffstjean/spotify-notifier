# Spotify Notifier Tool

A NodeJs + Express + React + MongoDB powered website for receiving real-time notifications from artist's newest releases on [Spotify](https://www.spotify.com/).

## Running Locally [WIP]

Make sure you have [Node.js](http://nodejs.org/) and [Docker](https://www.docker.com/) installed.

```sh
git clone https://github.com/jeffstjean/spotify-notifier # or clone your own fork
cd spotify-notifier/backend
npm install
cd ../frontend
npm install
cd ..
cp sample.env .env # fill in the .env file with your values
docker-compose up
```

## Running Locally [WORKING]

```sh
git clone https://github.com/jeffstjean/spotify-notifier # or clone your own fork
cd spotify-notifier
cp sample.env .env # fill in the .env file with your values
cd backend
npm install
npm run dev # either detach the process or open a new terminal
cd ../frontend
npm install
npm start
```

Your app should now be running on [localhost:3000](http://localhost:3000/) (or whatever port you specified). Make some changes in backend/server.js or frontend/app.js and watch Nodemon or React automatically restart the server.


## Deploying for Production

The steps for deploying to production are very similar, however the docker-compose command is run with a different yml file. You also do not need to install node modules because the production image will take care of bundling the code.

Make sure you have [Node.js](http://nodejs.org/) and [Docker](https://www.docker.com/) installed.

```sh
git clone https://github.com/jeffstjean/spotify-notifier # or clone your own fork
cd spotify-notifier
cp sample.env .env # fill in the .env file with your values
docker-compose -f docker-compose.prod.yml up
```

#### Notes

 - The application will be injected with the PRODUCTION environment variable so no stacktraces will be end-user visible (see [other benefits](https://dzone.com/articles/what-you-should-know-about-node-env) of PRODUCTION)
