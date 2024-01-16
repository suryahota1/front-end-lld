const Util = (() => {

    const suggestions = ["Surya", "Suryakant", "Sashi", "Nishi", "Sushree", "Shradha", "Sudhakar", 
        "Sitakant", "Ramakant"
    ];

    function debounce ( func, delay ) {

        let timer = null;
        const context = this;

        function prepare ( context, args ) {
            // Do prepare for delay time period before executing
            timer = window.setTimeout(check, delay, context, args);
        }

        function cancelPrepare () {
            clearTimeout(timer);
            timer = null;
        }

        function check ( context, args ) {
            func.apply(context, args);
        }

        return function ( ...args ) {
            cancelPrepare();
            prepare(context, args);
        }
    }

    function getSuggestions ( query="" ) {
        return new Promise(( resolve, reject ) => {
            const resp = suggestions.filter(sug => sug.toLowerCase().indexOf(query.toLowerCase()) >= 0);
            setTimeout(() => {
                resolve(resp);
            }, 1000);
        });
    }

    return {
        debounce, 
        getSuggestions
    };
})();
