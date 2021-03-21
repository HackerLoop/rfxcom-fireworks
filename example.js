var rfxcom = require('./index');

var rfxtrx = new rfxcom.RfxCom("/dev/tty.usbserial-DO3O5EMF", {debug: false}),
    fireworks = new rfxcom.Lighting4_fireworks(rfxtrx, rfxcom.lighting4.PT2262),
    light = new rfxcom.Lighting4_scs_HCN0018(rfxtrx, rfxcom.lighting4.PT2262);

rfxtrx.on("lighting4", function (evt) {
  console.log("lighting4 data in:", evt);
});

rfxtrx.initialise(function () {
  console.log("Device initialised");

  // fireworks.sendData("0xF701B1");

  // fireworks.rapidFire(1);
  // fireworks.allFire(1);

  fireworks.fire(1, 1, function(err, response, cmdId) {
    console.log("Transmit OK", err, response, cmdId);
  });

  light.switchOn(1, (err, response, cmdId) => {
    console.log("Transmit OK", err, response, cmdId);
  });

  // light.switchOff(2);
  // light.switchAllOn();
  // light.switchAllOff();
});

