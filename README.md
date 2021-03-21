# RFXCOM Fireworks :fireworks:

Node.js example to use a RFXCOM to operate a 433MHz fireworks system.

Protocol supported: Lighting4

## install

```
npm i github:Jorand/rfxcom-fireworks --save
```

## How to use

Use the cmd line `ls /dev/tty.*` in a terminal to find the port of your RFXCOM.

```
var rfxcom = require('rfxcom-fireworks');

var rfxtrx = new rfxcom.RfxCom("/dev/ttyUSB0", {debug: true}),
    fireworks = new rfxcom.Lighting4_fireworks(rfxtrx, rfxcom.lighting4.PT2262);

rfxtrx.on("lighting4", function (evt) {
  console.log("lighting4 data in:", evt);
});

rfxtrx.initialise(function () {
  console.log("Device initialised");

  /* Fire a specific line in one area */
  fireworks.fire(1, 1, function(err, response, cmdId) {
    console.log("Transmit OK", err, response, cmdId);
  });

  /* Fire every line in one area one by one */
  fireworks.rapidFire(1);

  /* Fire every line in one area at the same time */
  fireworks.allFire(1);
});
```

## Modules

- [node-rfxcom](https://github.com/rfxcom/node-rfxcom)

## Environment dev

- macOs Catalina 10.15.2
- RFXCOM (RFXtrx433XL)
- node v12.13.0

## Start example dev

`npm i`

`node example-webserver.js` or `npm start`

## Protocol

To understand the data protocol i listen the remote data.

Some examples:
- `0xF701B1` fire line 1 in area 1
- `0xF701BE` all Fire area 1
- `0xF701BF` rapid Fire area 1

Packet:
- `0xF7` never change
- `01` area 1 to 99 (maybe more)
- `B` never change
- `1` line 1 to 12 in Hexadecimal (1,2,3,4,5,6,7,8,9,A,B,C) or all (E) or rapid all (F)

# Support for SCS Sentinel HCN0018 Sockets
use a RFXCOM to operate a 433MHz scs sentinel HCN0018 control sockets system.

## Important !
il y a conflit de protocole!
elles sont reconnu en PT2262, c'est le protocole lighting4 (à activer) il rentre en conflit (juste pour ces prises!) avec le protocole ARC, il faut le désactiver.

```
in node_modules/rfxcom

> npm run find-rfxcom

> npm run set-protocols -- --disable ARC --save /dev/tty.usbserial-DO3O5EMF
```


## How to use HCN0018

```
var rfxcom = require('rfxcom-fireworks');

var rfxtrx = new rfxcom.RfxCom("/dev/ttyUSB0", {debug: true}),
    light = new rfxcom.Lighting4_scs_HCN0018(rfxtrx, rfxcom.lighting4.PT2262);

rfxtrx.on("lighting4", function (evt) {
  console.log("lighting4 data in:", evt);
});

rfxtrx.initialise(function () {
  console.log("Device initialised");

  /* Switch On a specific socket */
  light.switchOn(1, (err, response, cmdId) => {
    console.log("Transmit OK", err, response, cmdId);
  });

  /* Switch Off a specific socket */
  light.switchOff(2, (err, response, cmdId) => {
    console.log("Transmit OK", err, response, cmdId);
  });

  /* Switch On all sockets */
  light.switchAllOn();

  /* Switch Off all sockets */
  light.switchAllOff();
});
```

## Protocol HCN0018

To understand the data protocol i listen the remote data.

Some examples (maybe different on another set of sockets):
- `0x455533` ON 1
- `0x4555C3` ON 2
- `0x455703` ON 3
- `0x455D03` ON 4
- `0x457503` ON 5

- `0x45553C` OFF 1
- `0x4555CC` OFF 2
- `0x45570C` OFF 3
- `0x455D0C` OFF 4
- `0x45750C` OFF 5

Packet:
- `0x45` never change
- `553` socket 1, `55C` 2, `570` 3, `5D0` 4, `750` 5
- `3` ON, `C` OFF