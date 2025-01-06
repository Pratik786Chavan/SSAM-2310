import { v4 as uuidv4 } from 'uuid';
const BYTE_LENGTH = 20;

/**
 * 
 * @returns {string}
 */
export default function FormGuidCreate() {
    // IDs for SDF are 40 hex characters long (160 bits, 20 bytes)
    // TODO: use a proper rng for this
    return (uuidv4() + uuidv4()).replace(/\-/g,'').substring(0,BYTE_LENGTH * 2);
    /*
    const cryptoBytes = new Uint8Array(BYTE_LENGTH);
    crypto.getRandomValues(cryptoBytes);

    return Array.from(cryptoBytes, function(byte) {
        return ('0' + byte.toString(16)).slice(-2);
    }).join('');
    */
}
