const LOADING_STATUS = Symbol("loading");
const RESULT_AVAILABLE_STATUS = Symbol("result available");
const RESULT_NOT_AVAILABLE_STATUS = Symbol("result not available");

class AutoComplete {

    input;
    suggestion;
    liveRegion;
    value;

    constructor ( inputEle, suggestionEle, liveRegionEle ) {
        this.input = inputEle;
        this.suggestion = suggestionEle;
        this.liveRegion = liveRegionEle;
    }

    #onArrowDown () {

    }

    #updateFetchStatus ( status, count, query ) {
        if ( status === LOADING_STATUS ) this.liveRegion.innerHTML = "Fetching results for " + query;
        else if ( status === RESULT_AVAILABLE_STATUS ) this.liveRegion.innerHTML = count + " results available for " + query;
        else if ( status === RESULT_NOT_AVAILABLE_STATUS ) this.liveRegion.innerHTML = query ? "No results available for " + query : "No results available";
    }

    #clearSuggestions () {
        this.suggestion.innerHTML = "";
        this.suggestion.classList.add("hidden");
    }

    #appendResult ( data, value ) {
        const fragment = document.createDocumentFragment();
        let isSelected = false;
        for ( let i = 0; i < data.length; i++ ) {
            const nowSelected = !isSelected && data[i] === value ? "true" : "false";
            const opt = document.createElement("li");
            opt.setAttribute("role", "option");
            opt.setAttribute("aria-selected", nowSelected);
            opt.setAttribute("aria-label", data[i]);
            opt.setAttribute("tabindex", -1);
            opt.setAttribute("data-option-value", data[i]);
            opt.innerText = data[i];
            fragment.appendChild(opt);
        }
        this.suggestion.appendChild(fragment);
        this.suggestion.classList.remove("hidden");
    }

    #fetchSuggestions ( value ) {
        this.#updateFetchStatus(LOADING_STATUS, 0, value);
        this.#clearSuggestions();
        Util.getSuggestions(value).then(data => {
            console.log("getSuggestions data", data);
            if ( data && data.length > 0 ) {
                // update suggestions - prepare the dom and attach
                this.#appendResult(data, value);
                // update live region
                this.#updateFetchStatus(RESULT_AVAILABLE_STATUS, data.length, value);
            } else {
                // update live region
                this.#updateFetchStatus(RESULT_NOT_AVAILABLE_STATUS, 0, value);
            }
        });
    }

    #handleKeyUp ( event ) {
        console.log("key up event event", event);
        console.log("key up event this", this);
        const { target: { value }, keyCode } = event;
        console.log("key up event value, keyCode", value, keyCode);

        switch ( keyCode ) {
            case 40: 
                this.#onArrowDown();
                break;
            default: 
                if ( value ) this.#fetchSuggestions(value);
                else {
                    this.#clearSuggestions();
                    this.#updateFetchStatus(RESULT_NOT_AVAILABLE_STATUS, 0, value);
                }
        }
    }

    #focusMenu () {
        const isMenuOpen = this.suggestion.classList.value.indexOf("hidden") === -1;
        if ( isMenuOpen ) {
            const target = this.suggestion.querySelector("[aria-selected='true']") ?? this.suggestion.firstChild;
            if ( target ) {
                target.focus();
                target.scrollIntoView();
            }
        }
    }

    #handleKeyDown ( event ) {
        console.log("handleKeyDown", event);
        const { keyCode } = event;
        if ( keyCode === 9 ) {
            this.suggestion.classList.add("hidden");
        } else if ( keyCode === 40 ) {
            this.#focusMenu();
        }
    }

    #handleSuggestionClick ( event ) {
        console.log("suggestion click", event);
        const { target: option } = event;
        this.value = option.dataset.optionValue;
        console.log("suggestion this.value", this.value);
        const prevSelected = this.suggestion.querySelector("[aria-selected='true']");
        if ( prevSelected ) prevSelected.setAttribute("aria-selected", "false");
        option.setAttribute("aria-selected", "true");
        this.suggestion.classList.add("hidden");
        this.input.value = this.value;
        this.input.focus();
    }

    #handleSuggestionKeyPress ( event ) {
        console.log("handleSuggestionKeyPress", event);
        const { keyCode } = event;
        const currActive = document.activeElement;
        if ( keyCode === 38 ) {
            // Arrow up
            if ( currActive === this.suggestion.firstChild ) {

            } else {
                currActive.previousSibling.focus();
                currActive.previousSibling.scrollIntoView();
            }
        } else if ( keyCode === 40 ) {
            // Arrow down
            if ( currActive === this.suggestion.lastChild ) {

            } else {
                currActive.nextSibling.focus();
                currActive.nextSibling.scrollIntoView();
            }
        }
    }

    initializeEvents () {
        if ( this.input ) {
            console.log("this.input", this.input, this);
            const debounce = Util.debounce.bind(this);
            this.input.addEventListener("keyup", debounce(this.#handleKeyUp, 700));
            this.input.addEventListener("keydown", this.#handleKeyDown.bind(this));
            document.addEventListener("click", ( event ) => {
                if ( !this.input.contains(event.target) && !this.suggestion.contains(event.target) ) {
                    this.suggestion.classList.add("hidden");
                } else if ( this.input.contains(event.target) ) {
                    this.suggestion.classList.remove("hidden");
                }
            });
            this.suggestion.addEventListener("click", this.#handleSuggestionClick.bind(this));
            this.suggestion.addEventListener("keydown", this.#handleSuggestionKeyPress.bind(this));
        }
    }
}

(function () {
    const autoComp = new AutoComplete(
        document.getElementById("suggestion-query"), 
        document.getElementById("suggestion-response"), 
        document.getElementById("suggestion-status")
    );
    autoComp.initializeEvents();
}())
