#!/usr/bin/env python3
# Regenerates public/models/mnist-mlp.json, the weights behind <MnistRail> on
# /research/ai. Only needed if you want to retrain; the JSON is committed.
#
#   python3 -m venv .venv && .venv/bin/pip install numpy
#   mkdir -p mnist && cd mnist
#   for f in train-images-idx3-ubyte train-labels-idx1-ubyte \
#            t10k-images-idx3-ubyte t10k-labels-idx1-ubyte; do
#     curl -s "https://storage.googleapis.com/cvdf-datasets/mnist/$f.gz" | gunzip > "$f"
#   done && cd ..
#   .venv/bin/python scripts/train_mnist.py     # ~2 min, then copy the JSON into public/models/
#
# Last run: 96.09% test accuracy, 3,594 parameters.
#
# Architecture 196 -> 16 -> 16 -> 10, ReLU hidden, softmax out. The input is
# MNIST mean-pooled 2x2 to 14x14, so the pixel grid drawn at the top of the rail
# IS the input vector: what the reader sees is what the network gets. Writes one
# JSON holding the weights, one clean example digit per class, and the measured
# test accuracy.
import json, struct, pathlib
import numpy as np

HERE = pathlib.Path(__file__).parent
MN = HERE / "mnist"
rng = np.random.default_rng(0)


def read_idx(path):
    with open(path, "rb") as f:
        magic, n = struct.unpack(">II", f.read(8))
        if magic == 2051:
            rows, cols = struct.unpack(">II", f.read(8))
            return np.frombuffer(f.read(), dtype=np.uint8).reshape(n, rows, cols)
        return np.frombuffer(f.read(), dtype=np.uint8)


def pool14(imgs):
    """28x28 -> 14x14 by 2x2 mean pooling."""
    return imgs.reshape(-1, 14, 2, 14, 2).mean(axis=(2, 4))


Xtr = pool14(read_idx(MN / "train-images-idx3-ubyte").astype(np.float32)).reshape(-1, 196) / 255.0
ytr = read_idx(MN / "train-labels-idx1-ubyte")
Xte_img = pool14(read_idx(MN / "t10k-images-idx3-ubyte").astype(np.float32))
Xte = Xte_img.reshape(-1, 196) / 255.0
yte = read_idx(MN / "t10k-labels-idx1-ubyte")

SIZES = [196, 16, 16, 10]
W = [rng.normal(0, np.sqrt(2.0 / SIZES[i]), (SIZES[i], SIZES[i + 1])).astype(np.float32) for i in range(3)]
B = [np.zeros(SIZES[i + 1], dtype=np.float32) for i in range(3)]
VW = [np.zeros_like(w) for w in W]
VB = [np.zeros_like(b) for b in B]


def forward(X):
    a1 = np.maximum(0, X @ W[0] + B[0])
    a2 = np.maximum(0, a1 @ W[1] + B[1])
    z3 = a2 @ W[2] + B[2]
    z3 -= z3.max(axis=1, keepdims=True)
    e = np.exp(z3)
    return a1, a2, e / e.sum(axis=1, keepdims=True)


def accuracy(X, y):
    return float((forward(X)[2].argmax(axis=1) == y).mean())


EPOCHS, BS, MOM = 45, 64, 0.9
n = len(Xtr)
for ep in range(EPOCHS):
    # Momentum 0.9 multiplies the effective step by ~10, so the base rate stays small.
    lr = 0.08 * (0.5 ** (ep / 15))         # halve every 15 epochs
    order = rng.permutation(n)
    for s in range(0, n, BS):
        idx = order[s : s + BS]
        x, y = Xtr[idx], ytr[idx]
        a1, a2, p = forward(x)
        m = len(idx)
        d3 = p.copy()
        d3[np.arange(m), y] -= 1.0
        d3 /= m
        g = [None] * 3
        g[2] = (a2.T @ d3, d3.sum(axis=0))
        d2 = (d3 @ W[2].T) * (a2 > 0)
        g[1] = (a1.T @ d2, d2.sum(axis=0))
        d1 = (d2 @ W[1].T) * (a1 > 0)
        g[0] = (x.T @ d1, d1.sum(axis=0))
        for i in range(3):
            VW[i] = MOM * VW[i] - lr * g[i][0]
            VB[i] = MOM * VB[i] - lr * g[i][1]
            W[i] += VW[i]
            B[i] += VB[i]
    if not np.isfinite(W[0]).all():
        raise SystemExit(f"diverged at epoch {ep+1}: lower the learning rate")
    if ep < 2 or ep % 10 == 9 or ep == EPOCHS - 1:
        print(f"epoch {ep+1:3d}  train {accuracy(Xtr[:10000], ytr[:10000]):.4f}  test {accuracy(Xte, yte):.4f}", flush=True)

acc = accuracy(Xte, yte)
print(f"final test accuracy {acc:.4f}")

# One clean example per class: the highest-confidence correct test image.
_, _, probs = forward(Xte)
pred = probs.argmax(axis=1)
digits = []
for c in range(10):
    ok = np.where((yte == c) & (pred == c))[0]
    best = ok[probs[ok, c].argmax()]
    digits.append({
        "label": int(c),
        "conf": round(float(probs[best, c]), 4),
        "px": [int(v) for v in np.rint(Xte_img[best].reshape(-1)).clip(0, 255)],
    })
    print(f"  class {c}: test index {best}, confidence {probs[best, c]:.4f}")

r = lambda a: [round(float(v), 4) for v in np.asarray(a).reshape(-1)]
out = {
    "note": "196-16-16-10 MLP on 14x14 mean-pooled MNIST. Row-major weights.",
    "sizes": SIZES,
    "accuracy": round(acc, 4),
    "w": [r(W[0]), r(W[1]), r(W[2])],
    "b": [r(B[0]), r(B[1]), r(B[2])],
    "digits": digits,
}
dest = HERE / "mnist-mlp.json"
dest.write_text(json.dumps(out, separators=(",", ":")))
print(f"wrote {dest} ({dest.stat().st_size/1024:.1f} KB)")
