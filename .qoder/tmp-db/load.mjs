import { registerHooks } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const shim = pathToFileURL("D:/VPVM services/pumpsquare-website/.qoder/tmp-db/mem-pg.mjs").href;
const ts = await import(
  pathToFileURL("D:/VPVM services/pumpsquare-website/frontend/node_modules/typescript/lib/typescript.js").href
).then((m) => m.default ?? m);

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "pg") return { url: shim, shortCircuit: true };
    if (specifier === "server-only") return { url: "data:text/javascript,export{}", shortCircuit: true };
    if (specifier.startsWith("@/")) {
      const base = "D:/VPVM services/pumpsquare-website/frontend/" + specifier.slice(2);
      for (const ext of [".ts", ".tsx", "/index.ts"]) {
        if (existsSync(base + ext)) {
          return { url: pathToFileURL(base + ext).href, shortCircuit: true, format: "module" };
        }
      }
    }
    if (specifier.startsWith(".") && context.parentURL) {
      const base = fileURLToPath(new URL(specifier, context.parentURL));
      if (!base.endsWith(".ts") && existsSync(base + ".ts")) {
        return { url: pathToFileURL(base + ".ts").href, shortCircuit: true, format: "module" };
      }
    }
    if (specifier === "next/headers") {
      return {
        url: pathToFileURL("D:/VPVM services/pumpsquare-website/.qoder/tmp-db/headers-stub.mjs").href,
        shortCircuit: true,
      };
    }
    if (specifier === "next/navigation") {
      return {
        url: pathToFileURL("D:/VPVM services/pumpsquare-website/.qoder/tmp-db/navigation-stub.mjs").href,
        shortCircuit: true,
      };
    }
    const resolved = nextResolve(specifier, context);
    const url = String(resolved.url).split("?")[0];
    if (url.endsWith(".ts")) return { ...resolved, url, shortCircuit: true, format: "module" };
    return resolved;
  },
  load(url, context, nextLoad) {
    if (url.endsWith(".ts") || url.endsWith(".tsx")) {
      const source = readFileSync(fileURLToPath(url), "utf8");
      const { outputText } = ts.transpileModule(source, {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
          jsx: ts.JsxEmit.ReactJSX,
          verbatimModuleSyntax: false,
          importsNotUsedAsValues: undefined,
        },
        fileName: fileURLToPath(url),
      });
      return { format: "module", source: outputText, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});
