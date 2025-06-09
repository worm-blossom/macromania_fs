import {
  type Children,
  Context,
  type Expression,
} from "@wormblossom/macromania";
import { assert, assertEquals } from "@std/assert";
import { ConfigFs, Dir, File } from "../mod.tsx";
import { FilesystemExt, MemoryFs } from "@aljoscha-meyer/simple-fs-abstraction";

Deno.test("Halts when not configured", async () => {
  await (async () => {
    const ctx = new Context();
    const got = await ctx.evaluate(<Dir name="foo"></Dir>);
    assertEquals(got, null);
    assert(ctx.didWarnOrError());
  })();
});

Deno.test("The happy case works", async () => {
  await (async () => {
    const memFs = new FilesystemExt(new MemoryFs());

    const ctx = new Context();
    const got = await ctx.evaluate(
      <ConfigFs fs={memFs}>
        <Dir name="foo">
          <effect
            fun={(ctx) => {
              if (ctx.mustMakeProgress()) {
                return (
                  <>
                    <Dir name="bar">
                      <File name="baz">hi</File>
                    </Dir>
                    <File name="qux">ha</File>
                  </>
                );
              } else {
                return null;
              }
            }}
          />
        </Dir>
      </ConfigFs>,
    );
    assertEquals(got, "");
    assert(!ctx.didWarnOrError());

    assert(memFs.eq(MemoryFs.fromLiteral({
      foo: {
        bar: {
          baz: "hi",
        },
        qux: "ha",
      },
    })));
  })();
});

Deno.test("Dir timid works", async () => {
  await (async () => {
    const memFs = new FilesystemExt(MemoryFs.fromLiteral({
      foo: "dont_overwrite_me_pls",
    }));

    const ctx = new Context();
    const got = await ctx.evaluate(
      <ConfigFs fs={memFs}>
        <Dir name="foo" mode="timid">
          <effect
            fun={(ctx) => {
              if (ctx.mustMakeProgress()) {
                return (
                  <>
                    <Dir name="bar">
                      <File name="baz">hi</File>
                    </Dir>
                    <File name="qux">ha</File>
                  </>
                );
              } else {
                return null;
              }
            }}
          />
        </Dir>
      </ConfigFs>,
    );
    assertEquals(got, null);
    assert(ctx.didWarnOrError());

    assert(memFs.eq(MemoryFs.fromLiteral({
      foo: "dont_overwrite_me_pls",
    })));
  })();
});

Deno.test("Dir timid by default", async () => {
  await (async () => {
    const memFs = new FilesystemExt(MemoryFs.fromLiteral({
      foo: "dont_overwrite_me_pls",
    }));

    const ctx = new Context();
    const got = await ctx.evaluate(
      <ConfigFs fs={memFs}>
        <Dir name="foo">
          <effect
            fun={(ctx) => {
              if (ctx.mustMakeProgress()) {
                return (
                  <>
                    <Dir name="bar">
                      <File name="baz">hi</File>
                    </Dir>
                    <File name="qux">ha</File>
                  </>
                );
              } else {
                return null;
              }
            }}
          />
        </Dir>
      </ConfigFs>,
    );
    assertEquals(got, null);
    assert(ctx.didWarnOrError());

    assert(memFs.eq(MemoryFs.fromLiteral({
      foo: "dont_overwrite_me_pls",
    })));
  })();
});

Deno.test("Dir placid works", async () => {
  await (async () => {
    const memFs = new FilesystemExt(MemoryFs.fromLiteral({
      foo: {
        ohhi: "zzz",
      },
    }));

    const ctx = new Context();
    const got = await ctx.evaluate(
      <ConfigFs fs={memFs}>
        <Dir name="foo" mode="placid">
          <effect
            fun={(ctx) => {
              if (ctx.mustMakeProgress()) {
                return (
                  <>
                    <Dir name="bar">
                      <File name="baz">hi</File>
                    </Dir>
                    <File name="qux">ha</File>
                  </>
                );
              } else {
                return null;
              }
            }}
          />
        </Dir>
      </ConfigFs>,
    );
    assertEquals(got, "");
    assert(!ctx.didWarnOrError());

    assert(memFs.eq(MemoryFs.fromLiteral({
      foo: {
        bar: {
          baz: "hi",
        },
        qux: "ha",
        ohhi: "zzz",
      },
    })));
  })();
});

Deno.test("Dir assertive works", async () => {
  await (async () => {
    const memFs = new FilesystemExt(MemoryFs.fromLiteral({
      foo: {
        ohhi: "zzz",
      },
    }));

    const ctx = new Context();
    const got = await ctx.evaluate(
      <ConfigFs fs={memFs}>
        <Dir name="foo" mode="assertive">
          <effect
            fun={(ctx) => {
              if (ctx.mustMakeProgress()) {
                return (
                  <>
                    <Dir name="bar">
                      <File name="baz">hi</File>
                    </Dir>
                    <File name="qux">ha</File>
                  </>
                );
              } else {
                return null;
              }
            }}
          />
        </Dir>
      </ConfigFs>,
    );
    assertEquals(got, "");
    assert(!ctx.didWarnOrError());

    assert(memFs.eq(MemoryFs.fromLiteral({
      foo: {
        bar: {
          baz: "hi",
        },
        qux: "ha",
      },
    })));
  })();
});

