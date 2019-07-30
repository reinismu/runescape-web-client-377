extern crate num_bigint;
extern crate wasm_bindgen;

use std::num::Wrapping;

use num_bigint::BigInt;
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

#[wasm_bindgen]
pub fn rs_encrypt_bytes(bytes: &[u8], modulus: &str, public_key: &str) -> Box<[u8]> {
    let modul = modulus.parse().unwrap();
    let pk = public_key.parse().unwrap();
    let value = BigInt::from_signed_bytes_be(bytes);
    return value.modpow(&pk, &modul).to_signed_bytes_be().into_boxed_slice();
}

#[wasm_bindgen]
pub fn noise(x: i32, y: i32) -> i32 {
    let xw = Wrapping(x);
    let yw = Wrapping(y);
    let mut n = xw + yw * Wrapping(57i32);
    n ^= n << 13;
    return (((n * (n * n * Wrapping(15731i32) + Wrapping(789221i32)) + Wrapping(1376312589i32)) & Wrapping(0x7fffffffi32)) >> 19 & Wrapping(255i32)).0;
}

#[cfg(test)]
mod tests {
    use num_bigint::BigInt;

    use super::*;

    #[test]
    fn rs_encrypt_bytes_test() {
        let bytes: [u8; 4] = [1, 2, 3, 4];

        let res = rs_encrypt_bytes(&bytes,
                                   "119451785246034594318913466844897726485032978021771870857253652593456459656937408149171663305729099294408934560892059864142824573680823430259445420145626640471963783539799807337723403799309811004289973658204797289344515940319017904707123481018622649468116954230324555319775483054083583145719820778679015026209",
                                   "65537", );

        let value = BigInt::from_signed_bytes_be(&*res);

        assert_eq!(value.to_string(), "62941503495726515686915403074317605962270207656637960579496823972032733192232960324966571551496715640245454603371024879819288746669479138634430211630568608888343618083293892355075591583364821369137855568639221692956397918323596761717770334961614174642483257792333890847161885003161241462396197785099019655992");
    }


    #[test]
    fn noise_bytes_test() {
        assert_eq!(noise(6780, 1234), 245);
        assert_eq!(noise(67812340, 12123434), 226);
    }
}