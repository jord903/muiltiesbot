var request = require('request'),
    JSONStream = require('JSONStream'),
    es = require('event-stream')
 
request({url: 'https://bittrex.com/api/v1.1/public/getmarketsummary?market=eth-zec'})
  .pipe(JSONStream.parse('result.*.Last'))
  .pipe(es.mapSync(function (data) {
    console.error(data)
    return data
  }
 )
)
