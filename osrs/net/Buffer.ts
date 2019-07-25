import { CacheableNode } from "../collection/CacheableNode";
import { LinkedList } from "../util/LinkedList";
import { ISAACCipher } from "./ISAACCipher";

export class Buffer extends CacheableNode {
  public static __static_initialized: boolean = false;

  public static CRC32_TABLE: number[];
  public static BIT_MASKS: number[];
  public static smallBufferCount: number;
  public static mediumBufferCount: number;
  public static largeBufferCount: number;
  public static smallBuffers: LinkedList;
  public static mediumBuffers: LinkedList;
  public static largeBuffers: LinkedList;
  public static __static_initialize() {
    if (!Buffer.__static_initialized) {
      Buffer.__static_initialized = true;
      Buffer.__static_initializer_0();
    }
  }
  public static CRC32_TABLE_$LI$(): number[] {
    Buffer.__static_initialize();
    if (Buffer.CRC32_TABLE == null) {
      Buffer.CRC32_TABLE = (s => {
        const a = [];
        while (s-- > 0) {
          a.push(0);
        }
        return a;
      })(256);
    }
    return Buffer.CRC32_TABLE;
  }
  public static BIT_MASKS_$LI$(): number[] {
    Buffer.__static_initialize();
    if (Buffer.BIT_MASKS == null) {
      Buffer.BIT_MASKS = [
        0,
        1,
        3,
        7,
        15,
        31,
        63,
        127,
        255,
        511,
        1023,
        2047,
        4095,
        8191,
        16383,
        32767,
        65535,
        131071,
        262143,
        524287,
        1048575,
        2097151,
        4194303,
        8388607,
        16777215,
        33554431,
        67108863,
        134217727,
        268435455,
        536870911,
        1073741823,
        2147483647,
        -1
      ];
    }
    return Buffer.BIT_MASKS;
  }
  public static smallBufferCount_$LI$(): number {
    Buffer.__static_initialize();
    return Buffer.smallBufferCount;
  }
  public static mediumBufferCount_$LI$(): number {
    Buffer.__static_initialize();
    return Buffer.mediumBufferCount;
  }
  public static largeBufferCount_$LI$(): number {
    Buffer.__static_initialize();
    return Buffer.largeBufferCount;
  }
  public static smallBuffers_$LI$(): LinkedList {
    Buffer.__static_initialize();
    if (Buffer.smallBuffers == null) {
      Buffer.smallBuffers = new LinkedList();
    }
    return Buffer.smallBuffers;
  }
  public static mediumBuffers_$LI$(): LinkedList {
    Buffer.__static_initialize();
    if (Buffer.mediumBuffers == null) {
      Buffer.mediumBuffers = new LinkedList();
    }
    return Buffer.mediumBuffers;
  }
  public static largeBuffers_$LI$(): LinkedList {
    Buffer.__static_initialize();
    if (Buffer.largeBuffers == null) {
      Buffer.largeBuffers = new LinkedList();
    }
    return Buffer.largeBuffers;
  }
  public static allocate(sizeMode: number): Buffer {
    {
      let buffer: Buffer = null;
      if (sizeMode === 0 && Buffer.smallBufferCount_$LI$() > 0) {
        Buffer.smallBufferCount_$LI$();
        Buffer.smallBufferCount--;
        buffer = Buffer.smallBuffers_$LI$().removeFirst() as Buffer;
      } else if (sizeMode === 1 && Buffer.mediumBufferCount_$LI$() > 0) {
        Buffer.mediumBufferCount_$LI$();
        Buffer.mediumBufferCount--;
        buffer = Buffer.mediumBuffers_$LI$().removeFirst() as Buffer;
      } else if (sizeMode === 2 && Buffer.largeBufferCount_$LI$() > 0) {
        Buffer.largeBufferCount_$LI$();
        Buffer.largeBufferCount--;
        buffer = Buffer.largeBuffers_$LI$().removeFirst() as Buffer;
      }
      if (buffer != null) {
        buffer.currentPosition = 0;
        return buffer;
      }
    }
    const buffer: Buffer = new Buffer();
    buffer.currentPosition = 0;
    if (sizeMode === 0) {
      buffer.buffer = (s => {
        const a = [];
        while (s-- > 0) {
          a.push(0);
        }
        return a;
      })(100);
    } else if (sizeMode === 1) {
      buffer.buffer = (s => {
        const a = [];
        while (s-- > 0) {
          a.push(0);
        }
        return a;
      })(5000);
    } else {
      buffer.buffer = (s => {
        const a = [];
        while (s-- > 0) {
          a.push(0);
        }
        return a;
      })(30000);
    }
    return buffer;
  }

