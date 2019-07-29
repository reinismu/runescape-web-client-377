
import { ISAACGenerator } from "isaac-crypto";

/**
 * Creates the random number generator with the specified seed.
 *
 * @param {Array} seed The seed.
 * @class
 */
export class ISAACCipher {
    generator: ISAACGenerator;

    public constructor(seed: number[]) {
        this.generator = new ISAACGenerator(seed);
    }

    /**
     * Gets the next random value.
     *
     * @return {number} The next random value.
     */
    public nextInt(): number {
        return this.generator.getNextResult() | 0;
    }
}
