var timer;
var request = require('request');
var JSONStream = require('JSONStream');
var es = require('event-stream');
_get();

var data = [];

function _get() {
  clearTimeout(timer);
  var replyMsg = '';
  request({url: 'https://bittrex.com/api/v1.1/public/getmarketsummary?market=eth-zec'})
  .pipe(JSONStream.parse('result.*'))
  .pipe(es.mapSync(function (data) {
	  replyMsg = data;

    }));
	console.log(replyMsg);
  timer = setInterval(_get, 10000); //每一分鐘抓取一次新資料
}