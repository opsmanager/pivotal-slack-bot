var RtmClient = require('@slack/client').RtmClient;

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

