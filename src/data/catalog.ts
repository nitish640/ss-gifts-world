import birthday from "@/assets/p-birthday.jpg";
import mug from "@/assets/p-mug.jpg";
import frame from "@/assets/p-frame.jpg";
import softtoys from "@/assets/p-softtoys.jpg";
import balloons from "@/assets/p-balloons.jpg";
import toys from "@/assets/p-toys.jpg";
import event from "@/assets/p-event.jpg";
import custom from "@/assets/p-custom.jpg";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  ageGroup?: "baby" | "kids" | "teens" | "all";
  tag?: string;
  isCustomisable?: boolean;
  description: string;
  specs: { label: string; value: string }[];
};

export const categories = [
  { slug: "mug-printing", name: "Mug Printing", image: mug, count: 24 },
  { slug: "photo-frames", name: "Photo Frames", image: frame, count: 38 },
  { slug: "birthday", name: "Birthday Gifts", image: birthday, count: 42 },
  { slug: "event-items", name: "Event Items", image: event, count: 26 },
  { slug: "soft-toys", name: "Soft Toys", image: softtoys, count: 30 },
  { slug: "balloons", name: "Balloons & Decor", image: balloons, count: 34 },
  { slug: "toys", name: "Kids Toys", image: toys, count: 28 },
  { slug: "customized", name: "Customized Gifts", image: custom, count: 21 },
];

