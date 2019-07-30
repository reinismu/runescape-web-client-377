import { Buffer } from "../../net/Buffer";
import { Archive } from "../Archive";

export class ChatCensor {
    public static anInt728: number = 3;

    public static anInt729: number = 0;

    public static aBoolean731: boolean = false;

    public static aBoolean732: boolean = false;

    public static anInt733: number = -48545;

    public static anInt734: number = 0;

    public static aByte735: number = -113;

    public static anInt736: number = 3;

    public static aBoolean738: boolean = false;

    public static fragments: number[] = null;

    public static badWords: string[][] = null;

    public static badBytes: number[][][] = null;

    public static domains: string[][] = null;

    public static topLevelDomains: string[][] = null;

    public static topLevelDomainsType: number[] = null;

    public static toCharArray: string[] = ["cook", "cook\'s", "cooks", "seeks", "sheet", "woop", "woops", "faq", "noob", "noobs"];

    public static load(archive: Archive) {
        const fragmentsEnc: Buffer = new Buffer(archive.getFile("fragmentsenc.txt"));
        const badEnc: Buffer = new Buffer(archive.getFile("badenc.txt"));
        const domainEnc: Buffer = new Buffer(archive.getFile("domainenc.txt"));
        const topLevelDomainsBuffer: Buffer = new Buffer(archive.getFile("tldlist.txt"));
        ChatCensor.loadDictionaries(fragmentsEnc, badEnc, domainEnc, topLevelDomainsBuffer);
    }

    public static loadDictionaries(fragmentsEnc: Buffer, badEnc: Buffer, domainEnc: Buffer, topLevelDomainsBuffer: Buffer) {
        ChatCensor.loadBadEnc(badEnc);
        ChatCensor.loadDomainEnc(domainEnc);
        ChatCensor.loadFragmentsEnc(fragmentsEnc);
        ChatCensor.loadTopLevelDomains(topLevelDomainsBuffer);
    }

    public static loadTopLevelDomains(buffer: Buffer) {
        const length: number = buffer.getInt();
        ChatCensor.topLevelDomains = ((s) => { const a = []; while (s-- > 0) { a.push(null); } return a; })(length);
        ChatCensor.topLevelDomainsType = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(length);
        for (let index: number = 0; index < length; index++) {{
            ChatCensor.topLevelDomainsType[index] = buffer.getUnsignedByte();
            const topLevelDomain: string[] = ((s) => { const a = []; while (s-- > 0) { a.push(null); } return a; })(buffer.getUnsignedByte());
            for (let character: number = 0; character < topLevelDomain.length; character++) {topLevelDomain[character] = String.fromCharCode(buffer.getUnsignedByte()); }
            ChatCensor.topLevelDomains[index] = topLevelDomain;
        }}
    }

    public static loadBadEnc(buffer: Buffer) {
        const length: number = buffer.getInt();
        ChatCensor.badWords = ((s) => { const a = []; while (s-- > 0) { a.push(null); } return a; })(length);
        ChatCensor.badBytes = ((s) => { const a = []; while (s-- > 0) { a.push(null); } return a; })(length);
        ChatCensor.loadBadWords(buffer, ChatCensor.badWords, ChatCensor.badBytes);
    }

    public static loadDomainEnc(buffer: Buffer) {
        const length: number = buffer.getInt();
        ChatCensor.domains = ((s) => { const a = []; while (s-- > 0) { a.push(null); } return a; })(length);
        ChatCensor.loadDomains(buffer, ChatCensor.domains);
    }

    public static loadFragmentsEnc(buffer: Buffer) {
        ChatCensor.fragments = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(buffer.getInt());
        for (let index: number = 0; index < ChatCensor.fragments.length; index++) {ChatCensor.fragments[index] = buffer.getUnsignedLEShort(); }
    }

