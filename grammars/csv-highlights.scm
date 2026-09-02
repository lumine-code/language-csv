; A CSV field is text, not a quoted string: it carries no delimiters of its own
; and nothing escapes inside it, so `string.unquoted` describes it where
; upstream's `@string` would have become `string.quoted.double`.
(text) @string.unquoted.csv

(number) @constant.numeric.csv
(float) @constant.numeric.float.csv
(boolean) @constant.language.boolean.csv

"," @punctuation.separator.comma.csv
