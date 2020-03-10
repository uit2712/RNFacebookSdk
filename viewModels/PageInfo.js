export default class PageInfo {
    id: string;
    access_token: string;
    category: string;
    name: string;

    constructor({
        id,
        access_token,
        category,
        name
    }) {
        this.id = id;
        this.access_token = access_token;
        this.category = category;
        this.name = name;
    }
}