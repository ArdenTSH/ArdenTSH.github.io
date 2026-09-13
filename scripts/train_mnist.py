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
#   .venv/bin/python scripts/train_mnist.py       # ~5 min; writes the JSON in place
#
# Architecture 196 -> 16 -> 16 -> 10, ReLU hidden, softmax out. The input is MNIST
# mean-pooled 2x2 to 14x14, so the board drawn at the top of the rail IS the input
# vector: what the reader sees is what the network gets. The 16-wide hidden layers
# are a display constraint as much as a modelling one, since the rail draws each
# unit as a dot.
#
# HALF THE TRAINING SET IS AUGMENTED, and that is the point. A digit drawn with a
# pointer is thicker and larger than MNIST, which size-normalises every digit into
# a 20x20 box centred by centre of mass. Trained on clean data alone this network
# scores 96.1% on the test set but only 44.5% once the strokes are thickened and
# the digit fills the frame. Training on that variation costs about a point of
# clean accuracy and buys back roughly forty on drawn input. Adding a layer does
# not help: the failure is distribution shift, not capacity.
import json, struct, pathlib
import numpy as np

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
MN = next((p for p in (HERE / "mnist", pathlib.Path.cwd() / "mnist", ROOT / "mnist") if p.exists()), None)
if MN is None:
    raise SystemExit("MNIST idx files not found; see the header for the download commands.")
OUT = ROOT / "public" / "models" / "mnist-mlp.json"
rng = np.random.default_rng(0)


def read_idx(path):
    with open(path, "rb") as f:
        magic, n = struct.unpack(">II", f.read(8))
        if magic == 2051:
            rows, cols = struct.unpack(">II", f.read(8))
            return np.frombuffer(f.read(), dtype=np.uint8).reshape(n, rows, cols)
        return np.frombuffer(f.read(), dtype=np.uint8)


def pool14(a):
    """28x28 -> 14x14 by 2x2 mean pooling."""
    return a.reshape(-1, 14, 2, 14, 2).mean(axis=(2, 4))


def dilate(imgs, k=3):
    """Thicken strokes, which is what a blunt pointer brush does."""
    p = k // 2
    pad = np.pad(imgs, ((0, 0), (p, p), (p, p)))
    out = np.zeros_like(imgs)
    for dy in range(k):
        for dx in range(k):
            out = np.maximum(out, pad[:, dy:dy + imgs.shape[1], dx:dx + imgs.shape[2]])
    return out


def resize_nn(img, h, w):
    yi = (np.arange(h) * img.shape[0] / h).astype(int).clip(0, img.shape[0] - 1)
    xi = (np.arange(w) * img.shape[1] / w).astype(int).clip(0, img.shape[1] - 1)
    return img[yi][:, xi]


def bbox(img, thr=0.1):
    ys, xs = np.where(img > thr)
    return None if len(ys) == 0 else (ys.min(), ys.max(), xs.min(), xs.max())


