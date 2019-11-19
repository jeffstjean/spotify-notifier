const Agenda = require('agenda');
const mongo = require('mongodb');
const job = require('./updateUserArtists');

const agenda = new Agenda({
    db: {address: process.env.DB_CONNECTION, collection: 'jobs'},
    processEvery: '2 seconds'
});

const start = async function() {
  agenda.on('ready', async function () {
    console.log('Job scheduler loaded')
    agenda.define(job.name, job.function);
    agenda.start();
    await agenda.schedule('in 2 seconds', job.name);
  });
}

module.exports = {
    agenda,
    start
}
