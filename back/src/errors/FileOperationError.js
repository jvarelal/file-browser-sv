const secure = require("../util/secure")

class FileOperationError extends Error {
    constructor({ message = "", errors = [] }) {
        super(message);
        try {
            this.message = secure.digest(message);
            if (errors.length > 0) {
                this.elements = errors.map(e => ({
                    route: secure.digest(e.route),
                    name: secure.digest(e.name),
                    message: secure.digest(e.message)
                }))
            }
            this.key = true
        } catch (e) {
            this.message = message;
            this.elements = errors;
        }
    }
}

module.exports = FileOperationError