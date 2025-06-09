import {
  Mode,
  Path,
  Pathish,
  SimpleFilesystem,
  SimpleFilesystemExt,
} from "@aljoscha-meyer/simple-fs-abstraction";
import { type Children, Context, Expression } from "@wormblossom/macromania";

export type FsConfig = {
  fs?: null | (SimpleFilesystem & SimpleFilesystemExt);
};

const [ConfigFs_, getConfig] = Context.createConfig<FsConfig>(() => ({
  fs: null,
}));
export const ConfigFs = ConfigFs_;

export function pwd(ctx: Context): Path {
  return withFsSync(
    ctx,
    "get the (virtual) current working directory",
    (fs) => {
      return fs.pwd();
    },
  );
}

export function cd(ctx: Context, path: Pathish): void {
  return withFsSync(ctx, "change the (virtual) working directory", (fs) => {
    return fs.cd(path);
  });
}

export async function ls(ctx: Context, path?: Pathish): Promise<Set<string>> {
  return await withFs(ctx, "list all files in a directory", async (fs) => {
    return await fs.ls(path);
  });
}

export function lsSync(ctx: Context, path?: Pathish): Set<string> {
  return withFsSync(ctx, "list all files in a directory", (fs) => {
    return fs.lsSync(path);
  });
}

export async function stat(
  ctx: Context,
  path: Pathish,
): Promise<"directory" | "data" | "nothing"> {
  return await withFs(ctx, "obtain information about a file", async (fs) => {
    return await fs.stat(path);
  });
}

export function statSync(
  ctx: Context,
  path: Pathish,
): "directory" | "data" | "nothing" {
  return withFsSync(ctx, "obtain information about a file", (fs) => {
    return fs.statSync(path);
  });
}

export async function read(ctx: Context, path: Pathish): Promise<Uint8Array> {
  return await withFs(ctx, "read a data file", async (fs) => {
    return await fs.read(path);
  });
}

export function readSync(ctx: Context, path: Pathish): Uint8Array {
  return withFsSync(ctx, "read a data file", (fs) => {
    return fs.readSync(path);
  });
}

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

export async function mkdir(
  ctx: Context,
  path: Pathish,
  mode?: Mode,
): Promise<void> {
  return await withFs(ctx, "create a directory", async (fs) => {
    return await fs.mkdir(path, mode);
  });
}

export function mkdirSync(ctx: Context, path: Pathish, mode?: Mode): void {
  return withFsSync(ctx, "create a directory", (fs) => {
    return fs.mkdirSync(path, mode);
  });
}

export async function remove(ctx: Context, path: Pathish): Promise<void> {
  return await withFs(ctx, "delete a file", async (fs) => {
    return await fs.remove(path);
  });
}

export function removeSync(ctx: Context, path: Pathish): void {
  return withFsSync(ctx, "delete a file", (fs) => {
    return fs.removeSync(path);
  });
}

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

export async function readString(ctx: Context, path: Pathish): Promise<string> {
  return await withFs(ctx, "read a data file as a UTF-8 string", async (fs) => {
    return await fs.readString(path);
  });
}

export function readStringSync(ctx: Context, path: Pathish): string {
  return withFsSync(ctx, "read a data file as a UTF-8 string", (fs) => {
    return fs.readStringSync(path);
  });
}

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

export async function ensureNot(
  ctx: Context,
  path: Pathish,
  mode?: Mode,
): Promise<void> {
  return await withFs(ctx, "ensure a file does not exist", async (fs) => {
    return await fs.ensureNot(path, mode);
  });
}

export function ensureNotSync(
  ctx: Context,
  path: Pathish,
  mode?: Mode,
): void {
  return withFsSync(ctx, "ensure a file does not exist", (fs) => {
    return fs.ensureNotSync(path, mode);
  });
}

export function getFs(ctx: Context): SimpleFilesystem & SimpleFilesystemExt {
  return doGetFs(ctx, `obtain the current file system object`);
}

export function Dir(
  { children, name, mode }: {
    children?: Children;
    name: string;
    mode?: Mode;
  },
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
            {children}
          </lifecycle>
        );
      }}
    />
  );
}

export function File(
  { children, name, mode, forwardContent }: {
    children?: Children;
    name: string;
    mode?: Mode;
    forwardContent?: boolean;
  },
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
            {children}
          </map>
        );
      }}
    />
  );
}

function nameToRelativePath(ctx: Context, name: string): Path {
  if (Path.isComponent(name)) {
    return Path.relative([name]);
  } else {
    ctx.error(
      `Tried to create a directory, but the given name was not a valid path component for the ${
        ctx.fmtCode("simple-abstract-fs")
      } ( ${
        ctx.fmtURL("https://jsr.io/@aljoscha-meyer/simple-fs-abstraction")
      } )`,
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
          ctx.fmtURL("https://jsr.io/@aljoscha-meyer/simple-fs-deno")
        }`,
      );
      ctx.info(
        `For interacting with an in-memory "file system", or for implementing your own backends, see ${
          ctx.fmtURL("https://jsr.io/@aljoscha-meyer/simple-fs-abstraction")
        }`,
      );
    });
    throw ctx.halt();
  } else {
    return config.fs;
  }
}

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
