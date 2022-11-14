export function camelToPretty(value: string): string {
    return value.replace(new RegExp("([A-Z])"), value => " " + value.toLowerCase())
}
