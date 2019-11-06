export class WhoBringsWhat extends HTMLElement {

    connectedCallback() {
        this.render();
    }

    get items() {
        return this._items || [];
    }

    set items(items) {
        if (items !== this._items) {
            this._items = items;
            this.render();
        }
    }

    render() {
        this.innerHTML = (this.items && this.items.length || '') && `
        <style>
        th, td {
            border-bottom: 1px solid;
            border-left: 1px solid;
            
        }
</style>
        <table>
                <tr>
                <th>כיבוד</th>
                <th>שם הילד/ה</th>
</tr>
        ${this.items.map(item  => {
            return `<tr>
                    <td>${item.name}</td>
                        <td>${item.kidName || ''}</td>
                    </tr>`
        }).join('')}

</table>`
    }
}

customElements.define('who-brings-what', WhoBringsWhat);
