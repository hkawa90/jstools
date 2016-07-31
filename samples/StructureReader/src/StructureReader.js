var BitStream = require('bit-buffer').BitStream; // https://www.npmjs.com/package/bit-buffer
var util = require('util');
var EventEmitter = require("events");
var self;
var intDispatch = {};

var patterns = {
    "(U?)Int(\\d+)([BE|LE]?)": function (offset, r, buffer) {
        var signed = "";
        var endian = "LE";
        if (r[1] !== "") signed = "";
        else signed = "U";
        if (r[2] === "be") bigEndian = "BE";
        else bigEndian = "LE";

        console.log("read" + r[1] + "Int" + r[2] + r[3]);
        console.log(util.inspect(r));
        console.log(buffer["read" + r[1] + "Int" + r[2] + r[3]](offset / 8));
        console.log("offset:", offset / 8);
        return buffer["read" + r[1] + "Int" + r[2] + r[3]](offset / 8);
    },
    "boolean": function (offset, r, buffer) {
        console.log(r);
        return true;
    },
    "(u?)char(\\d+)": function (offset, r, buffer) {
        console.log(r);
        return true;
    },
    "array": function (offset, r, buffer) {
        console.log(r);
        return true;
    }
};

function StructureReader(readableStream, structure, size) {

    self = this;
    self.structure = structure;
    self.pointer = 0;
    self.bufferSize = size || 100;
    self.readableStream = readableStream;
    self.intrnalBuffer = new Buffer(self.bufferSize);

    EventEmitter.call(this);

}

util.inherits(StructureReader, EventEmitter);
StructureReader.prototype.rightShift = function (buffer, offsetBits, bitsWidth) {
    var array;
    if (((offsetBits + bitsWidth) % 8) == 0) {
        array = new Buffer((offsetBits + bitsWidth) % 8);
    } else {
        array = new Buffer(((offsetBits + bitsWidth) % 8) + 1);
    }
    array.fill(0);
    return array;
}

StructureReader.prototype.setBits = function (buffer, offsetBits, bits, bitsWidth) {}
StructureReader.prototype.getBits = function (buffer, offsetBits, bitsWidth) {
    var r = 0;
    for (var o = offsetBits; o < offsetBits + bitsWidth; o++) {
        r = r | ((buffer[o >> 3] & (0x01 << (o % 8))) >> (offsetBits % 8));
    }
    return r;
}
StructureReader.prototype.toString = function (buffer, offsetBits, bitsWidth, radix) {
    var r = '';
    if (radix != 2) {
        throw new Error('Unpported radix.');
    }

    for (var o = offsetBits; o < offsetBits + bitsWidth; o++) {
        r += (((buffer[o >> 3] & (0x01 << (o % 8))) >> (offsetBits % 8)) > 0) ? '1' : '0';
    }

    return r.split("").reverse().join("");;
}

StructureReader.prototype.readChunk = function (rBuffer, structure) {
    var r = {};
    var m = null;
    var data;
    var offset = 0;
    console.log("readChunk");
    console.log("rbuffer[0] " + rBuffer[0]);
    for (var prop in self.structure) {
        m = null;
        console.log("prop:" + prop);
        for (var p in patterns) {
            console.log("pattern:" + p);
            var regEx = new RegExp(p);
            console.log("type:" + self.structure[prop]);
            var result = regEx.exec(self.structure[prop]);
            console.log("result:" + result);
            if (result != null) {
                //m = patterns[p](offset, result, rBuffer);
                m = rBuffer.readUInt8(0);
                console.log(m);
                if (m != null) break;
            }
        }
        r[prop] = m;
    }
    this.emit("data", r);
}

StructureReader.prototype.start = function () {
    self.readableStream.on('data', function (chunk) {
        console.log("data...");
        console.log("chunk:" + chunk.length);
        self.readChunk(chunk, self.structure);
        /*        self.bv = self.bw = null;
                self.bv = new BitView(chunk);
                self.bsw = new BitStream(self.bv);
                this.emit("data", data);*/
    });

}


module.exports = StructureReader;