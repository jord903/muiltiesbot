var linebot = require('linebot');
var express = require('express');
var getJSON = require('get-json');
var request = require('request');
var JSONStream = require('JSONStream');
var es = require('event-stream');
var Array = require('node-array');

var bot = linebot({
  channelId: '1532029112',
  channelSecret: 'bdaaeaa65585d4ce4f3797f79867124d',
  channelAccessToken: 'DIRKZiwxHJR4WovPL+c8Kvm6zPmkYQs/vvUQsvfyb93mOBnpYhRTuutIi/qGaOGun/v/doYAvG2b2W6v5XgXpmd2cH3GtkZE9P8GZVpeSDTUUAP7Q/RLTb5xcgQfKLJHa101gwEKbr1nBBeSrknfdwdB04t89/1O/w1cDnyilFU=',
  verify: true
  });

var timer;
var pm = [];
var coin = [];
_getJSONpm();
_bot();
const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});

function _bot() {
  bot.on('message', function(event) {
    console.log(event); //把收到訊息的 event 印出來看看
    if (event.message.type == 'text') {
      var msg = event.message.text;
      var replyMsg = '';
      if (msg.indexOf('PM2.5') != -1) {
        pm.forEachAsync(function(e, i) {
          if (msg.indexOf(e[0]) != -1) {
            replyMsg = e[0] + '的 PM2.5 數值為 \n' + e[1];
          }
        });
        if (replyMsg == '') {
          replyMsg = '請輸入正確的地點';
        }
      }
      if (msg.indexOf('bot coin') != -1) {
        coin.forEachAsync(function(c, n) {
          if (msg.indexOf(n[0]) != -1) {
            replyMsg = '\[ ' + n[0] + ' \]\n' + '\nLast \-\-\> ' + n[1] + '\nBid \-\-\> ' + n[2] + '\nAsk \-\-\> ' + n[3];
          }
        });
        if (replyMsg == '') {
          replyMsg = '請輸入正確的幣值';
        }
      }

      event.reply(replyMsg).then(function(data) {
        console.log(replyMsg);
      }).catch(function(error) {
        console.log('error');
      });
    }
  });

}

function _getJSONpm() {
  clearTimeout(timer);
  getJSON('http://opendata2.epa.gov.tw/AQX.json', function(error, pm25) {
    pm25.forEachAsync(function(e, i) {
      pm[i] = [];
      pm[i][0] = e.SiteName;
      pm[i][1] = e['PM2.5'] * 1;
      pm[i][2] = e.PM10 * 1;
    });
  });
  timer = setInterval(_getJSONpm, 60000); //每一分鐘抓取一次新資料
}