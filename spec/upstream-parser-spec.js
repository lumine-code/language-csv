describe("CSV and TSV text cells", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-csv");
    editor = await lumine.workspace.open();
  });

  afterEach(() => editor?.destroy());

  for (const [scope, separator] of [
    ["source.csv", ","],
    ["source.tsv", "\t"],
  ]) {
    it(`keeps digit-leading and one-character cells in ${scope}`, async () => {
      editor.setGrammar(lumine.grammars.grammarForScopeName(scope));
      editor.setText(`123abc${separator}x${separator}last\n`);
      await editor.languageMode.ready;
      const root = editor.languageMode.tree.rootNode;
      expect(root.hasError).toBe(false);
      expect(root.descendantsOfType("field").map((node) => node.text)).toEqual([
        "123abc",
        "x",
        "last",
      ]);
    });
  }
});
