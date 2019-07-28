declare module '*/wasm/src/lib.rs' {
    function rs_hash_string(s: string): number;
    function rs_encrypt_bytes(buf: Int8Array, modulus: string, publicKey: string): Int8Array;
}