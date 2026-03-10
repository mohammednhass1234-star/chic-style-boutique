fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        customerName: 'Test Name',
        customerPhone: '0612345678',
        customerAddress: 'Test Address',
        customerCity: 'Fes',
        total: 100,
        items: [
            {
                productId: 1, // Assumes product 1 exists
                quantity: 1,
                price: 100,
                name: 'Test Product',
                size: 'M',
                color: 'Rouge'
            }
        ]
    })
}).then(async res => {
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
}).catch(err => {
    console.error("Error:", err);
});
