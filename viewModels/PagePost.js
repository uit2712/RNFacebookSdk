export default class PagePost {
    id: string;
    created_time: date;
    message: string;

    constructor({
        id,
        created_time,
        message
    }) {
        this.id = id;
        this.created_time = created_time;
        this.message = message;
    }
}