Deno.test("File timid works", async () => {
  await (async () => {
    const memFs = new FilesystemExt(MemoryFs.fromLiteral({
      ohhi: "zzz",
    }));

    const ctx = new Context();
    const got = await ctx.evaluate(
      <ConfigFs fs={memFs}>
        <File name="ohhi" mode="timid">ha</File>
      </ConfigFs>,
    );
    assertEquals(got, null);
    assert(ctx.didWarnOrError());

    assert(memFs.eq(MemoryFs.fromLiteral({
      ohhi: "zzz",
    })));
  })();
});

Deno.test("File timid is default", async () => {
  await (async () => {
    const memFs = new FilesystemExt(MemoryFs.fromLiteral({
      ohhi: "zzz",
    }));

    const ctx = new Context();
    const got = await ctx.evaluate(
      <ConfigFs fs={memFs}>
        <File name="ohhi">ha</File>
      </ConfigFs>,
    );
    assertEquals(got, null);
    assert(ctx.didWarnOrError());

    assert(memFs.eq(MemoryFs.fromLiteral({
      ohhi: "zzz",
    })));
  })();
});

Deno.test("File placid works", async () => {
  await (async () => {
    const memFs = new FilesystemExt(MemoryFs.fromLiteral({
      ohhi: "zzz",
    }));

    const ctx = new Context();
    const got = await ctx.evaluate(
      <ConfigFs fs={memFs}>
        <File name="ohhi" mode="placid">ha</File>
      </ConfigFs>,
    );
    assertEquals(got, "");
    assert(!ctx.didWarnOrError());

    assert(memFs.eq(MemoryFs.fromLiteral({
      ohhi: "zzz",
    })));
  })();
});

Deno.test("File assertive works", async () => {
  await (async () => {
    const memFs = new FilesystemExt(MemoryFs.fromLiteral({
      ohhi: "zzz",
    }));

    const ctx = new Context();
    const got = await ctx.evaluate(
      <ConfigFs fs={memFs}>
        <File name="ohhi" mode="assertive">ha</File>
      </ConfigFs>,
    );
    assertEquals(got, "");
    assert(!ctx.didWarnOrError());

    assert(memFs.eq(MemoryFs.fromLiteral({
      ohhi: "ha",
    })));
  })();
});

Deno.test("File forwardContent works assertive", async () => {
  await (async () => {
    const memFs = new FilesystemExt(MemoryFs.fromLiteral({
      ohhi: "zzz",
    }));

    const ctx = new Context();
    const got = await ctx.evaluate(
      <ConfigFs fs={memFs}>
        <File name="ohhi" mode="assertive" forwardContent>ha</File>
      </ConfigFs>,
    );
    assertEquals(got, "ha");
    assert(!ctx.didWarnOrError());

    assert(memFs.eq(MemoryFs.fromLiteral({
      ohhi: "ha",
    })));
  })();
});

Deno.test("File forwardContent works placid", async () => {
  await (async () => {
    const memFs = new FilesystemExt(MemoryFs.fromLiteral({
      ohhi: "zzz",
    }));

    const ctx = new Context();
    const got = await ctx.evaluate(
      <ConfigFs fs={memFs}>
        <File name="ohhi" mode="placid" forwardContent>ha</File>
      </ConfigFs>,
    );
    assertEquals(got, "ha");
    assert(!ctx.didWarnOrError());

    assert(memFs.eq(MemoryFs.fromLiteral({
      ohhi: "zzz",
    })));
  })();
});

Deno.test("Dir evaluates to its children", async () => {
  await (async () => {
    const memFs = new FilesystemExt(MemoryFs.fromLiteral({
      ohhi: "zzz",
    }));

    const ctx = new Context();
    const got = await ctx.evaluate(
      <ConfigFs fs={memFs}>
        <Dir name="ohhi" mode="assertive">ha</Dir>
      </ConfigFs>,
    );
    assertEquals(got, "ha");
    assert(!ctx.didWarnOrError());

    assert(memFs.eq(MemoryFs.fromLiteral({
      ohhi: {},
    })));
  })();
});

Deno.test("Dir evaluates to its children even when placid", async () => {
  await (async () => {
    const memFs = new FilesystemExt(MemoryFs.fromLiteral({
      ohhi: {},
    }));

    const ctx = new Context();
    const got = await ctx.evaluate(
      <ConfigFs fs={memFs}>
        <Dir name="ohhi" mode="placid">ha</Dir>
      </ConfigFs>,
    );
    assertEquals(got, "ha");
    assert(!ctx.didWarnOrError());

    assert(memFs.eq(MemoryFs.fromLiteral({
      ohhi: {},
    })));
  })();
});