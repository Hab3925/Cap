//NAPI V4 File
const express = require('express')
const superagent = require('superagent')
const app = express()
const port = 7863 //enter port here
const apikey = 'ica3C-ByELk-QNLYA-lKpyl'

let ip = '0.0.0.0:0000'

if (!ip.match(/\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}:\d{1,5}/)) return { code: 500, err: 'Invalid IP Adress Supplied' }

// uncomment for ip cache logging
// setInterval(() => {
//   console.log(ip)
// }, 5000);

app.put('/', function (req, res, next) {
    if (!req.headers || !req.headers.ip) { res.status(400).json({ error: 'Bad Request' }); return false }
    ip = req.headers.ip
    res.sendStatus(204)
})
function senddata(data) {
    if (!data) return false
    if (typeof data != 'object') return true
    superagent.post(ip).set('Content-Type', 'application/json').set('apikey', apikey).send(data).catch(e => { throw (e) })
}

module.exports.send = senddata

app.listen(port, () => {
    console.log(new Date().toLocaleString() + ' | FeedbackCollection | ' + `Running on Port ${port}`)
})