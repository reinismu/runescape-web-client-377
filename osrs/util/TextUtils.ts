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

    public static nameToLong(name: string): number {
        let longName: number = 0;
        for (let i: number = 0; i < name.length && i < 12; i++) {
            {
                const ch: string = name.charAt(i);
                longName *= 37;
                if (
                    (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(ch) >= "A".charCodeAt(0) &&
                    (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(ch) <= "Z".charCodeAt(0)
                ) {
                    longName += 1 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(ch) - 65;
                } else if (
                    (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(ch) >= "a".charCodeAt(0) &&
                    (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(ch) <= "z".charCodeAt(0)
                ) {
                    longName += 1 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(ch) - 97;
                } else if (
                    (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(ch) >= "0".charCodeAt(0) &&
                    (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(ch) <= "9".charCodeAt(0)
                ) {
                    longName += 27 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(ch) - 48;
                }
            }
        }
        for (; longName % 37 === 0 && longName !== 0; longName = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(longName / 37)) {}
        return longName;
    }

    public static longToName(longName: number): string {
        if (longName <= 0 || longName >= 6582952005840035281) {
            return "invalid_name";
        }
        if (longName % 37 === 0) {
            return "invalid_name";
        }
        let length: number = 0;
        const name: string[] = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(null);
            }
            return a;
        })(12);
        while (longName !== 0) {
            {
                const tmp: number = longName;
                longName = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(longName / 37);
                name[11 - length++] = TextUtils.VALID_CHARACTERS[((tmp - longName * 37) as number) | 0];
            }
        }
        return ((str, index, len) => str.substring(index, index + len))(name.join(""), 12 - length, length) as string;
    }

    public static spriteToHash(sprite: string): number {
        sprite = sprite.toUpperCase();
        let spriteHash: number = 0;
        for (let index: number = 0; index < sprite.length; index++) {
            {
                spriteHash = spriteHash * 61 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(sprite.charAt(index)) - 32;
                spriteHash = (spriteHash + (spriteHash >> 56)) & 72057594037927935;
            }
        }
        return spriteHash;
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
            return new String(formatedName) as string;
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