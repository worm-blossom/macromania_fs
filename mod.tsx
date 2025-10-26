import {
  type Mode,
  Path,
  type Pathish,
  type SimpleFilesystem,
  type SimpleFilesystemExt,
} from "@wormblossom/simple-fs-abstraction";
import {
  type Children,
  Context,
  type Expression,
} from "@wormblossom/macromania";

/**
 * The (non-children) props of the {@linkcode ConfigFs} macro.
 *
```ts
import { ConfigFs, File } from "@wormblossom/macromania-fs";
import { SimpleFsDeno } from "@wormblossom/simple-fs-deno";

<ConfigFs fs={new SimpleFsDeno(".")}>
  <File name="hello.txt">Hello, world.</File>
</ConfigFs>
 ```
 */
export type FsConfig = {
  /**
   * The file system implementation which will be used by all macros and functions of the `macromania-fs` package while evaluating the children of the {@linkcode ConfigFs} macro.
   */
  fs?: null | (SimpleFilesystem & SimpleFilesystemExt);
};

const [ConfigFs_, getConfig] = Context.createConfig<FsConfig>(() => ({
  fs: null,
}));

/**
 * The config macro for `macromania-fs`.
 *
 * This macro controls the concrete file system implementation used by all other macros and functions of this package. Its `fs` {@linkcode FsConfig | prop } is a single value that must implement both the {@linkcode SimpleFilesystem} and the {@linkcode SimpleFilesystemExt} interface.
 *
 * This `fs` then performs all actual file system operations for the macros and functions of this package which are evaluated or called while evaluating the `children` of the config macro.
 *
```ts
import { ConfigFs, File } from "@wormblossom/macromania-fs";
import { SimpleFsDeno } from "@wormblossom/simple-fs-deno";

<ConfigFs fs={new SimpleFsDeno(".")}>
  <File name="hello.txt">Hello, world.</File>
</ConfigFs>
 ```
 */
export const ConfigFs = ConfigFs_;

