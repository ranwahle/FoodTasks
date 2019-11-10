import pg from "pg";
import dotEnv from "dotenv";

const { Pool, Client } = pg;

// dotEnv.config();

// pools will use environment variables
// for connection information
export async function removeSelectedItem(item) {
  const text =
    'Delete from "public"."selectedItems" where "selectedItems"."itemId" = $1';
  const pool = new Pool();

  const res = await pool.query(text, [item.id]);

  await pool.end();

  return res;
}

export async function saveSelectedItem(selectedItem) {
  const text = `Insert into "public"."selectedItems" ("kidName", "itemId") values ($1, $2)`;

  const pool = new Pool();
  try {
    await pool.query(text, [selectedItem.kidName, selectedItem.id]);
  } catch (err) {
    console.error(text, err);
  }
  await pool.end();
}

export async function insertItems(items) {
  const pool = new Pool();
  const insertCommands = `Insert into "public"."Items" ("ItemName") values ($1) `;

  try {
    const commands = items.map(item => {
      return pool.query(insertCommands, [item.name]);
    });

    const promise = new Promise((resolve, reject) => {
      Promise.all(commands).then(result => resolve(result));
    });

    await promise;
  } catch (err) {
    console.error("error inserting items", insertCommands, err);
    return err;
  }

  await pool.end();
}

export async function getSelectedItems() {
  const pool = new Pool();

  let res = await pool.query(`SELECT * from "public"."selectedItems" inner join "public"."Items"
     on "public"."Items".id = "public"."selectedItems"."itemId" `); // => {
  await pool.end();

  const items = res.rows.map(row => ({
    id: row.itemId,
    name: row.ItemName,
    kidName: row.kidName
  }));

  return items;
}

export async function getItems() {
  const pool = new Pool();
 try {
   let res = await pool.query('SELECT * from "public"."Items"'); // => {
   await pool.end();

   const items = res.rows.map(row => ({id: row.id, name: row.ItemName}));
   return items;
  }
  catch (e) {
    console.error('Error connecting to the database', e);
    return [];
  }

}