  public static __static_initializer_0() {
    let pos: number = 0;
    while (pos < 256) {
      {
        let value: number = pos;
        for (let pass: number = 0; pass < 8; pass++) {
          if ((value & 1) === 1) {
            value = (value >>> 1) ^ -306674912;
          } else {
            value >>>= 1;
          }
        }
        Buffer.CRC32_TABLE_$LI$()[pos] = value;
        pos++;
      }
    }
  }

  public buffer: number[];

  public currentPosition: number;

  public bitPosition: number;

  public random: ISAACCipher;

  public constructor(buffer?: any) {
    if (
      (buffer != null &&
        ((buffer instanceof Array) as any) &&
        (buffer.length == 0 ||
          buffer[0] == null ||
          typeof buffer[0] === "number")) ||
      buffer === null
    ) {
      const __args = arguments;
      super();
      if (this.buffer === undefined) {
        this.buffer = null;
      }
      if (this.currentPosition === undefined) {
        this.currentPosition = 0;
      }
      if (this.bitPosition === undefined) {
        this.bitPosition = 0;
      }
      if (this.random === undefined) {
        this.random = null;
      }
      if (this.buffer === undefined) {
        this.buffer = null;
      }
      if (this.currentPosition === undefined) {
        this.currentPosition = 0;
      }
      if (this.bitPosition === undefined) {
        this.bitPosition = 0;
      }
      if (this.random === undefined) {
        this.random = null;
      }
      (() => {
        this.buffer = buffer;
        this.currentPosition = 0;
      })();
    } else if (buffer === undefined) {
      const __args = arguments;
      super();
      if (this.buffer === undefined) {
        this.buffer = null;
      }
      if (this.currentPosition === undefined) {
        this.currentPosition = 0;
      }
      if (this.bitPosition === undefined) {
        this.bitPosition = 0;
      }
      if (this.random === undefined) {
        this.random = null;
      }
      if (this.buffer === undefined) {
        this.buffer = null;
      }
      if (this.currentPosition === undefined) {
        this.currentPosition = 0;
      }
      if (this.bitPosition === undefined) {
        this.bitPosition = 0;
      }
      if (this.random === undefined) {
        this.random = null;
      }
    } else {
      throw new Error("invalid overload");
    }
  }

  public putOpcode(opcode: number) {
    this.buffer[this.currentPosition++] =
      ((opcode + this.random.nextInt()) as number) | 0;
  }

  public putByte(value: number) {
    this.buffer[this.currentPosition++] = (value as number) | 0;
  }

  public putShort(value: number) {
    this.buffer[this.currentPosition++] = ((value >> 8) as number) | 0;
    this.buffer[this.currentPosition++] = (value as number) | 0;
  }

  public putLEShort(value: number) {
    this.buffer[this.currentPosition++] = (value as number) | 0;
    this.buffer[this.currentPosition++] = ((value >> 8) as number) | 0;
  }

  public putTriByte(value: number) {
    this.buffer[this.currentPosition++] = ((value >> 16) as number) | 0;
    this.buffer[this.currentPosition++] = ((value >> 8) as number) | 0;
    this.buffer[this.currentPosition++] = (value as number) | 0;
  }

  public putInt(value: number) {
    this.buffer[this.currentPosition++] = ((value >> 24) as number) | 0;
    this.buffer[this.currentPosition++] = ((value >> 16) as number) | 0;
    this.buffer[this.currentPosition++] = ((value >> 8) as number) | 0;
    this.buffer[this.currentPosition++] = (value as number) | 0;
  }

