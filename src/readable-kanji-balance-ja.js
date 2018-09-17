"use strict";

import {RuleHelper} from "textlint-rule-helper";
import {getTokenizer} from "kuromojin";
import {splitAST, Syntax as SentenceSyntax} from "sentence-splitter";
import Source from "structured-source";
import StringSource from "textlint-util-to-string";

const toBeExcludedSymbolRegExp = /[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~\s]|[\r\n|\n|\r]/g
const kanjiRegExp = /[々〇〻\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]/g

module.exports = function reporter(context) {
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

        const skippableSentenceLength = 10;
        const kanjiBetterBalanceInPercentage = 45;

        if (sentenceText.length < skippableSentenceLength) {
          return;
        }

        const symbolExcludedText = sentenceText.replace(toBeExcludedSymbolRegExp, '');
        const kanjiExcludedText = symbolExcludedText.replace(kanjiRegExp, '');

        const symbolExcludedTextLength = symbolExcludedText.length;
        const kanjiExcludedTextLength = kanjiExcludedText.length;

        const kanjiPercentage = Math.round(((symbolExcludedTextLength - kanjiExcludedTextLength) / symbolExcludedTextLength) * 100);

        if (kanjiPercentage < kanjiBetterBalanceInPercentage) {
          return;
        }

        const message = `1文における漢字比率が「${kanjiPercentage}%」と多くの漢字が含まれています。漢字比率の目安は30%前後です。漢字が多すぎる場合、読みにくさにつながることがあります。`;
        const ruleError = new RuleError(message, {});

        report(sentence, ruleError);
      });
    }
  };
};