/**
 * Calls {@linkcode SimpleFilesystem.pwd | pwd} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export function pwd(ctx: Context): Path {
  return withFsSync(
    ctx,
    "get the (virtual) current working directory",
    (fs) => {
      return fs.pwd();
    },
  );
}

/**
 * Calls {@linkcode SimpleFilesystem.cd | cd} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export function cd(ctx: Context, path: Pathish): void {
  return withFsSync(ctx, "change the (virtual) working directory", (fs) => {
    return fs.cd(path);
  });
}

/**
 * Calls {@linkcode SimpleFilesystem.ls | ls} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export async function ls(ctx: Context, path?: Pathish): Promise<Set<string>> {
  return await withFs(ctx, "list all files in a directory", async (fs) => {
    return await fs.ls(path);
  });
}

/**
 * Calls {@linkcode SimpleFilesystem.lsSync | lsSync} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export function lsSync(ctx: Context, path?: Pathish): Set<string> {
  return withFsSync(ctx, "list all files in a directory", (fs) => {
    return fs.lsSync(path);
  });
}

/**
 * Calls {@linkcode SimpleFilesystem.stat | stat} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export async function stat(
  ctx: Context,
  path: Pathish,
): Promise<"directory" | "data" | "nothing"> {
  return await withFs(ctx, "obtain information about a file", async (fs) => {
    return await fs.stat(path);
  });
}

/**
 * Calls {@linkcode SimpleFilesystem.statSync | statsSync} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export function statSync(
  ctx: Context,
  path: Pathish,
): "directory" | "data" | "nothing" {
  return withFsSync(ctx, "obtain information about a file", (fs) => {
    return fs.statSync(path);
  });
}

/**
 * Calls {@linkcode SimpleFilesystem.read | read} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export async function read(ctx: Context, path: Pathish): Promise<Uint8Array> {
  return await withFs(ctx, "read a data file", async (fs) => {
    return await fs.read(path);
  });
}

/**
 * Calls {@linkcode SimpleFilesystem.readSync | readSync} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export function readSync(ctx: Context, path: Pathish): Uint8Array {
  return withFsSync(ctx, "read a data file", (fs) => {
    return fs.readSync(path);
  });
}

/**
 * Calls {@linkcode SimpleFilesystem.write | write} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export async function write(
  ctx: Context,
  path: Pathish,
  data: Uint8Array,
  mode?: Mode,
): Promise<void> {
  return await withFs(ctx, "write a data file", async (fs) => {
    return await fs.write(path, data, mode);
  });
}

/**
 * Calls {@linkcode SimpleFilesystem.writeSync | writeSync} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export function writeSync(
  ctx: Context,
  path: Pathish,
  data: Uint8Array,
  mode?: Mode,
): void {
  return withFsSync(ctx, "write a data file", (fs) => {
    return fs.writeSync(path, data, mode);
  });
}

/**
 * Calls {@linkcode SimpleFilesystem.mkdir | mkdir} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export async function mkdir(
  ctx: Context,
  path: Pathish,
  mode?: Mode,
): Promise<void> {
  return await withFs(ctx, "create a directory", async (fs) => {
    return await fs.mkdir(path, mode);
  });
}

/**
 * Calls {@linkcode SimpleFilesystem.mkdirSync | mkdirSync} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export function mkdirSync(ctx: Context, path: Pathish, mode?: Mode): void {
  return withFsSync(ctx, "create a directory", (fs) => {
    return fs.mkdirSync(path, mode);
  });
}

/**
 * Calls {@linkcode SimpleFilesystem.remove | remove} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export async function remove(ctx: Context, path: Pathish): Promise<void> {
  return await withFs(ctx, "delete a file", async (fs) => {
    return await fs.remove(path);
  });
}

/**
 * Calls {@linkcode SimpleFilesystem.removeSync | removeSync} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export function removeSync(ctx: Context, path: Pathish): void {
  return withFsSync(ctx, "delete a file", (fs) => {
    return fs.removeSync(path);
  });
}

/**
 * Calls {@linkcode SimpleFilesystem.copy | copy} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export async function copy(
  ctx: Context,
  src: Pathish,
  dst: Pathish,
  mode?: Mode,
): Promise<void> {
  return await withFs(ctx, "copy a file", async (fs) => {
    return await fs.copy(src, dst, mode);
  });
}

/**
 * Calls {@linkcode SimpleFilesystem.copySync | copySync} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export function copySync(
  ctx: Context,
  src: Pathish,
  dst: Pathish,
  mode?: Mode,
): void {
  return withFsSync(ctx, "copy a file", (fs) => {
    return fs.copySync(src, dst, mode);
  });
}

/**
 * Calls {@linkcode SimpleFilesystem.move | move} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export async function move(
  ctx: Context,
  src: Pathish,
  dst: Pathish,
  mode?: Mode,
): Promise<void> {
  return await withFs(ctx, "move a file", async (fs) => {
    return await fs.move(src, dst, mode);
  });
}

/**
 * Calls {@linkcode SimpleFilesystem.moveSync | moveSync} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export function moveSync(
  ctx: Context,
  src: Pathish,
  dst: Pathish,
  mode?: Mode,
): void {
  return withFsSync(ctx, "move a file", (fs) => {
    return fs.moveSync(src, dst, mode);
  });
}

/**
 * Calls {@linkcode SimpleFilesystemExt.readString | readString} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export async function readString(ctx: Context, path: Pathish): Promise<string> {
  return await withFs(ctx, "read a data file as a UTF-8 string", async (fs) => {
    return await fs.readString(path);
  });
}

/**
 * Calls {@linkcode SimpleFilesystemExt.readStringSync | readStringSync} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export function readStringSync(ctx: Context, path: Pathish): string {
  return withFsSync(ctx, "read a data file as a UTF-8 string", (fs) => {
    return fs.readStringSync(path);
  });
}

/**
 * Calls {@linkcode SimpleFilesystemExt.writeString | writeString} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export async function writeString(
  ctx: Context,
  path: Pathish,
  data: string,
  mode?: Mode,
): Promise<void> {
  return await withFs(
    ctx,
    "write a UTF-8 string to a data file",
    async (fs) => {
      return await fs.writeString(path, data, mode);
    },
  );
}

/**
 * Calls {@linkcode SimpleFilesystemExt.writeStringSync | writeStringSync} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export function writeStringSync(
  ctx: Context,
  path: Pathish,
  data: string,
  mode?: Mode,
): void {
  return withFsSync(ctx, "write a UTF-8 string to a data file", (fs) => {
    return fs.writeStringSync(path, data, mode);
  });
}

/**
 * Calls {@linkcode SimpleFilesystemExt.ensureNot | ensureNot} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export async function ensureNot(
  ctx: Context,
  path: Pathish,
  mode?: Mode,
): Promise<void> {
  return await withFs(ctx, "ensure a file does not exist", async (fs) => {
    return await fs.ensureNot(path, mode);
  });
}

/**
 * Calls {@linkcode SimpleFilesystemExt.ensureNotSync | ensureNotSync} on the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export function ensureNotSync(
  ctx: Context,
  path: Pathish,
  mode?: Mode,
): void {
  return withFsSync(ctx, "ensure a file does not exist", (fs) => {
    return fs.ensureNotSync(path, mode);
  });
}

/**
 * Retrieves the `fs` prop of the closest surrounding {@linkcode ConfigFs} macro.
 *
 * Halts evaluation when there is no surrounding {@linkcode ConfigFs} macro at all.
 */
