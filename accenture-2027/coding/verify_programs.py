"""Compile and run every Java and Python solution in coding_problems.py on its test cases.

Usage: python3 verify_programs.py <workdir>
"""
import os
import subprocess
import sys

from coding_problems import P


def run(cmd, stdin, cwd):
    r = subprocess.run(cmd, input=stdin, capture_output=True, text=True, cwd=cwd, timeout=60)
    if r.returncode != 0:
        raise RuntimeError(r.stderr[-400:])
    return r.stdout.strip()


def verify(work):
    bad = 0
    for p in P:
        d = os.path.join(work, p["id"])
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, "Main.java"), "w").write(p["java"])
        open(os.path.join(d, "sol.py"), "w").write(p["py"])
        subprocess.run(["javac", "Main.java"], cwd=d, check=True, capture_output=True)
        for stdin, exp in p["tests"]:
            for lang, cmd in (("java", ["java", "-cp", ".", "Main"]), ("py", [sys.executable, "sol.py"])):
                try:
                    got = run(cmd, stdin, d)
                except Exception as e:  # noqa: BLE001
                    got = "ERROR " + str(e)
                if got != exp:
                    bad += 1
                    print(f"MISMATCH {p['id']} {lang} input={stdin!r}\n  got={got[:200]!r}\n  exp={exp!r}")
        print(f"{p['id']:6} {len(p['tests'])} tests x 2 languages")
    return bad


if __name__ == "__main__":
    b = verify(sys.argv[1])
    print("mismatches:", b)
    sys.exit(1 if b else 0)
