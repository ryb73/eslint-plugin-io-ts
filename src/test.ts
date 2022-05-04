import path from "path";
import { ESLintUtils } from "@typescript-eslint/utils";
import { rule as requireExact } from "./rules/require-exact";

const ruleTester = new ESLintUtils.RuleTester({
  parser: `@typescript-eslint/parser`,
  parserOptions: {
    project: `./tsconfig.json`,
    // eslint-disable-next-line unicorn/prefer-module
    tsconfigRootDir: path.resolve(__dirname, `../..`),
  },
});

ruleTester.run(`require-exact`, requireExact, {
  valid: [
    `
      function type(x: string) {}
      const a = type(ok);
    `,
    `
      import { string, type } from "io-ts";
      const type = () => {};
      const a = type();
    `,
    `
      import { string, type } from "io-ts";
      function f(type: () => void) {
        return type();
      }
    `,
    `
      import { string, type } from "not-io-ts";
      const a = type({ s: string });
    `,
  ],
  invalid: [
    {
      code: `
        import { string, type } from "io-ts";
        const a = type({ s: string });
      `,
      errors: [
        {
          column: 19,
          endColumn: 38,
          endLine: 3,
          line: 3,
          messageId: `noType`,
        },
      ],
    },
    {
      code: `
        import { string, type } from "io-ts";
        function f() {
          return type({ s: string });
        }
      `,
      errors: [
        {
          column: 18,
          endColumn: 37,
          endLine: 4,
          line: 4,
          messageId: `noType`,
        },
      ],
    },
  ],
});
