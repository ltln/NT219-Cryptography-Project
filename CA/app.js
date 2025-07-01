const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const falcon = require('@btq-js/falcon-js')
const fs = require('node:fs')

require('dotenv').config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/submit', async (req, res) => {
    const { publicKey, signature, user } = req.body;

    const parsed = {
        publicKey: new Uint8Array(Buffer.from(publicKey, 'base64')),
        signature: new Uint8Array(Buffer.from(signature, 'base64')),
        user: new Uint8Array(Buffer.from(user))
    }

    const username = user.split("|")[0].split("=")[1]

    console.log(`${username} gửi yêu cầu đến CA.`)

    console.log(parsed);

    const isValid = await falcon.verify(parsed.user, parsed.signature, parsed.publicKey);
    if (!isValid) {
        return res.status(400).json({ error: 'Invalid signature.' });
    }

    console.log(`${username}: Chữ ký hợp lệ.`)

    try {
        fs.writeFileSync(`public_keys/${username}.pub`, publicKey, 'utf8');
        console.log(`${username}: Đã lưu khóa công khai vào tệp ${username}.pub`);
    } catch (err) {
        console.error('Error writing to file:', err);
        return res.status(500).json({ error: 'Failed to save public key.' });
    }

    res.json({
        message: 'Data received successfully!',
    });
});

app.get("/query/:username", async (req, res) => {
    const username = req.params.username;

    console.log(`Yêu cầu truy vấn thông tin người dùng với tên: ${username}`);
    try {
        const publicKey = fs.readFileSync(`public_keys/${username}.pub`, 'utf8');
        console.log(`Đã tìm thấy khóa công khai cho người dùng ${username}`);
        console.log(`Khóa công khai: ${Buffer.from(publicKey, 'utf8').toString('base64')}`);
        res.json({
            publicKey: Buffer.from(publicKey, 'utf8').toString('base64'),
            message: `Public key for ${username} retrieved successfully!`
        });
    } catch (err) {
        console.error(`Không tìm thấy khóa công khai cho người dùng ${username}:`, err);
        return res.status(404).json({ error: `Public key for ${username} not found.` });
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});