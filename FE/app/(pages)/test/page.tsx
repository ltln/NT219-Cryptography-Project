"use client";

import { useEffect } from "react";
import falcon_wasm from "@btq-js/falcon-implementation";
import * as asn1js from "asn1js";
import * as pkijs from "pkijs";


export default function TestPage() {
    const seed = Buffer.from(crypto.getRandomValues(new Uint8Array(48)));
    const falconOID = "1.3.9999.3.6";

    useEffect(() => {
        TestFalconCSR();
    }, [])

    function arrayBufferToBase64(buffer: ArrayBuffer) {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }


    async function TestFalconCSR() {
        const { publicKey, privateKey } = await falcon_wasm.keyPair(seed);

        const crypto = window.crypto;
        const subtle = crypto.subtle;
        const keyPair = await subtle.generateKey({ name: "ECDSA", namedCurve: "P-256", }, true, ["sign", "verify"]);

        const csr = new pkijs.CertificationRequest({
            version: 0,
            subject: new pkijs.RelativeDistinguishedNames({
                typesAndValues: [
                    new pkijs.AttributeTypeAndValue({
                        type: "2.5.4.3",
                        value: new asn1js.Utf8String({ value: "example.com" }),
                    }),
                    new pkijs.AttributeTypeAndValue({
                        type: "1.2.840.113549.1.9.1",
                        value: new asn1js.Utf8String({ value: "user@example.com" }),
                    }),
                ],
            }),
            attributes: [
                new pkijs.Attribute({
                    type: "1.3.9999.3.6",
                    values: [new asn1js.OctetString({ valueHex: publicKey })]
                }),
            ]
        });

        await csr.subjectPublicKeyInfo.importKey(keyPair.publicKey);
        await csr.sign(keyPair.privateKey, "SHA-256");
        const csrDer = csr.toSchema().toBER(false);
        const csrB64 = arrayBufferToBase64(csrDer);
        const pem =
        "-----BEGIN CERTIFICATE REQUEST-----\n" +
        csrB64.match(/.{1,64}/g)?.join("\n") +
        "\n-----END CERTIFICATE REQUEST-----";
        console.log(pem);
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Test Page</h1>
            <p>This is a test page to verify the setup.</p>
        </div>
    );
}