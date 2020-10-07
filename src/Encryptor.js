const nacl = require('libsodium-wrappers')
module.exports = async (key) => {
await nacl.ready;
    if(!key){
        throw 'no key';
    }
    let sodium = nacl;
    return Object.freeze({
        encrypt: (ciphertext,nonce)=> {
            return sodium.crypto_secretbox_easy(ciphertext,nonce, key);
        }
  
    })
}