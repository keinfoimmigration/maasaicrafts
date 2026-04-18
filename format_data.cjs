const fs = require('fs');
const path = require('path');

const inputPath = path.resolve('./public/scraped_items/scraped_products.json');
const outputPath = path.resolve('./src/data/products.json');

const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const categories = ['Jewelry', 'Decor', 'Fashion', 'Crafts'];

const formattedData = data.map((item, index) => {
    // try to parse price, default to something reasonable
    let numPrice = 45.00;
    if (item.price && item.price !== 'Unknown Price') {
        const match = item.price.match(/\d+([.,]\d{2})?/);
        if (match) {
            numPrice = parseFloat(match[0].replace(',', '.'));
        }
    } else {
        // assign arbitrary pricing based on index
        numPrice = 20 + Math.floor(Math.random() * 50);
    }

    return {
        id: index + 1,
        name: item.title.replace(/\.[^/.]+$/, '').replace(/-/g, ' '), // remove extension and dashes
        price: numPrice,
        stock: 10 + Math.floor(Math.random() * 20),
        category: categories[Math.floor(Math.random() * categories.length)],
        imageUrl: item.localImage,
        short_description: `Authentic handcrafted ${item.title.toLowerCase().replace(/\.[^/.]+$/, '').replace(/-/g, ' ')}. Made by skilled artisans using traditional techniques to support the local economy.`,
        cultural_history: `This piece carries the heritage of the Maasai people, traditionally worn or used in cultural ceremonies and daily life in East Africa. Every purchase directly empowers the artisans.`
    };
});

fs.writeFileSync(outputPath, JSON.stringify(formattedData, null, 2));
console.log('Formatted products saved to src/data/products.json');
