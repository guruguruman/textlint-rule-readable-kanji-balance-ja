# textlint-rule-readable-kanji-balance-ja

## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint-rule-readable-kanji-balance-ja

Or install with yarn:

    yarn add textlint-rule-readable-kanji-balance-ja

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "rule-readable-kanji-balance-ja": true
    }
}
```

Via CLI

```
textlint --rule readable-kanji-balance-ja README.md
```

### Build

Builds source codes for publish to the `lib` folder.
You can write ES2015+ source codes in `src/` folder.

    npm run build

### Tests

Run test code in `test` folder.
Test textlint rule by [textlint-tester](https://github.com/textlint/textlint-tester "textlint-tester").

    npm test

## License

ISC © Tomoyuki Kato
