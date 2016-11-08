var calamars = require('calamars');
var request = require('request');
var cheerio = require('cheerio');

const FacebookMessengerBot = calamars.FacebookMessengerBot;
const createRouter = calamars.createRouter;

const myPageToken = 'EAAW1CjZAZADS0BADIB8nI0t2lbAoRfAwzctZAZCGk2RQ5G5e9QdcNfY86lGbCfuYQUVRCILHrLtECS0X1oCAMr8Q6kuaMxteWLFSXbHR1YVtKZAmcsMP0SXZAITkduiHyqcLZC6psz1Xv3YTpdSGaWIQGMUJVGlGoEpTCfZAy3ZANYwZDZD';
const myVerifyToken = 'M06MrJ3wNNS27us5GGuI3jB/rU2w8arK6mvb9yrJc30oNnsx';
const myCallbackPath = '/webhook';
const myPort = 9091;

const callbacks = {
  getMenu() {
    var url = "http://www2.ufscar.br/restaurantes-universitario/";
    var msg = "";

    request(url, function(error, response, html){
        // First we'll check to make sure no errors occurred when making the request
        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
            // console.log(html);
          var $ = cheerio.load(html);
          $('div.cardapio_titulo').each(function(i, element){
            //  var span = $(this).prev();
            var e = $(this).text();

            if(e.indexOf('ALMOÇO') !== -1){
              var current = $(this);
              for (var i = 0; i < 7; i++) {
                current = current.next();
                msg += current.text();
              }
              console.log(msg);
            }
            // console.log(msg);
          });
        }
    });
    console.log(msg);
    return msg;
  }
}

const routes = [
    ['yes', 'no'],
    ['stop', 'go go go'],
    ['goodbye', 'hello'],
    ['high', 'low'],
    ['why', 'I don’t know'],
    ['cardapio',callbacks.getMenu],
    [/.*/, matches => matches[0]],
];
const router = createRouter(routes);

const myMessageListener = function(updateEvent){
    // output received message
    console.log('received update:', JSON.stringify(updateEvent.update, ' ', 2));
    var request = router(updateEvent.update.message.text);
    updateEvent.bot.sendMessage({
        userId: updateEvent.update.sender.id,
        text: request
    });
};

const mybot = new FacebookMessengerBot({
    port: myPort,
    callbackPath: myCallbackPath,
    verifyToken: myVerifyToken,
    pageTokens: [myPageToken],
    listeners: {
        onMessage: myMessageListener
    }
});

mybot.launchPromise.then(function(){
    console.log(`server is running on port ${myPort}`);
})
