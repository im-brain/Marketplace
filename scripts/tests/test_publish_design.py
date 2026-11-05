"""Tests for publish_design.py. None of these talk to Printify.

Every test replaces call_api with a fake, so nothing is created, changed,
or deleted. Run from the repo folder with:
    python3 -m unittest discover scripts/tests
"""
import io
import json
import os
import sys
import tempfile
import unittest
from unittest import mock

SCRIPTS_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, SCRIPTS_DIR)

import publish_design  # noqa: E402

GOOD_ID = "5d39b411749d0a000f30e0f4"


class FakeApi:
    """Stands in for call_api and remembers every call."""

    def __init__(self, replies=None):
        self.calls = []
        self.replies = replies or {}

    def __call__(self, method, path, body=None):
        self.calls.append((method, path))
        return self.replies.get(method, {})


def run_main(argv, api, stdin=""):
    with mock.patch.object(publish_design, "call_api", api), \
            mock.patch.object(sys, "argv", ["publish_design.py"] + argv), \
            mock.patch.object(sys, "stdin", io.StringIO(stdin)), \
            mock.patch("sys.stdout", new_callable=io.StringIO):
        publish_design.main()


class DeleteSafetyTests(unittest.TestCase):
    def test_bad_id_never_calls_printify(self):
        api = FakeApi()
        with self.assertRaises(SystemExit):
            run_main(["--delete", "../../shops"], api)
        self.assertEqual(api.calls, [])

    def test_dry_run_delete_only_reads(self):
        api = FakeApi({"GET": {"title": "TEST DRAFT"}})
        run_main(["--delete", GOOD_ID, "--dry-run"], api)
        self.assertEqual([m for m, _ in api.calls], ["GET"])

    def test_no_keyboard_means_no_delete(self):
        api = FakeApi({"GET": {"title": "TEST DRAFT"}})
        with self.assertRaises(SystemExit):
            run_main(["--delete", GOOD_ID], api, stdin="")  # empty stdin: EOF
        self.assertNotIn("DELETE", [m for m, _ in api.calls])

    def test_typed_yes_deletes(self):
        api = FakeApi({"GET": {"title": "TEST DRAFT"}})
        run_main(["--delete", GOOD_ID], api, stdin="yes\n")
        self.assertEqual([m for m, _ in api.calls], ["GET", "DELETE"])

    def test_design_and_delete_together_refused(self):
        api = FakeApi()
        with self.assertRaises(SystemExit):
            run_main(["scripts/examples/test_tee.json", "--delete", GOOD_ID], api)
        self.assertEqual(api.calls, [])

    def test_dry_run_archive_sends_nothing(self):
        api = FakeApi()
        run_main(["--archive-upload", GOOD_ID, "--dry-run"], api)
        self.assertEqual(api.calls, [])


class DesignFileTests(unittest.TestCase):
    def write_design(self, **changes):
        design = {"title": "Agate Expectations", "description": "Soft tee.",
                  "blueprint_id": 12, "print_provider_id": 29, "variants": [18540],
                  "price": 27.99, "image": "art.png", "position": "front"}
        design.update(changes)
        folder = tempfile.mkdtemp()
        open(os.path.join(folder, "art.png"), "wb").close()
        path = os.path.join(folder, "d.json")
        with open(path, "w") as f:
            json.dump(design, f)
        return path

    def test_good_file_loads(self):
        self.assertEqual(publish_design.load_design(self.write_design())["price"], 27.99)

    def test_bad_values_rejected(self):
        for changes in ({"price": 2799}, {"price": "cheap"}, {"price": 0},
                        {"blueprint_id": "12"}, {"variants": "All"}, {"variants": ["18540"]}):
            with self.subTest(changes=changes):
                with self.assertRaises(SystemExit):
                    publish_design.load_design(self.write_design(**changes))

    def test_example_title_passes_listing_check(self):
        path = os.path.join(SCRIPTS_DIR, "examples", "test_tee.json")
        with mock.patch("sys.stdout", new_callable=io.StringIO):
            publish_design.check_listing(publish_design.load_design(path))


class PayloadTests(unittest.TestCase):
    def test_payload_shape(self):
        design = {"title": "T", "description": "D", "blueprint_id": 12,
                  "print_provider_id": 29, "price": 27.99, "position": "front"}
        p = publish_design.build_product(design, [1, 2], "img")
        self.assertEqual(p["variants"][0], {"id": 1, "price": 2799, "is_enabled": True})
        self.assertEqual(p["print_areas"][0]["variant_ids"], [1, 2])
        self.assertEqual(p["print_areas"][0]["placeholders"][0]["images"][0]["id"], "img")

    def test_no_authorization_header(self):
        seen = {}

        def fake_urlopen(req, timeout):
            seen.update({k.lower(): v for k, v in req.header_items()})
            raise publish_design.urllib.error.URLError("offline test")

        with mock.patch.object(publish_design.urllib.request, "urlopen", fake_urlopen):
            with self.assertRaises(SystemExit):
                publish_design.call_api("GET", "/shops.json")
        self.assertNotIn("authorization", seen)


if __name__ == "__main__":
    unittest.main()
