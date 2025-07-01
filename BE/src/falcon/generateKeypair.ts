import { falcon } from 'falcon-crypto';
import fs from 'node:fs';
import path from 'node:path';

async function generateFalconKeypair() {
  try {
    const { publicKey, privateKey } = await falcon.keyPair();
    const publicKeyPath =
      process.cwd() + process.env.FALCON_PUBLIC_KEY_PATH ||
      path.join(__dirname, 'falcon_public_key.pem');
    const privateKeyPath =
      process.cwd() + process.env.FALCON_PRIVATE_KEY_PATH ||
      path.join(__dirname, 'falcon_private_key.pem');
    fs.writeFileSync(publicKeyPath, publicKey);
    fs.writeFileSync(privateKeyPath, privateKey);
    console.log('Falcon keypair generated and saved to files.');
    console.log('Public Key:', publicKeyPath);
    console.log('Private Key:', privateKeyPath);
  } catch (error) {
    throw new Error('Failed to generate Falcon keypair', error);
  }
}

generateFalconKeypair();
