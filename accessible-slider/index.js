class CustomSlider extends HTMLElement {

    thumbPosn;
    thumbValue;
    minValue;
    maxValue;
    startDragX;

    constructor () {
        super();
    }

    static observedAttributes = [ "mode", "min", "max", "value", "id", "label" ];

    #attachListeners ( ele ) {
        const thumb = ele.querySelector(".slider-thumb");
        const sliderContainer = ele.querySelector(".slider");
        console.log(thumb);
        thumb.addEventListener("keydown", ( event ) => {
            // console.log("keydown event", event);
            if ( event.code === "ArrowRight" || event.code === "ArrowUp" ) {
                console.log("this.thumbValue-----", this.thumbValue, this.maxValue);
                if ( this.thumbValue < this.maxValue ) {
                    console.log("here");
                    this.thumbValue++;
                }
            } else if ( event.code === "ArrowLeft" || event.code === "ArrowDown" ) {
                if ( this.thumbValue > this.minValue ) this.thumbValue--;
            }
            this.thumbPosn = (this.thumbValue - this.minValue) / (this.maxValue - this.minValue) * 100;
            sliderContainer.setAttribute("aria-valuenow", this.thumbValue);
            thumb.setAttribute("style", `left: ${this.thumbPosn}%`);
        });

        function drag ( e ) {
            console.log("on drag e", e, this);
            const currX = e.pageX;

        }

        thumb.addEventListener("pointerdown", ( e ) => {
            console.log("pointerdown e", e);
            e.preventDefault();
            this.startDragX = e.pageX;
            window.addEventListener("pointermove", drag);
            window.addEventListener("touchmove", drag);

            function removeEvents () {
                window.removeEventListener("pointermove", drag);
                window.removeEventListener("touchmove", drag);
            }

            window.addEventListener("pointerup", ( e ) => {
                e.preventDefault();
                removeEvents();
            });
            window.addEventListener("touchend", ( e ) => {
                e.preventDefault();
                removeEvents();
            });
        });
    }

    connectedCallback () {
        const shadow = this.attachShadow({ mode: "open" });

        const sliderId = `custom-slider-${this.getAttribute("id")}`;

        const orientation = this.getAttribute("mode") ?? "horizontal";
        const minVal = this.getAttribute("min") ?? 0;
        const maxVal = this.getAttribute("max") ?? 100;
        const value = this.getAttribute("value") ?? 0;

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
        sliderContainer.setAttribute("aria-valuemin", minVal);
        sliderContainer.setAttribute("aria-valuemax", maxVal);
        sliderContainer.setAttribute("aria-valuenow", value);
        sliderContainer.setAttribute("aria-labelledby", sliderId);

        const sliderThumb = document.createElement("div");
        sliderThumb.classList.add("slider-thumb");
        sliderThumb.setAttribute("tabindex", 0);

        sliderContainer.appendChild(sliderThumb);

        wrapper.appendChild(label);
        wrapper.appendChild(sliderContainer);

        this.thumbValue = Number(value);
        this.minValue = Number(minVal);
        this.maxValue = Number(maxVal);

        this.thumbPosn = (this.thumbValue - this.minValue) / (this.maxValue - this.minValue) * 100;

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
                position: relative;
            }
            .slider-wrapper .slider.vertical {

            }
            .slider-wrapper .slider.horizontal {

            }
            .slider-wrapper .slider .slider-thumb {
                width: 15px; 
                height: 10px;
                background-color: red;
                position: absolute;
                left: ${this.thumbPosn}%
            }
            .slider-wrapper .slider.vertical .slider-thumb {

            }
            .slider-wrapper .slider.horizontal .slider-thumb {

            }
        `;

        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        this.#attachListeners(this.shadowRoot);
    }

    attributeChangedCallback ( name, oldValue, newValue ) {
        console.log("attributeChangedCallback name, oldValue, newValue", name, oldValue, newValue);
    }
}

customElements.define("surya-custom-slider", CustomSlider);
