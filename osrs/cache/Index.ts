export class Index {
  public static buffer: number[] = new Array(520).map(() => 0);

  public dataFile: ArrayBuffer;

  public indexFile: ArrayBuffer;

  public type: number;

  public maxSize: number;

  public constructor(
    _type: number,
    _maxSize: number,
    dataFile: ArrayBuffer,
    indexFile: ArrayBuffer
  ) {
    if (this.dataFile === undefined) {
      this.dataFile = null;
    }
    if (this.indexFile === undefined) {
      this.indexFile = null;
    }
    if (this.type === undefined) {
      this.type = 0;
    }
    if (this.maxSize === undefined) {
      this.maxSize = 0;
    }
    this.type = _type;
    this.dataFile = dataFile;
    this.indexFile = indexFile;
    this.maxSize = _maxSize;
  }

  readIn(inBuffer: number[], inOffset: number, inSize: number, fromBuffer: ArrayBuffer, fromOffset: number): number {
    const fromSlice = new Uint8Array(fromBuffer.slice(fromOffset, fromOffset + inSize));
    const readSize = Math.min(inSize, fromSlice.byteLength);
    for(let i = 0; i < readSize; i++) {
        inBuffer[inOffset+i] = fromSlice[i];
    }
    return readSize;
  }

  public get(index: number): number[] {
    try {
      let fileSize: number;
      for (let indexPart: number = 0; indexPart < 6; indexPart += fileSize) {
        fileSize = this.readIn(Index.buffer, indexPart, 6 - indexPart, this.indexFile, index * 6);
        // TODO: check if this should matter
        if (fileSize === -1) {
          return null;
        }
      }
      fileSize =
        ((Index.buffer[0] & 255) << 16) +
        ((Index.buffer[1] & 255) << 8) +
        (Index.buffer[2] & 255);
      let fileBlock: number =
        ((Index.buffer[3] & 255) << 16) +
        ((Index.buffer[4] & 255) << 8) +
        (Index.buffer[5] & 255);
      if (fileSize < 0 || fileSize > this.maxSize) {
        return null;
      }
      if (
        fileBlock <= 0 ||
        fileBlock >
          (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(
            this.dataFile.byteLength / 520
          )
      ) {
        return null;
      }
      const fileBuffer: number[] = (s => {
        const a = [];
        while (s-- > 0) {
          a.push(0);
        }
        return a;
      })(fileSize);
      let read: number = 0;
      for (let cycle: number = 0; read < fileSize; cycle++) {
        {
          if (fileBlock === 0) {
            return null;
          }
          let size: number = 0;
          let remaining: number = fileSize - read;
          if (remaining > 512) {
            remaining = 512;
          }
          let nextFileId: number;
          for (; size < remaining + 8; size += nextFileId) {
            {
              nextFileId = this.readIn(
                Index.buffer,
                size,
                remaining + 8 - size,
                this.dataFile,
                fileBlock * 520
              );
              if (nextFileId === -1) {
                return null;
              }
            }
          }
          nextFileId = ((Index.buffer[0] & 255) << 8) + (Index.buffer[1] & 255);
          const currentPartId: number =
            ((Index.buffer[2] & 255) << 8) + (Index.buffer[3] & 255);
          const nextBlockId: number =
            ((Index.buffer[4] & 255) << 16) +
            ((Index.buffer[5] & 255) << 8) +
            (Index.buffer[6] & 255);
          const nextStoreId: number = Index.buffer[7] & 255;
          if (
            nextFileId !== index ||
            currentPartId !== cycle ||
            nextStoreId !== this.type
          ) {
            return null;
          }
          if (
            nextBlockId < 0 ||
            nextBlockId >
              (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(
                this.dataFile.byteLength / 520
              )
          ) {
            return null;
          }
          for (let offset: number = 0; offset < remaining; offset++) {
            fileBuffer[read++] = Index.buffer[offset + 8];
          }
          fileBlock = nextBlockId;
        }
      }
      return fileBuffer;
    } catch (_ex) {
      return null;
    }
  }

//   public put$int$byte_A$int(len: number, buf: number[], id: number): boolean {
//     let success: boolean = this.put$byte_A$int$boolean$int(buf, id, true, len);
//     if (!success) {
//       success = this.put$byte_A$int$boolean$int(buf, id, false, len);
//     }
//     return success;
//   }

//   public put$byte_A$int$boolean$int(
//     buf: number[],
//     index: number,
//     overwrite: boolean,
//     len: number
//   ): boolean {
//     try {
//       let sector: number;
//       if (overwrite) {
//         let lenght: number;
//         for (let offset: number = 0; offset < 6; offset += lenght) {
//           {
//             lenght = this.readIn(Index.buffer, offset, 6 - offset, this.indexFile, index * 6);
//             if (lenght === -1) {
//               return false;
//             }
//           }
//         }
//         sector =
//           ((Index.buffer[3] & 255) << 16) +
//           ((Index.buffer[4] & 255) << 8) +
//           (Index.buffer[5] & 255);
//         if (
//           sector <= 0 ||
//           sector >
//             (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(
//               this.dataFile.byteLength / 520
//             )
//         ) {
//           return false;
//         }
//       } else {
//         sector =
//           ((n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(
//             (this.dataFile.byteLength + 519) / 520
//           ) as number) | 0;
//         if (sector === 0) {
//           sector = 1;
//         }
//       }
//       Index.buffer[0] = ((len >> 16) as number) | 0;
//       Index.buffer[1] = ((len >> 8) as number) | 0;
//       Index.buffer[2] = (len as number) | 0;
//       Index.buffer[3] = ((sector >> 16) as number) | 0;
//       Index.buffer[4] = ((sector >> 8) as number) | 0;
//       Index.buffer[5] = (sector as number) | 0;
//       this.seek(this.indexFile, index * 6);
//       this.indexFile.write(Index.buffer, 0, 6);
//       let written: number = 0;
//       for (let chunk: number = 0; written < len; chunk++) {
//         {
//           let nextSector: number = 0;
//           if (overwrite) {
//             this.seek(this.dataFile, sector * 520);
//             let pos: number;
//             let tmp: number;
//             for (pos = 0; pos < 8; pos += tmp) {
//               {
//                 tmp = this.dataFile.read(Index.buffer, pos, 8 - pos);
//                 if (tmp === -1) {
//                   break;
//                 }
//               }
//             }
//             if (pos === 8) {
//               const _id: number =
//                 ((Index.buffer[0] & 255) << 8) + (Index.buffer[1] & 255);
//               const _chunk: number =
//                 ((Index.buffer[2] & 255) << 8) + (Index.buffer[3] & 255);
//               nextSector =
//                 ((Index.buffer[4] & 255) << 16) +
//                 ((Index.buffer[5] & 255) << 8) +
//                 (Index.buffer[6] & 255);
//               const _type: number = Index.buffer[7] & 255;
//               if (_id !== index || _chunk !== chunk || _type !== this.type) {
//                 return false;
//               }
//               if (
//                 nextSector < 0 ||
//                 nextSector >
//                   (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(
//                     this.dataFile.length() / 520
//                   )
//               ) {
//                 return false;
//               }
//             }
//           }
//           if (nextSector === 0) {
//             overwrite = false;
//             nextSector =
//               ((n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(
//                 (this.dataFile.length() + 519) / 520
//               ) as number) | 0;
//             if (nextSector === 0) {
//               nextSector++;
//             }
//             if (nextSector === sector) {
//               nextSector++;
//             }
//           }
//           if (len - written <= 512) {
//             nextSector = 0;
//           }
//           Index.buffer[0] = ((index >> 8) as number) | 0;
//           Index.buffer[1] = (index as number) | 0;
//           Index.buffer[2] = ((chunk >> 8) as number) | 0;
//           Index.buffer[3] = (chunk as number) | 0;
//           Index.buffer[4] = ((nextSector >> 16) as number) | 0;
//           Index.buffer[5] = ((nextSector >> 8) as number) | 0;
//           Index.buffer[6] = (nextSector as number) | 0;
//           Index.buffer[7] = (this.type as number) | 0;
//           this.seek(this.dataFile, sector * 520);
//           this.dataFile.write(Index.buffer, 0, 8);
//           let sectorLen: number = len - written;
//           if (sectorLen > 512) {
//             sectorLen = 512;
//           }
//           this.dataFile.write(buf, written, sectorLen);
//           written += sectorLen;
//           sector = nextSector;
//         }
//       }
//       return true;
//     } catch (_ex) {
//       return false;
//     }
//   }

//   public put(buf?: any, index?: any, overwrite?: any, len?: any): any {
//     if (
//       ((buf != null &&
//         ((buf instanceof Array) as any) &&
//         (buf.length == 0 || buf[0] == null || typeof buf[0] === "number")) ||
//         buf === null) &&
//       (typeof index === "number" || index === null) &&
//       (typeof overwrite === "boolean" || overwrite === null) &&
//       (typeof len === "number" || len === null)
//     ) {
//       return this.put$byte_A$int$boolean$int(buf, index, overwrite, len) as any;
//     } else if (
//       (typeof buf === "number" || buf === null) &&
//       ((index != null &&
//         ((index instanceof Array) as any) &&
//         (index.length == 0 ||
//           index[0] == null ||
//           typeof index[0] === "number")) ||
//         index === null) &&
//       (typeof overwrite === "number" || overwrite === null) &&
//       len === undefined
//     ) {
//       return this.put$int$byte_A$int(buf, index, overwrite) as any;
//     } else {
//       throw new Error("invalid overload");
//     }
//   }

//   public seek(file: RandomAccessFile, position: number) {
//     if (position < 0 || position > 62914560) {
//       console.info("Badseek - coord:" + position + " len:" + file.length());
//       position = 62914560;
//       try {
//         java.lang.Thread.sleep(1000);
//       } catch (_ex) {}
//     }
//     file.seek(position);
//   }
}
