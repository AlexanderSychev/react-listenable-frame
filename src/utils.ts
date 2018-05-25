export type Omit<T, K extends keyof T> = Pick<
    T,
    ({ [P in keyof T]: P } & { [P in K]: never } & { [x: string]: never; [x: number]: never })[keyof T]
>;

/** Implementation of "Array.prototype.includes" for ES5 */
export function includes<T>(collection: T[], value: T): boolean {
    let result: boolean = false;
    for (const item of collection) {
        result = value === item;
        if (result) {
            break;
        }
    }
    return result;
}

/** Get copy of object without some fields */
export function omit<T, K extends keyof T>(value: T, props: K[]): Omit<T, K> {
    const result: T = <T>{};
    Object.keys(value).forEach(key => {
        if (!includes(props, key)) {
            result[key] = value[key];
        }
    });
    return result;
}

/** Returns "true" if value equals "null" or "undefined" */
export function isNil(value: any): value is null | undefined {
    return value === null || value === undefined;
}