export function getFs(ctx: Context): SimpleFilesystem & SimpleFilesystemExt {
  return doGetFs(ctx, `obtain the current file system object`);
}

/**
 * The props of the {@linkcode Dir} macro.
 */
export type DirProps = {
  /**
   * The {@linkcode Dir} macro evaluates its children, it evaluates to whatever the children evaluated to.
   *
   * While evaluating the children, the current working directory of the {link ConfigFs | configured} {@linkcode SimpleFilesystem} is set to the directory created by this macro.
   */
  children?: Children;
  /**
   * The name of the directory to create. Must be a valid {@link Path.isComponent | component} for {@link Path | paths} in the simple-fs abstraction.
   */
  name: string;
  /**
   * The {@linkcode Mode} controlling what should happen if there already exists a file of the given `name`:
   *
   * - `"timid"`: erroneously halt evaluation.
   * - `"placid"`: silently leave the file system unchanged.
   * - `"assertive"`: overwrite whatever was there before with a fresh, empty directory.
   */
  mode?: Mode;
};

/**
 * A macro to create a directory.
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

This macro evaluates to what its children evaluated to.
 */
export function Dir(
  { children, name, mode }: DirProps,
): Expression {
  return (
    <effect
      fun={async (ctx) => {
        const path = nameToRelativePath(ctx, name);

        await mkdir(ctx, path, mode);

        return (
          <lifecycle
            pre={(ctx) => {
              cd(ctx, path);
            }}
            post={(ctx) => {
              cd(ctx, Path.relative([], 1));
            }}
          >
            <xs x={children} />
          </lifecycle>
        );
      }}
    />
  );
}

const [FileNameStateScope, getCurrentFilename, _] = Context.createScopedState<
  null | string
>(() => null);

/**
 * While evaluating the children of a [`File`] macro, this returns the `name` prop of that macro. Otherwise, returns `null`.
 */
export function currentFile(ctx: Context): string | null {
  return getCurrentFilename(ctx);
}

/**
 * The props of the {@linkcode File} macro.
 */
export type FileProps = {
  /**
   * The {@linkcode File} macro evaluates its children, writes the resulting string into the file it creates, and finally evaluates to the empty string (unless the `forwardContent` prop is `true`).
   */
  children?: Children;
  /**
   * The name of the file to create. Must be a valid {@link Path.isComponent | component} for {@link Path | paths} in the simple-fs abstraction.
   */
  name: string;
  /**
   * The {@linkcode Mode} controlling what should happen if there already exists a file of the given `name`:
   *
   * - `"timid"`: erroneously halt evaluation.
   * - `"placid"`: silently leave the file system unchanged.
   * - `"assertive"`: overwrite whatever was there before with the newly created file.
   */
  mode?: Mode;
  /**
   * If this flag is set, the `File` macro evaluates not to the empty string but to whatever its children evaluated to.
   */
  forwardContent?: boolean;
};

