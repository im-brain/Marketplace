"""Check product listing text before it goes in the store.

Usage:
    python3 scripts/listing_check.py listing.txt
    cat listing.txt | python3 scripts/listing_check.py

What it looks for:
  1. Dashes Brian never uses: em dashes (and look-alikes such as the
     horizontal bar), en dashes used as dashes, "--", a lone hyphen with
     spaces around it (" - "), and HTML codes like "&mdash;" (Printify
     descriptions are HTML, so "&mdash;" shows up as a real em dash).
  2. A missing Oxford comma, like "red, white and blue" (should be
     "red, white, and blue"). This is a guess based on patterns, so it
     explains each match. It tries hard not to cry wolf.
  3. Risky claims a print-on-demand store can't back up, like "genuine",
     "made in USA", or "healing".

Exit code: 0 means the text is clean. 1 means at least one problem was
found (so other scripts, like publish_design.py, can refuse to continue).
2 means the file could not be read.

Only the Python standard library is used, so there is nothing to install.
"""
import re
import sys
from collections import namedtuple

# One problem found in the text. line and col start at 1, like an editor.
Problem = namedtuple("Problem", "line col rule message")

EM_DASH = "\u2014"
EN_DASH = "\u2013"
# Characters that look like an em dash: figure dash, horizontal bar, two- and
# three-em dashes, and the small or vertical em dash forms.
EM_LOOKALIKES = "\u2012\u2015\u2e3a\u2e3b\ufe58\ufe31\ufe32"
# HTML codes that a web page or Printify turns into an em or en dash.
DASH_ENTITY = re.compile(r"&(mdash|ndash|horbar);|&#(8212|8211|8213);|&#x(2014|2013|2015);",
                         re.IGNORECASE)

# Risky words and phrases. Each entry is (pattern, reason shown to Brian).
# The patterns ignore upper and lower case. \b means "word edge", so
# "cure" does not match inside "secure".
CLAIMS = [
    (r"\bgenuine\b", "Sounds like a guarantee about the stone or product. Can we prove it?"),
    (r"\bauthentic\b", "Sounds like a guarantee about the stone or product. Can we prove it?"),
    (r"\breal agates?\b", "The shirt is a print, not a real agate. Reword so no one expects a stone."),
    (r"\bcertified\b", "Certified by whom? Only use with a real certificate."),
    (r"\bguarantee[sd]?\b", "A guarantee is a promise we must honor. Check the return policy first."),
    (r"\borganic\b", "Blanks vary by print provider. Only say organic if the exact blank is certified."),
    (r"\beco[- ]?friendly\b", "Green claims need proof (FTC Green Guides)."),
    (r"\bsustainabl[ey]\b", "Green claims need proof (FTC Green Guides)."),
    (r"\bmade in (the )?(usa|u\.s\.a\.|us|u\.s\.|america)\b",
     "Print on demand can't guarantee US-made blanks. Say 'printed in the USA' only if the provider confirms."),
    (r"\byooperlites?\b", "Trademark history (cancelled 2025, owner may refile). Say 'UV-glowing sodalite' instead."),
    (r"\bcur(e|es|ed|ing)\b", "Health claim. Never say a rock or shirt cures anything."),
    (r"\bheal(ing|s)?\b", "Health claim. Rocks are fun, not medicine."),
    (r"\bmetaphysical\b", "Health or spiritual claim. Keep listings about geology and fun."),
    (r"\bbest\b", "'Best' is a superlative claim. Say what makes it good instead."),
    (r"#1\b", "'#1' is a ranking claim we can't back up."),
]

# Words that often start an opening phrase, like "On the beach, rocks and
# gulls". If the text before the first comma starts with one of these,
# the comma is probably not part of a list, so we skip it.
INTRO_WORDS = {
    "after", "although", "as", "at", "because", "before", "but", "by", "for",
    "from", "here", "however", "if", "in", "now", "of", "ok", "okay", "on",
    "once", "since", "so", "still", "then", "today", "though", "unless",
    "until", "well", "when", "where", "while", "with", "yes", "no", "also",
    "honestly", "plus", "sure", "yet", "dear", "hi", "hey",
}

# Words that start a new clause rather than a list item. If the piece just
# before "and" starts with one of these ("..., so grab one and go"), or the
# word just after "and" is one of these ("..., rinse it and you'll see"),
# it is probably not a list.
CLAUSE_WORDS = {
    "so", "but", "which", "who", "whom", "that", "then", "because", "if",
    "when", "while", "i", "you", "we", "they", "he", "she", "it", "there",
    "this", "these", "those", "your", "our", "my",
}

# How many words one list item may have. Long pieces are usually clauses.
MAX_ITEM_WORDS = 4


