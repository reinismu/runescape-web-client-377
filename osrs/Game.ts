import cacheData from "./../client_cache/*.dat";
import cacheIndices from "./../client_cache/*.idx*";
import { rs_hash_string } from "./../wasm/src/lib.rs";
import { Index } from "./cache/Index";
import { Archive } from "./cache/Archive";

console.log("Hello");
console.log("Rust add: " + rs_hash_string("title.dat"));
console.log(cacheData.main_file_cache);

async function getFile(fileUrl: string): Promise<ArrayBuffer> {
    const resp = await fetch(fileUrl);
    return resp.arrayBuffer();
}

Promise.all(
    [
        getFile(cacheData.main_file_cache),
        getFile(cacheIndices.main_file_cache[0]),
        getFile(cacheIndices.main_file_cache[1]),
        getFile(cacheIndices.main_file_cache[2]),
        getFile(cacheIndices.main_file_cache[3]),
        getFile(cacheIndices.main_file_cache[4]),
    ]
).then((promises) => {
    const main = promises[0];
    let indexes: Index[] = []
    for(let type = 0; type< 5; type++) {
        indexes.push(new Index(type+1, 0x927c0, main, promises[1+type]));
    }
    console.log(indexes[0]);
    const tileArchive = new Archive(indexes[0].get(1));
    const tileData = tileArchive.getFile("title.dat")
    console.log(tileData);
    var bytes = new Uint8Array(indexes[0].get(1)); // pass your byte response to this constructor

    var blob=new Blob([bytes]);// change resultByte to bytes

    var link=document.createElement('a');
    link.href=window.URL.createObjectURL(blob);
    link.download="index1.raw";
    link.click();
})
