export function notify( message) {
    const element = document.createElement('notification-element');
    element.setAttribute('message', message);
    document.body.append(element);
}


export class NotificationComponent extends HTMLElement {

    static get observedAttributes() {
        return ['message'];
    }

    attributeChangeCallback() {
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    destroy = () => {
        this.remove();
    }

    render() {
        this.innerHTML = `<style>
        notification-element {
            background-color: blue;
            transition: opacity 5s;
            color: white;
            position: fixed;
            font-size: 20px;
            border-radius: 3px;
            padding: 2px;
            top: 0px;
            right: 0;
            opacity: 1;
            transition: opacity 10s ease-in-out;
        }
        notification-element.disappear {
            opacity: 0;
             transition: opacity 10s ease-in-out;
        }
</style>
<div>${this.getAttribute('message')}</div>`;
        window.requestAnimationFrame(() => {
            this.classList.add('disappear')
        });
        setTimeout(this.destroy, 10000);
    }
}

customElements.define('notification-element', NotificationComponent);
