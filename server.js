import express from "express";
import getArguments from "get-arguments-lib";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import {getItems, getSelectedItems, insertItems, removeSelectedItem, saveSelectedItem} from "./data-access.js";

import {sessionMiddleware} from "./session-manager.js";

const args = getArguments(process.argv);


const port = args.port || process.env.PORT || 80;

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/vendors", express.static("node_modules"));

app.use("/", express.static("client"));


app.get("/items", sessionMiddleware, async (req, res) => {
    const items = await getItems();

    const selectedItems = await getSelectedItems();

    const result = items.filter(
        item => !selectedItems.find(selected => selected.id === item.id)
    );

    res.status(200).send(result);
});

app.get("/whobrings-what/:eventId", sessionMiddleware, async (req, res) => {
    const eventId = req.params['eventId'];
    const items = await getItems(+eventId);
    const selectedItems = await getSelectedItems();
    const itemsWithKids = items.map(item => {
        const itemKid = selectedItems.find(selItem => selItem.id === item.id);
        if (itemKid) {
            return {...item, kidName: itemKid.kidName};
        }
        return {...item};
    });

    res.status(200).send(itemsWithKids);
});

app.get("/my-selected-item", sessionMiddleware, (req, res) => {
    // const session = getCurrentSession();
    res.status(200).send(req.session.selectedItem);
});

app.post("/items/:eventId", sessionMiddleware, async (req, res) => {
    const eventId = req.params['eventId']
    const items = await getItems(eventId);
    if (items && items.length) {
        res.status(301).send("items cannot be modified");
        return;
    }
    const newItems = req.body;
    await insertItems(newItems);
    res.status(200).send(items);
});

app.post("/undo-selection", sessionMiddleware, async (req, res) => {
    if (!req.session.selectedItem) {
        res.status(404).send("No item selected");
        return;
    }
    try {
        await removeSelectedItem(req.session.selectedItem);
        req.session.selectedItem = null;
        res.status(200).send("ok");
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post("/set-item", sessionMiddleware, async (req, res) => {
    const selectedItems = await getSelectedItems();

    const {selectedItem, kidName} = req.body;
    if (!kidName || !selectedItem || !selectedItem.id) {
        res.status(400).send("kidName, or selectedItrem is missing");
        return;
    }
    if (selectedItems.find(item => item.id === selectedItem.id)) {
        res.status(400).send("already taken");
    } else {
        try {
            await saveSelectedItem({id: selectedItem.id, kidName});
            req.session.selectedItem = selectedItem;
            res.status(201).send("OK");
        } catch (err) {
            //    selectedItems.push({id: selectedItem.id, kidName});
            // saveSelectedItems(selectedItems, (err, result) => {
            res.status(500).send(err);
        }
    }
});

app.listen(port);
