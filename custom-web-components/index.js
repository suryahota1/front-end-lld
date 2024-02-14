// A customized paragraph element
// document.body.appendChild(document.getElementById("sample").content);
class CustomizedParagraphElement extends HTMLParagraphElement {

    static count = 0;

    constructor() {
        super();
    }

    connectedCallback () {
        console.log("Paragraph mounted", ++CustomizedParagraphElement.count);
    }
}

// A customized HTML element
class CustomHTMLElement extends HTMLElement {
    
    constructor() {
        super();
        this._internals = this.attachInternals();
    }

    static observedAttributes = ["name"];

    get collapsed () {
        this._internals.states.has("--collapsed");
    }

    set collapsed ( flag ) {
        if ( flag ) this._internals.states.add("--collapsed");
        else this._internals.states.delete("--collapsed");
    }

    connectedCallback () {
        console.log("Component mounted");
        const shadow = this.attachShadow({ mode: "open" });

        const wrapper = document.createElement("span");
        wrapper.setAttribute("class", "wrapper");

        const info = document.createElement("span");
        info.setAttribute("class", "info");

        const text = document.createElement("span");
        text.setAttribute("class", "text");

        if ( this.hasAttribute("name") ) {
            info.textContent = this.getAttribute("name");
        }

        let imgURL;
        if ( this.hasAttribute("img") ) {
            imgURL = this.getAttribute("img");
        } else {
            imgURL = "./showers.svg";
        }

        const imgEle = document.createElement("img");
        imgEle.src = imgURL;
        text.appendChild(imgEle);

        const style = document.createElement("style");

        const cssSheet = new CSSStyleSheet();
        cssSheet.replace("span {color: red}");
        shadow.adoptedStyleSheets = [cssSheet];
        style.textContent = `
            .wrapper {
                position: relative;
            }

            .info {
                font-size: 0.8rem;
                width: 200px;
                display: inline-block;
                border: 1px solid black;
                padding: 10px;
                background: white;
                border-radius: 10px;
                opacity: 0;
                transition: 0.6s all;
                position: absolute;
                bottom: 20px;
                left: 10px;
                z-index: 3;
            }
        
            img {
                width: 1.2rem;
            }
        
            .text:hover + .info, .text:focus + .info {
                opacity: 1;
            }
        `;

        wrapper.appendChild(text);
        wrapper.appendChild(info);
        shadow.appendChild(style);
        shadow.appendChild(wrapper);
    }

    disconnectedCallback () {
        console.log("Component unmounted");
    }

    adoptedCallback () {
        console.log("Component moved to a different document");
    }

    attributeChangedCallback ( name, oldValue, newValue ) {
        console.log(`Attribute ${name} has changed from ${oldValue} to ${newValue}.`);
    }
}

class CustomULElement extends HTMLUListElement {

    constructor () {
        self = super();
    }

    #recurAndAppend ( ulEle ) {
        const children = ulEle.children;
        console.log("children", children);
        for ( let i = 0; i < children.length; i++ ) {
            console.log("children[i]", children[i]);
            if ( children[i]["children"].length > 0 ) {
                children[i].classList.add("expandable");
                children[i].classList.add("hidden");
                children[i].addEventListener("click", ( event ) => {
                    event.stopPropagation();
                    console.log(event);
                    event.target.classList.toggle("hidden");
                });

                this.#recurAndAppend(children[i]["children"][0]);
            } else {
                children[i].classList.add("not-expandable");
                children[i].classList.add("shown");
            }
        }
    }

    connectedCallback() {
        console.log("lis", self.querySelector("li"));
        this.#recurAndAppend(this);
    }
}

customElements.define("surya-custom-element", CustomHTMLElement);
customElements.define("surya-custom-ul-element", CustomULElement, { extends: "ul" });
customElements.define("surya-custom-paragraph-element", CustomizedParagraphElement, {extends: "p"});
