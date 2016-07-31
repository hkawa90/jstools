var expect = require("chai").expect;
var assert = require("chai").assert;
var StructureReader = require('../src/StructureReader');
var readStream;

describe("Structure Reader", function () {
    describe("filesystem file read ", function () {
        before(function (done) {
            console.log('[describe]before test');
            done();
        });
        beforeEach(function (done) {
            console.log('[it]before every test');
            var fs = require("fs");
            var buf = new Buffer(1);
            buf[0] = 0x1;
            fs.writeFileSync('test.dat', buf);
            readStream = fs.createReadStream("test.dat");
            done();
        });
        it("filesystem file read construct", function (done) {
            var st = new StructureReader(readStream, null);
            expect(st).to.not.equal(null);
            expect(st.bufferSize).to.equal(100);
            done();
        });
        it("filesystem file read construct with structure", function (done) {
            var st = new StructureReader(readStream, {
                "1st": "int8",
                "2nd": "int16",
                "3rd": "int32"
            });
            expect(st).to.not.equal(null);
            done();
        });
    });
    describe("event", function () {
        it("one bit", function (done) {

            var st = new StructureReader(readStream, {
                "1st": "UInt8"
            });
            st.start();
            st.on("data", function (result) {
                expect(result["1st"]).to.equal(1);
                var fs = require("fs");
                fs.unlinkSync('test.dat');
                done();
            });
        });
    });
    describe("low level bits access", function () {
        var st = null;
        var buffer = null;
        beforeEach(function (done) {
            st = new StructureReader(null, null);
            buffer = new Buffer(6);
            buffer.fill(0);
            done();
        });
        it("getBits", function (done) {
            for (var i = 0; i < 8; i++) {
                buffer[0] = 0x01 << i;
                console.log(i + ":" + buffer[0] + ">>" + (0x01 << i));
                var r = st.getBits(buffer, i, 1);
                console.log(r + "<<");
                expect(r).to.equal(1);
            }
            for (var i = 8; i < 16; i++) {
                buffer[1] = 0x01 << (i - 8);
                console.log(i + ":" + buffer[1] + ">>" + (0x01 << i));
                var r = st.getBits(buffer, i, 1);
                console.log(r + "<<");
                expect(r).to.equal(1);
            }
            done();
        });
    });
    describe("toString", function () {
        var st = null;
        var buffer = null;
        beforeEach(function (done) {
            st = new StructureReader(null, null);
            buffer = new Buffer(6);
            buffer.fill(0);
            done();
        });
        it("radix=2", function (done) {
            for (var i = 0; i < 8; i++) {
                buffer[0] = 0x01 << i;
                console.log(i + ":" + buffer[0] + ">>" + (0x01 << i));
                var r = st.toString(buffer, i, 4, 2);
                console.log(r + "<<");
                expect(r).to.equal('0001');
            }
            done();
        });
        it("unspported radix", function (done) {
            expect(st.toString.bind(buffer, 0, 1, 20), Error, 'Unpported radix.');
            done();
        });
    });
});