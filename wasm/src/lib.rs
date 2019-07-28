extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;
 
#[wasm_bindgen]
pub fn foo(x: &str) -> String {
  if x == "me" {
    "yes".to_string()
  } else {
    "no".to_string()
  }
}

#[wasm_bindgen]
pub fn rs_hash_string(s: &str) -> i32 {
  let mut hash = 0;
  for c in s.chars() {
    hash = (hash * 61 + c as i32) - 32;
  }
  hash
}

//  sprite = sprite.toUpperCase();
//         let spriteHash: number = 0;
//         for (let index: number = 0; index < sprite.length; index++) {
//             {
//                 spriteHash = spriteHash * 61 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(sprite.charAt(index)) - 32;
//                 spriteHash = (spriteHash + (spriteHash >> 56)) & 72057594037927935;
//             }
//         }
//         return spriteHash;