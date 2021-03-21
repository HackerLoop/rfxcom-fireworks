'use strict';
const rfxcom = require('rfxcom');

function d2h(d, pad=false) {
    d = Math.abs(d);
    var s = (+d).toString(16);
    if(pad && s.length < 2) {
        s = '0' + s;
    }
    return s;
}

class Lighting4_FIREWORKS extends rfxcom.Lighting4 {
  constructor(rfxcom, subtype, options) {
    super(rfxcom, subtype, options);
  }

  /**
   * Fire a specific line in one area
   * @param {number} area - 0 to 99
   * @param {number} line - 1 to 12
   * @param {function} callback
   * @return {number} seqnbr
   */
  fire(area = 0, line = 0, callback) {
    if (Math.abs(line) <= 12) {
      var hexArea = d2h(area, true).toUpperCase(),
          hexLine = d2h(line).toUpperCase(),
          data = "0xF7"+ hexArea +"B"+ hexLine;
      // console.log("Send data:", data);
      return this.sendData(data, null, callback);
    }
    else {
      console.log("[rfxcom] lighting4.fire: Invalid line number - range 0 to 12");
      return false;
    }
  }

  /* Fire every line in one area one by one */
  rapidFire(area, callback) {
    var hexArea = d2h(area, true).toUpperCase();
    return this.sendData("0xF7"+ hexArea +"BF", null, callback);
  }

  /* Fire every line in one area at the same time */
  allFire(area, callback) {
    var hexArea = d2h(area, true).toUpperCase();
    return this.sendData("0xF7"+ hexArea +"BE", null, callback);
  }

}


class Lighting4_SCS_HCN0018 extends rfxcom.Lighting4 {
  constructor(rfxcom, subtype, options) {
    super(rfxcom, subtype, options);
    this.socketsHex = ['553', `55C`, `570`, `5D0`, `750`];
  }

  /**
   * Turn on a specific socket
   * @param {number} socket - 1 to 5
   * @param {function} callback
   * @return {number} seqnbr
   */
  switchOn(socket = 1, callback) {
    var hexSocket = this.socketsHex[Math.abs(socket)-1];
    if (hexSocket) {
      return this.sendData("0x45"+ hexSocket +"3", 172, callback);
    }
    else {
      console.log("[rfxcom] lighting4.switchOn: Invalid socket number - range 1 to 5");
      return false;
    }
  }
  /**
   * Turn off a specific socket
   * @param {number} socket - 1 to 5
   * @param {function} callback
   * @return {number} seqnbr
   */
  switchOff(socket = 1, callback) {
    var hexSocket = this.socketsHex[Math.abs(socket)-1];
    if (hexSocket) {
      return this.sendData("0x45"+ hexSocket +"C", 172, callback);
    }
    else {
      console.log("[rfxcom] lighting4.switchOff: Invalid socket number - range 1 to 5");
      return false;
    }
  }
  /**
   * Turn on all sockets
   */
  switchAllOn() {
    this.switchOn(1);
    this.switchOn(2);
    this.switchOn(3);
    this.switchOn(4);
    this.switchOn(5);
  }
  /**
   * Turn off all sockets
   */
  switchAllOff() {
    this.switchOff(1);
    this.switchOff(2);
    this.switchOff(3);
    this.switchOff(4);
    this.switchOff(5);
  }

}

rfxcom.Lighting4_fireworks = Lighting4_FIREWORKS
rfxcom.Lighting4_scs_HCN0018 = Lighting4_SCS_HCN0018

module.exports = rfxcom;