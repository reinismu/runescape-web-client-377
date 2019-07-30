import cacheData from "./../client_cache/*.dat";
import cacheIndices from "./../client_cache/*.idx*";
import { rs_encrypt_bytes } from "./../wasm/src/lib.rs";
import { Index } from "./cache/Index";
import { Archive } from "./cache/Archive";
import pixels from "image-pixels";
import { Game } from "./Game";
import { Socket } from "./net/Socket";
import { Configuration } from "./Configuration";


// console.log("Hello");
// console.log("Rust add: " + rs_hash_string("title.dat"));
// console.log(cacheData.main_file_cache);

// async function getFile(fileUrl: string): Promise<ArrayBuffer> {
//     const resp = await fetch(fileUrl);
//     return resp.arrayBuffer();
// }

// async function test() {
//     const promises = await Promise.all([
//         getFile(cacheData.main_file_cache),
//         getFile(cacheIndices.main_file_cache[0]),
//         getFile(cacheIndices.main_file_cache[1]),
//         getFile(cacheIndices.main_file_cache[2]),
//         getFile(cacheIndices.main_file_cache[3]),
//         getFile(cacheIndices.main_file_cache[4])
//     ]);
//     const main = promises[0];
//     let indexes: Index[] = [];
//     for (let type = 0; type < 5; type++) {
//         indexes.push(new Index(type + 1, 0x927c0, main, promises[1 + type]));
//     }
//     console.log(indexes[0]);
//     const tileArchive = new Archive(indexes[0].get(1));
//     const tileData = tileArchive.getFile("title.dat");
//     const data = await pixels(new Int8Array(tileData));
//     console.log(data);
//     console.log(new Int32Array(data.data.buffer));
//     // FFFFFFFFFF90968A FFFFFFFFFF3D4342
//     (document.getElementById("preview") as HTMLImageElement).src =
//         "data:image/jpg;base64," +
//         btoa(String.fromCharCode.apply(null, new Int8Array(tileData)));
// }

async function startGame() {
    const game = new Game(document.getElementById("gameCanvas") as HTMLCanvasElement);
    await game.initializeApplication(765, 503);
}
startGame().then(() => {
    console.log("Game stopped!");
}).catch(error => {
    console.error(error);
});

// async function testSocket() {
//     const socket = new Socket("localhost", 43594);
//     console.log("Connecting");
//     await socket.connect();
//     console.log("Connected");

//     console.log("Write");
//     socket.write$int(15);
//     const data = await socket.read();
//     console.log(data);
//     const data2 = await socket.read();
//     console.log(data2);

// }
// testSocket().then(() => {
//     console.log("socket tested");
// });

// const res = rs_encrypt_bytes(new Int8Array([1,2,3,4]), "119451785246034594318913466844897726485032978021771870857253652593456459656937408149171663305729099294408934560892059864142824573680823430259445420145626640471963783539799807337723403799309811004289973658204797289344515940319017904707123481018622649468116954230324555319775483054083583145719820778679015026209",
//  "65537");
// console.log(res);