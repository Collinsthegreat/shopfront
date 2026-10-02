-- ====================================================================
-- Seed Data: 14 Products across 4 categories
-- ====================================================================

INSERT INTO public.products (id, slug, name, description, price_kobo, currency, category, image_url, stock, featured, created_at)
VALUES
  -- Everyday Carry
  (
    'prod-001',
    'minimalist-leather-cardholder',
    'Minimalist Leather Cardholder',
    'Slim Italian vegetable-tanned leather wallet with four card slots and a center cash compartment. Hand-burnished edges that develop a rich patina over time.',
    1850000,
    'NGN',
    'carry',
    '/images/products/cardholder.svg',
    24,
    true,
    '2026-09-01T08:00:00Z'
  ),
  (
    'prod-002',
    'brass-key-organizer',
    'Solid Brass Key Organizer',
    'Precision CNC-machined brass bar with stainless steel washers. Holds up to 6 keys securely without jingling or scratching your phone screen.',
    1200000,
    'NGN',
    'carry',
    '/images/products/key-organizer.svg',
    18,
    false,
    '2026-09-02T08:00:00Z'
  ),
  (
    'prod-003',
    'titanium-pocket-pry-bar',
    'Titanium Pocket EDC Tool',
    'Grade 5 titanium multi-function pocket pry bar featuring an integrated bottle opener, standard bit driver, and deep-carry pocket clip.',
    2200000,
    'NGN',
    'carry',
    '/images/products/pry-bar.svg',
    12,
    true,
    '2026-09-03T08:00:00Z'
  ),
  (
    'prod-004',
    'waxed-canvas-carryall',
    'Waxed Canvas Utility Carryall',
    'Rugged 16oz water-repellent waxed canvas tote with full-grain bridle leather handles and brass rivet reinforcements. Built to endure daily commutes.',
    4500000,
    'NGN',
    'carry',
    '/images/products/carryall.svg',
    9,
    true,
    '2026-09-04T08:00:00Z'
  ),

  -- Stationery & Writing
  (
    'prod-005',
    'solid-brass-mechanical-pencil',
    'Solid Brass Mechanical Pencil',
    '0.5mm drafting pencil crafted with a hexagonal brass barrel and diamond knurled grip. Perfectly balanced for long writing and sketching sessions.',
    1450000,
    'NGN',
    'stationery',
    '/images/products/pencil.svg',
    30,
    true,
    '2026-09-05T08:00:00Z'
  ),
  (
    'prod-006',
    'minimalist-grid-notebook',
    'Hardcover Grid Journal (192 Pages)',
    'Thread-bound lay-flat notebook featuring 100gsm fountain-pen friendly acid-free paper, subtle 5mm light gray dot-grid, and ribbon marker.',
    950000,
    'NGN',
    'stationery',
    '/images/products/notebook.svg',
    45,
    false,
    '2026-09-06T08:00:00Z'
  ),
  (
    'prod-007',
    'stoneware-desk-pen-stand',
    'Ceramic Minimalist Pen Stand',
    'Wheel-thrown stoneware pen stand with a raw basalt matte finish. Weighted base with cork bottom to protect your desk surface.',
    800000,
    'NGN',
    'stationery',
    '/images/products/pen-stand.svg',
    15,
    false,
    '2026-09-07T08:00:00Z'
  ),
  (
    'prod-008',
    'aluminum-pocket-fountain-pen',
    'Anodized Aluminum Fountain Pen',
    'Compact pocket-sized fountain pen machined from aircraft-grade aluminum. Includes a German stainless steel fine nib and brass converter.',
    2800000,
    'NGN',
    'stationery',
    '/images/products/fountain-pen.svg',
    16,
    true,
    '2026-09-08T08:00:00Z'
  ),

  -- Desk & Workspace
  (
    'prod-009',
    'dual-sided-desk-mat',
    'Dual-Sided Felt & Vegan Leather Desk Pad',
    'Large 900x400mm desk mat offering high-density Merino wool felt on one side and smooth water-resistant vegan leather on the other.',
    3200000,
    'NGN',
    'desk',
    '/images/products/desk-mat.svg',
    20,
    true,
    '2026-09-09T08:00:00Z'
  ),
  (
    'prod-010',
    'solid-walnut-phone-dock',
    'Solid Walnut Phone Dock',
    'Carved from a single piece of kiln-dried American walnut with precision angled viewing slot and hidden cable routing channel underneath.',
    1650000,
    'NGN',
    'desk',
    '/images/products/phone-dock.svg',
    14,
    false,
    '2026-09-10T08:00:00Z'
  ),
  (
    'prod-011',
    'magnetic-desktop-cable-organizer',
    'Weighted Magnetic Cable Block',
    'Solid zinc and silicone weighted desktop block with three magnetic cable collars that keep charging cables right where you need them.',
    1100000,
    'NGN',
    'desk',
    '/images/products/cable-block.svg',
    22,
    false,
    '2026-09-11T08:00:00Z'
  ),
  (
    'prod-012',
    'matte-stoneware-coffee-mug',
    'Matte Stoneware Coffee Mug',
    'Handcrafted 360ml ceramic mug with ergonomic geometric handle and a tactile charcoal glaze. Microwave and dishwasher safe.',
    950000,
    'NGN',
    'desk',
    '/images/products/ceramic-mug.svg',
    35,
    true,
    '2026-09-12T08:00:00Z'
  ),

  -- Refined Living
  (
    'prod-013',
    'cedar-amber-soy-candle',
    'Cedar & Amber Soy Wax Candle',
    'Slow-burning 280g natural soy wax candle poured into a matte black vessel with an organic crackling wood wick. 55-hour clean burn time.',
    1350000,
    'NGN',
    'living',
    '/images/products/candle.svg',
    28,
    true,
    '2026-09-13T08:00:00Z'
  ),
  (
    'prod-014',
    'botanical-room-linen-mist',
    'Sandalwood Botanical Room Mist',
    '100ml relaxing blend of pure sandalwood, vetiver, and bergamot essential oils in an ultraviolet apothecary glass bottle with fine atomizer.',
    1050000,
    'NGN',
    'living',
    '/images/products/room-mist.svg',
    19,
    false,
    '2026-09-14T08:00:00Z'
  )
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_kobo = EXCLUDED.price_kobo,
  currency = EXCLUDED.currency,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  stock = EXCLUDED.stock,
  featured = EXCLUDED.featured;
