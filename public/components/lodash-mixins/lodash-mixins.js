_.mixin({
    'startsWith': function(str, subStr) {
        if (_.isString(str)) {
            return str.lastIndexOf(subStr, 0) === 0;
        }
        return false;
    },
    'without': function(array, object) {
        array.splice(array.indexOf(object), 1);
    }
});