  public putLEInt(value: number) {
    this.buffer[this.currentPosition++] = (value as number) | 0;
    this.buffer[this.currentPosition++] = ((value >> 8) as number) | 0;
    this.buffer[this.currentPosition++] = ((value >> 16) as number) | 0;
    this.buffer[this.currentPosition++] = ((value >> 24) as number) | 0;
  }

  public putLong(value: number) {
    this.buffer[this.currentPosition++] =
      ((((value >> 56) as number) | 0) as number) | 0;
    this.buffer[this.currentPosition++] =
      ((((value >> 48) as number) | 0) as number) | 0;
    this.buffer[this.currentPosition++] =
      ((((value >> 40) as number) | 0) as number) | 0;
    this.buffer[this.currentPosition++] =
      ((((value >> 32) as number) | 0) as number) | 0;
    this.buffer[this.currentPosition++] =
      ((((value >> 24) as number) | 0) as number) | 0;
    this.buffer[this.currentPosition++] =
      ((((value >> 16) as number) | 0) as number) | 0;
    this.buffer[this.currentPosition++] =
      ((((value >> 8) as number) | 0) as number) | 0;
    this.buffer[this.currentPosition++] =
      (((value as number) | 0) as number) | 0;
  }

  public putString(str: string) {
    const bytes: number[] = (s => {
      const a = [];
      while (s-- > 0) {
        a.push(0);
      }
      return a;
    })(str.length);
    for (let i: number = 0; i < bytes.length; i++) {
      {
        bytes[i] = str.charAt(i).charCodeAt(0);
      }
    }
    for (let c of str) {
      this.buffer[this.currentPosition++] = c.charCodeAt(0);
    }
    this.buffer[this.currentPosition++] = 10;
  }

  public putBytes(bytes: number[], start: number, length: number) {
    for (let pos: number = start; pos < start + length; pos++) {
      this.buffer[this.currentPosition++] = bytes[pos];
    }
  }

  public putLength(length: number) {
    this.buffer[this.currentPosition - length - 1] = (length as number) | 0;
  }

  public getUnsignedByte(): number {
    return this.buffer[this.currentPosition++] & 255;
  }

  public getSignedByte(): number {
    return this.buffer[this.currentPosition++];
  }

  public getUnsignedLEShort(): number {
    this.currentPosition += 2;
    return (
      ((this.buffer[this.currentPosition - 2] & 255) << 8) +
      (this.buffer[this.currentPosition - 1] & 255)
    );
  }

  public getSignedShort(): number {
    this.currentPosition += 2;
    let i: number =
      ((this.buffer[this.currentPosition - 2] & 255) << 8) +
      (this.buffer[this.currentPosition - 1] & 255);
    if (i > 32767) {
      i -= 65536;
    }
    return i;
  }

  public get24BitInt(): number {
    this.currentPosition += 3;
    return (
      ((this.buffer[this.currentPosition - 3] & 255) << 16) +
      ((this.buffer[this.currentPosition - 2] & 255) << 8) +
      (this.buffer[this.currentPosition - 1] & 255)
    );
  }

  public getInt(): number {
    this.currentPosition += 4;
    return (
      ((this.buffer[this.currentPosition - 4] & 255) << 24) +
      ((this.buffer[this.currentPosition - 3] & 255) << 16) +
      ((this.buffer[this.currentPosition - 2] & 255) << 8) +
      (this.buffer[this.currentPosition - 1] & 255)
    );
  }

  public getLong(): number {
    const l: number = this.getInt() & 4294967295;
    const l1: number = this.getInt() & 4294967295;
    return (l << 32) + l1;
  }

  public getString(): string {
    const start: number = this.currentPosition;
    while (this.buffer[this.currentPosition++] !== 10) {}
    return ((str, index, len) => str.substring(index, index + len))(
      this.buffer.map(s => String.fromCharCode(s)).join(""),
      start,
      this.currentPosition - start - 1
    ) as string;
  }

