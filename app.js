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
    session.send("Znam tylko menu, ale szybko się uczę");
});
bot.dialog('menu', (session, args, next) => {
    // Send message to the user and end this dialog
    request(url, function(err, resp, body) {
        $ = cheerio.load(body);
        menuTag = $('#menu > div > div > div.vc_col-sm-4.wpb_column.vc_column_container > div > div > div.wpb_text_column > div');
        session.send($(menuTag).text());
        session.endDialog();
    });
}).triggerAction({
    matches: /.*menu$/,
    onSelectAction: (session, args, next) => {
        session.beginDialog(args.action, args);
    }
});
bot.dialog('pomoc', (session, args, next) => {
    // Send message to the user and end this dialog
     session.send('Zamawiamy przez formularz -> https://goo.gl/forms/1W45f7VSnWU9HW6o2');
     session.endDialog();
}).triggerAction({
    matches: /.*pomoc$/,
    onSelectAction: (session, args, next) => {
        session.beginDialog(args.action, args);
    }
});
