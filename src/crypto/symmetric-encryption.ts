import * as Crypto from "crypto";
import { CryptoException } from "./crypto-exception";
import { given } from "@nivinjoseph/n-defensive";
import "@nivinjoseph/n-ext";


// public
export class SymmetricEncryption
{
    private constructor() { }

    
    public static generateKey(): Promise<string>
    {
        return new Promise<string>((resolve, reject) =>
        {
            Crypto.randomBytes(32, (err, buf) =>
            {
                if (err)
                {
                    reject(err);
                    return;
                }

                resolve(buf.toString("hex").toUpperCase());
            });
        });
    }
    
    public static encrypt(key: string, value: string): Promise<string>
    {
        given(key, "key").ensureHasValue().ensureIsString().ensure(t => !t.isEmptyOrWhiteSpace());
        given(value, "value").ensureHasValue().ensureIsString().ensure(t => !t.isEmptyOrWhiteSpace());
        
        key = key.trim();
        value = value.trim();
        
        return new Promise<string>((resolve, reject) =>
        {
            Crypto.randomBytes(16, (err, buf) =>
            {
                if (err)
                {
                    reject(err);
                    return;
                }

                try 
                {
                    const iv = buf;
                    const cipher = Crypto.createCipheriv("AES-256-CBC", Buffer.from(key, "hex"), iv);
                    let encrypted = cipher.update(value, "utf8", "hex");
                    encrypted += cipher.final("hex");
                    const cipherText = `${encrypted}.${iv.toString("hex")}`;
                    resolve(cipherText);
                }
                catch (error)
                {
                    reject(error);
                }
            });
        });
        
        
    }
    
    public static decrypt(key: string, value: string): Promise<string>
    {
        given(key, "key").ensureHasValue().ensureIsString().ensure(t => !t.isEmptyOrWhiteSpace());
        given(value, "value").ensureHasValue().ensureIsString().ensure(t => !t.isEmptyOrWhiteSpace());

        key = key.trim();
        value = value.trim();
        
        try 
        {
            const splitted = value.split(".");
            if (splitted.length !== 2)
                throw new CryptoException("Invalid value.");

            const iv = Buffer.from(splitted[1], "hex");
            const deCipher = Crypto.createDecipheriv("AES-256-CBC", Buffer.from(key, "hex"), iv);
            let decrypted = deCipher.update(splitted[0], "hex", "utf8");
            decrypted += deCipher.final("utf8");
            return Promise.resolve(decrypted);
        }
        catch (error)
        {
            return Promise.reject(error);
        }
    }
}