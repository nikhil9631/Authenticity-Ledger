const client = require('../config/database');

async function addProduct(serialNumber, name, brand) {
    await client.query(
        'INSERT INTO product (serialNumber, name, brand) VALUES ($1, $2, $3)',
        [serialNumber, name, brand]
    );
}

async function getSerialNumbers() {
    const data = await client.query('SELECT serialNumber FROM product');
    return data.rows;
}

module.exports = { addProduct, getSerialNumbers };
