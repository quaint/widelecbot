var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');
var cheerio = require('cheerio');

var url = 'http://nawidelcukoszalin.pl';

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
     session.send('Zamawiamy do 11:30 przez formularz -> https://goo.gl/forms/1L9wzEJwxzCD8Hnm1');
     session.send('Weryfikacja -> https://docs.google.com/spreadsheets/d/1qf2s7RV5QeVXcSNXK1KI12oiMWMGyb9bWFBUjVhVQLo');
     session.endDialog();
});
