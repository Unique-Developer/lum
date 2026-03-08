"""Set B2 CORS rules. Run: python set-b2-cors.py"""
import subprocess
import sys

with open("b2-cors-oneline.json", encoding="utf-8") as f:
    cors = f.read().strip()

result = subprocess.run(
    ["b2", "bucket", "update", "--cors-rules", cors, "luminart-app", "allPublic"],
    check=False,
)
sys.exit(result.returncode)
