var rfxcom = require('./index');

var express = require("express"),
    path = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    bodyParser = require('body-parser'),
    port = process.env["PORT"] || 8080;

var rfxtrx = new rfxcom.RfxCom("/dev/tty.usbserial-DO3O5EMF", {debug: false}),
    lighting4 = new rfxcom.Lighting4(rfxtrx, rfxcom.lighting4.PT2262);

rfxtrx.on("lighting4", function (evt) {
  console.log("lighting4 data in:", evt);
});

rfxtrx.initialise(function () {
  console.log("Device initialised");

  // lighting4.sendData("0xF701B1");

  // lighting4.rapidFire(1);
  // lighting4.allFire(1);

  // lighting4.fire(1, 3, function(err, response, cmdId) {
  //   console.log("Transmit OK", err, response, cmdId);
  // });

});

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.post('/', function(request, respond) {
  var data = request.body;
  console.log(data);
  if (data.rapid && data.area) {
    lighting4.rapidFire(data.area);
  }
  else if (data.all && data.area) {
    lighting4.allFire(data.area);
  }
  else if (data.area && data.line) {
    lighting4.fire(data.area, data.line, function(err, response, cmdId) {
      console.log("Transmit OK");
    });
  }
});

app.listen(port)
console.log("listening to server on port:", port);