const baseProducts = [
  {
    name: "Personalised Photo Mug",
    category: "mug-printing",
    image: mug,
    price: 299,
    oldPrice: 399,
    tag: "Bestseller",
    isCustomisable: true,
    description: "Premium grade 325ml ceramic mug featuring high-definition photo sublimation printing. Microwave and dishwasher safe with vibrant, fade-resistant gloss coating. Share your photo or text on WhatsApp for a free design preview before printing.",
    specs: [
      { label: "Material", value: "High-Gloss Ceramic" },
      { label: "Capacity", value: "325 ml" },
      { label: "Customisation", value: "HD Photo & Name Sublimation Print" },
      { label: "Care", value: "Microwave & Dishwasher Safe" },
    ],
  },
  {
    name: "Magic Colour-Changing Mug",
    category: "mug-printing",
    image: mug,
    price: 449,
    isCustomisable: true,
    description: "Heat-sensitive thermochromic magic mug that reveals your custom hidden photo and message when filled with hot coffee, tea, or water. Features a sleek black exterior when cool.",
    specs: [
      { label: "Material", value: "Thermochromic Black Ceramic" },
      { label: "Capacity", value: "325 ml" },
      { label: "Feature", value: "Heat-Activated Color & Image Reveal" },
      { label: "Care", value: "Hand Wash Recommended" },
    ],
  },
  {
    name: "Couple Photo Mug Set",
    category: "mug-printing",
    image: mug,
    price: 649,
    oldPrice: 799,
    isCustomisable: true,
    description: "Matching pair of romantic heart-handle ceramic mugs designed for couples. Customized with dual photo collages, names, or special anniversary dates. Perfect gift for couples, weddings, and anniversaries.",
    specs: [
      { label: "Quantity", value: "Set of 2 Mugs" },
      { label: "Material", value: "Ceramic with Red Heart Handles" },
      { label: "Customisation", value: "Dual Side Photo & Text Print" },
      { label: "Packaging", value: "Couples Gift Box Included" },
    ],
  },
  {
    name: "Wall Collage Photo Frame Set (13 pcs)",
    category: "photo-frames",
    image: frame,
    price: 1499,
    tag: "Popular",
    isCustomisable: true,
    description: "Transform your living room wall with this luxury 13-piece wooden collage photo gallery kit. Includes protective clear front panels, hanging templates, and high-resolution photo printing of your family photos.",
    specs: [
      { label: "Frame Count", value: "13 Frames Gallery Set" },
      { label: "Material", value: "Synthetic Wood & Shatterproof Front" },
      { label: "Layout Template", value: "Wall Hanging Guide Included" },
      { label: "Photo Printing", value: "Lab-Quality Matte Photo Prints" },
    ],
  },
  {
    name: "Wooden Engraved Photo Frame",
    category: "photo-frames",
    image: frame,
    price: 799,
    isCustomisable: true,
    description: "Crafted from natural solid beechwood with precision laser engraving of your custom photo line art, names, or heartfelt anniversary quotes. A timeless keepsake built to last.",
    specs: [
      { label: "Material", value: "100% Solid Natural Wood" },
      { label: "Finish", value: "Precision Laser Engraved & Polished" },
      { label: "Placement", value: "Tabletop Stand & Wall Mount" },
      { label: "Customisation", value: "Laser Photo Engraving + Custom Text" },
    ],
  },
  {
    name: "Wedding Memory Frame",
    category: "photo-frames",
    image: frame,
    price: 1899,
    oldPrice: 2299,
    isCustomisable: true,
    description: "Luxury wedding box photo frame with elegant gold foil detailing, double matting, and UV-protective glass front. Designed specifically to preserve wedding couple portraits and memories.",
    specs: [
      { label: "Frame Type", value: "Deep Shadow Box Memory Frame" },
      { label: "Border Detail", value: "Gold Foil Embossed Border" },
      { label: "Protection", value: "UV-Resistant Glass Front" },
      { label: "Size", value: "12 x 18 Inches" },
    ],
  },
  {
    name: "Birthday Surprise Gift Hamper",
    category: "birthday",
    image: birthday,
    price: 1299,
    oldPrice: 1599,
    isCustomisable: true,
    description: "All-in-one curated birthday gift hamper box containing a cute mini teddy bear, premium chocolates, handwritten birthday greeting card, and customized photo mug. Wrapped in signature red ribbon packaging.",
    specs: [
      { label: "Hamper Contents", value: "Mini Teddy, Chocolates, Card & Mug" },
      { label: "Packaging", value: "Rigid Matte Gift Box with Ribbon" },
      { label: "Card", value: "Handwritten Personal Message Included" },
      { label: "Dispatch", value: "Express Local Delivery in 60 Mins" },
    ],
  },
  {
    name: "Birthday Decoration Combo Kit",
    category: "birthday",
    image: birthday,
    price: 899,
    tag: "New",
    isCustomisable: false,
    description: "Complete DIY birthday party decoration kit including Happy Birthday banner, 50 metallic balloons, foil curtain backdrop, glue dots, and balloon garland tape for easy home party setup.",
    specs: [
      { label: "Kit Items", value: "50 Metallic Balloons, Banner & Foil Curtain" },
      { label: "Accessories", value: "Glue Dots & Balloon Arch Strip Included" },
      { label: "Theme", value: "Birthday Celebration (Gold / Rose Gold)" },
      { label: "Setup", value: "Easy DIY 20-Minute Installation" },
    ],
  },
  {
    name: "Event Stage Decoration Package",
    category: "event-items",
    image: event,
    price: 4999,
    isCustomisable: false,
    description: "Professional stage setup and decoration service for birthday parties, anniversaries, and family functions in Ichapuram & nearby areas. Includes flower arches, LED spotlights, and backdrop theme styling.",
    specs: [
      { label: "Service", value: "On-Site Stage Setup & Backdrop Styling" },
      { label: "Location", value: "Ichapuram & 15km Surrounding Radius" },
      { label: "Duration", value: "Same-Day Professional Installation" },
      { label: "Inclusions", value: "Floral Arch, Lighting & Theme Props" },
    ],
  },
  {
    name: "Snow Spray & Party Popper Pack",
    category: "event-items",
    image: event,
    price: 249,
    tag: "Party",
    isCustomisable: false,
    description: "Instant celebration party pack containing 2 non-toxic party poppers (confetti cannons) and 2 artificial snow spray cans for cake cutting and birthday party celebration moments.",
    specs: [
      { label: "Pack Contains", value: "2 Party Poppers + 2 Snow Spray Cans" },
      { label: "Safety", value: "100% Non-Toxic & Fabric-Safe" },
      { label: "Usage", value: "Cake Cutting, Birthday & New Year Parties" },
      { label: "Quality", value: "High-Pressure Confetti & Foam Burst" },
    ],
  },
  {
    name: "Cuddly Teddy Bear (Medium)",
    category: "soft-toys",
    image: softtoys,
    price: 699,
    oldPrice: 899,
    isCustomisable: false,
    description: "Super-soft cuddly teddy bear crafted with plush velvet fabric and hypoallergenic microfiber filling. Features durable reinforced stitching, cute neck bow tie, and machine-washable fabric.",
    specs: [
      { label: "Height", value: "1.2 Feet (35 cm)" },
      { label: "Material", value: "Ultra-Soft Plush Velvet Fabric" },
      { label: "Filling", value: "100% Hypoallergenic Microfiber" },
      { label: "Care", value: "Hand Washable & Machine Washable" },
    ],
  },
  {
    name: "Jumbo Teddy Bear (3 ft)",
    category: "soft-toys",
    image: softtoys,
    price: 1999,
    isCustomisable: false,
    description: "Grand 3-foot giant life-sized teddy bear made with fluffy plush fur. Exceptionally soft, huggable, and perfect for big birthday surprises, Valentine's gifts, and kids' bedrooms.",
    specs: [
      { label: "Height", value: "3 Feet (90 cm)" },
      { label: "Weight", value: "1.8 kg" },
      { label: "Material", value: "Premium High-Density Soft Plush" },
      { label: "Colors Available", value: "Classic Brown / Pink" },
    ],
  },
  {
    name: "Metallic Balloon Pack (50 pcs)",
    category: "balloons",
    image: balloons,
    price: 199,
    tag: "Fresh",
    isCustomisable: false,
    description: "Pack of 50 heavy-gauge 12-inch metallic chrome latex balloons. Long-lasting air and helium retention suitable for birthday party arch decorations and room decor.",
    specs: [
      { label: "Quantity", value: "50 Balloons Pack" },
      { label: "Size", value: "12 Inches Standard" },
      { label: "Material", value: "Thick Natural Latex with Chrome Finish" },
      { label: "Inflation", value: "Air & Helium Compatible" },
    ],
  },
  {
    name: "Happy Birthday Balloon Arch Kit",
    category: "balloons",
    image: balloons,
    price: 549,
    oldPrice: 699,
    isCustomisable: false,
    description: "Complete DIY balloon garland arch kit featuring 70 multi-color metallic balloons, balloon arch tape, dot glue, and 2 foil star balloons for spectacular photo backdrops.",
    specs: [
      { label: "Total Pieces", value: "75+ Party Items" },
      { label: "Includes", value: "70 Balloons, Arch Strip, Glue Dots, 2 Stars" },
      { label: "Backdrop Size", value: "Creates 6-Foot Balloon Garland" },
      { label: "Reusability", value: "Foil Stars are Reusable" },
    ],
  },
  {
    name: "Rubik's Cube 3x3 Puzzle",
    category: "toys",
    image: toys,
    price: 249,
    isCustomisable: false,
    description: "High-speed 3x3 Rubik's cube puzzle toy for kids and adults. Features stickerless bright plastic tiles, anti-pop mechanical core, and smooth adjustable corner turns.",
    specs: [
      { label: "Toy Type", value: "3x3 Speed Cube Puzzle" },
      { label: "Material", value: "Non-Toxic ABS Stickerless Plastic" },
      { label: "Mechanism", value: "Anti-Pop Corner & Adjustable Tension" },
      { label: "Recommended Age", value: "6+ Years" },
    ],
  },
  {
    name: "Die-Cast Toy Jeep",
    category: "toys",
    image: toys,
    price: 399,
    tag: "Kids",
    isCustomisable: false,
    description: "Heavy-duty metal die-cast off-road toy jeep featuring powerful pull-back action, opening front doors, rubber tires, working LED headlights, and realistic engine sound effects.",
    specs: [
      { label: "Body Material", value: "Die-Cast Metal Alloy & Rubber Tires" },
      { label: "Scale", value: "1:32 Scale Replica" },
      { label: "Features", value: "Pull-Back Motor, Opening Doors, Sound & Lights" },
      { label: "Recommended Age", value: "3+ Years" },
    ],
  },
  {
    name: "Customized Name Keychain",
    category: "customized",
    image: custom,
    price: 199,
    isCustomisable: true,
    description: "Durable laser-cut personalized acrylic/metal keychain custom engraved with your name, phone number, or vehicle number. Features smooth rounded edges and a heavy-duty key ring.",
    specs: [
      { label: "Material", value: "High-Grade Acrylic / Stainless Steel" },
      { label: "Engraving", value: "Laser Cut Custom Name / Vehicle No." },
      { label: "Hardware", value: "Rust-Proof Heavy Metal Key Ring" },
      { label: "Finish", value: "Glossy Scratch-Resistant Coating" },
    ],
  },
  {
    name: "Photo Printed Cushion",
    category: "customized",
    image: custom,
    price: 599,
    oldPrice: 749,
    isCustomisable: true,
    description: "Luxurious soft plush satin pillow cushion customized with your high-definition photo or collage on front. Includes soft microfiber cushion filler and a concealed zipper for easy washing.",
    specs: [
      { label: "Dimensions", value: "12 x 12 Inches (Square)" },
      { label: "Material", value: "Soft Satin-Velvet Plush Fabric" },
      { label: "Print Quality", value: "HD Sublimation Non-Fading Print" },
      { label: "Closure", value: "Concealed Zipper with Washable Cover" },
    ],
  },
];

