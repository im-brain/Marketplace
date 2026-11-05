"""Tests for sock_petoskey.py (skipped if numpy, scipy, or pillow is missing)."""
import os
import sys
import unittest
from unittest import mock

SCRIPTS_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, SCRIPTS_DIR)

try:
    import sock_petoskey  # noqa: E402
except ImportError:
    sock_petoskey = None


@unittest.skipIf(sock_petoskey is None, "needs numpy, scipy, and pillow")
class SeamTests(unittest.TestCase):
    def test_wrapped_copies_share_one_seed(self):
        # A cell that crosses the edge is painted more than once (shifted by
        # the tile size). Every copy must get the same random lines and eye,
        # or the pattern will not line up where the sock print repeats.
        seen = {}
        real_paint = sock_petoskey.paint_cell

        def recorder(draw, poly, colors, rng, scale):
            first = rng.random()
            key = tuple(round(v, 3) for v in poly.mean(axis=0) % 400)
            seen.setdefault(key, set()).add(first)

        with mock.patch.object(sock_petoskey, "paint_cell", recorder):
            sock_petoskey.render(200, 200, 60, 3, "natural", supersample=2)
        self.assertTrue(any(True for _ in seen))
        for key, firsts in seen.items():
            self.assertEqual(len(firsts), 1, "copies of cell at %s got different seeds" % (key,))
        self.assertIsNotNone(real_paint)


if __name__ == "__main__":
    unittest.main()
