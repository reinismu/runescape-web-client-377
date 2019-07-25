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