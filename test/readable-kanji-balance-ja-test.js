"use strict";
const TextLintTester = require("textlint-tester");
const tester = new TextLintTester();

// rule
const rule = require("../src/readable-kanji-balance-ja");

// ruleName, rule, { valid, invalid }
tester.run("rule", rule, {
  valid: [
    // no problem
    "漢字があまりに多いと読みづらくなる傾向があると言われています。",
    "可読率低下。",
  ],
  invalid: [
    // single match.
    {
      text: "漢字が余りにも多いと可読率低下を招く。",
      errors: [{
        message: "1文における漢字比率が「53%」と多くの漢字が含まれています。（目標比率: 40%）漢字が多すぎる場合、読みにくさにつながることがあります。",
        line: 1,
        column: 1
      }]
    },
    // multiple match
    {
      text: `漢字が余りにも多いと可読率低下を招く。

但し漢字は優秀な表現。`,
      errors: [{
          message: "1文における漢字比率が「53%」と多くの漢字が含まれています。（目標比率: 40%）漢字が多すぎる場合、読みにくさにつながることがあります。",
          line: 1,
        },
        {
          message: "1文における漢字比率が「64%」と多くの漢字が含まれています。（目標比率: 40%）漢字が多すぎる場合、読みにくさにつながることがあります。",
          line: 3,
        }
      ]
    },

  ]
});
