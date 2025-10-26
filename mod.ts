/**
 * A macromania package for interacting with the file system.
 *
```ts
import { ConfigFs, Dir, File } from "@wormblossom/macromania-fs";
import { SimpleFsDeno } from "@wormblossom/simple-fs-deno";

<ConfigFs fs={new SimpleFsDeno(".")}>
  <File name="hello.txt">Hello, world.</File>
  <Dir name="plans">
    <File name="vacation.txt">See all the sights!</File>
  </Dir>
</ConfigFs>
```
 *
 * ## For Writers
 *
 * This package provides three macros: the {@linkcode Dir} macor for creating directories, the {@linkcode File} macro for writing evaluated expressions to files, and the {@linkcode ConfigFs} macro for configuring everything.
 *
 * This package does not assume any particular file system API, but works through an [abstraction layer](https://jsr.io/@wormblossom/simple-fs-abstraction). The {@linkcode ConfigFs} macro must be used to provide a concrete implementation of the abstraction layer; all functionality of this package only works inside a {@linkcode ConfigFs} macro application. The following example configures this package to use the Deno filesystem APIs via through the [`simple-fs-deno`](https://jsr.io/@wormblossom/simple-fs-deno@0.1.0) package:
 *
 * ```ts
import { ConfigFs, Dir, File } from "@wormblossom/macromania-fs";
import { SimpleFsDeno } from "@wormblossom/simple-fs-deno";

<ConfigFs fs={new SimpleFsDeno(".")}>
  <File name="hello.txt">Hello, world.</File>
</ConfigFs>
 ```
 *
 * The {@linkcode File} macro in the snipped above evaluates its children and writes the result to a file.
 *
 * The {@linkcode Dir} macro creates a directory. Nested instances of the macro result in nested directories:
 *
```ts
import { Dir, File } from "@wormblossom/macromania-fs";

<Dir name="plans">
  <File name="vacation.txt">See all the sights!</File>

  <Dir name="nested">
    <File name="bla.txt">
      Nobody will open a file this deep in the directory
      hierarchy anyway.
    </File>
  </Dir>
</Dir>
```
 *
 * ## For Macro Developers
 *
 * In addition to the preceding macros, this packages provides functions for file system manipulation relative to the current {@linkcode Dir} macro. More specifically, each method of the {@linkcode SimpleFilesystem} and {@linkcode SimpleFilesystemExt} interfaces has a counterpart function in this package. These functions simply call the corresponding interface method on the `fs` prop of the nearest surrounding {@linkcode ConfigFs} macro. The current working directory of the `fs` prop is set to the directory created by the nearest surrounding {@linkcode Dir} macro. Using these functions, macro developers can create macros whose side-effects are relative to whichever file is currently being created.
 *
 * If raw access to the closest surrounding `fs` prop is required, the {@linkcode getFs} function can be used to retrieve it.
 *
 * @module
 */

export * from "./mod.tsx";
