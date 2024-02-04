import {
  CopyOptions,
  copySync,
  emptyDirSync,
  ensureDirSync,
  ensureFileSync,
  ensureLinkSync,
  ensureSymlinkSync,
} from "https://deno.land/std@0.63.0/fs/mod.ts";

import { Context, Expression, styleFile } from "../macromania/main.ts";

/**
 * Changes the permission of a specific file/directory of
 * specified path. Ignores the process's umask.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.chmodSync
 * @returns The empty string.
 */
export function Chmod(
  { path, mode }: { path: string | URL; mode: number },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          Deno.chmodSync(path, mode);
        } catch (err) {
          ctx.error(
            `Failed to chmod file ${
              styleFile(path.toString())
            } to the permissions 0o${mode.toString(8)}.`,
          );
          ctx.error(err);
          ctx.halt();
        }
        return "";
      }}
    />
  );
}

/**
 * Changes the owner of a regular file or directory.
 *
 * https://deno.land/api@v1.40.3?unstable=true&s=Deno.chownSync
 * @returns The empty string.
 */
export function Chown(
  { path, uid, gid }: { path: string | URL; uid?: number; gid?: number },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          Deno.chownSync(path, uid ?? null, gid ?? null);
        } catch (err) {
          ctx.error(
            `Failed to chown file ${styleFile(path.toString())}`,
          );
          if (uid != undefined) {
            ctx.error(`User id: ${uid}`);
          }
          if (gid != undefined) {
            ctx.error(`Group id: ${gid}`);
          }
          ctx.error(err);
          ctx.halt();
        }
        return "";
      }}
    />
  );
}

/**
 * Copies the contents and permissions of one file to another
 * specified path, by default creating a new file if needed, else overwriting.
 * Fails if target path is a directory or is unwritable.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.copyFileSync
 * @returns The empty string.
 */
export function CopyFile(
  { from, to }: { from: string | URL; to: string | URL },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          Deno.copyFileSync(from, to);
        } catch (err) {
          ctx.error(
            `Failed to copy file from ${styleFile(from.toString())} to ${
              styleFile(to.toString())
            }`,
          );
          ctx.error(err);
          ctx.halt();
        }
        return "";
      }}
    />
  );
}

/**
 * Creates `newpath` as a hard link to `oldpath`.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.linkSync
 * @returns The empty string.
 */
export function Link(
  { oldpath, newpath }: { oldpath: string; newpath: string },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          Deno.linkSync(oldpath, newpath);
        } catch (err) {
          ctx.error(
            `Failed to create ${
              styleFile(newpath.toString())
            } as a hardlink to ${styleFile(oldpath.toString())}`,
          );
          ctx.error(err);
          ctx.halt();
        }
        return "";
      }}
    />
  );
}

/**
 * Creates a new temporary directory in the default directory for
 * temporary files, unless `dir` is specified. Other optional options include
 * prefixing and suffixing the directory name with `prefix` and `suffix`
 * respectively.
 *
 * It is the caller's responsibility to remove the directory when no longer
 * needed.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.makeTempDirSync
 * @returns The full path to the newly created directory.
 */
export function MakeTempDir(
  { options }: { options?: Deno.MakeTempOptions },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          return Deno.makeTempDirSync(options);
        } catch (err) {
          ctx.error(`Failed to create temporary directory.`);
          if (options) {
            ctx.error(`Options: ${JSON.stringify(options)}`);
          }
          ctx.error(err);
          ctx.halt();
          return "";
        }
      }}
    />
  );
}

/**
 * Creates a new temporary file in the default directory for
 * temporary files, unless `dir` is specified. Other optional options include
 * prefixing and suffixing the file name with `prefix` and `suffix`
 * respectively.
 *
 * It is the caller's responsibility to remove the file when no longer needed.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.makeTempFileSync
 * @returns The full path to the newly created file.
 */
export function MakeTempFile(
  { options }: { options?: Deno.MakeTempOptions },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          return Deno.makeTempFileSync(options);
        } catch (err) {
          ctx.error(`Failed to create temporary file.`);
          if (options) {
            ctx.error(`Options: ${JSON.stringify(options)}`);
          }
          ctx.error(err);
          ctx.halt();
          return "";
        }
      }}
    />
  );
}

/**
 * Creates a new directory with the specified path.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.mkdirSync
 * @returns The empty string.
 */
export function Mkdir(
  { path, options }: { path: string | URL; options?: Deno.MkdirOptions },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          Deno.mkdirSync(path, options);
        } catch (err) {
          ctx.error(`Failed to create directory ${path.toString()}`);
          if (options) {
            ctx.error(`Options: ${JSON.stringify(options)}`);
          }
          ctx.error(err);
          ctx.halt();
        }
        return "";
      }}
    />
  );
}

