import express from 'express';
import getArguments from 'get-arguments-lib';
import {getItems} from './server-backoffice.js';
import fileSystem from 'fs';
import bodyParser from 'body-parser';
const args = getArguments(process.argv);

const port = args.port || process.env.PORT || 80;


const app = express();
app.use(bodyParser.json());
app.use('/', express.static('client'));

app.get('/items', async (req, res) => {
    const items = await getItems();

    const selectedItems = await getSelectedItems();

    const result = items.filter(item => !selectedItems.find(selected => selected.id === item.id));

    res.status(200).send(result);
});

app.get('/whobrings-what', async (req, res) => {
    const items = await getItems();
    const selectedItems = await getSelectedItems();
    const itemsWithKids = items.map(item => {
        const itemKid = selectedItems.find(selItem => selItem.id === item.id);
        if (itemKid) {
            return {...item, kidName: itemKid.kidName};
        }
        return {...item};
    });

    res.status(200).send(itemsWithKids);
})

app.post('/items',  (req, res) => {
    filesystem.readFile('./items.json', async (err, items) => {
        items = await getItems();
        const newItems = req.body;
        newitems.forEach(newItem => newItem.id = '#' + (Math.random() * 0xFFFFFF << 0).toString(16));
        items.push(...newItems);
        filesystem.writeFile('./items.json', JSON.stringify(items), () => res.status(200).send(items));
    });

})

const getSelectedItems = () => {
    return new Promise((resolve, reject ) => {
        fileSystem.readFile('./selectedItems.json', (err, items) => {
            if (err) {
                resolve([]);
                return;
            }
            items = JSON.parse(items);
            resolve(items || []);
        })
    });
}

app.post('/set-item', async (req, res) => {
    const selectedItems = await getSelectedItems();

    const {selectedItem, kidName} = req.body;
    if (!kidName || !selectedItem || !selectedItem.id) {
        res.status(400).send('kidName, or selectedItrem is missing');
        return;
    }
    if (selectedItems.find(item => item.id === selectedItem.id )) {
        res.status(400).send('already taken');
    } else {
        selectedItems.push({id: selectedItem.id, kidName});
        fileSystem.writeFile('./selectedItems.json', JSON.stringify(selectedItems), (err, result) => {
            if (!err) {
                res.status(201).send('OK');
            } else {
                res.status(500).send(err);
            }
        })
    }

})



app.listen(port);