    public static loadBadWords(buffer: Buffer, badWords: string[][], badBytes: number[][][]) {
        for (let index: number = 0; index < badWords.length; index++) {{
            const badWord: string[] = ((s) => { const a = []; while (s-- > 0) { a.push(null); } return a; })(buffer.getUnsignedByte());
            for (let k: number = 0; k < badWord.length; k++) {badWord[k] = String.fromCharCode(buffer.getUnsignedByte()); }
            badWords[index] = badWord;
            const badByte: number[][] = (function(dims) { const allocate = function(dims) { if (dims.length == 0) { return 0; } else { const array = []; for (let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims); })([buffer.getUnsignedByte(), 2]) as any;
            for (let l: number = 0; l < badByte.length; l++) {{
                badByte[l][0] = ((buffer.getUnsignedByte() as number) | 0);
                badByte[l][1] = ((buffer.getUnsignedByte() as number) | 0);
            }}
            if (badByte.length > 0) { badBytes[index] = badByte; }
        }}
    }

    public static loadDomains(buffer: Buffer, cs: string[][]) {
        for (let index: number = 0; index < cs.length; index++) {{
            const domainEnc: string[] = ((s) => { const a = []; while (s-- > 0) { a.push(null); } return a; })(buffer.getUnsignedByte());
            for (let character: number = 0; character < domainEnc.length; character++) {domainEnc[character] = String.fromCharCode(buffer.getUnsignedByte()); }
            cs[index] = domainEnc;
        }}
    }

    public static formatLegalCharacters(characters: string[]) {
        let character: number = 0;
        for (let index: number = 0; index < characters.length; index++) {{
            if (ChatCensor.isLegalCharacter(characters[index])) { characters[character] = characters[index]; } else { characters[character] = " "; }
            if (character === 0 || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(characters[character]) != " ".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(characters[character - 1]) != " ".charCodeAt(0)) { character++; }
        }}
        for (let characterIndex: number = character; characterIndex < characters.length; characterIndex++) {characters[characterIndex] = " "; }
    }

    public static isLegalCharacter(character: string): boolean {
        return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(character) >= " ".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(character) <= "\u007f".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(character) == " ".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(character) == "\n".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(character) == "\t".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(character) == "\u00a3".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(character) == "\u20ac".charCodeAt(0);
    }

    public static censorString(string: string): string {
        // We all big boys and girls here!
        return string;
    }

    public static method384(i: number, ac: string[], ac1: string[]) {
        for (let j: number = 0; j < ac1.length; j++) {if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac[j]) != "*".charCodeAt(0) && ChatCensor.method408(-217, ac1[j])) { ac[j] = ac1[j]; }}
        if (i !== 0) { ChatCensor.anInt728 = 271; }
    }

