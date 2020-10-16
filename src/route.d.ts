declare class Route {
    constructor(...args: any[])

    relative(path: string): string
    match(path: string): object

    static sanitize(path: string): string
}

export = Route