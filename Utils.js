const fs = require('fs');
const path = require('path');
const resolve = path.resolve;

const _defaultAssertOptions = {
    error: "ReferenceError: test is not defined",
    failEmptyString: true,
    failNullValue: true,
    failZeroValue: false,
    test: null
};
function Assert(target, options) {
    let _opts = {};
    Object.assign(
        _opts,
        _defaultAssertOptions,
        typeof options === "string" ? { error: options } : options
    );
    if (
        target === undefined ||
        _opts.failNullValue && target === null ||
        _opts.failZeroValue && target === 0 ||
        _opts.failEmptyString && target === "" ||
        _opts.test && _opts.test(target)
    ) throw _opts.error;
    return target;
}

function ValueOf(from, path, propDefault) {
    const props = path.split(".");
    let result = from;
    for (let i = 0; i < props.length; i++) {
        if (Boolean(result) && Boolean(result[props[i]])) {
            result = result[props[i]];
        } else {
            result = propDefault;
        }
    }
    return result;
}


function fileExists(path) {
    try {
        if (fs.existsSync(path)) {
            return true;
        }
    } catch (err) {
        return false;
    }
    return false;
}

function toAbsolutePath(path) {
    return resolve(path);
}

function scanDirectorySync(dir, filelist = []) {
    fs.readdirSync(dir).forEach(file => {
        filelist = fs.statSync(path.join(dir, file)).isDirectory()
            ? scanDirectorySync(path.join(dir, file), filelist)
            : filelist.concat(path.join(dir, file));
    });
    return filelist;
}

module.exports = {
    Assert,
    ValueOf,
    fileExists,
    toAbsolutePath,
    scanDirectorySync
}