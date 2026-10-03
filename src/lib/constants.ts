export const STORE_NAME = "BuildMart";
export const STORE_TAGLINE = "Your Authoritative Source for Construction & Building Materials";
export const STORE_DESCRIPTION =
  "Nigeria's authoritative marketplace for genuine building and construction materials with transparent pricing, instant haulage calculation, and site delivery.";

export const CURRENCY = {
  code: "NGN",
  symbol: "₦",
  locale: "en-NG",
  minorUnitName: "kobo",
  minorUnitRatio: 100, // 100 kobo = 1 Naira
} as const;

// Flat simulated haulage fee across Lagos & Abuja building sites (₦35,000)
export const FLAT_HAULAGE_FEE_KOBO = 3500000;
export const FLAT_DELIVERY_FEE_KOBO = FLAT_HAULAGE_FEE_KOBO;

export const CATEGORIES = [
  { slug: "all", name: "All Materials", icon: "Boxes" },
  { slug: "cement-binders", name: "Cement & Binders", icon: "Package" },
  { slug: "steel-rods", name: "Steel & Iron Rods", icon: "Layers" },
  { slug: "blocks-bricks", name: "Blocks & Bricks", icon: "Grid" },
  { slug: "sand-aggregates", name: "Sand & Aggregates", icon: "Mountain" },
  { slug: "roofing", name: "Roofing & Ceiling", icon: "Home" },
  { slug: "tiles-flooring", name: "Tiles & Flooring", icon: "LayoutGrid" },
  { slug: "paints-finishes", name: "Paints & Finishes", icon: "Paintbrush" },
  { slug: "plumbing", name: "Plumbing & Sanitary", icon: "Droplet" },
  { slug: "electrical", name: "Electrical & Lighting", icon: "Zap" },
  { slug: "doors-hardware", name: "Doors & Hardware", icon: "Shield" },
  { slug: "tools-scaffolding", name: "Tools & Site Gear", icon: "Wrench" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export const BRANDS = [
  { slug: "dangote", name: "Dangote Cement", origin: "Nigeria" },
  { slug: "bua", name: "BUA Group", origin: "Nigeria" },
  { slug: "lafarge", name: "Lafarge Africa", origin: "Nigeria" },
  { slug: "sika", name: "Sika Construction Chemicals", origin: "Switzerland" },
  { slug: "super-snow", name: "Super Snow White Cement", origin: "Nigeria" },
  { slug: "tiger-tmt", name: "Tiger TMT Steel", origin: "Nigeria" },
  { slug: "prime-steel", name: "Prime Steel", origin: "Nigeria" },
  { slug: "buildmart-certified", name: "BuildMart Certified Blocks & Materials", origin: "Nigeria" },
  { slug: "buildmart-quarry", name: "BuildMart Direct Quarry Aggregates", origin: "Nigeria" },
  { slug: "tower-aluminium", name: "Tower Aluminium", origin: "Nigeria" },
  { slug: "nigerite", name: "Nigerite Roofing", origin: "Nigeria" },
  { slug: "cdk", name: "CDK Integrated Industries", origin: "Nigeria" },
  { slug: "royal", name: "Royal Ceramics", origin: "Nigeria" },
  { slug: "berger", name: "Berger Paints", origin: "Nigeria" },
  { slug: "dulux", name: "Dulux Paints", origin: "United Kingdom" },
  { slug: "meyer", name: "Meyer Paints", origin: "Nigeria" },
  { slug: "geepee", name: "GeePee Tanks", origin: "Nigeria" },
  { slug: "twyford", name: "Twyford Sanitaryware", origin: "United Kingdom" },
  { slug: "coleman", name: "Coleman Wires & Cables", origin: "Nigeria" },
  { slug: "schneider", name: "Schneider Electric", origin: "France" },
  { slug: "philips", name: "Philips Lighting", origin: "Netherlands" },
  { slug: "yale", name: "Yale Hardware", origin: "USA" },
  { slug: "ingco", name: "INGCO Tools", origin: "Global" },
  { slug: "total", name: "Total Tools", origin: "Global" },
] as const;

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "newest", label: "Newest Arrivals" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
export type SortOptionValue = SortOption;
