// See http://www.winpcap.org/ntar/draft/PCAP-DumpFileFormat.html

var PCAPNG_Block = {
    blockType : "uint32",
    blockTotalLength: "uint32",
    blockBody : "array", // array=>type? PCAPNG_SectionHeaderBlock
    blockTotalLengthBackward: "uint32"
};

var PCAPNG_Option = {
    code : "uint16",
    length : "uint16",
    values : "array", // aligned on 32bit.
    code_end : "uint16",
    length_end : "uint16"
};

// blockType -> 0x0A0D0D0A
var PCAPNG_SectionHeaderBlock = {
    byteOrderMagic: "uint32", // 0x1A2B3C4D
    majorVersion : "uint16",
    minorVersion : "uint16",
    sectionLength: "uint64", // length of following section.
    options: "PCAPNG_Option"
};

// blockType -> 0x00000001
var  PCAPNG_InterfaceDescriptionBlock = {
    linkType : "uint16",
    reserved : "uint16",
    snapLen : "uint32",
    options: "PCAPNG_Option"
};

// blockType -> 0x00000006
var  PCAPNG_EnhancedPacketBlock = {
    interfaceID : "uint32",
    timestampHight: "uint32",
    timestampLow: "uint32",
    capturedLen : "uint32",
    packetData : "array", // aligned on 32bit.
    options: "PCAPNG_Option"
};

// blockType -> 0x00000003
var PCAPNG_SimplePacketBlock = {
    packetLen : "uint32",
    packetData : "array" // aligned on 32bit.
};

// blockType -> 0x00000004
var PCAPNG_NameResolutionBlock = {
    recordType : "uint16",
    recordLength : "uint16",
    recordValue : "array", // aligned on 32bit.
    recordType_end : "uint16",
    recordLength_end : "uint16"
};

// blockType ->
var PCAPNG_InterfaceStatisticsBlock = {
    interfaceID : "uint32",
    timestampHight: "uint32",
    timestampLow: "uint32",
    options: "PCAPNG_Option"    
};

// See https://wiki.wireshark.org/Development/LibpcapFileFormat
var PCAP_GlobalHeader = {
    byteOrderMagic : "uint32",
    majorVersion : "uint16",
    minorVersion : "uint16",
    thisZone: "int32",
    sigfigs: "uint32",
    snaplen : "uint32",
    network: "uint32"
}
var PCAP_RecordHeader = {
    ts_sec : "uint32",
    ts_usec: "uint32",
    incl_len : "uint32",
    orig_len : "uint32"
};

var PCAP_EtherFrame = {
    dstMACAddress : "uchar64",
    srcMACAddress : "uchar64",
    type : "uint16" // BIG_ENDIAN
};

// Note: http://optimus5.com/index.php?page=search/images&search=tcpdump+cheat+sheet&type=images
var PCAP_IPv4 = {
    version : "uint4",
    headerLen : "uint4",
    typeOfService : "uint8",
    datagramLen: "uint16",
    identification : "uint16",
    flags: "uint3",
    flagmentOffset : "uint15",
    ttl : "uint8",
    protocolNumber: "uint8",
    headerChecksum : "uint16",
    srcIPAddress: "uint32",
    dstIPAddress: "uint32",
    options: "array",
    payload: "array"
};

var PCAP_IPv6 = {
    version: "uint4",
    trafficClass: "uint8",
    flowLabel : "uint20",
    payloadLen: "uint16",
    nextHeader: "uint8",
    hopLimit: "uint8",
    srcIPAddress: "uint128",
    dstIPAddress: "uint128"
};

var PCAP_TCP = {
    srcPort : "uint16",
    dstPort : "uint16",
    sequenceNumber : "uint32",
    ackNumber : "uint32",
    offset : "uint4",
    reserved: "uint6",
    urg : "boolean",
    ack : "boolean",
    psh: "boolean",
    rst: "boolean",
    syn: "boolean",
    fin: "boolean",
    windowSize : "uint16",
    checksum : "uint16",
    urgentPointer: "uint16",
    option: "array",  // aligned on 32bit.
    payload: "array"    
};

var PCAP_UDP = { // RFC 768
    srcPort: "uint16",
    dstPort: "uint16",
    length: "uint16", // include UDP header
    checksum : "uint16",
    payload : "array"
};
