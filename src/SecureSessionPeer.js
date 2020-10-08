const nacl = require('libsodium-wrappers');
const Encryptor = require('./Encryptor.js');
const Decryptor = require('./Decryptor.js');


const secureSessionPeer = async(securePeer = null) => {
    await nacl.ready;
    const secureSessionPeer = {};
    const key = nacl.crypto_box_keypair();
    const publicKey=key.publicKey;
    const privateKey=key.privateKey;
    secureSessionPeer.publicKey = publicKey;

    secureSessionPeer.connector = async function(other, crypto_kx_client_session_keys) {
        secureSessionPeer.peer = other;

        const key = crypto_kx_client_session_keys(publicKey, privateKey, other.publicKey);

        secureSessionPeer.decryptor = await Decryptor(key.sharedRx);
        secureSessionPeer.encryptor = await Encryptor(key.sharedTx);
    }

    if(securePeer) {
        await secureSessionPeer.connector(securePeer, nacl.crypto_kx_client_session_keys);
        await securePeer.connector(secureSessionPeer, nacl.crypto_kx_server_session_keys);
    };



    secureSessionPeer.encrypt = function(msg) {
        const nonce = nacl.randombytes_buf(nacl.crypto_secretbox_NONCEBYTES);
        const ciphertext = secureSessionPeer.encryptor.encrypt(msg, nonce);
        return { nonce, ciphertext };
    }

    secureSessionPeer.decrypt = function(msg, nonce) {
        return secureSessionPeer.decryptor.decrypt(msg, nonce);
    }

    secureSessionPeer.send = function(msg) {
        secureSessionPeer.peer.message = this.encrypt(msg);
    }

    secureSessionPeer.receive = function() {
        return secureSessionPeer.decrypt(secureSessionPeer.message.ciphertext, secureSessionPeer.message.nonce);
    }

    return Object.defineProperties(secureSessionPeer, {
        publicKey: {writable: false},
        privateKey: {writable: false}
    });
}


module.exports = secureSessionPeer;