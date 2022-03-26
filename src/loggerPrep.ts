function prefixLogger(prefix, func) {
    return function () {
        let args = [];
        args.push("[" + prefix + "]");
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        func.apply(console, args);
    };
}

console.info = prefixLogger("info", console.info);
console.debug = prefixLogger("debug", console.debug);
console.log = prefixLogger("log", console.log);
console.warn = prefixLogger("warn", console.warn);
console.error = prefixLogger("error", console.error);
