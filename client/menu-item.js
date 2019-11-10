export class MenuItemComponent extends HTMLAnchorElement {
  connectedCallback() {
    this.style.cursor = "pointer";
    this.style.color = "blue";
    this.addEventListener("click", this.menuItemSelected);
  }

  menuItemSelected = () => {
    console.log("selected", this.id);

    this.dispatchEvent(new CustomEvent("menuItemSelected", { id: this.id }));
  };

  disconnectedCallback() {
    this.removeEventListener("click", this.menuItemSelected);
  }

  set onSelected(callback) {
    if (this._callback) {
      this.removeEventListener("menuItemSelected", this._callback);
    }
    this._callback = callback;
    this.addEventListener("menuItemSelected", callback);
  }
}

customElements.define("menu-item", MenuItemComponent, { extends: "a" });
