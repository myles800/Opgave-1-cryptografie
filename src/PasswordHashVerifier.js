const nacl = require('libsodium-wrappers')
module.exports = async () => {
await nacl.ready;
    
    let sodium = nacl;
    return Object.freeze({
        verify: (hashedPw,Pw)=> {
            if(!hashedPw){
                throw 'no hashed password';
            }
            if(!Pw){
                throw 'no password';
            }
            return sodium.crypto_pwhash_str_verify(hashedPw,Pw);
        }
  
    })
}