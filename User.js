class User {
    constructor(name, password, id = null) {
        this.name = name;
        this.password = password;
        this.id = id ?? new Date().getTime();
    }

    get Name() {
        return this.name;
    }

    get Id() {
        return this.id;
    }

    set Name(name) {
        this.name = name;
    }

    set Id(id) {
        this.id = id;
    }
}

export default Object.freeze(User);