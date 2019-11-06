import './menu-item.js';

const defaultText = 'בחר/י'

export class SelectBox extends HTMLElement {

    connectedCallback() {
        this.render();
    }

    get items() {
        return this._items || [];
    }

    set items(items) {
        if (items !== this._items) {
            console.log("new items", items);
            this._items = items;
            this.render();
        }
    }

    get selectedText() {
        return this.selectedItem ? this.selectedItem.name : defaultText;
    }


    render() {
        this.innerHTML = `
    <style>
        ul {
        list-style: none;
        direction: rtl;
        }
          
        .items-container ul li:nth-child(even) {
        background-color: lightblue;
        }
        .items-container ul li:hover, .items-container ul li:active,a[is="menu-item"]:hover, a[is="menu-item"]:active {
            font-size: 18px;
            transition: font-size 0.5s;
            background-color: rgba(200, 200, 200, 0.9);
        }
        .items-container {
            max-height: 20em;
            overflow-y: auto;
            border: solid 1px;
        }
      
        
        .selectedItem {
        direction: rtl;
            border-style: solid;
            border-width: 1px;
        }
    </style>
     <div class="selectedItem">${this.selectedText}</div>
     <div class="items-container">
            <ul>
                ${this.items.map(item => {
               return `<li><a is="menu-item" id="${item.id}"> ${item.name}</a></li>`    
        }).join('')}
            </ul>
            </div>
        `;

        this.querySelectorAll('a[is="menu-item"]').forEach(element => {
            element.onSelected = () => {
                this.selectedItem = this.items.find(item => item.id === element.id);
                this.render();
            }
        })


    }

}

customElements.define('select-box', SelectBox);
