import { given } from "@nivinjoseph/n-defensive";
import { createHmac } from "node:crypto";


// public
export class Hmac
{
    private constructor() { }


    public static create(key: string, value: string): string
    {
        given(key, "key").ensureHasValue().ensureIsString();
        given(value, "value").ensureHasValue().ensureIsString();

        key = key.trim();
        value = value.trim();

        const hmac = createHmac("sha256", Buffer.from(key, "hex"));

        hmac.update(value, "utf8");
        return hmac.digest("hex").toUpperCase();
    }
}