class Validation {
    constructor() {
        this.errors = {};
    }

    emailValid = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            this.errors['email'] = "Invalid Email Format.";
        }
    }

    getError = () => this.errors;
}

export default Validation