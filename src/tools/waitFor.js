// This basically waits for item to not be null and then executes the code.
// This can be used for State Management.

export default function waitFor(item, callback, interval = 10) {

    const checkItem = () => {
        if (item !== null) {
            callback(item);
        } else {
            setTimeout(checkItem, interval);
        }
    }

    return checkItem()
}