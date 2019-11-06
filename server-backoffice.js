import express from 'express';
import filesystem from 'fs';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();

const __dirname = path.resolve();

app.use(bodyParser.json())

app.get('/items', async (req, res) => {
    const items = await getItems();

    console.log('items', items);
    res.status(200).send(items);
});


export function getItems() {
    return new Promise((resolve, reject) => {
        filesystem.readFile(`${__dirname}/items.json`, (err, itemString) => {
            if (err) {
                resolve([]);
            }
            try {
                const items = JSON.parse(itemString)
                resolve(items);
            } catch {
                resolve([]);
            }


        });
    })
}

app.post('/item',  (req, res) => {
    filesystem.readFile(`${__dirname}/items.json`, async (err, items) => {
        items = await getItems();
        const newItem = req.body;
        newItem.id = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);

        items.push(newItem);
        filesystem.writeFile(`${__dirname}/items.json`, JSON.stringify(items), () => res.status(200).send(items));
    });

})

app.listen(3001);
