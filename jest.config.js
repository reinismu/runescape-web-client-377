module.exports = {
  roots: ["<rootDir>"],
  globals: {
    "rs-jest": {
      "release": false,
      "export": "async-instance"
    }
  },
  transform: {
    "^.+\\.rs$": "rs-jest",
    "^.+\\.tsx?$": "ts-jest"
  }
};
