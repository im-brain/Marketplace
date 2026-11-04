"""Tests for listing_check.py.

Run from the repo folder with:
    python3 -m unittest discover scripts/tests
"""
import os
import subprocess
import sys
import unittest

# Let the tests find listing_check.py, which lives one folder up.
SCRIPTS_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, SCRIPTS_DIR)

import listing_check  # noqa: E402  (must come after the path line above)


def rules(text):
    """Return just the rule names found in the text, like ['em-dash']."""
    return [p.rule for p in listing_check.check_text(text)]


class DashTests(unittest.TestCase):
    def test_em_dash_flagged(self):
        problems = listing_check.check_text("Head down\u2014pockets full.")
        self.assertEqual([p.rule for p in problems], ["em-dash"])
        self.assertEqual((problems[0].line, problems[0].col), (1, 10))

    def test_en_dash_as_dash_flagged(self):
        self.assertEqual(rules("Wet it \u2013 then look."), ["en-dash"])

    def test_en_dash_in_number_range_ok(self):
        self.assertEqual(rules("Ships in 3\u20135 days."), [])

    def test_double_hyphen_flagged(self):
        self.assertEqual(rules("Wet it -- then look."), ["double-hyphen"])
        self.assertEqual(rules("Wet it--then look."), ["double-hyphen"])

    def test_plain_hyphen_ok(self):
        self.assertEqual(rules("A wipe-clean, UV-glowing tee."), [])

    def test_line_numbers(self):
        problems = listing_check.check_text("Fine line.\nBad\u2014line.")
        self.assertEqual((problems[0].line, problems[0].col), (2, 4))


class OxfordCommaTests(unittest.TestCase):
    def test_missing_comma_and(self):
        self.assertEqual(rules("Found in Michigan, Wisconsin and Minnesota."), ["oxford-comma"])

    def test_missing_comma_or(self):
        self.assertEqual(rules("Pick red, blue or green."), ["oxford-comma"])

    def test_longer_list(self):
        self.assertEqual(rules("Agates, jasper, chert and basalt."), ["oxford-comma"])

    def test_message_explains_fix(self):
        msg = listing_check.check_text("Soft, light and comfy.")[0].message
        self.assertIn("light, and comfy", msg)

    def test_with_oxford_comma_ok(self):
        self.assertEqual(rules("Found in Michigan, Wisconsin, and Minnesota."), [])
        self.assertEqual(rules("Pick red, blue, or green."), [])

    def test_two_items_ok(self):
        self.assertEqual(rules("Agates and jasper."), [])

    def test_intro_phrase_not_a_list(self):
        self.assertEqual(rules("On the shore, rocks and gulls."), [])
        self.assertEqual(rules("When it rains, agates and jasper shine."), [])

    def test_clause_not_a_list(self):
        self.assertEqual(rules("We ship fast, so order now and smile."), [])
        self.assertEqual(rules("Rinse it, then look and see."), [])
        self.assertEqual(rules("Wet the stone, and you will see the bands."), [])
        self.assertEqual(rules("Rinse it, wait a second and you will see."), [])

    def test_lists_in_separate_sentences_ok(self):
        self.assertEqual(rules("Wash cold. Dry low and enjoy."), [])


class ClaimTests(unittest.TestCase):
    def test_each_claim_flagged(self):
        samples = [
            "A genuine find.", "Authentic design.", "Printed with real agate colors.",
            "Certified soft.", "Guaranteed to fit.", "Organic cotton.",
            "Eco-friendly ink.", "Sustainable choice.", "Made in USA.",
            "Made in the U.S.A.", "Yooperlite glow.", "Yooperlites!",
            "Rocks cure boredom.", "Healing stones.", "Metaphysical vibes.",
            "The best tee.", "#1 rock shirt.",
        ]
        for text in samples:
            with self.subTest(text=text):
                self.assertEqual(rules(text), ["claim"])

    def test_claim_column(self):
        p = listing_check.check_text("Soft tee. Organic cotton.")[0]
        self.assertEqual((p.line, p.col), (1, 11))

    def test_no_false_claims_inside_words(self):
        # "secure" contains "cure", "bestow" contains "best". Neither is a claim.
        self.assertEqual(rules("A secure fit to bestow on friends."), [])

    def test_suggests_sodalite(self):
        msg = listing_check.check_text("Yooperlite tee.")[0].message
        self.assertIn("UV-glowing sodalite", msg)


class CleanListingTests(unittest.TestCase):
    def test_clean_listing_passes(self):
        text = ("Agate Expectations tee.\n"
                "Soft cotton blend, printed on demand in the USA by our print partner.\n"
                "Great for beach walks, lake days, and long drives up north.\n")
        self.assertEqual(listing_check.check_text(text), [])


class CommandLineTests(unittest.TestCase):
    script = os.path.join(SCRIPTS_DIR, "listing_check.py")

    def run_script(self, text):
        return subprocess.run([sys.executable, self.script], input=text,
                              capture_output=True, text=True)

    def test_exit_zero_when_clean(self):
        result = self.run_script("Head down. Pockets full.")
        self.assertEqual(result.returncode, 0)
        self.assertIn("OK", result.stdout)

    def test_exit_one_with_problems(self):
        result = self.run_script("Head down\u2014pockets full.")
        self.assertEqual(result.returncode, 1)
        self.assertIn("stdin:1:10", result.stdout)

    def test_exit_two_for_missing_file(self):
        result = subprocess.run([sys.executable, self.script, "no_such_file.txt"],
                                capture_output=True, text=True)
        self.assertEqual(result.returncode, 2)


if __name__ == "__main__":
    unittest.main()