def check_dashes(line, line_no):
    """Find em dashes (and look-alikes), en dashes used as dashes, and double hyphens."""
    problems = []
    for m in re.finditer("[" + EM_DASH + EM_LOOKALIKES + "]", line):
        problems.append(Problem(line_no, m.start() + 1, "em-dash",
                                "Em dash found. Use a comma, period, colon, or parentheses."))
    for m in DASH_ENTITY.finditer(line):
        problems.append(Problem(line_no, m.start() + 1, "em-dash",
                                "HTML dash code '%s' shows as a dash. Use a comma, period, or colon."
                                % m.group()))
    for m in re.finditer(EN_DASH, line):
        before = line[m.start() - 1] if m.start() > 0 else ""
        after = line[m.end()] if m.end() < len(line) else ""
        # An en dash between two numbers is a range, like "3\u20135". That is fine.
        if before.isdigit() and after.isdigit():
            continue
        problems.append(Problem(line_no, m.start() + 1, "en-dash",
                                "En dash used as a dash. Use a comma, period, or colon."))
    # Any run of two or more hyphens, like "wet it--then" or "wet it --then".
    for m in re.finditer(r"-{2,}", line):
        problems.append(Problem(line_no, m.start() + 1, "double-hyphen",
                                "'--' used as a dash. Use a comma, period, or colon."))
    # A lone hyphen with spaces on both sides, like "Test - delete me". That is
    # a dash in disguise. "3 - 5" (between numbers) is left alone, like en dashes.
    # A hyphen at the very start of a line (a bullet point) is also fine.
    for m in re.finditer(r"(?<=(\S))\s+-\s+(?=(\S))", line):
        if m.group(1).isdigit() and m.group(2).isdigit():
            continue
        col = line.index("-", m.start()) + 1
        problems.append(Problem(line_no, col, "spaced-hyphen",
                                "' - ' used as a dash. Use a comma, period, or colon."))
    return problems


def words(text):
    """Split text into lowercase words (letters, digits, apostrophes, hyphens)."""
    return re.findall(r"[A-Za-z0-9'’-]+", text.lower())


def check_oxford_comma(line, line_no):
    """Guess where a list of 3 or more items is missing its last comma.

    How it works, in plain terms:
      - Split the line into sentences (at . ! ? ; and :).
      - Split each sentence at commas into pieces.
      - Look for a piece (not the first one) shaped like "B and C" or
        "B or C" with no comma before the "and". That is the end of a list
        like "A, B and C".
      - Skip it if the pieces look like clauses instead of list items
        (too long, or starting with words like "so", "you", or "when").
    """
    problems = []
    # Each sentence keeps its starting position so we can report a column.
    for sent in re.finditer(r"[^.!?;:]+", line):
        pieces = sent.group().split(",")
        offset = sent.start()  # where the current piece starts in the line
        starts = []
        for piece in pieces:
            starts.append(offset)
            offset += len(piece) + 1  # +1 for the comma we split on
        for i in range(1, len(pieces)):
            piece = pieces[i]
            # IGNORECASE so Title Case product names ("Red, White And Blue") count.
            # "&" counts too: "Michigan, Wisconsin & Minnesota" still needs the comma.
            m = re.match(r"^\s*(?P<b>[^,]+?)\s+(?P<conj>and|or|&)\s+(?P<c>\S+)", piece,
                         flags=re.IGNORECASE)
            if not m:
                continue
            item_b = words(m.group("b"))
            item_c = words(m.group("c"))
            if not item_b or not item_c or len(item_b) > MAX_ITEM_WORDS:
                continue
            # Drop a contraction ending so "you'll" or "it's" counts as "you" or "it".
            first_c = re.split(r"['\u2019]", item_c[0])[0]
            if item_b[0] in CLAUSE_WORDS or first_c in CLAUSE_WORDS:
                continue
            if i == 1:
                # Only one piece before this one, so it is either list item A
                # or an opening phrase like "On the shore". Skip opening phrases.
                first = words(pieces[0])
                if not first or first[0] in INTRO_WORDS:
                    continue
            prev = pieces[i - 1].split()
            if not prev:
                continue  # an empty piece, like ",," so not a real list
            col = starts[i] + m.start("conj") + 1
            a, b, conj, c = prev[-1], m.group("b").strip(), m.group("conj"), m.group("c")
            snippet = "%s, %s %s %s" % (a, b, conj, c)
            fixed = "%s, %s, %s %s" % (a, b, conj, c)
            problems.append(Problem(
                line_no, col, "oxford-comma",
                "Possible missing Oxford comma: '...%s' looks like a list of 3 or more. "
                "Try '...%s'. If it is not a list, ignore this." % (snippet, fixed)))
    return problems


def check_claims(line, line_no):
    """Find risky marketing or health claims."""
    problems = []
    for pattern, reason in CLAIMS:
        for m in re.finditer(pattern, line, flags=re.IGNORECASE):
            problems.append(Problem(line_no, m.start() + 1, "claim",
                                    "Flagged claim '%s': %s" % (m.group(), reason)))
    return problems


def check_text(text):
    """Run every check on the text. Returns a list of Problems, sorted by position."""
    problems = []
    for line_no, line in enumerate(text.splitlines(), start=1):
        problems += check_dashes(line, line_no)
        problems += check_oxford_comma(line, line_no)
        problems += check_claims(line, line_no)
    return sorted(problems, key=lambda p: (p.line, p.col))


def format_problem(p, source="text"):
    """Turn a Problem into one readable line, like an editor error message."""
    kind = "WARNING" if p.rule == "claim" else "ERROR"
    return "%s:%d:%d: %s [%s] %s" % (source, p.line, p.col, kind, p.rule, p.message)


def main(argv):
    if len(argv) > 1 and argv[1] not in ("-", "--help", "-h"):
        source = argv[1]
        try:
            with open(source, encoding="utf-8") as f:
                text = f.read()
        except OSError as e:
            print("Could not read %s: %s" % (source, e), file=sys.stderr)
            return 2
    elif len(argv) > 1 and argv[1] in ("--help", "-h"):
        print(__doc__)
        return 0
    else:
        source = "stdin"
        text = sys.stdin.read()

    problems = check_text(text)
    for p in problems:
        print(format_problem(p, source))
    if problems:
        print("%d problem(s) found. Fix them, or reword, then run again." % len(problems))
        return 1
    print("OK: no problems found.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
