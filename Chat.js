class Chat {
    constructor(message, sender, receiver, time = null) {
        this.message = message;
        this.sender = sender;
        this.receiver = receiver;
        this.time = time ?? new Date().getTime();
    }

    get Message() {
        return this.message;
    }

    get Time() {
        return this.time;
    }

    get Sender() {
        return this.sender;
    }

    get Receiver() {
        return this.receiver;
    }

    set Message(message) {
        this.message = message;
    }

    set Sender(sender) {
        this.sender = sender;
    }

    set Receiver(receiver) {
        this.receiver = receiver;
    }
}

export default Object.freeze(Chat);