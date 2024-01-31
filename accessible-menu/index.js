class Accordion {

    parentNode;

    constructor( parent ) {
        this.parentNode = parent;
        this.#initializeEvents();
    }

    #toggleEle ( currOpen, status ) {
        currOpen.setAttribute("aria-expanded", status);
        const contentEle = currOpen.closest(".accordion-item").querySelector(".accordion-content");
        contentEle.setAttribute("aria-hidden", !status);
        if ( status ) contentEle.removeAttribute("hidden");
        else contentEle.setAttribute("hidden", true);
    }

    #hideOther ( node ) {
        const currOpen = node.closest(".accordion.accordion-controls").querySelector(".accordion-main-control[aria-expanded='true']");
        console.log("currOpen", currOpen);
        if ( currOpen ) {
            this.#toggleEle(currOpen, false);
        }
    }

    #initializeEvents () {
        this.parentNode.querySelectorAll(".accordion-main-control").forEach(item => {
            item.addEventListener("click", ( event ) => {
                console.log(event);
                this.#hideOther(event.target);
                this.#toggleEle(event.target, true);
                // const currSiblings = 
            });
        });
    }
}

document.querySelectorAll(".accordion.accordion-controls").forEach(node => {
    new Accordion(node);
});
