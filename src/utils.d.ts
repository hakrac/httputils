declare function isolate(fn: (...args: any[]) => any, obj: object, ...props: string[]): (...args: any[]) => any 


export module "utils" {
    isolate
}