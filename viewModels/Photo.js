export default class Photo {
    id: string;
    created_time: date;

    constructor({
        id,
        created_time
    }) {
        this.id = id;
        this.created_time = created_time;
    }
}