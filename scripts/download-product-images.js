const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'products');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const productsToFetch = [
  // Cement
  { slug: 'dangote-3x-cement-50kg', id: '1589939705384-5185137a7f0f' },
  { slug: 'bua-super-cement-50kg', id: '1504307651254-35680f356dfd' },
  { slug: 'lafarge-elephant-supaset-cement-50kg', id: '1541888946425-d0fbb186156a' },
  { slug: 'sika-ceram-80-tile-adhesive-20kg', id: '1581094794329-c8112a89af12' },
  { slug: 'super-snow-white-portland-cement-40kg', id: '1590381105924-c72589b9ef3f' },

  // Steel
  { slug: 'tiger-tmt-rebar-12mm-12m', id: '1535813547-99c456a41d4a' },
  { slug: 'tiger-tmt-rebar-16mm-12m', id: '1518709268805-4e9042af9f23' },
  { slug: 'prime-steel-rebar-10mm-12m', id: '1504917599217-d4dc5ebe6122' },
  { slug: 'annealed-binding-wire-25kg-roll', id: '1587293852726-70cdb56c2866' },
  { slug: 'brc-welded-wire-mesh-a142', id: '1503387762-592deb58ef4e' },

  // Blocks
  { slug: 'vibrated-hollow-block-9inch', id: '1590381105924-c72589b9ef3f' },
  { slug: 'vibrated-hollow-block-6inch', id: '1584467735871-8e85353a8413' },
  { slug: 'interlocking-paving-stones-60mm', id: '1584467735815-f778f274e296' },
  { slug: 'solid-burnt-clay-facing-brick', id: '1546484475-7f7bd55792da' },

  // Aggregates
  { slug: 'sharp-sand-tipper-20-ton', id: '1509316975850-ff9c5deb0cd9' },
  { slug: 'granite-chippings-3-4-20-ton', id: '1517646287270-a5a9ca602e5c' },
  { slug: 'granite-chippings-1-2-20-ton', id: '1541888946425-d0fbb186156a' },
  { slug: 'filling-laterite-tipper-20-ton', id: '1473448912268-2022ce9509d8' },

  // Roofing
  { slug: 'long-span-aluminium-sheet-055mm', id: '1513694203232-719a280e022f' },
  { slug: 'stone-coated-bond-roof-tile', id: '1600585154340-be6161a56a0c' },
  { slug: 'asbestos-free-fibre-cement-ceiling-sheet', id: '1600566753376-12c8ab7fb75b' },
  { slug: 'treated-hardwood-timber-2x4x12ft', id: '1520116468418-095984ab1724' },

  // Tiles
  { slug: 'cdk-porcelain-floor-tiles-60x60', id: '1502005229762-ee1b2b8ab00f' },
  { slug: 'royal-glazed-wall-tiles-30x60', id: '1584622650111-993a426fbf0a' },
  { slug: 'granite-finish-outdoor-tiles-40x40', id: '1527352774646-953e5e48545e' },
  { slug: 'sika-epoxy-tile-grout-5kg', id: '1581094794329-c8112a89af12' },

  // Paints
  { slug: 'berger-luxol-emulsion-paint-20l', id: '1589939705384-5185137a7f0f' },
  { slug: 'dulux-trade-gloss-paint-4l', id: '1562259949-e8e7689d7828' },
  { slug: 'meyer-imperial-textured-paint-20l', id: '1595428774223-ef52624120d2' },
  { slug: 'acrylic-wall-putty-screeding-20kg', id: '1590381105924-c72589b9ef3f' },

  // Plumbing
  { slug: 'upvc-pressure-pipe-4inch-5-8m', id: '1585704032915-c3400ca199e7' },
  { slug: 'geepee-overhead-water-tank-2000l', id: '1541888946425-d0fbb186156a' },
  { slug: 'ppr-hot-cold-water-pipe-25mm', id: '1584622650111-993a426fbf0a' },
  { slug: 'twyford-dual-flush-toilet-suite', id: '1584622781564-1d987f7333c1' },

  // Electrical
  { slug: 'coleman-pure-copper-cable-2-5mm', id: '1544716278-ca5e3f4abd8c' },
  { slug: 'coleman-pure-copper-cable-1-5mm', id: '1558494949-ef010cbdcc31' },
  { slug: 'schneider-12-way-distribution-board', id: '1621905251189-08b45d6a269e' },
  { slug: 'rigid-pvc-conduit-pipe-20mm', id: '1513694203232-719a280e022f' },
  { slug: 'philips-recessed-led-downlight-18w', id: '1513506003901-1e6a229e2d15' },

  // Doors
  { slug: 'turkish-steel-security-door-3ft', id: '1513694203232-719a280e022f' },
  { slug: 'casement-aluminium-window-4x4', id: '1503899036084-c55cdd92da26' },
  { slug: 'yale-mortise-door-lock-set', id: '1558002038-1055907df827' },
  { slug: 'solid-brass-heavy-duty-hinges-4inch', id: '1584622650111-993a426fbf0a' },

  // Tools
  { slug: 'ingco-contractor-wheelbarrow-100l', id: '1586864387967-d02ef85d93e8' },
  { slug: 'forged-steel-round-mouth-shovel', id: '1581092160607-ee22621dd758' },
  { slug: 'adjustable-scaffolding-acrow-prop', id: '1504307651254-35680f356dfd' },
  { slug: 'total-rotary-hammer-drill-800w', id: '1504148455328-c376907d081c' },
  { slug: 'ppe-site-safety-kit', id: '1578873375972-e1c22d56a3e5' }
];

async function downloadAll() {
  console.log(`Starting download of ${productsToFetch.length} optimized WebP photos...`);
  let successCount = 0;

  for (let i = 0; i < productsToFetch.length; i++) {
    const item = productsToFetch[i];
    const filePath = path.join(targetDir, `${item.slug}.webp`);
    
    // Unsplash direct WebP URL with 600px width and 80 quality for lightweight delivery (<100KB)
    const url = `https://images.unsplash.com/photo-${item.id}?w=600&h=600&fit=crop&q=80&fm=webp`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`[FAIL] ${item.slug}: HTTP ${res.status}`);
        continue;
      }
      const buffer = await res.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));
      const stats = fs.statSync(filePath);
      console.log(`[${i + 1}/${productsToFetch.length}] Saved ${item.slug}.webp (${Math.round(stats.size / 1024)} KB)`);
      successCount++;
    } catch (err) {
      console.error(`[ERROR] ${item.slug}:`, err.message);
    }
  }

  console.log(`Finished: ${successCount}/${productsToFetch.length} images saved in ${targetDir}`);
}

downloadAll();
