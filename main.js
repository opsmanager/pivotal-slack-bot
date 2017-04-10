var RtmClient = require('@slack/client').RtmClient;
var http = require('http');

var token = process.env.PIVOTAL_SLACK_BOT_TOKEN

var rtm = new RtmClient(token, {logLevel: 'debug'});
rtm.start();

var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

rtm.on(RTM_EVENTS.MESSAGE, function (message) {
  if(/\#\d+/.test(message.text)) {
    id = message.text.match(/\#\d+/)[0];
    id = id.replace('#', '');
    rtm.sendMessage('https://www.pivotaltracker.com/story/show/' + id, message.channel, function messageSent() {});
  }
});

var lastKnownStatus = 'up';

notifyChange = function() {
  var channelId = 'C02999QFK';
  rtm.sendMessage('Airdrilling is now '+lastKnownStatus, channelId, function messageSent(){});
}

checkStatus = function() {
  var options = {
    host: 'airdrilling.com',
    method: 'GET'
  };

  var req = http.request(options, function(res) {
    if (res.statusCode == 200) {
      if (lastKnownStatus != 'up') {
        lastKnownStatus = 'up';
        notifyChange();
      }
    }
    else {
      if (lastKnownStatus == 'up') {
        lastKnownStatus = 'down';
        notifyChange();
      }
    }
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.end();

  setTimeout(checkStatus, 900000);
}

checkStatus();
