import secure from "../helpers/secure.js";

class FileOperationError extends Error {
    constructor({ message = "", errors = [], status = 500 }) {
        super(message);
        this.status = status
        try {
            this.message = secure.digest(message);
            if (errors.length > 0) {
                this.errors = errors.map(e => ({
                    route: secure.digest(e.route),
                    name: secure.digest(e.name),
                    message: secure.digest(e.message)
                }))
            }
            this.secure = true
        } catch (e) {
            this.message = message;
            this.elements = errors;
        }
    }
}

export default FileOperationError