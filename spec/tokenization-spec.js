// CSV and TSV have no comment syntax, so the fixture format used by the other
// grammar packages — which finds its assertions in comments — cannot express
// anything here. Scopes are asserted directly instead.

async function scopesAt(text, grammarScope, position) {
  const editor = await lumine.workspace.open();
  lumine.grammars.assignGrammar(
    editor.getBuffer(),
    lumine.grammars.grammarForScopeName(grammarScope),
  );
  editor.setText(text);
  await editor.getBuffer().getLanguageMode().ready;
  return editor.scopeDescriptorForBufferPosition(position).getScopesArray();
}

describe("CSV and TSV grammars", () => {
  beforeEach(async () => {
    jasmine.useRealClock();
    await lumine.packages.activatePackage("language-csv");
  });

  it("selects a grammar by file extension", () => {
    expect(lumine.grammars.selectGrammar("data.csv", "").scopeName).toBe("source.csv");
    expect(lumine.grammars.selectGrammar("data.tsv", "").scopeName).toBe("source.tsv");
  });

  describe("CSV", () => {
    const sample = "name,count,ratio,active\nwidget,12,3.5,true\n";

    it("scopes a field as unquoted text", async () => {
      expect(await scopesAt(sample, "source.csv", [0, 0])).toContain("string.unquoted.csv");
    });

    it("separates an integer from a float", async () => {
      expect(await scopesAt(sample, "source.csv", [1, 7])).toContain("constant.numeric.csv");
      expect(await scopesAt(sample, "source.csv", [1, 10])).toContain("constant.numeric.float.csv");
    });

    it("scopes a boolean", async () => {
      expect(await scopesAt(sample, "source.csv", [1, 14])).toContain(
        "constant.language.boolean.csv",
      );
    });

    it("scopes the comma as a separator", async () => {
      expect(await scopesAt(sample, "source.csv", [0, 4])).toContain(
        "punctuation.separator.comma.csv",
      );
    });
  });

  describe("TSV", () => {
    const sample = "name\tcount\nwidget\t12\n";

    it("scopes a field and a number", async () => {
      expect(await scopesAt(sample, "source.tsv", [0, 0])).toContain("string.unquoted.tsv");
      expect(await scopesAt(sample, "source.tsv", [1, 7])).toContain("constant.numeric.tsv");
    });
  });
});
