var rfxcom = require('./index');

var express = require("express"),
    path = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    port = process.env["PORT"] || 8080;

var rfxtrx = new rfxcom.RfxCom("/dev/tty.usbserial-DO3O5EMF", {debug: false}),
    lighting4_fireworks = new rfxcom.Lighting4_fireworks(rfxtrx, rfxcom.lighting4.PT2262),
    lighting4_light = new rfxcom.Lighting4_scs_HCN0018(rfxtrx, rfxcom.lighting4.PT2262);

rfxtrx.on("lighting4", function (evt) {
  console.log("lighting4 data in:", evt);
});

rfxtrx.initialise(function () {
  console.log("Device initialised");
});

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/light', function (req, res) {
  var data = req.query;
  console.log(data);
  if (data.all == "on") {
    lighting4_light.switchAllOn();
  }
  else if (data.all == "off") {
    lighting4_light.switchAllOff();
  }
  else if (data.on) {
    lighting4_light.switchOn(data.on, (err, response, cmdId) => {
      console.log("Transmit OK");
    });
  }
  else if (data.off) {
    lighting4_light.switchOff(data.off, (err, response, cmdId) => {
      console.log("Transmit OK");
    });
  }

  res.sendStatus(200);
});

app.post('/', function(request, respond) {
  var data = request.body;
  console.log(data);
  if (data.rapid && data.area) {
    lighting4_fireworks.rapidFire(data.area);
  }
  else if (data.all && data.area) {
    lighting4_fireworks.allFire(data.area);
  }
  else if (data.area && data.line) {
    lighting4_fireworks.fire(data.area, data.line, function(err, response, cmdId) {
      console.log("Transmit OK");
    });
  }

  //respond.end();
  //respond.redirect("/");
  respond.sendStatus(200);
});

app.listen(port)
console.log("listening to server on port:", port);
var localIP = require('ip').address();
console.log(`listening to server on: http://${localIP}:${port}`);
