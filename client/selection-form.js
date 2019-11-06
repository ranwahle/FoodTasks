import {getItems, setItem, undoSelection} from "./food-service.js";
import {notify} from "./notiifcations.js";

export class SelectionForm extends HTMLElement {
    connectedCallback() {
        this.render();
        this.handleFormEvents();
    }

    refreshItems = async () => {
        const items = await getItems();
        this.querySelector('select-box').items = items;
    }


    async handleFormEvents() {

        this.refreshItems();
        setInterval(this.refreshItems, 10000)

        this.querySelector('#btnUndo').addEventListener('click', async() => {
            const result = await undoSelection();
            if (result) {
                notify('בחירתך בוטלה בהצלחה');
                this.refreshItems();
            }
            this.querySelector('#btnUndo').style.display = 'none';
            this.querySelector('#btnSend').removeAttribute('disabled');
        })

        this.querySelector('#btnSend').addEventListener('click', async() => {
            const kidName = document.querySelector('[name="kidName"]').value;
            const selectedItem = document.querySelector('select-box').selectedItem;
            if (!kidName) {
                notify('נא למלא שם ילד/ה');
                return;
            } else if (!selectedItem) {
                notify('לא בחרת מה להביא');
                return;
            }
            const response = await setItem({kidName, selectedItem});

            if (!response.ok) {
                notify('ארעה שגיאה');
                const text = await response.text();
                if (text  === 'already taken') {
                    notify(`אחרים בחרו להביא ${selectedItem.name} ,נא בחרו פריט אחר`)
                }
                console.log(response);
            } else {
                notify(`בחירתך להביא ${selectedItem.name} נרשמה `);
                this.querySelector('#btnUndo').style.display = '';
                this.querySelector('select-box').items =  await getItems();
                this.querySelector('#btnSend').disabled = 'disabled';
            }



        })

    }

    render() {
        this.innerHTML = `
        <input type="text" placeholder="שם הילד" name="kidName">
<select-box></select-box>
<button id="btnUndo" style="display: none;">התחרטתי</button>
<button id="btnSend">שליחה</button>`;
    }
}

customElements.define('selection-form', SelectionForm);
