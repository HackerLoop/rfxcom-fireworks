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

class newLighting4 extends rfxcom.Lighting4 {
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

rfxcom.Lighting4 = newLighting4

module.exports = rfxcom;