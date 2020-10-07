const nacl = require('libsodium-wrappers')
module.exports = async() => {
    await nacl.ready;
    let sodium = nacl;
    let key=sodium.crypto_sign_keypair();
    return Object.freeze({
        verifyingKey: key.publicKey
        ,
        sign: (msg)=> {
            return sodium.crypto_sign(msg , key.privateKey);
        }

  
    })
    
}