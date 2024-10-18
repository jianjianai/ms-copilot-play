import { net } from "electron";

export function pFetch(
    input: string,
    init?: RequestInit,
): Promise<GlobalResponse>{
    return net.fetch(input, init);
}