// Thanks to https://stackoverflow.com/a/63763497
export function getInitials(name: string): string {
    return (
        name
            .match(/(\b\S)?/g)
            ?.join("")
            .match(/(^\S|\S$)?/g)
            ?.join(".")
            .toUpperCase() || ""
    );
}
