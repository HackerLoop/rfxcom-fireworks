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
    lighting4 = new rfxcom.Lighting4(rfxtrx, rfxcom.lighting4.PT2262);

rfxtrx.on("lighting4", function (evt) {
  console.log("lighting4 data in:", evt);
});

rfxtrx.initialise(function () {
  console.log("Device initialised");

  /* Fire a specific line in one area */
  lighting4.fire(1, 1, function(err, response, cmdId) {
    console.log("Transmit OK", err, response, cmdId);
  });

  /* Fire every line in one area one by one */
  lighting4.rapidFire(1);

  /* Fire every line in one area at the same time */
  lighting4.allFire(1);
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