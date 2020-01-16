var rfxcom = require('./index');

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

  lighting4.fire(1, 1, function(err, response, cmdId) {
    console.log("Transmit OK", err, response, cmdId);
  });

});

