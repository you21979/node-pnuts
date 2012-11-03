"use strict";
exports.PJW = function(str){
    var data = new Buffer(str.toString(), "utf-8");
    var V = {
        HASH : 0,
        TEST : 1,
        BITSINUNSIGNEDINT : 2,
        THREEQUARTERS : 3,
        ONEEIGHTH : 4,
        HIGHBITS : 5,
        SIZEOF : 6,
    };
    var w = new Uint32Array(V.SIZEOF);
    w[V.BITSINUNSIGNEDINT] = 32;
    w[V.THREEQUARTERS] = (w[V.BITSINUNSIGNEDINT] * 3) / 4;
    w[V.ONEEIGHTH] = w[V.BITSINUNSIGNEDINT] / 8;
    w[V.HIGHBITS] = 0xFFFFFFFF << (w[V.BITSINUNSIGNEDINT] - w[V.ONEEIGHTH]); ;
    w[V.HASH] = 0;
    w[V.TEST] = 0;
    var len = data.length;
    for(var i = 0; i < len; ++i)
    {
       w[V.HASH] = (w[V.HASH] << w[V.ONEEIGHTH]) + data[i];
       if((w[V.TEST] = w[V.HASH] & w[V.HIGHBITS])  != 0)
       {
          w[V.HASH] = (( w[V.HASH] ^ (w[V.TEST] >> w[V.THREEQUARTERS])) & (~w[V.HIGHBITS]));
       }
    }
    return w[V.HASH];
};