/**
 * Returns the full path destination of the named symbolic link.
 *
 * https://deno.land/api@v1.40.3?unstable=true&s=Deno.readLinkSync
 * @returns The full path destination of the named symbolic link.
 */
export function ReadLink(
  { path }: { path: string | URL },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          return Deno.readLinkSync(path);
        } catch (err) {
          ctx.error(`Failed to read link ${path.toString()}`);
          ctx.error(err);
          ctx.halt();
          return "";
        }
      }}
    />
  );
}

/**
 * Reads and returns the entire contents of a file as an UTF-8 decoded string.
 * Reading a directory throws an error.
 *
 * https://deno.land/api@v1.40.3?unstable=true&s=Deno.readTextFileSync
 * @returns The file contents.
 */
export function ReadTextFile(
  { path }: { path: string | URL },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          return Deno.readTextFileSync(path);
        } catch (err) {
          ctx.error(`Failed to read text file ${path.toString()}`);
          ctx.error(err);
          ctx.halt();
          return "";
        }
      }}
    />
  );
}

/**
 * Returns the absolute normalized path, with symbolic links
 * resolved.
 *
 * https://deno.land/api@v1.40.3?unstable=true&s=Deno.realPathSync
 * @returns The absolute normalized path, with symbolic links resolved.
 */
export function RealPath(
  { path }: { path: string | URL },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          return Deno.realPathSync(path);
        } catch (err) {
          ctx.error(`Failed to get real path for ${path.toString()}`);
          ctx.error(err);
          ctx.halt();
          return "";
        }
      }}
    />
  );
}

/**
 * Removes the named file or directory.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.removeSync
 * @returns The empty string.
 */
export function Remove(
  { path, options }: { path: string | URL; options?: Deno.RemoveOptions },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          Deno.removeSync(path, options);
        } catch (err) {
          ctx.error(`Failed to remove ${path.toString()}`);
          if (options) {
            ctx.error(`Options: ${JSON.stringify(options)}`);
          }
          ctx.error(err);
          ctx.halt();
        }
        return "";
      }}
    />
  );
}

/**
 * Renames (moves) `oldpath` to `newpath`. Paths may be files or directories.
 * If `newpath` already exists and is not a directory, Rename replaces
 * it. OS-specific restrictions may apply when `oldpath` and `newpath` are in
 * different directories.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.renameSync
 * @returns The empty string.
 */
export function Rename(
  { oldpath, newpath }: { oldpath: string; newpath: string },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          Deno.renameSync(oldpath, newpath);
        } catch (err) {
          ctx.error(
            `Failed to rename (move) ${styleFile(oldpath.toString())} to ${
              styleFile(newpath.toString())
            }`,
          );
          ctx.error(err);
          ctx.halt();
        }
        return "";
      }}
    />
  );
}

/**
 * Creates `newpath` as a symbolic link to `oldpath`.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.symlinkSync
 * @returns The empty string.
 */
export function Symlink(
  { oldpath, newpath, options }: {
    oldpath: string;
    newpath: string;
    options?: Deno.SymlinkOptions;
  },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          Deno.symlinkSync(oldpath, newpath, options);
        } catch (err) {
          ctx.error(
            `Failed to create ${
              styleFile(newpath.toString())
            } as a symlinklink to ${styleFile(oldpath.toString())}`,
          );
          if (options) {
            ctx.error(`Options: ${JSON.stringify(options)}`);
          }
          ctx.error(err);
          ctx.halt();
        }
        return "";
      }}
    />
  );
}

/**
 * Truncates (or extends) the specified file, to reach the specified `len`.
 * If `len` is not specified then the entire file contents are truncated.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.truncateSync
 * @returns The empty string.
 */
export function Truncate(
  { path, len }: { path: string; len?: number },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          Deno.truncateSync(path, len);
        } catch (err) {
          ctx.error(
            `Failed to truncate ${path} to length ${
              len === undefined ? 0 : len
            }.`,
          );
          ctx.error(err);
          ctx.halt();
        }
        return "";
      }}
    />
  );
}

/**
 * Changes the access (`atime`) and modification (`mtime`) times of a file
 * system object referenced by `path`. Given times are either in seconds
 * (UNIX epoch time) or as `Date` objects.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.utimeSync
 * @returns The empty string.
 */
export function Utime(
  { path, atime, mtime }: {
    path: string | URL;
    atime: number | Date;
    mtime: number | Date;
  },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          Deno.utimeSync(path, atime, mtime);
        } catch (err) {
          ctx.error(
            `Failed to change access tme and modification time of ${path.toString()} to ${atime} and ${mtime} respectively.`,
          );
          ctx.error(err);
          ctx.halt();
        }
        return "";
      }}
    />
  );
}

