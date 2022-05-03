"use strict";

/** @type {import('@typescript-eslint/experimental-utils').TSESLint.Linter.Config} */
module.exports = {
  extends: [`@ryb73`],

  rules: {
    "@typescript-eslint/strict-boolean-expressions": [
      `error`,
      {
        allowString: false,
        allowNumber: false,
        // Need allowNullableObject off to catch branded primitives (e.g. Branded<number, IntBrand>)
        allowNullableObject: false,
      },
    ],
  },
};
