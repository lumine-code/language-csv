const path = require("path");

// The fixtures beside this file are plain samples of the two formats — the
// files to open when you want to look at the highlighting rather than assert on
// it. This spec is only what stops them quietly rotting: each grammar still
// claims its file, and each sample still parses.

describe("CSV and TSV sample fixtures", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-csv");
  });

  for (const [file, scopeName] of [
    ["sample.csv", "source.csv"],
    ["sample.tsv", "source.tsv"],
  ]) {
    it(`parses ${file} without error`, async () => {
      const editor = await lumine.workspace.open(path.join(__dirname, "fixtures", file));
      const languageMode = editor.getBuffer().getLanguageMode();
      await languageMode.ready;

      expect(editor.getGrammar().scopeName).toBe(scopeName);
      expect((await editor.getSyntaxDiagnostics()).hasError).toBe(false);
    });
  }
});