/**
 * A macro to create a file, whose contents are whatever the children of the macro evaluate to.
 *
```ts
import { File } from "@wormblossom/macromania-fs";

<File name="vacation.txt">See all the sights!</File>
```

This macro evaluates to the empty string, unless its `forwardContent` prop is `true`.
 */
export function File(
  { children, name, mode, forwardContent }: FileProps,
): Expression {
  return (
    <effect
      fun={(ctx) => {
        const path = nameToRelativePath(ctx, name);

        return (
          <map
            fun={async (ctx, evaled) => {
              await writeString(ctx, path, evaled, mode);
              return forwardContent ? evaled : "";
            }}
          >
            <FileNameStateScope>{children}</FileNameStateScope>
          </map>
        );
      }}
    />
  );
}

/** @ignore */
function nameToRelativePath(ctx: Context, name: string): Path {
  if (Path.isComponent(name)) {
    return Path.relative([name]);
  } else {
    ctx.error(
      `Tried to create a directory, but the given name was not a valid path component for the ${
        ctx.fmtCode("simple-abstract-fs")
      } ( ${ctx.fmtURL("https://jsr.io/@wormblossom/simple-fs-abstraction")} )`,
    );
    ctx.loggingGroup(() => {
      ctx.info(
        `The name must not contain any ${
          ctx.fmtCode("/")
        }, must not be empty, and must not be ${ctx.fmtCode(`"."`)} or ${
          ctx.fmtCode(`".."`)
        }`,
      );
    });
    throw ctx.halt();
  }
}

/** @ignore */
function doGetFs(
  ctx: Context,
  explanation: string,
): SimpleFilesystem & SimpleFilesystemExt {
  const config = getConfig(ctx);

  if (config.fs === null) {
    ctx.error(
      `Tried to ${explanation} with ${
        ctx.fmtCode("macromania-fs")
      }, but no backing file system was configured.`,
    );
    ctx.loggingGroup(() => {
      ctx.info(
        `Use the ${ctx.fmtCode("fs")} prop of the ${
          ctx.fmtCode("ConfigFs")
        } macro (see ${
          ctx.fmtURL("https://jsr.io/@wormblossom/macromania-fs")
        }) to configure a backing file system.`,
      );
      ctx.info(
        `For interacting with the native file system when using the Deno javascript runtime, see ${
          ctx.fmtURL("https://jsr.io/@wormblossom/simple-fs-deno")
        }`,
      );
      ctx.info(
        `For interacting with an in-memory "file system", or for implementing your own backends, see ${
          ctx.fmtURL("https://jsr.io/@wormblossom/simple-fs-abstraction")
        }`,
      );
    });
    throw ctx.halt();
  } else {
    return config.fs;
  }
}

/** @ignore */
async function withFs<Ret>(
  ctx: Context,
  explanation: string,
  action: (fs: SimpleFilesystem & SimpleFilesystemExt) => Promise<Ret>,
): Promise<Ret> {
  const fs = doGetFs(ctx, explanation);

  try {
    return await action(fs);
  } catch (err) {
    ctx.error(`Tried to ${explanation}, but encounter the following error:`);
    ctx.error(err);
    ctx.info(
      `Note that the preceding error was emitted from an operation mediated by the ${
        ctx.fmtCode("macromania-fs")
      } package ( ${ctx.fmtURL("https://jsr.io/@wormblossom/macromania-fs")} )`,
    );
    return ctx.halt() as Ret;
  }
}

/** @ignore */
function withFsSync<Ret>(
  ctx: Context,
  explanation: string,
  action: (fs: SimpleFilesystem & SimpleFilesystemExt) => Ret,
): Ret {
  const fs = doGetFs(ctx, explanation);

  try {
    return action(fs);
  } catch (err) {
    ctx.error(`Tried to ${explanation}, but encounter the following error:`);
    ctx.error(err);
    ctx.info(
      `Note that the preceding error was emitted from an operation mediated by the ${
        ctx.fmtCode("macromania-fs")
      } package ( ${ctx.fmtURL("https://jsr.io/@wormblossom/macromania-fs")} )`,
    );
    return ctx.halt() as Ret;
  }
}
