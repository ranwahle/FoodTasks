export async function getItems() {
    const response = await fetch('/items');
    const items = await response.json();
    console.log('items', items);

    return items;
}
export async function setItem({kidName, selectedItem}) {
    const response = await fetch('/set-item', {
        method: 'post', headers: {'content-type': 'application/json'},
            body: JSON.stringify({kidName, selectedItem})});

    return response;


}

export async function whoBringsWhat() {
    const response = await fetch('/whobrings-what');
    const result = await response.json();
    return result;

}
