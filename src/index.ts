/* eslint-disable import/no-unused-modules */
import type { TSESLint } from "@typescript-eslint/utils";
import { rule as requireExact } from "./rules/require-exact";

export const rules: Record<string, TSESLint.RuleModule<string, unknown[]>> = {
  "require-exact": requireExact,
};
