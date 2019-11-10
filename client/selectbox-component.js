import "./menu-item.js";

const defaultText = "בחר/י";

export class SelectBox extends HTMLElement {
  connectedCallback() {
    this.dropdownOpen = true;
    this.render();
  }

  get items() {
    return this._items || [];
  }

  get dropdownOpen() {
    return this._dropdownOpen;
  }

  set dropdownOpen(value) {
    this._dropdownOpen = value;
    const carrotElement = this.querySelector(".open-close");
    const itemsContainer = this.querySelector(".items-container");
    if (!carrotElement) {
      return;
    }
    if (value) {
      carrotElement.classList.remove("close");
      itemsContainer.classList.remove("close");
    } else {
      carrotElement.classList.add("close");
      itemsContainer.classList.add("close");
    }
  }

  set items(items) {
    if (items !== this._items) {
      console.log("new items", items);
      this._items = items;
      const itemsElement = this.querySelector(".items-container");
      if (itemsElement) {
        itemsElement.innerHTML = this.renderItems();
      }
      this.setItemEvents();
    }
  }

  get selectedText() {
    return this.selectedItem ? this.selectedItem.name : defaultText;
  }

  renderStyle() {
    return ` <style>
        ul {
        list-style: none;
        direction: rtl;
        padding: 0;
        max-height: 999px;
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
            width: 100%;
            background-color: white;
            transition: opacity 1s, max-height 1s;
            opacity: 1;
            max-height: 999px;;

        }
        .items-container.close {
            opacity: 0;
            max-height: 0;
            transition: max-height 1s, opacity 1s,;
        }
      
      ul.hidden {
       max-height: 0;
       opcity: 0;
       transition: max-height 1s opacity 1s;
      }
        
        .dropdown-header {
        direction: rtl;
            border-style: solid;
            border-width: 1px;
            display: flex;
            align-content: stretch;
            align-items: stretch;
            flex-flow: row;
            width: 100%;
            
        }
        .dropdown-header div:first-child {
            flex-shrink: 0;
            flex-grow: 1;
        }
        .dropdown-header .open-close {
            align-self: flex-end;
            width: 0.7em;
            flex-grow: 0;
            cursor: pointer;     
            transition: transform 1s;
   
        }
        
        .dropdown-header .open-close.close {
            transform: rotate(180deg);
            transition: transform 1s;
        }
    </style>`;
  }

  renderItems() {
    return `  <ul>
        ${this.items
          .map(item => {
            return `<li><a is="menu-item" id="${item.id}"> ${item.name}</a></li>`;
          })
          .join("")}
</ul>`;
  }

  setEvents() {
    this.setItemEvents();
    this.querySelector(".open-close").onclick = () => {
      this.dropdownOpen = !this.dropdownOpen;
    };
  }

  setItemEvents() {
    this.querySelectorAll('a[is="menu-item"]').forEach(element => {
      element.onSelected = () => {
        this.selectedItem = this.items.find(
          item => `${item.id}` === element.id
        );
        this.querySelector(".selected-item").textContent = this.selectedText;
      };
    });
  }

  renderHeader() {
    return `  <div class="dropdown-header">
     <div class="selected-item">
    ${this.selectedText}
    </div>
    <div class="open-close">
     <i class="fas fa-caret-up"></i>
     </div>
     </div>`;
  }

  render() {
    this.innerHTML = `
<div style="position: relative">
    ${this.renderStyle()}
   ${this.renderHeader()}
     <div class="items-container">
     ${this.renderItems()}
           
            </div>
            </div>
        `;

    this.setEvents();
  }
}

customElements.define("select-box", SelectBox);
