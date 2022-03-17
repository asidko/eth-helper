const express = require('express');
const log4js = require("log4js");
const ethers = require('ethers');
const app = express();
const log = log4js.getLogger();
log.level = 'debug';
const port = 3000;

//// Validating signature example
log.info("🧚‍ Validating signature example")
const wallet = ethers.Wallet.createRandom();
log.info("Creating random wallet")
log.info('address:', wallet.address)
log.info('mnemonic:', wallet.mnemonic.phrase)
log.info('privateKey:', wallet.privateKey)

const message = "Some message"
log.info("Creating digest for message: '%s'", message)

const digest = ethers.utils.id(message);
const signingKey = new ethers.utils.SigningKey(wallet.privateKey);
const signature = signingKey.signDigest(digest);
const joinedSignature = ethers.utils.joinSignature(signature);
console.log(joinedSignature)

log.info("Verify... (comparing recovered address to original)")
const recoveredAddress = ethers.utils.recoverAddress(digest, signature);
const result = String(wallet.address === recoveredAddress);

log.info("🏁 Wallet address (%s) == Recover address (%s). Is equals: %s", wallet.address, recoveredAddress, result);
// end example //////

(async () => {
    app
        .get("/", async (req, res) => res.json({status: "OK"}))
        .get("/api/eth/verify-signature", async (req, res) => {
            const {address, digest, signature} = req.body;
            const recoveredAddress = ethers.utils.recoverAddress(digest, signature);
            const isValid = address === recoveredAddress;
            return res.json({"status": isValid ? "VALID" : "INVALID"})
        })


    app.listen(port, "0.0.0.0", () => {
        const url = `http://127.0.0.1:${port}`;
        log.info('\n\n⚡️ Server listens: %s', url);
    })
})();