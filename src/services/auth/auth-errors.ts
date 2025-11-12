export class AuthenticationError extends Error {
    #resource: string;

    constructor(resource: string) {
        super(`Authentication is required to access ${resource}.`);
        this.#resource = resource;
    }

    get resource() {
        return this.#resource;
    }
}

export class AuthorizationError extends Error {
    #resource: string;
    #requirement: string;

    constructor(requirement: string, resource: string) {
        super(`You does not have authorization to access ${resource}. Requires ${requirement} access.`);
        this.#resource = resource;
        this.#requirement = requirement;
    }

    get resource() {
        return this.#resource;
    }

    get requirement() {
        return this.#requirement;
    }
}

export class TokenExpiredError extends Error {
    #resource: string;
    #token_name: string;

    constructor(resource: string, tokenName: 'access_token' | `id_token` | `refresh_token` | 'session_token') {
        super(`Token ${tokenName} was expired!`);
        this.#resource = resource;
        this.#token_name = tokenName;
    }

    get resource() {
        return this.#resource;
    }

    get tokenName() {
        return this.#token_name;
    }
}