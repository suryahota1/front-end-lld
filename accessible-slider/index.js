class CustomSlider extends HTMLElement {

    constructor () {
        super();
    }

    static observedAttributes = [ "mode", "min", "max", "value", "id", "label" ];

    #attachListeners () {
        
    }

    connectedCallback () {
        const shadow = this.attachShadow({ mode: "open" });

        const sliderId = `custom-slider-${this.getAttribute("id")}`;

        const orientation = this.getAttribute("mode") ?? "horizontal";

        const wrapper = document.createElement("div");
        wrapper.classList.add("slider-wrapper");

        const label = document.createElement("span");
        label.classList.add("slider-label");
        label.setAttribute("id", sliderId);
        label.textContent = this.getAttribute("label");

        const containerClasses = ["slider"];
        if ( orientation === "vertical" ) containerClasses.push("vertical");
        else containerClasses.push("horizontal");

        const sliderContainer = document.createElement("div");
        sliderContainer.classList.add(...containerClasses);
        sliderContainer.setAttribute("aria-orientation", orientation);
        sliderContainer.setAttribute("aria-valuemin", this.getAttribute("min"));
        sliderContainer.setAttribute("aria-valuemax", this.getAttribute("max"));
        sliderContainer.setAttribute("aria-valuenow", this.getAttribute("now"));

        const sliderThumb = document.createElement("div");
        sliderThumb.classList.add("slider-thumb");

        sliderContainer.appendChild(sliderThumb);

        wrapper.appendChild(label);
        wrapper.appendChild(sliderContainer);

        const style = document.createElement("style");
        style.textContent = `
            .slider-wrapper {

            }
            .slider-wrapper .slider-label {

            }
            .slider-wrapper .slider {
                width: 200px; 
                height: 7px;
                background-color: blue;
            }
            .slider-wrapper .slider.vertical {

            }
            .slider-wrapper .slider.horizontal {

            }
            .slider-wrapper .slider .slider-thumb {
                width: 15px; 
                height: 10px;
                background-color: red;
            }
            .slider-wrapper .slider.vertical .slider-thumb {

            }
            .slider-wrapper .slider.horizontal .slider-thumb {

            }
        `;

        shadow.appendChild(style);
        shadow.appendChild(wrapper);
    }

    attributeChangedCallback ( name, oldValue, newValue ) {
        console.log("attributeChangedCallback name, oldValue, newValue", name, oldValue, newValue);
    }
}

customElements.define("surya-custom-slider", CustomSlider);