def augment(imgs, r):
    """Random thickness, size and position: the variation a pointer produces."""
    out = np.zeros_like(imgs)
    for i, im in enumerate(imgs):
        w = dilate(im[None], 3)[0] if r.random() < 0.5 else im
        b = bbox(w)
        if b is None:
            out[i] = w
            continue
        y0, y1, x0, x1 = b
        crop = w[y0:y1 + 1, x0:x1 + 1]
        h, ww = crop.shape
        s = r.uniform(14, 26) / max(h, ww)
        nh, nw = max(1, int(round(h * s))), max(1, int(round(ww * s)))
        small = resize_nn(crop, nh, nw)
        tmp = np.zeros((28, 28), np.float32)
        oy = int(np.clip((28 - nh) // 2 + r.integers(-3, 4), 0, 28 - nh))
        ox = int(np.clip((28 - nw) // 2 + r.integers(-3, 4), 0, 28 - nw))
        tmp[oy:oy + nh, ox:ox + nw] = small
        out[i] = tmp
    return out


def drawn_like(imgs, fill=26):
    """The held-out stress test: thick strokes, digit blown up to fill the frame."""
    thick = dilate(imgs, 3)
    out = np.zeros_like(thick)
    for i, im in enumerate(thick):
        b = bbox(im)
        if b is None:
            continue
        y0, y1, x0, x1 = b
        crop = im[y0:y1 + 1, x0:x1 + 1]
        h, w = crop.shape
        s = fill / max(h, w)
        nh, nw = max(1, int(round(h * s))), max(1, int(round(w * s)))
        r = resize_nn(crop, nh, nw)
        oy, ox = (28 - nh) // 2, (28 - nw) // 2
        out[i, oy:oy + nh, ox:ox + nw] = r
    return out


print("loading and augmenting…", flush=True)
tr28 = read_idx(MN / "train-images-idx3-ubyte").astype(np.float32) / 255.0
ytr_clean = read_idx(MN / "train-labels-idx1-ubyte")
te28 = read_idx(MN / "t10k-images-idx3-ubyte").astype(np.float32) / 255.0
yte = read_idx(MN / "t10k-labels-idx1-ubyte")

flat = lambda a: pool14(a).reshape(len(a), 196)
Xtr = np.concatenate([flat(tr28), flat(augment(tr28, rng))])
ytr = np.concatenate([ytr_clean, ytr_clean])
Xte_img = pool14(te28)
Xte = Xte_img.reshape(-1, 196)
Xte_drawn = flat(drawn_like(te28))
print(f"training on {len(Xtr)} samples (half augmented)", flush=True)

SIZES = [196, 16, 16, 10]
W = [rng.normal(0, np.sqrt(2.0 / SIZES[i]), (SIZES[i], SIZES[i + 1])).astype(np.float32) for i in range(3)]
B = [np.zeros(SIZES[i + 1], dtype=np.float32) for i in range(3)]
VW = [np.zeros_like(w) for w in W]
VB = [np.zeros_like(b) for b in B]


def forward(X):
    a1 = np.maximum(0, X @ W[0] + B[0])
    a2 = np.maximum(0, a1 @ W[1] + B[1])
    z3 = a2 @ W[2] + B[2]
    z3 = z3 - z3.max(axis=1, keepdims=True)
    e = np.exp(z3)
    return a1, a2, e / e.sum(axis=1, keepdims=True)


def accuracy(X, y):
    return float((forward(X)[2].argmax(axis=1) == y).mean())


EPOCHS, BS, MOM = 40, 64, 0.9
n = len(Xtr)
for ep in range(EPOCHS):
    # Momentum 0.9 multiplies the effective step by ~10, so the base rate stays small.
    lr = 0.08 * (0.5 ** (ep / 14))
    order = rng.permutation(n)
    for s in range(0, n, BS):
        idx = order[s:s + BS]
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
        print(f"epoch {ep+1:3d}  clean {accuracy(Xte, yte):.4f}  drawn-like {accuracy(Xte_drawn, yte):.4f}", flush=True)

acc, acc_drawn = accuracy(Xte, yte), accuracy(Xte_drawn, yte)
print(f"\nfinal: clean {acc:.4f}   drawn-like {acc_drawn:.4f}")

# One clean example per class for the "sample" button: the most confident correct
# test image, so the stored digits are real MNIST rather than anything synthetic.
_, _, probs = forward(Xte)
pred = probs.argmax(axis=1)
digits = []
for c in range(10):
    ok = np.where((yte == c) & (pred == c))[0]
    best = ok[probs[ok, c].argmax()]
    # Xte_img is in [0,1]; the rail expects 0-255 bytes, so scale on the way out.
    digits.append({
        "label": int(c),
        "px": [int(v) for v in np.rint(Xte_img[best].reshape(-1) * 255).clip(0, 255)],
    })

r = lambda a: [round(float(v), 4) for v in np.asarray(a).reshape(-1)]
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps({
    "note": "196-16-16-10 MLP on 14x14 mean-pooled MNIST, half the training set augmented "
            "for stroke thickness, size and position. Row-major weights.",
    "sizes": SIZES,
    "accuracy": round(acc, 4),
    "accuracy_drawn_like": round(acc_drawn, 4),
    "w": [r(W[0]), r(W[1]), r(W[2])],
    "b": [r(B[0]), r(B[1]), r(B[2])],
    "digits": digits,
}, separators=(",", ":")))
print(f"wrote {OUT} ({OUT.stat().st_size/1024:.1f} KB)")