/**
 * Write the expanded child to the given `path`, by default creating a new file
 * if needed, else overwriting.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.writeTextFileSync
 * @returns The expanded child.
 */
export function WriteTextFile(
  { path, options, children }: {
    path: string | URL;
    options?: Deno.WriteFileOptions;
    children: Expression;
  },
): Expression {
  return (
    <map
      fun={(evaled: string, ctx: Context) => {
        try {
          Deno.writeTextFileSync(path, evaled, options);
          return evaled;
        } catch (err) {
          ctx.error(`Failed to write file ${path.toString()}`);
          if (options) {
            ctx.error(`Options: ${JSON.stringify(options)}`);
          }
          ctx.error(err);
          ctx.halt();
        }
        return "";
      }}
    >
      {children}
    </map>
  );
}

/**
 * Copies a file or directory. The directory can have contents. Like `cp -r`.
 *
 * See https://deno.land/std@0.63.0/fs/mod.ts?s=copySync
 * @returns The empty string.
 */
export function Copy(
  { src, dest, options }: {
    src: string;
    dest: string;
    options?: CopyOptions;
  },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          copySync(src, dest, options);
        } catch (err) {
          ctx.error(
            `Failed to copy ${styleFile(src.toString())} to ${
              styleFile(dest.toString())
            }`,
          );
          if (options) {
            ctx.error(`Options: ${JSON.stringify(options)}`);
          }
          ctx.error(err);
          ctx.halt();
        }
        return "";
      }}
    />
  );
}

/**
 * Ensures that a directory is empty. Deletes directory contents if the
 * directory is not empty. If the directory does not exist, it is created. The
 * directory itself is not deleted.
 *
 * See https://deno.land/std@0.63.0/fs/mod.ts?s=emptyDirSync
 * @returns The empty string.
 */
export function EmptyDir(
  { dir }: {
    dir: string;
  },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          emptyDirSync(dir);
        } catch (err) {
          ctx.error(
            `Failed to ensure an empty directory at ${styleFile(dir)}`,
          );
          ctx.error(err);
          ctx.halt();
        }
        return "";
      }}
    />
  );
}

/**
 * Ensures that the directory exists. If the directory structure does not
 * exist, it is created. Like `mkdir -p`.
 *
 * See https://deno.land/std@0.63.0/fs/mod.ts?s=ensureDirSync
 * @returns The empty string.
 */
export function EnsureDir(
  { dir }: {
    dir: string;
  },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          ensureDirSync(dir);
        } catch (err) {
          ctx.error(
            `Failed to ensure that a directory exists at ${styleFile(dir)}`,
          );
          ctx.error(err);
          ctx.halt();
        }
        return "";
      }}
    />
  );
}

/**
 * Ensures that the file exists. If the file that is requested to be created is
 * in directories that do not exist, these directories are created. If the file
 * already exists, it is NOT MODIFIED.
 *
 * See https://deno.land/std@0.63.0/fs/mod.ts?s=ensureFileSync
 * @returns The empty string.
 */
export function EnsureFile(
  { filePath }: {
    filePath: string;
  },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          ensureFileSync(filePath);
        } catch (err) {
          ctx.error(
            `Failed to ensure that a file exists at ${styleFile(filePath)}`,
          );
          ctx.error(err);
          ctx.halt();
        }
        return "";
      }}
    />
  );
}

/**
 * Ensures that the hard link exists. If the directory structure does not
 * exist, it is created.
 *
 * See https://deno.land/std@0.63.0/fs/mod.ts?s=ensureLinkSync
 * @returns The empty string.
 */
export function EnsureLink(
  { src, dest }: {
    src: string;
    dest: string;
  },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          ensureLinkSync(src, dest);
        } catch (err) {
          ctx.error(
            `Failed to ensure that a link exists at ${styleFile(dest)} to ${
              styleFile(src)
            }`,
          );
          ctx.error(err);
          ctx.halt();
        }
        return "";
      }}
    />
  );
}

/**
 * Ensures that the symlink exists. If the directory structure does not
 * exist, it is created.
 *
 * See https://deno.land/std@0.63.0/fs/mod.ts?s=ensureSymlinkSync
 * @returns The empty string.
 */
export function EnsureSymlink(
  { src, dest }: {
    src: string;
    dest: string;
  },
): Expression {
  return (
    <impure
      fun={(ctx: Context) => {
        try {
          ensureSymlinkSync(src, dest);
        } catch (err) {
          ctx.error(
            `Failed to ensure that a symlink exists at ${styleFile(dest)} to ${
              styleFile(src)
            }`,
          );
          ctx.error(err);
          ctx.halt();
        }
        return "";
      }}
    />
  );
}
