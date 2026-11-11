"""Order Mock 6 questions (no two neighbours share a topic) and place answers evenly across options 1-4."""
import random

from mock6_data import Q


def ordered():
    rng = random.Random(606)
    for _ in range(20000):
        qs = Q[:]
        rng.shuffle(qs)
        if all(a["t"] != b["t"] for a, b in zip(qs, qs[1:])):
            break
    else:
        raise RuntimeError("no valid order")
    pos = [1, 2, 3, 4] * 13
    rng.shuffle(pos)
    out = []
    for q, p in zip(qs, pos):
        correct, wrong = q["opts"][0], q["opts"][1:]
        if q.get("fixed_last"):
            p = min(p, 3)
            opts = wrong[:-1]
            opts.insert(p - 1, correct)
            opts.append(wrong[-1])
        else:
            opts = wrong[:]
            opts.insert(p - 1, correct)
        out.append(dict(q, opts=opts, right=p))
    return out


if __name__ == "__main__":
    from collections import Counter
    o = ordered()
    print(Counter(q["right"] for q in o))
    print([q["t"][:3] for q in o])
