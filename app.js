var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');
var cheerio = require('cheerio');
const dateformat = require('dateformat');

var url = 'http://nawidelcukoszalin.pl';
var url_park = 'http://parkcaffe.pl'

var inMemoryStorage = new builder.MemoryBotStorage();

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
}).set('storage', inMemoryStorage);

bot.dialog('menu', (session, args, next) => {
    // Send message to the user and end this dialog
    request(url, function(err, resp, body) {
        $ = cheerio.load(body);
        menuTag = $('#menu > div > div > div.vc_col-sm-4.wpb_column.vc_column_container > div > div > div > div');
        let menu = $(menuTag).text().replace(/\n\n/g, "")
        //menu = menu.substring(0, menu.indexOf("Cennik:"))
        let now = new Date();
        let todayFormat1 = dateformat(now, "dd/mm/yyyy");
        let todayFormat2 = dateformat(now, "dd.mm.yyyy");
        console.log(menu)
        if(menu.indexOf(todayFormat1) !== -1 || menu.indexOf(todayFormat2) !== -1) {
         session.send(menu);
         session.send('Zamawiamy do 11:30 przez formularz -> https://goo.gl/forms/1W45f7VSnWU9HW6o2');
         session.send('Weryfikacja -> https://docs.google.com/spreadsheets/d/1rblfoj6a8zf0VUzlcEq7PC4t1gfGGxj16GcoistNq_4');
         session.send('Po 11:30 zamówienia potwierdzamy telefonicznie 94 347 17 21 lub 515 083 735');
        } else {
         session.send('Dzisiejsze menu nie jest jeszcze gotowe:( Proszę spróbować później.');
        }
        session.endDialog();
    });
}).triggerAction({
    matches: /.*menu$/,
    onSelectAction: (session, args, next) => {
        session.beginDialog(args.action, args);
    }
});
bot.dialog('park', (session, args, next) => {
    // Send message to the user and end this dialog
    request(url_park, function(err, resp, body) {
        $ = cheerio.load(body);
        menuTag = $('#Content > div > div > div > div.section.the_content.has_content > div > div > div.vc_column-gap-3');
        let menu = $(menuTag).text();
        menu = menu.substring(menu.indexOf("215 zł") + 6);
        menu = menu.replace(/\n\s*\n/g, '\n');
        session.send(menu);
        session.endDialog();
    });
}).triggerAction({
    matches: /.*park/,
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
     session.send('Weryfikacja -> https://docs.google.com/spreadsheets/d/1rblfoj6a8zf0VUzlcEq7PC4t1gfGGxj16GcoistNq_4');
     session.endDialog();
}).triggerAction({
    matches: /.*pomoc$/,
    onSelectAction: (session, args, next) => {
        session.beginDialog(args.action, args);
    }
});
