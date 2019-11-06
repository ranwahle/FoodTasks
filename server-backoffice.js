import express from 'express';
import filesystem from 'fs';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json())

app.get('/items', async (req, res) => {
    const items = await getItems();

    console.log('items', items);
    res.status(200).send(items);
});


export function getItems() {
    return new Promise((resolve, reject) => {
        filesystem.readFile('./items.json', (err, items) => {
            if (err) {
                reject(err);
            }
            resolve(JSON.parse(items));
        });
    })
}

app.post('/item',  (req, res) => {
    filesystem.readFile('./items.json', async (err, items) => {
        items = await getItems();
        const newItem = req.body;
        newItem.id = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);

        items.push(newItem);
        filesystem.writeFile('./items.json', JSON.stringify(items), () => res.status(200).send(items));
    });

})

app.listen(3001);
