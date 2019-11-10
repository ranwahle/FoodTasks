export async function getItems() {
  const response = await fetch("/items");
  const items = await response.json();
  console.log("items", items);

  return items;
}
export async function setItem({ kidName, selectedItem }) {
  const response = await fetch("/set-item", {
    method: "post",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ kidName, selectedItem })
  });

  return response;
}

export async function getSelectedItem() {
  const response = await fetch("/my-selected-item");
  try {
    return await response.json();
  } catch {
    return false;
  }
}

export async function undoSelection() {
  const response = await fetch("/undo-selection", { method: "post" });

  return response.ok;
}

export async function whoBringsWhat() {
  const response = await fetch("/whobrings-what");
  const result = await response.json();
  return result;
}
