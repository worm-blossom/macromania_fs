# Macromania FS

Macros for macromania for file system manipulation. These macros essentially
wrap the
[Deno file system API](https://deno.land/api@v1.40.3?unstable=true&s=Deno.chmod)
and some convenience functions from the
[Deno fs std library](https://deno.land/std@0.63.0/fs/mod.ts) with error
reporting. The macros all halt evaluation when they encounter a filesystem
error..
