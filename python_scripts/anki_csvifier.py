import re

regexes = [
    ["\"", "'"],  # translate all double-quote to single-quote
    ["	\n", "\"\n\""],  # add line-final and line-initial double-quotes
    ["	$", '"'],  # add file-final double-quote
    ["	\S+?	", "\",\""],  # remove duplicate ZH field
    ["	", "\",\""],  # complete double-quoting
    ["''", "'"],  # remove duplicate single-quotes
]

with open("../../All Decks.txt", 'r') as og_deck_file:
    deck_data = og_deck_file.read()
    for pattern, replacement in regexes:
        p = re.compile(pattern)
        deck_data = p.sub(replacement, deck_data)
    with open("../../csvified_decks.csv", 'wt') as new_deck_file:
        new_deck_file.write(deck_data)