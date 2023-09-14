import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';

// Read encrypted private key
const encryptedPrivateKey = fs.readFileSync(path.resolve(__dirname, '../ssl/key.pem'), 'utf8');
// Define the decryption algorithm and passphrase
const passphrase = 'kenny';  
// Decrypt the private key
const decryptedPrivateKey = crypto.createPrivateKey({ key: encryptedPrivateKey, passphrase: passphrase });
// Convert the decrypted key to PEM format
const decryptedPrivateKeyPem = crypto.createPublicKey(decryptedPrivateKey).export({ type: 'pkcs8', format: 'pem' });
// Convert the PEM-formatted string to a Buffer 
const decryptedPrivateKeyBuffer = decryptedPrivateKey.export({
  type: 'pkcs1',
  format: 'der'
})

const rootCertsPath = path.resolve(__dirname, '../ssl/cert.pem');
 
const rootCerts = fs.readFileSync(rootCertsPath)
const keyCertPairs = [
  {
    private_key: decryptedPrivateKeyBuffer,
    cert_chain: fs.readFileSync(path.resolve(__dirname, '../ssl/cert.pem')),
  },
];