    public static method385(i: number, ac: string[]) {
        let flag: boolean = true;
        for (let j: number = 0; j < ac.length; j++) {{
            const c: string = ac[j];
            if (ChatCensor.method405(true, c)) {
                if (flag) {
                    if (ChatCensor.method407(c)) { flag = false; }
                } else if (ChatCensor.method408(-217, c)) { ac[j] = String.fromCharCode(((((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) + 97) - 65)); }
            } else {
                flag = true;
            }
        }}
        if (i === 1) {  }
    }

    public static method386(ac: string[], i: number) {
        for (let j: number = 0; j < 2; j++) {{
            for (let k: number = ChatCensor.badWords.length - 1; k >= 0; k--) {ChatCensor.method395(ChatCensor.badBytes[k], -939, ChatCensor.badWords[k], ac); }
        }}
        if (i !== -48545) { ChatCensor.aBoolean731 = !ChatCensor.aBoolean731; }
    }

    public static method387(i: number, ac: string[]) {
        const ac1: string[] = /* clone */((o: any) => { if (o.clone != undefined) { return (o as any).clone(); } else { const clone = Object.create(o); for (const p in o) { if (o.hasOwnProperty(p)) { clone[p] = o[p]; } } return clone; } })(ac);
        const ac2: string[] = ["(", "a", ")"];
        ChatCensor.method395(null, -939, ac2, ac1);
        if (i < 3 || i > 3) { ChatCensor.anInt728 = 382; }
        const ac3: string[] = /* clone */((o: any) => { if (o.clone != undefined) { return (o as any).clone(); } else { const clone = Object.create(o); for (const p in o) { if (o.hasOwnProperty(p)) { clone[p] = o[p]; } } return clone; } })(ac);
        const ac4: string[] = ["d", "o", "t"];
        ChatCensor.method395(null, -939, ac4, ac3);
        for (let j: number = ChatCensor.domains.length - 1; j >= 0; j--) {ChatCensor.method388(ac, ac3, ac1, -65, ChatCensor.domains[j]); }
    }

    public static method388(ac: string[], ac1: string[], ac2: string[], i: number, ac3: string[]) {
        if (i >= 0) { return; }
        if (ac3.length > ac.length) { return; }
        let j: number;
        for (let k: number = 0; k <= ac.length - ac3.length; k += j) {{
            let l: number = k;
            let i1: number = 0;
            j = 1;
            while ((l < ac.length)) {{
                let j1: number = 0;
                const c: string = ac[l];
                let c1: string = "\u0000";
                if (l + 1 < ac.length) { c1 = ac[l + 1]; }
                if (i1 < ac3.length && (j1 = ChatCensor.method397(c, 0, ac3[i1], c1)) > 0) {
                    l += j1;
                    i1++;
                    continue;
                }
                if (i1 === 0) { break; }
                if ((j1 = ChatCensor.method397(c, 0, ac3[i1 - 1], c1)) > 0) {
                    l += j1;
                    if (i1 === 1) { j++; }
                    continue;
                }
                if (i1 >= ac3.length || !ChatCensor.method403(c, false)) { break; }
                l++;
            }}
            if (i1 >= ac3.length) {
                let flag1: boolean = false;
                const k1: number = ChatCensor.method389(ac, ac2, ((-72 as number) | 0), k);
                const l1: number = ChatCensor.method390(ac1, 0, l - 1, ac);
                if (k1 > 2 || l1 > 2) { flag1 = true; }
                if (flag1) {
                    for (let i2: number = k; i2 < l; i2++) {ac[i2] = "*"; }
                }
            }
        }}
    }

    public static method389(ac: string[], ac1: string[], byte0: number, i: number): number {
        if (i === 0) { return 2; }
        for (let j: number = i - 1; j >= 0; j--) {{
            if (!ChatCensor.method403(ac[j], false)) { break; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac[j]) == "@".charCodeAt(0)) { return 3; }
        }}
        let k: number = 0;
        for (let l: number = i - 1; l >= 0; l--) {{
            if (!ChatCensor.method403(ac1[l], false)) { break; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac1[l]) == "*".charCodeAt(0)) { k++; }
        }}
        if (byte0 !== -72) { return 3; }
        if (k >= 3) { return 4; }
        return !ChatCensor.method403(ac[i - 1], false) ? 0 : 1;
    }

    public static method390(ac: string[], i: number, j: number, ac1: string[]): number {
        if (j + 1 === ac1.length) { return 2; }
        for (let k: number = j + 1; k < ac1.length; k++) {{
            if (!ChatCensor.method403(ac1[k], false)) { break; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac1[k]) == ".".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac1[k]) == ",".charCodeAt(0)) { return 3; }
        }}
        let l: number = 0;
        if (i !== 0) { return ChatCensor.anInt733; }
        for (let i1: number = j + 1; i1 < ac1.length; i1++) {{
            if (!ChatCensor.method403(ac[i1], false)) { break; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac[i1]) == "*".charCodeAt(0)) { l++; }
        }}
        if (l >= 3) { return 4; }
        return !ChatCensor.method403(ac1[j + 1], false) ? 0 : 1;
    }

    public static method391(ac: string[], i: number) {
        const ac1: string[] = /* clone */((o: any) => { if (o.clone != undefined) { return (o as any).clone(); } else { const clone = Object.create(o); for (const p in o) { if (o.hasOwnProperty(p)) { clone[p] = o[p]; } } return clone; } })(ac);
        const ac2: string[] = ["d", "o", "t"];
        ChatCensor.method395(null, -939, ac2, ac1);
        const ac3: string[] = /* clone */((o: any) => { if (o.clone != undefined) { return (o as any).clone(); } else { const clone = Object.create(o); for (const p in o) { if (o.hasOwnProperty(p)) { clone[p] = o[p]; } } return clone; } })(ac);
        const ac4: string[] = ["s", "l", "a", "s", "h"];
        if (i !== 0) { ChatCensor.aBoolean732 = !ChatCensor.aBoolean732; }
        ChatCensor.method395(null, -939, ac4, ac3);
        for (let j: number = 0; j < ChatCensor.topLevelDomains.length; j++) {ChatCensor.method392(ac, ((7 as number) | 0), ac1, ChatCensor.topLevelDomainsType[j], ChatCensor.topLevelDomains[j], ac3); }
    }

    public static method392(ac: string[], byte0: number, ac1: string[], i: number, ac2: string[], ac3: string[]) {
        if (ac2.length > ac.length) { return; }
        let j: number;
        for (let k: number = 0; k <= ac.length - ac2.length; k += j) {{
            let l: number = k;
            let i1: number = 0;
            j = 1;
            while ((l < ac.length)) {{
                let j1: number = 0;
                const c: string = ac[l];
                let c1: string = "\u0000";
                if (l + 1 < ac.length) { c1 = ac[l + 1]; }
                if (i1 < ac2.length && (j1 = ChatCensor.method397(c, 0, ac2[i1], c1)) > 0) {
                    l += j1;
                    i1++;
                    continue;
                }
                if (i1 === 0) { break; }
                if ((j1 = ChatCensor.method397(c, 0, ac2[i1 - 1], c1)) > 0) {
                    l += j1;
                    if (i1 === 1) { j++; }
                    continue;
                }
                if (i1 >= ac2.length || !ChatCensor.method403(c, false)) { break; }
                l++;
            }}
            if (i1 >= ac2.length) {
                let flag1: boolean = false;
                const k1: number = ChatCensor.method393(ac1, k, ac, ((-113 as number) | 0));
                const l1: number = ChatCensor.method394(ac3, l - 1, ac, 3);
                if (i === 1 && k1 > 0 && l1 > 0) { flag1 = true; }
                if (i === 2 && (k1 > 2 && l1 > 0 || k1 > 0 && l1 > 2)) { flag1 = true; }
                if (i === 3 && k1 > 0 && l1 > 2) { flag1 = true; }
                if (flag1) {
                    let i2: number = k;
                    let j2: number = l - 1;
                    if (k1 > 2) {
                        if (k1 === 4) {
                            let flag2: boolean = false;
                            for (let l2: number = i2 - 1; l2 >= 0; l2--) {if (flag2) {
                                if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac1[l2]) != "*".charCodeAt(0)) { break; }
                                i2 = l2;
                            } else if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac1[l2]) == "*".charCodeAt(0)) {
                                i2 = l2;
                                flag2 = true;
                            }}
                        }
                        let flag3: boolean = false;
                        for (let i3: number = i2 - 1; i3 >= 0; i3--) {if (flag3) {
                            if (ChatCensor.method403(ac[i3], false)) { break; }
                            i2 = i3;
                        } else if (!ChatCensor.method403(ac[i3], false)) {
                            flag3 = true;
                            i2 = i3;
                        }}
                    }
                    if (l1 > 2) {
                        if (l1 === 4) {
                            let flag4: boolean = false;
                            for (let j3: number = j2 + 1; j3 < ac.length; j3++) {if (flag4) {
                                if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac3[j3]) != "*".charCodeAt(0)) { break; }
                                j2 = j3;
                            } else if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac3[j3]) == "*".charCodeAt(0)) {
                                j2 = j3;
                                flag4 = true;
                            }}
                        }
                        let flag5: boolean = false;
                        for (let k3: number = j2 + 1; k3 < ac.length; k3++) {if (flag5) {
                            if (ChatCensor.method403(ac[k3], false)) { break; }
                            j2 = k3;
                        } else if (!ChatCensor.method403(ac[k3], false)) {
                            flag5 = true;
                            j2 = k3;
                        }}
                    }
                    for (let k2: number = i2; k2 <= j2; k2++) {ac[k2] = "*"; }
                }
            }
        }}
        if (byte0 === 7) { byte0 = 0; }
    }

    public static method393(ac: string[], i: number, ac1: string[], byte0: number): number {
        if (byte0 !== ChatCensor.aByte735) {
            for (let j: number = 1; j > 0; j++) {}
        }
        if (i === 0) { return 2; }
        for (let k: number = i - 1; k >= 0; k--) {{
            if (!ChatCensor.method403(ac1[k], false)) { break; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac1[k]) == ",".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac1[k]) == ".".charCodeAt(0)) { return 3; }
        }}
        let l: number = 0;
        for (let i1: number = i - 1; i1 >= 0; i1--) {{
            if (!ChatCensor.method403(ac[i1], false)) { break; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac[i1]) == "*".charCodeAt(0)) { l++; }
        }}
        if (l >= 3) { return 4; }
        return !ChatCensor.method403(ac1[i - 1], false) ? 0 : 1;
    }

    public static method394(ac: string[], i: number, ac1: string[], j: number): number {
        if (j < ChatCensor.anInt736 || j > ChatCensor.anInt736) {
            for (let k: number = 1; k > 0; k++) {}
        }
        if (i + 1 === ac1.length) { return 2; }
        for (let l: number = i + 1; l < ac1.length; l++) {{
            if (!ChatCensor.method403(ac1[l], false)) { break; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac1[l]) == "\\".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac1[l]) == "/".charCodeAt(0)) { return 3; }
        }}
        let i1: number = 0;
        for (let j1: number = i + 1; j1 < ac1.length; j1++) {{
            if (!ChatCensor.method403(ac[j1], false)) { break; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac[j1]) == "*".charCodeAt(0)) { i1++; }
        }}
        if (i1 >= 5) { return 4; }
        return !ChatCensor.method403(ac1[i + 1], false) ? 0 : 1;
    }

    public static method395(abyte0: number[][], i: number, ac: string[], ac1: string[]) {
        while ((i >= 0)) {return; }
        if (ac.length > ac1.length) { return; }
        let j: number;
        for (let k: number = 0; k <= ac1.length - ac.length; k += j) {{
            let l: number = k;
            let i1: number = 0;
            let j1: number = 0;
            j = 1;
            let flag1: boolean = false;
            let flag2: boolean = false;
            let flag3: boolean = false;
            while ((l < ac1.length && (!flag2 || !flag3))) {{
                let k1: number = 0;
                const c: string = ac1[l];
                let c2: string = "\u0000";
                if (l + 1 < ac1.length) { c2 = ac1[l + 1]; }
                if (i1 < ac.length && (k1 = ChatCensor.method398(ac[i1], c, c2, 7)) > 0) {
                    if (k1 === 1 && ChatCensor.method406(c, false)) { flag2 = true; }
                    if (k1 === 2 && (ChatCensor.method406(c, false) || ChatCensor.method406(c2, false))) { flag2 = true; }
                    l += k1;
                    i1++;
                    continue;
                }
                if (i1 === 0) { break; }
                if ((k1 = ChatCensor.method398(ac[i1 - 1], c, c2, 7)) > 0) {
                    l += k1;
                    if (i1 === 1) { j++; }
                    continue;
                }
                if (i1 >= ac.length || !ChatCensor.method404(2, c)) { break; }
                if (ChatCensor.method403(c, false) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) != "'".charCodeAt(0)) { flag1 = true; }
                if (ChatCensor.method406(c, false)) { flag3 = true; }
                l++;
                if (((++j1 * 100) / (l - k) | 0) > 90) { break; }
            }}
            if (i1 >= ac.length && (!flag2 || !flag3)) {
                let flag4: boolean = true;
                if (!flag1) {
                    let c1: string = " ";
                    if (k - 1 >= 0) { c1 = ac1[k - 1]; }
                    let c3: string = " ";
                    if (l < ac1.length) { c3 = ac1[l]; }
                    const byte0: number = ChatCensor.method399(c1, ((7 as number) | 0));
                    const byte1: number = ChatCensor.method399(c3, ((7 as number) | 0));
                    if (abyte0 != null && ChatCensor.method396(byte1, abyte0, byte0, 4)) { flag4 = false; }
                } else {
                    let flag5: boolean = false;
                    let flag6: boolean = false;
                    if (k - 1 < 0 || ChatCensor.method403(ac1[k - 1], false) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac1[k - 1]) != "'".charCodeAt(0)) { flag5 = true; }
                    if (l >= ac1.length || ChatCensor.method403(ac1[l], false) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac1[l]) != "'".charCodeAt(0)) { flag6 = true; }
                    if (!flag5 || !flag6) {
                        let flag7: boolean = false;
                        let k2: number = k - 2;
                        if (flag5) { k2 = k; }
                        for (; !flag7 && k2 < l; k2++) {if (k2 >= 0 && (!ChatCensor.method403(ac1[k2], false) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac1[k2]) == "'".charCodeAt(0))) {
                            const ac2: string[] = [null, null, null];
                            let j3: number;
                            for (j3 = 0; j3 < 3; j3++) {{
                                if (k2 + j3 >= ac1.length || ChatCensor.method403(ac1[k2 + j3], false) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac1[k2 + j3]) != "'".charCodeAt(0)) { break; }
                                ac2[j3] = ac1[k2 + j3];
                            }}
                            let flag8: boolean = true;
                            if (j3 === 0) { flag8 = false; }
                            if (j3 < 3 && k2 - 1 >= 0 && (!ChatCensor.method403(ac1[k2 - 1], false) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac1[k2 - 1]) == "'".charCodeAt(0))) { flag8 = false; }
                            if (flag8 && !ChatCensor.method409(ac2, 463)) { flag7 = true; }
                        }}
                        if (!flag7) { flag4 = false; }
                    }
                }
                if (flag4) {
                    let l1: number = 0;
                    let i2: number = 0;
                    let j2: number = -1;
                    for (let l2: number = k; l2 < l; l2++) {if (ChatCensor.method406(ac1[l2], false)) { l1++; } else if (ChatCensor.method405(true, ac1[l2])) {
                        i2++;
                        j2 = l2;
                    }}
                    if (j2 > -1) { l1 -= l - 1 - j2; }
                    if (l1 <= i2) {
                        for (let i3: number = k; i3 < l; i3++) {ac1[i3] = "*"; }
                    } else {
                        j = 1;
                    }
                }
            }
        }}
    }

    public static method396(byte0: number, abyte0: number[][], byte1: number, i: number): boolean {
        let j: number = 0;
        if (i < 4 || i > 4) { throw Error("NullPointerException"); }
        if (abyte0[j][0] === byte1 && abyte0[j][1] === byte0) { return true; }
        let k: number = abyte0.length - 1;
        if (abyte0[k][0] === byte1 && abyte0[k][1] === byte0) { return true; }
        do {{
            const l: number = ((j + k) / 2 | 0);
            if (abyte0[l][0] === byte1 && abyte0[l][1] === byte0) { return true; }
            if (byte1 < abyte0[l][0] || byte1 === abyte0[l][0] && byte0 < abyte0[l][1]) { k = l; } else { j = l; }
        }} while ((j !== k && j + 1 !== k));
        return false;
    }

    public static method397(c: string, i: number, c1: string, c2: string): number {
        if (i !== 0) { return ChatCensor.anInt733; }
        if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) == ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c)) { return 1; }
        if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) == "o".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "0".charCodeAt(0)) { return 1; }
        if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) == "o".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "(".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) == ")".charCodeAt(0)) { return 2; }
        if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) == "c".charCodeAt(0) && (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "(".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "<".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "[".charCodeAt(0))) { return 1; }
        if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) == "e".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "\u20ac".charCodeAt(0)) { return 1; }
        if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) == "s".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "$".charCodeAt(0)) { return 1; }
        return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "l".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) != "i".charCodeAt(0) ? 0 : 1;
    }

    public static method398(c: string, c1: string, c2: string, i: number): number {
        if (i !== 7) { return ChatCensor.anInt728; }
        if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1)) { return 1; }
        if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) >= "a".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) <= "m".charCodeAt(0)) {
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "a".charCodeAt(0)) {
                if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) == "4".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) == "@".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) == "^".charCodeAt(0)) { return 1; }
                return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "/".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != "\\".charCodeAt(0) ? 0 : 2;
            }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "b".charCodeAt(0)) {
                if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) == "6".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) == "8".charCodeAt(0)) { return 1; }
                return (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "1".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != "3".charCodeAt(0)) && (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "i".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != "3".charCodeAt(0)) ? 0 : 2;
            }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "c".charCodeAt(0)) { return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "(".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "<".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "{".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "[".charCodeAt(0) ? 0 : 1; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "d".charCodeAt(0)) { return (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "[".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != ")".charCodeAt(0)) && (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "i".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != ")".charCodeAt(0)) ? 0 : 2; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "e".charCodeAt(0)) { return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "3".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "\u20ac".charCodeAt(0) ? 0 : 1; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "f".charCodeAt(0)) {
                if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) == "p".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) == "h".charCodeAt(0)) { return 2; }
                return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "\u00a3".charCodeAt(0) ? 0 : 1;
            }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "g".charCodeAt(0)) { return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "9".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "6".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "q".charCodeAt(0) ? 0 : 1; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "h".charCodeAt(0)) { return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "#".charCodeAt(0) ? 0 : 1; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "i".charCodeAt(0)) { return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "y".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "l".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "j".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "1".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "!".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != ":".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != ";".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "|".charCodeAt(0) ? 0 : 1; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "j".charCodeAt(0)) { return 0; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "k".charCodeAt(0)) { return 0; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "l".charCodeAt(0)) { return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "1".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "|".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "i".charCodeAt(0) ? 0 : 1; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "m".charCodeAt(0)) { return 0; }
        }
        if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) >= "n".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) <= "z".charCodeAt(0)) {
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "n".charCodeAt(0)) { return 0; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "o".charCodeAt(0)) {
                if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) == "0".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) == "*".charCodeAt(0)) { return 1; }
                return (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "(".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != ")".charCodeAt(0)) && (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "[".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != "]".charCodeAt(0)) && (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "{".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != "}".charCodeAt(0)) && (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "<".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != ">".charCodeAt(0)) ? 0 : 2;
            }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "p".charCodeAt(0)) { return 0; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "q".charCodeAt(0)) { return 0; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "r".charCodeAt(0)) { return 0; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "s".charCodeAt(0)) { return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "5".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "z".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "$".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "2".charCodeAt(0) ? 0 : 1; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "t".charCodeAt(0)) { return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "7".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "+".charCodeAt(0) ? 0 : 1; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "u".charCodeAt(0)) {
                if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) == "v".charCodeAt(0)) { return 1; }
                return (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "\\".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != "/".charCodeAt(0)) && (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "\\".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != "|".charCodeAt(0)) && (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "|".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != "/".charCodeAt(0)) ? 0 : 2;
            }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "v".charCodeAt(0)) { return (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "\\".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != "/".charCodeAt(0)) && (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "\\".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != "|".charCodeAt(0)) && (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "|".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != "/".charCodeAt(0)) ? 0 : 2; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "w".charCodeAt(0)) { return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "v".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != "v".charCodeAt(0) ? 0 : 2; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "x".charCodeAt(0)) { return (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != ")".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != "(".charCodeAt(0)) && (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "}".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != "{".charCodeAt(0)) && (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "]".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != "[".charCodeAt(0)) && (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != ">".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != "<".charCodeAt(0)) ? 0 : 2; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "y".charCodeAt(0)) { return 0; }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "z".charCodeAt(0)) { return 0; }
        }
        if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) >= "0".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) <= "9".charCodeAt(0)) {
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "0".charCodeAt(0)) {
                if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) == "o".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) == "O".charCodeAt(0)) { return 1; }
                return (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "(".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != ")".charCodeAt(0)) && (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "{".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != "}".charCodeAt(0)) && (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "[".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c2) != "]".charCodeAt(0)) ? 0 : 2;
            }
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "1".charCodeAt(0)) { return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "l".charCodeAt(0) ? 0 : 1; } else { return 0; }
        }
        if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == ",".charCodeAt(0)) { return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != ".".charCodeAt(0) ? 0 : 1; }
        if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == ".".charCodeAt(0)) { return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != ",".charCodeAt(0) ? 0 : 1; }
        if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "!".charCodeAt(0)) { return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c1) != "i".charCodeAt(0) ? 0 : 1; } else { return 0; }
    }

    public static method399(c: string, byte0: number): number {
        if (byte0 !== 7) { throw Error("NullPointerException") }
        if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) >= "a".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) <= "z".charCodeAt(0)) { return ((((((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) - 97) + 1) as number) | 0); }
        if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "'".charCodeAt(0)) { return 28; }
        if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) >= "0".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) <= "9".charCodeAt(0)) { return ((((((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) - 48) + 29) as number) | 0); } else { return 27; }
    }

    public static method400(i: number, ac: string[]) {
        let j: number = 0;
        let k: number = 0;
        let l: number = 0;
        if (i < 3 || i > 3) { return; }
        let i1: number = 0;
        while (((j = ChatCensor.method401(307, k, ac)) !== -1)) {{
            let flag: boolean = false;
            for (let j1: number = k; j1 >= 0 && j1 < j && !flag; j1++) {if (!ChatCensor.method403(ac[j1], false) && !ChatCensor.method404(2, ac[j1])) { flag = true; }}
            if (flag) { l = 0; }
            if (l === 0) { i1 = j; }
            k = ChatCensor.method402(j, 618, ac);
            let k1: number = 0;
            for (let l1: number = j; l1 < k; l1++) {k1 = (k1 * 10 + ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac[l1])) - 48; }
            if (k1 > 255 || k - j > 8) { l = 0; } else { l++; }
            if (l === 4) {
                for (let i2: number = i1; i2 < k; i2++) {ac[i2] = "*"; }
                l = 0;
            }
        }}
    }

    public static method401(i: number, j: number, ac: string[]): number {
        for (let k: number = j; k < ac.length && k >= 0; k++) {if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac[k]) >= "0".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac[k]) <= "9".charCodeAt(0)) { return k; }}
        if (i <= 0) { ChatCensor.aBoolean731 = !ChatCensor.aBoolean731; }
        return -1;
    }

    public static method402(i: number, j: number, ac: string[]): number {
        if (j <= 0) {
            for (let k: number = 1; k > 0; k++) {}
        }
        for (let l: number = i; l < ac.length && l >= 0; l++) {if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac[l]) < "0".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac[l]) > "9".charCodeAt(0)) { return l; }}
        return ac.length;
    }

    public static method403(c: string, flag: boolean): boolean {
        if (flag) { throw Error("NullPointerException") }
        return !ChatCensor.method405(true, c) && !ChatCensor.method406(c, false);
    }

    public static method404(i: number, c: string): boolean {
        if (i !== 2) { ChatCensor.aBoolean732 = !ChatCensor.aBoolean732; }
        if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) < "a".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) > "z".charCodeAt(0)) { return true; }
        return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "v".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "x".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "j".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "q".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "z".charCodeAt(0);
    }

    public static method405(flag: boolean, c: string): boolean {
        return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) >= "a".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) <= "z".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) >= "A".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) <= "Z".charCodeAt(0);
    }

    public static method406(c: string, flag: boolean): boolean {
        if (flag) { throw Error("NullPointerException"); }
        return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) >= "0".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) <= "9".charCodeAt(0);
    }

    public static method407(c: string): boolean {
        return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) >= "a".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) <= "z".charCodeAt(0);
    }

    public static method408(i: number, c: string): boolean {
        return ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) >= "A".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) <= "Z".charCodeAt(0);
    }

    public static method409(ac: string[], i: number): boolean {
        let flag: boolean = true;
        for (let j: number = 0; j < ac.length; j++) {if (!ChatCensor.method406(ac[j], false) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(ac[j]) != 0) { flag = false; }}
        i = (78 / i | 0);
        if (flag) { return true; }
        const k: number = ChatCensor.method410(ac, ((5 as number) | 0));
        let l: number = 0;
        let i1: number = ChatCensor.fragments.length - 1;
        if (k === ChatCensor.fragments[l] || k === ChatCensor.fragments[i1]) { return true; }
        do {{
            const j1: number = ((l + i1) / 2 | 0);
            if (k === ChatCensor.fragments[j1]) { return true; }
            if (k < ChatCensor.fragments[j1]) { i1 = j1; } else { l = j1; }
        }} while ((l !== i1 && l + 1 !== i1));
        return false;
    }

    public static method410(ac: string[], byte0: number): number {
        if (ac.length > 6) { return 0; }
        let i: number = 0;
        if (byte0 === 5) { byte0 = 0; } else { return 3; }
        for (let j: number = 0; j < ac.length; j++) {{
            const c: string = ac[ac.length - j - 1];
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) >= "a".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) <= "z".charCodeAt(0)) { i = i * 38 + ((((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) - 97) + 1); } else if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) == "'".charCodeAt(0)) { i = i * 38 + 27; } else if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) >= "0".charCodeAt(0) && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) <= "9".charCodeAt(0)) { i = i * 38 + ((((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) - 48) + 28); } else if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) != 0) { return 0; }
        }}
        return i;
    }
}
