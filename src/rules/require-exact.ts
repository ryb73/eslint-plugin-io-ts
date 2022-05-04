import { isDefined } from "@ryb73/super-duper-parakeet/lib/src/type-checks";
import type { Scope, Variable } from "@typescript-eslint/scope-manager";
import { DefinitionType } from "@typescript-eslint/scope-manager";
import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator((name) => `https://github.com`);

function findVariable(scope: Scope, name: string): Variable | undefined {
  const result = scope.set.get(name);

  if (isDefined(result)) return result;

  if (isDefined(scope.upper)) return findVariable(scope.upper, name);

  return undefined;
}

function getPathImportedFrom(variable: Variable | undefined) {
  if (!isDefined(variable)) return undefined;

  const lastDef = variable.defs[variable.defs.length - 1];
  if (lastDef?.type !== DefinitionType.ImportBinding) {
    return undefined;
  }

  const importDeclaration = lastDef.parent;
  if (importDeclaration.type !== `ImportDeclaration`) return undefined;

  return importDeclaration.source.value;
}

export const rule = createRule({
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== AST_NODE_TYPES.Identifier) return;

        const scope = context.getScope();

        if (node.callee.name === `type`) {
          const variable = findVariable(scope, `type`);
          const importedFrom = getPathImportedFrom(variable);
          if (importedFrom !== `io-ts`) return;

          context.report({
            messageId: `noType`,
            node,
          });
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    type: `problem`,
    messages: {
      noType: `type() can produce unexpected behavior. Use strict() instead.`,
      noBarePartial: `partial(), on its own, can produce unexpected behavior. Wrap it in exact().`,
    },
    schema: [],
    docs: {
      description: `Prevents use of non-strict object types in io-ts.`,
      recommended: `error`,
      requiresTypeChecking: true,
    },
  },
  name: `require-exact`,
});
