describe("language-csv editing defaults", () => {
  let editor;
  beforeEach(async () => {
    jasmine.useRealClock();
    await lumine.packages.activatePackage("language-source");
    await lumine.packages.activatePackage("language-csv");

    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.csv"));
    editor.setText("name,value");
    await editor.whenGrammarSettled();
  });
  afterEach(() => editor?.destroy());

  it("uses the correct comment operation in source.csv", async () => {
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.csv"));
    editor.setText("name,value");
    await editor.whenGrammarSettled();
    await editor.toggleLineCommentsForBufferRows(0, editor.getLastBufferRow());
    await editor.whenGrammarSettled();
    expect(editor.getText()).toBe("name,value");
  });

  it("uses the correct comment operation in source.tsv", async () => {
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.tsv"));
    editor.setText("name\tvalue");
    await editor.whenGrammarSettled();
    await editor.toggleLineCommentsForBufferRows(0, editor.getLastBufferRow());
    await editor.whenGrammarSettled();
    expect(editor.getText()).toBe("name\tvalue");
  });

  it("exposes no inherited C-style delimiters and respects an explicit user override", async () => {
    const before = await editor.getCommentDelimitersForBufferPosition([0, 0]);
    expect(before?.line).toBeUndefined();
    expect(before?.block).toBeUndefined();
    const options = { scopeSelector: ".source.csv" };
    try {
      lumine.config.set("editor.commentStart", "// ", options);
      lumine.config.set("editor.commentEnd", "", options);
      lumine.config.set("editor.commentDelimiters", { line: "//" }, options);
      await editor.toggleLineCommentsForBufferRows(0, 0);
      await editor.whenGrammarSettled();
      expect(editor.lineTextForBufferRow(0)).toBe("// " + "name,value");
    } finally {
      for (const key of ["commentStart", "commentEnd", "commentDelimiters"])
        lumine.config.unset("editor." + key, options);
    }
  });
});
