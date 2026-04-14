// Animal module
// Handles ONLY animal data model + validation

export class Animal {
    #healthStatus;

    constructor({ id, name, species, health = "Healthy", status = "closed" }) {
        if (typeof id !== "number" || typeof name !== "string" || typeof species !== "string") {
            throw new Error("Invalid Animal constructor data");
        }

        this.id = id;
        this.name = name;
        this.species = species;
        this.availability = status;
        this.#healthStatus = health;
    }

    get status() {
        return this.#healthStatus;
    }

    set status(value) {
        if (typeof value !== "string" || !value.trim()) {
            throw new Error("Invalid health status");
        }
        this.#healthStatus = value.trim();
    }

    toggleAvailability = () => {
        this.availability = this.availability === "open" ? "closed" : "open";
    };
}