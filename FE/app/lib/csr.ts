import falcon_wasm from "@btq-js/falcon-implementation";
import axios from "axios";
import { User } from "../types/user";

function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export async function create(user: User) {
    const seed = Buffer.from(crypto.getRandomValues(new Uint8Array(48)));
    const keyPair = await falcon_wasm.keyPair(seed);

    const userTbs = "user=" + user.username + "|email=" + user.email;

    const signature = await falcon_wasm.sign(new Uint8Array(Buffer.from(userTbs)), keyPair.privateKey);
    console.log("Public Key:", Buffer.from(keyPair.publicKey).byteLength);
    console.log("Signature:", Buffer.from(signature).byteLength);
    console.log("User TBS:", Buffer.from(userTbs).byteLength);
    const data = {
        user: userTbs,
        signature: Buffer.from(signature).toString('base64'),
        publicKey: Buffer.from(keyPair.publicKey).toString('base64'),
    }
    localStorage.setItem('falconPublicKey', Buffer.from(keyPair.publicKey).toString('base64'));
    localStorage.setItem('falconPrivateKey', Buffer.from(keyPair.privateKey).toString('base64'));

    console.log('Public Key (Raw):', keyPair.publicKey);
    console.log('Signature (Raw):', signature);
    console.log('User TBS (Raw):', Buffer.from(userTbs));


    submit(data);
}

export async function submit(data: any) {
    const res = await axios.post<{ test: string }>(process.env.NEXT_PUBLIC_CA_BASE_URL + "/submit", data, {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    );

    console.log(res);
}

export async function sign(message: string, privateKey: string) {
    const signature = await falcon_wasm.sign(new Uint8Array(Buffer.from(message)), new Uint8Array(Buffer.from(privateKey, 'base64')));
    return Buffer.from(signature).toString('base64');
}