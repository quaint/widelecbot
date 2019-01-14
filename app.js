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
        let menu = $(menuTag).text().replace(/\n\n/g, "")
        menu = menu.substring(0, menu.indexOf("Cennik:"))
        session.send(menu);
        session.send('Zamawiamy do 11:30 przez formularz -> https://goo.gl/forms/1W45f7VSnWU9HW6o2');
        session.send('Po 11:30 zamówienia potwierdzamy telefonicznie 94 347 17 21 lub 515 083 735');
        session.endDialog();
    });
}).triggerAction({
    matches: /.*menu$/,
    onSelectAction: (session, args, next) => {
        session.beginDialog(args.action, args);
    }
});
bot.dialog('udko', (session, args, next) => {
    request(url, function(err, resp, body) {
        $ = cheerio.load(body);
        menuTag = $('#menu > div > div > div.vc_col-sm-4.wpb_column.vc_column_container > div > div > div.wpb_text_column > div');
        if($(menuTag).text().toLowerCase().indexOf("udk") !== -1) {
           session.send('Jest udko :D @Robert zamawiaj!');
        } else {
           session.send('Niestety dziś udka brak:(');           
        }
        session.endDialog();
    });
}).triggerAction({
    matches: /.*udko$/,
    onSelectAction: (session, args, next) => {
        session.beginDialog(args.action, args);
    }
});
bot.dialog('pomoc', (session, args, next) => {
    // Send message to the user and end this dialog
     session.send('Zamawiamy do 11:30 przez formularz -> https://goo.gl/forms/1W45f7VSnWU9HW6o2');
     session.send('Po 11:30 zamówienia potwierdzamy telefonicznie 94 347 17 21 lub 515 083 735');
     session.send('Weryfikacja -> https://docs.google.com/spreadsheets/d/1tiejXab91kk9LA_hwnBCpO1iVzjrsMxWxIuwPMcSkvg');
     session.endDialog();
}).triggerAction({
    matches: /.*pomoc$/,
    onSelectAction: (session, args, next) => {
        session.beginDialog(args.action, args);
    }
});