  public getStringBytes(): number[] {
    const start: number = this.currentPosition;
    while (this.buffer[this.currentPosition++] !== 10) {}
    const bytes: number[] = (s => {
      const a = [];
      while (s-- > 0) {
        a.push(0);
      }
      return a;
    })(this.currentPosition - start - 1);
    for (let pos: number = start; pos < this.currentPosition - 1; pos++) {
      bytes[pos - start] = this.buffer[pos];
    }
    return bytes;
  }

  public getBytes(bytes: number[], start: number, len: number) {
    for (let pos: number = start; pos < start + len; pos++) {
      bytes[pos] = this.buffer[this.currentPosition++];
    }
  }

  public initBitAccess() {
    this.bitPosition = this.currentPosition * 8;
  }

  public getBits(numBits: number): number {
    let k: number = this.bitPosition >> 3;
    let l: number = 8 - (this.bitPosition & 7);
    let value: number = 0;
    this.bitPosition += numBits;
    for (; numBits > l; l = 8) {
      {
        value +=
          (this.buffer[k++] & Buffer.BIT_MASKS_$LI$()[l]) << (numBits - l);
        numBits -= l;
      }
    }
    if (numBits === l) {
      value += this.buffer[k] & Buffer.BIT_MASKS_$LI$()[l];
    } else {
      value +=
        (this.buffer[k] >> (l - numBits)) & Buffer.BIT_MASKS_$LI$()[numBits];
    }
    return value;
  }

  public finishBitAccess() {
    this.currentPosition = ((this.bitPosition + 7) / 8) | 0;
  }

  public getSignedSmart(): number {
    const peek: number = this.buffer[this.currentPosition] & 255;
    if (peek < 128) {
      return this.getUnsignedByte() - 64;
    } else {
      return this.getUnsignedLEShort() - 49152;
    }
  }

  public getSmart(): number {
    const peek: number = this.buffer[this.currentPosition] & 255;
    if (peek < 128) {
      return this.getUnsignedByte();
    } else {
      return this.getUnsignedLEShort() - 32768;
    }
  }
  // TODO: Implement if we need encryption here
  //   public encrypt(modulus: BigInteger, key: BigInteger) {
  //     const length: number = this.currentPosition;
  //     this.currentPosition = 0;
  //     let bytes: number[] = (s => {
  //       const a = [];
  //       while (s-- > 0) {
  //         a.push(0);
  //       }
  //       return a;
  //     })(length);
  //     this.getBytes(bytes, 0, length);
  //     const raw: BigInteger = BigInteger(bytes);
  //     const encrypted: BigInteger = raw.modPow(key, modulus);
  //     bytes = encrypted.toByteArray();
  //     this.currentPosition = 0;
  //     this.putByte(bytes.length);
  //     this.putBytes(bytes, 0, bytes.length);
  //   }

  public putByteAdded(value: number) {
    this.buffer[this.currentPosition++] = ((value + 128) as number) | 0;
  }

  public putByteNegated(value: number) {
    this.buffer[this.currentPosition++] = (-value as number) | 0;
  }

  public putByteSubtracted(value: number) {
    this.buffer[this.currentPosition++] = ((128 - value) as number) | 0;
  }

  public getByteAdded(): number {
    return (this.buffer[this.currentPosition++] - 128) & 255;
  }

  public getByteNegated(): number {
    return -this.buffer[this.currentPosition++] & 255;
  }

  public getByteSubtracted(): number {
    return (128 - this.buffer[this.currentPosition++]) & 255;
  }

  public getSignedByteAdded(): number {
    return ((this.buffer[this.currentPosition++] - 128) as number) | 0;
  }

  public getSignedByteNegated(): number {
    return (-this.buffer[this.currentPosition++] as number) | 0;
  }

  public getSignedByteSubtracted(): number {
    return ((128 - this.buffer[this.currentPosition++]) as number) | 0;
  }

  public putLEShortDup(value: number) {
    this.buffer[this.currentPosition++] = (value as number) | 0;
    this.buffer[this.currentPosition++] = ((value >> 8) as number) | 0;
  }

