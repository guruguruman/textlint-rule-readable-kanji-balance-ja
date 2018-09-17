"use strict";

import {RuleHelper} from "textlint-rule-helper";
import {splitAST, Syntax as SentenceSyntax} from "sentence-splitter";
import StringSource from "textlint-util-to-string";

const toBeExcludedSymbolRegExp = /[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~\s]|[\r\n|\n|\r]/g
const kanjiRegExp = /[々〇〻\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]/g
const defaultOptions = {
    skip_length: 20,
    report_kanji_balance: 45,
    prefer_kanji_balance: 30,
};

module.exports = function(context, options = {}) {
  const skippableSentenceLength = options.skip_length || defaultOptions.skip_length;
  const kanjiBalanceToBeReported = options.report_kanji_balance || defaultOptions.report_kanji_balance;
  const kanjiPreferBalance = options.prefer_kanji_balance || defaultOptions.prefer_kanji_balance;

  const {Syntax, RuleError, report, fixer, getSource} = context;
  const helper = new RuleHelper(context);

  return {
    [Syntax.Paragraph](node) {
      if (helper.isChildNode(node, [Syntax.BlockQuote])) {
        return;
      }

      const isChildrenSingleLinkNode = node.children.length === 1 && node.children[0].type === Syntax.Link;
      if (isChildrenSingleLinkNode) {
          return;
      }

      const paragraph = splitAST(node);
      paragraph.children.filter(sentence => sentence.type === SentenceSyntax.Sentence).forEach(sentence => {
        const source = new StringSource(sentence);
        const sentenceText = source.toString();

        if (sentenceText.length < skippableSentenceLength) {
          return;
        }

        const symbolExcludedText = sentenceText.replace(toBeExcludedSymbolRegExp, '');
        const kanjiExcludedText = symbolExcludedText.replace(kanjiRegExp, '');

        const symbolExcludedTextLength = symbolExcludedText.length;
        const kanjiExcludedTextLength = kanjiExcludedText.length;

        const kanjiPercentage = Math.round(((symbolExcludedTextLength - kanjiExcludedTextLength) / symbolExcludedTextLength) * 100);

        if (kanjiPercentage < kanjiBalanceToBeReported) {
          return;
        }

        const message = `漢字出現比率の高い1文が見つかりました（漢字出現率： ${kanjiPercentage}%）。漢字比率が高い文は、読者に読みにくい印象を与えると言われています。漢字の出現率の目安を「${kanjiPreferBalance}%前後」として、表現を改定してみましょう。`;
        const ruleError = new RuleError(message, {});

        report(sentence, ruleError);
      });
    }
  };
};
