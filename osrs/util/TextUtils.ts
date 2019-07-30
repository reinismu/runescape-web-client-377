import { rs_hash_string } from "./../../wasm/src/lib.rs";
import Long from "long";

export class TextUtils {
    public static VALID_CHARACTERS: string[] = [
        "_",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9"
    ];

    public static nameToLong(name: string): Long {
        let longName: Long = new Long(0, 0);
        for (let i: number = 0; i < name.length && i < 12; i++) {
            {
                const ch: string = name.charAt(i);
                longName = longName.mul(37);
                if (
                    (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(ch) >= "A".charCodeAt(0) &&
                    (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(ch) <= "Z".charCodeAt(0)
                ) {
                    longName = longName.add(1 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(ch) - 65);
                } else if (
                    (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(ch) >= "a".charCodeAt(0) &&
                    (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(ch) <= "z".charCodeAt(0)
                ) {
                    longName = longName.add(1 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(ch) - 97);
                } else if (
                    (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(ch) >= "0".charCodeAt(0) &&
                    (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(ch) <= "9".charCodeAt(0)
                ) {
                    longName = longName.add(27 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(ch) - 48);
                }
            }
        }
        for (; longName.mod(37).isZero() && !longName.isZero(); longName = longName.div(37)) {}
        return longName;
    }

    public static longToName(longName: Long): string {
        if (longName.lessThan(0) || longName.greaterThan(6582952005840035281)) {
            return "invalid_name";
        }
        if (longName.div(37).isZero()) {
            return "invalid_name";
        }
        let length: number = 0;
        const name: string[] = Array(12).fill("");
        while (!longName.isZero()) {
            const tmp: Long = new Long(longName.low, longName.high);
            longName = longName.div(37);
            name[11 - length++] = TextUtils.VALID_CHARACTERS[tmp.sub(longName.mul(37)).toNumber()];
        }
        return name.join("");
    }

    public static spriteToHash(sprite: string): number {
        return rs_hash_string(sprite);
    }

    public static decodeAddress(address: number): string {
        return ((address >> 24) & 255) + "." + ((address >> 16) & 255) + "." + ((address >> 8) & 255) + "." + (address & 255);
    }

    public static formatName(name: string): string {
        if (name.length > 0) {
            const formatedName: string[] = /* toCharArray */ name.split("");
            for (let pos: number = 0; pos < formatedName.length; pos++) {
                if ((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(formatedName[pos]) == "_".charCodeAt(0)) {
                    formatedName[pos] = " ";
                    if (
                        pos + 1 < formatedName.length &&
                        (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(formatedName[pos + 1]) >= "a".charCodeAt(0) &&
                        (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(formatedName[pos + 1]) <= "z".charCodeAt(0)
                    ) {
                        formatedName[pos + 1] = String.fromCharCode(
                            (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(formatedName[pos + 1]) + 65 - 97
                        );
                    }
                }
            }
            if (
                (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(formatedName[0]) >= "a".charCodeAt(0) &&
                (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(formatedName[0]) <= "z".charCodeAt(0)
            ) {
                formatedName[0] = String.fromCharCode(
                    (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(formatedName[0]) + 65 - 97
                );
            }
            return formatedName.join("");
        } else {
            return name;
        }
    }

    public static censorPassword(password: string): string {
        let censoredPassword = "";
        for (let index: number = 0; index < password.length; index++) {
            censoredPassword += "*";
        }
        return censoredPassword;
    }
}