export const products: Product[] = baseProducts.map((p, i) => {
  // Category specific default color options
  const defaultColors =
    p.category === "mug-printing"
      ? [
          { name: "Classic White", hex: "#ffffff" },
          { name: "Thermochromic Black", hex: "#18181b" },
          { name: "Ruby Red", hex: "#ef4444" },
          { name: "Royal Blue", hex: "#2563eb" },
        ]
      : p.category === "photo-frames"
      ? [
          { name: "Matte Black Wood", hex: "#18181b" },
          { name: "Natural Beechwood", hex: "#d97706" },
          { name: "Royal Walnut", hex: "#78350f" },
          { name: "Imperial Gold", hex: "#eab308" },
        ]
      : p.category === "soft-toys"
      ? [
          { name: "Classic Honey Brown", hex: "#b45309" },
          { name: "Blush Pink", hex: "#f472b6" },
          { name: "Snow White", hex: "#f8fafc" },
        ]
      : p.category === "toys"
      ? [
          { name: "Canary Yellow", hex: "#eab308" },
          { name: "Racing Red", hex: "#dc2626" },
          { name: "Matte Midnight Black", hex: "#18181b" },
          { name: "Army Olive Green", hex: "#15803d" },
        ]
      : p.category === "customized"
      ? [
          { name: "Royal Velvet Red", hex: "#dc2626" },
          { name: "Soft Satin Cream", hex: "#fef3c7" },
          { name: "Midnight Navy", hex: "#1e3a8a" },
        ]
      : undefined;

  // Category specific default size options
  const defaultSizes =
    p.category === "photo-frames"
      ? ['6" x 8" (Tabletop)', '8" x 12" (Medium Wall)', '12" x 18" (Large Wall)', '16" x 24" (Grand Gallery)']
      : p.category === "soft-toys"
      ? ['1.2 Feet (35cm)', '2 Feet (60cm)', '3 Feet (90cm Jumbo)']
      : p.category === "customized"
      ? ['12" x 12" Standard', '15" x 15" Plush Square', 'Heart Cushion Edition']
      : p.category === "toys"
      ? ['Standard 1:32 Scale', 'Pro RC Remote Control Edition']
      : p.category === "mug-printing"
      ? ['325 ml Standard', '450 ml Jumbo Mug']
      : undefined;

  // Default Age Group classification for kids & toys filtering
  const defaultAgeGroup: "baby" | "kids" | "teens" | "all" =
    p.category === "soft-toys"
      ? "baby"
      : p.category === "toys"
      ? p.name.includes("Jeep") || p.name.includes("Rubik")
        ? "kids"
        : "teens"
      : "all";

  // Multiple product images for interactive image thumbnail gallery
  const imageGallery = [p.image, custom, birthday, frame].filter((img, idx, arr) => arr.indexOf(img) === idx);

  return {
    id: `ssg-${i + 1}`,
    ...p,
    images: p.images || imageGallery,
    colors: p.colors || defaultColors,
    sizes: p.sizes || defaultSizes,
    ageGroup: p.ageGroup || defaultAgeGroup,
    rating: Number((4.3 + ((i * 7) % 7) / 10).toFixed(1)),
    reviews: 48 + ((i * 37) % 260),
  };
});

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const testimonials = [
  {
    name: "Ananya Sharma",
    city: "Ichapuram",
    text: "Got a photo mug printed for my sister's birthday — ready in a few hours and the print quality was excellent.",
  },
  {
    name: "Rahul Mehta",
    city: "Sompeta",
    text: "Ordered the 13-piece collage frame set. They arranged everything and even helped with the layout on WhatsApp.",
  },
  {
    name: "Fatima Q.",
    city: "Palasa",
    text: "Balloons, snow spray and full birthday decoration — the whole party setup came from here and it looked great.",
  },
  {
    name: "Dev Patel",
    city: "Srikakulam",
    text: "Big teddy bear and a customised keychain at a very fair price. Friendly shop, quick service.",
  },
];

export const faqs = [
  {
    q: "How do I place an order?",
    a: "Message us on WhatsApp with the item, your photo or text, and the date you need it. We share a design preview and confirm the price before printing.",
  },
  {
    q: "How fast is mug printing and framing?",
    a: "Most mug printing and standard photo frames are ready the same day. Large collage sets and event decoration need 1-2 days' notice.",
  },
  {
    q: "Do you handle event and birthday decoration?",
    a: "Yes. We supply balloons, snow spray, party poppers and full stage or birthday decoration setups for functions in and around Ichapuram.",
  },
  {
    q: "Where is the shop located?",
    a: "Market Road, Radham Street, Ichapuram, Srikakulam District, Andhra Pradesh 532312. Walk in any day between 9:30am and 9:30pm.",
  },
];
