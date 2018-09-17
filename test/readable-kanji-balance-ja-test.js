"use strict";
const TextLintTester = require("textlint-tester");
const tester = new TextLintTester();

// rule
const rule = require("../src/readable-kanji-balance-ja");

// ruleName, rule, { valid, invalid }
tester.run("rule", rule, {
  valid: [
    // no problem
    "漢字があまりにも多く含まれている場合、読者が読みづらいと感じると言われています。",
    "漢字出現過多による可読率低下。",
  ],
  invalid: [
    // single match.
    {
      text: "漢字が余りにも多い事が文の可読性低下を誘引する。",
      errors: [{
        message: "漢字出現比率の高い1文が見つかりました（漢字出現率： 54%）。漢字比率が高い文は、読者に読みにくい印象を与えると言われています。漢字の出現率の目安を「30%前後」として、表現を改定してみましょう。",
        line: 1,
        column: 1
      }]
    },
    // multiple match
    {
      text: `漢字が余りにも多い事が文の可読性低下を誘引する。

但し漢字の出現は必然である為、程々に使用すべき`,
      errors: [{
          message: "漢字出現比率の高い1文が見つかりました（漢字出現率： 54%）。漢字比率が高い文は、読者に読みにくい印象を与えると言われています。漢字の出現率の目安を「30%前後」として、表現を改定してみましょう。",
          line: 1,
        },
        {
          message: "漢字出現比率の高い1文が見つかりました（漢字出現率： 52%）。漢字比率が高い文は、読者に読みにくい印象を与えると言われています。漢字の出現率の目安を「30%前後」として、表現を改定してみましょう。",
          line: 3,
        }
      ]
    },

  ]
});