  public putShortAdded(value: number) {
    this.buffer[this.currentPosition++] = ((value >> 8) as number) | 0;
    this.buffer[this.currentPosition++] = ((value + 128) as number) | 0;
  }

  public putLEShortAdded(value: number) {
    this.buffer[this.currentPosition++] = ((value + 128) as number) | 0;
    this.buffer[this.currentPosition++] = ((value >> 8) as number) | 0;
  }

  public method549(): number {
    this.currentPosition += 2;
    return (
      ((this.buffer[this.currentPosition - 1] & 255) << 8) +
      (this.buffer[this.currentPosition - 2] & 255)
    );
  }

  public method550(): number {
    this.currentPosition += 2;
    return (
      ((this.buffer[this.currentPosition - 2] & 255) << 8) +
      ((this.buffer[this.currentPosition - 1] - 128) & 255)
    );
  }

  public getLittleShortA(): number {
    this.currentPosition += 2;
    return (
      ((this.buffer[this.currentPosition - 1] & 255) << 8) +
      ((this.buffer[this.currentPosition - 2] - 128) & 255)
    );
  }

  public method552(): number {
    this.currentPosition += 2;
    let j: number =
      ((this.buffer[this.currentPosition - 1] & 255) << 8) +
      (this.buffer[this.currentPosition - 2] & 255);
    if (j > 32767) {
      j -= 65536;
    }
    return j;
  }

  public method553(): number {
    this.currentPosition += 2;
    let i: number =
      ((this.buffer[this.currentPosition - 2] & 255) << 8) +
      ((this.buffer[this.currentPosition - 1] - 128) & 255);
    if (i > 32767) {
      i -= 65536;
    }
    return i;
  }

  public method554(): number {
    this.currentPosition += 3;
    return (
      ((this.buffer[this.currentPosition - 2] & 255) << 16) +
      ((this.buffer[this.currentPosition - 3] & 255) << 8) +
      (this.buffer[this.currentPosition - 1] & 255)
    );
  }

  public method555(): number {
    this.currentPosition += 4;
    return (
      ((this.buffer[this.currentPosition - 1] & 255) << 24) +
      ((this.buffer[this.currentPosition - 2] & 255) << 16) +
      ((this.buffer[this.currentPosition - 3] & 255) << 8) +
      (this.buffer[this.currentPosition - 4] & 255)
    );
  }

  public method556(): number {
    this.currentPosition += 4;
    return (
      ((this.buffer[this.currentPosition - 2] & 255) << 24) +
      ((this.buffer[this.currentPosition - 1] & 255) << 16) +
      ((this.buffer[this.currentPosition - 4] & 255) << 8) +
      (this.buffer[this.currentPosition - 3] & 255)
    );
  }

  public method557(): number {
    this.currentPosition += 4;
    return (
      ((this.buffer[this.currentPosition - 3] & 255) << 24) +
      ((this.buffer[this.currentPosition - 4] & 255) << 16) +
      ((this.buffer[this.currentPosition - 1] & 255) << 8) +
      (this.buffer[this.currentPosition - 2] & 255)
    );
  }

  public getBytesReverse(bytes: number[], start: number, len: number) {
    for (let pos: number = start + len - 1; pos >= start; pos--) {
      bytes[pos] = this.buffer[this.currentPosition++];
    }
  }

  public getBytesAdded(bytes: number[], start: number, len: number) {
    for (let pos: number = start; pos < start + len; pos++) {
      bytes[pos] = ((this.buffer[this.currentPosition++] - 128) as number) | 0;
    }
  }
}

Buffer.largeBuffers_$LI$();

Buffer.mediumBuffers_$LI$();

Buffer.smallBuffers_$LI$();

Buffer.largeBufferCount_$LI$();

Buffer.mediumBufferCount_$LI$();

Buffer.smallBufferCount_$LI$();

Buffer.BIT_MASKS_$LI$();

Buffer.CRC32_TABLE_$LI$();

Buffer.__static_initialize();
