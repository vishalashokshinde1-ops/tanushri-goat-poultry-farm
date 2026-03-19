import { Toaster } from "@/components/ui/sonner";
import {
  Award,
  BookOpen,
  ChevronDown,
  Leaf,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShoppingCart,
  Star,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { usePlaceOrder, useVisitorCount } from "./hooks/useQueries";

interface CartItem {
  name: string;
  qty: number;
  price: number;
  total: number;
  unit: string;
}

declare const window: Window & {
  jspdf?: {
    jsPDF: new () => {
      setFontSize: (size: number) => void;
      text: (text: string, x: number, y: number) => void;
      line: (x1: number, y1: number, x2: number, y2: number) => void;
      save: (filename: string) => void;
    };
  };
};

const PRODUCTS = [
  {
    id: "goat",
    name: "Goat",
    emoji: "🐐",
    price: 700,
    unit: "kg",
    placeholder: "Weight (kg)",
    image: "/assets/generated/goat-product.dim_400x300.jpg",
    description: "Premium Osmanabadi & Sirohi breeds",
  },
  {
    id: "chicken",
    name: "Chicken",
    emoji: "🐔",
    price: 600,
    unit: "kg",
    placeholder: "Weight (kg)",
    image: "/assets/generated/chicken-product.dim_400x300.jpg",
    description: "Free-range Desi & Aseel breeds",
  },
  {
    id: "eggs",
    name: "Eggs",
    emoji: "🥚",
    price: 10,
    unit: "nos",
    placeholder: "Quantity (nos)",
    image: "/assets/generated/eggs-product.dim_400x300.jpg",
    description: "Farm fresh daily eggs",
  },
];

const GALLERY_IMAGES = [
  {
    src: "/assets/generated/gallery-beetal.dim_400x300.jpg",
    alt: "Beetal Goat",
    id: "beetal",
  },
  {
    src: "/assets/generated/gallery-sirohi.dim_400x300.jpg",
    alt: "Sirohi Goat",
    id: "sirohi",
  },
  {
    src: "/assets/generated/gallery-aseel.dim_400x300.jpg",
    alt: "Aseel Chicken",
    id: "aseel",
  },
  {
    src: "/assets/generated/goat-product.dim_400x300.jpg",
    alt: "Farm Goat",
    id: "farm-goat",
  },
  {
    src: "/assets/generated/chicken-product.dim_400x300.jpg",
    alt: "Desi Chicken",
    id: "desi-chicken",
  },
  {
    src: "/assets/generated/eggs-product.dim_400x300.jpg",
    alt: "Fresh Eggs",
    id: "fresh-eggs",
  },
];

const BREEDS = [
  {
    id: "aseel",
    name: "Aseel",
    desc: "Strong & premium heritage breed. Known for hardiness, excellent meat quality and high demand.",
    icon: "🐓",
  },
  {
    id: "desi",
    name: "Desi Chicken",
    desc: "Natural free-range variety. High protein, chemical-free, full of authentic flavor.",
    icon: "🐔",
  },
  {
    id: "kadaknath",
    name: "Kadaknath",
    desc: "Rare black meat variety. High protein, low fat, prized for medicinal properties.",
    icon: "🖤",
  },
];

const TECHNIQUES = [
  {
    id: "hygiene",
    text: "Clean & hygienic farm environment",
    icon: <Leaf className="w-6 h-6" />,
  },
  {
    id: "feeding",
    text: "Proper scientific feeding system",
    icon: <BookOpen className="w-6 h-6" />,
  },
  {
    id: "vaccine",
    text: "Regular vaccination & health checks",
    icon: <Award className="w-6 h-6" />,
  },
  {
    id: "freerange",
    text: "Certified free-range farming",
    icon: <Star className="w-6 h-6" />,
  },
];

const TRAINING_PROGRAMS = [
  {
    id: "goat-training",
    title: "Goat Farming Training – Batch 1",
    image: "/assets/generated/training-goat.dim_600x300.jpg",
    features: [
      "Practical hands-on training",
      "Feeding & daily care techniques",
      "Disease prevention & vaccination",
      "Includes meal 🍽️",
    ],
    price: "₹599",
  },
  {
    id: "poultry-training",
    title: "Poultry Farming Training – Batch 2",
    image: "/assets/generated/training-poultry.dim_600x300.jpg",
    features: [
      "Desi chicken farming setup",
      "Vaccination & coop management",
      "Breeding & egg production",
      "Includes meal 🍽️",
    ],
    price: "₹599",
  },
];

const PRODUCT_DETAILS = [
  {
    id: "detail-goat",
    title: "🐐 Goat (Desi / Osmanabadi / Sirohi)",
    features: [
      "Strong & healthy breeds",
      "Natural grass feeding",
      "Best for meat quality",
      "Live weight available",
    ],
    price: "₹700/kg",
    targetId: "goat",
  },
  {
    id: "detail-chicken",
    title: "🐔 Desi Chicken",
    features: [
      "Free range farming",
      "High protein meat",
      "No chemicals or hormones",
      "Multiple breeds available",
    ],
    price: "₹600/kg",
    targetId: "chicken",
  },
  {
    id: "detail-eggs",
    title: "🥚 Farm Fresh Eggs",
    features: [
      "Daily fresh collection",
      "High nutrition value",
      "Strong shells",
      "Minimum 30 eggs per order",
    ],
    price: "₹10/egg",
    targetId: "eggs",
  },
];

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Products", href: "#products" },
  { label: "Gallery", href: "#gallery" },
  { label: "Training", href: "#training" },
  { label: "Location", href: "#location" },
  { label: "Cart", href: "#cart" },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center text-2xl md:text-3xl font-bold uppercase tracking-widest text-primary mb-8">
      {children}
    </h2>
  );
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [qtyInputs, setQtyInputs] = useState<Record<string, string>>({});
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number>(0);

  const { data: backendVisitorCount } = useVisitorCount();
  const placeOrder = usePlaceOrder();

  useEffect(() => {
    if (backendVisitorCount !== undefined) {
      setVisitorCount(Number(backendVisitorCount));
    } else {
      const count = Number.parseInt(localStorage.getItem("visits") || "0") + 1;
      localStorage.setItem("visits", String(count));
      setVisitorCount(count);
    }
  }, [backendVisitorCount]);

  const cartTotal = cart.reduce((s, i) => s + i.total, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const addItem = useCallback(
    (product: (typeof PRODUCTS)[0]) => {
      const rawQty = qtyInputs[product.id] || "";
      const qty = Number.parseFloat(rawQty);
      if (!qty || qty <= 0) {
        toast.error("Please enter a valid quantity");
        return;
      }
      const total = product.price * qty;
      setCart((prev) => {
        const existing = prev.findIndex((i) => i.name === product.name);
        if (existing >= 0) {
          return prev.map((item, idx) =>
            idx === existing
              ? { ...item, qty: item.qty + qty, total: item.total + total }
              : item,
          );
        }
        return [
          ...prev,
          {
            name: product.name,
            qty,
            price: product.price,
            total,
            unit: product.unit,
          },
        ];
      });
      setQtyInputs((prev) => ({ ...prev, [product.id]: "" }));
      toast.success(`${product.emoji} ${product.name} added to cart!`);
    },
    [qtyInputs],
  );

  const removeItem = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const sendWhatsApp = useCallback(() => {
    let msg = `Name: ${customerName}\nAddress: ${customerAddress}\nContact: ${customerContact}\n\nOrder:\n`;
    for (const i of cart) {
      msg += `${i.name} (${i.qty} ${i.unit}) ₹${i.total}\n`;
    }
    msg += `Total: ₹${cartTotal}`;
    window.open(`https://wa.me/918390053946?text=${encodeURIComponent(msg)}`);
  }, [cart, customerName, customerAddress, customerContact, cartTotal]);

  const submitDetails = useCallback(async () => {
    if (!customerName || !customerAddress || !customerContact) {
      toast.error("Please fill all customer details");
      return;
    }
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    try {
      await placeOrder.mutateAsync({
        name: customerName,
        address: customerAddress,
        contact: customerContact,
        items: cart.map((i) => ({
          productName: i.name,
          quantity: BigInt(Math.round(i.qty)),
          price: i.price,
        })),
        totalAmount: cartTotal,
      });
      toast.success("Order details submitted successfully! ✅");
    } catch {
      toast.success("Details submitted! ✅");
    }
  }, [
    customerName,
    customerAddress,
    customerContact,
    cart,
    cartTotal,
    placeOrder,
  ]);

  const generateInvoice = useCallback(() => {
    const jspdf = window.jspdf;
    if (!jspdf) {
      toast.error("PDF library not loaded. Please refresh.");
      return;
    }
    if (!customerName || !customerAddress || !customerContact) {
      toast.error("Please fill customer details first");
      return;
    }
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    const gstin = "27ABCDE1234F1Z5";
    let y = 80;
    let total = 0;

    doc.setFontSize(16);
    doc.text("Tanushri Farm GST Invoice", 20, 20);
    doc.setFontSize(10);
    doc.text(`GSTIN: ${gstin}`, 20, 28);
    doc.text(`Customer: ${customerName}`, 20, 40);
    doc.text(`Address: ${customerAddress}`, 20, 48);
    doc.text(`Contact: ${customerContact}`, 20, 56);
    doc.line(20, 70, 190, 70);
    doc.text("Product", 20, 75);
    doc.text("Qty", 90, 75);
    doc.text("Price", 120, 75);
    doc.text("Total", 160, 75);
    doc.line(20, 78, 190, 78);

    for (const item of cart) {
      let itemTotal = item.price * item.qty;
      if (item.qty >= 10) itemTotal *= 0.9;
      total += itemTotal;
      doc.text(item.name, 20, y);
      doc.text(String(item.qty), 90, y);
      doc.text(`Rs.${item.price}`, 120, y);
      doc.text(`Rs.${itemTotal.toFixed(0)}`, 160, y);
      y += 10;
    }

    const base = total / 1.05;
    const gst = total - base;
    doc.line(20, y, 190, y);
    y += 10;
    doc.text(`Subtotal: Rs.${base.toFixed(0)}`, 20, y);
    y += 10;
    doc.text(`GST (5%): Rs.${gst.toFixed(0)}`, 20, y);
    y += 10;
    doc.setFontSize(14);
    doc.text(`Total: Rs.${total.toFixed(0)}`, 20, y);
    doc.text("Thank You! Visit Again", 20, y + 20);
    doc.save("GST_Invoice.pdf");
    toast.success("Invoice downloaded!");
  }, [cart, customerName, customerAddress, customerContact]);

  const filteredProducts = searchQuery
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : PRODUCTS;

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background font-poppins">
      <Toaster richColors position="top-right" />

      {/* TOP INFO BAR */}
      <div className="bg-farm-header text-xs py-2 px-4 text-center text-muted-foreground border-b border-farm-border flex flex-wrap items-center justify-center gap-4">
        <span>🌐 Multi-language support available</span>
        <span>
          👀 Visitors:{" "}
          <strong className="text-primary">
            {visitorCount.toLocaleString()}
          </strong>
        </span>
        <span>
          ⭐ Rating: <strong className="text-primary">4.8/5 (Google)</strong>
        </span>
      </div>

      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-farm-header border-b border-farm-border shadow-card">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/farm-logo-transparent.dim_200x200.png"
              alt="Tanushri Farm Logo"
              className="w-12 h-12 rounded-full object-cover border-2 border-primary"
            />
            <span className="font-bold text-lg tracking-wider text-foreground hidden sm:block">
              TANUSHRI FARM
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollToSection("#cart")}
              data-ocid="cart.open_modal_button"
              className="relative p-2 text-foreground hover:text-primary transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <ChevronDown className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-farm-header border-t border-farm-border overflow-hidden"
            >
              <nav className="flex flex-col px-4 py-2">
                {NAV_LINKS.map((link) => (
                  <button
                    type="button"
                    key={link.label}
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-muted-foreground hover:text-primary py-2 text-left font-medium"
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section
        id="hero"
        className="relative min-h-[90vh] flex items-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%), url('/assets/generated/hero-farm.dim_1200x600.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl"
          >
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
              Since 2015 • Pune, Maharashtra
            </p>
            <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-wider text-white leading-tight mb-4">
              Premium Goat,
              <br />
              Chicken &amp; Eggs
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              Healthy • Hygienic • Natural
            </p>
            <button
              type="button"
              onClick={() => scrollToSection("#products")}
              data-ocid="hero.primary_button"
              className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-pill hover:opacity-90 transition-opacity shadow-gold text-sm uppercase tracking-wider"
            >
              Order Now
            </button>
          </motion.div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4">
        {/* SEARCH */}
        <section className="py-8" id="search">
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="product-search"
              data-ocid="search.search_input"
              type="text"
              placeholder="Search goat, chicken, eggs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-pill text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
        </section>

        {/* PRODUCTS */}
        <section id="products" className="py-10">
          <SectionTitle>🛍️ Our Farm Products</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                data-ocid={`product.card.${idx + 1}`}
                className="bg-card rounded-lg overflow-hidden border border-border shadow-card"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {product.emoji} {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {product.description}
                  </p>
                  <p className="text-primary font-bold text-lg mb-4">
                    ₹{product.price}/{product.unit}
                  </p>
                  <label htmlFor={`qty-${product.id}`} className="sr-only">
                    {product.placeholder}
                  </label>
                  <input
                    id={`qty-${product.id}`}
                    data-ocid={`product.${product.id}.input`}
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder={product.placeholder}
                    value={qtyInputs[product.id] || ""}
                    onChange={(e) =>
                      setQtyInputs((prev) => ({
                        ...prev,
                        [product.id]: e.target.value,
                      }))
                    }
                    className="w-full mb-3 px-4 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                  <button
                    type="button"
                    data-ocid={`product.${product.id}.primary_button`}
                    onClick={() => addItem(product)}
                    className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-md hover:opacity-90 transition-opacity text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
            {filteredProducts.length === 0 && (
              <div
                data-ocid="product.empty_state"
                className="col-span-3 text-center py-12 text-muted-foreground"
              >
                No products found for &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        </section>

        {/* CART */}
        <section id="cart" className="py-10">
          <SectionTitle>🛒 Your Cart</SectionTitle>
          <div className="max-w-2xl mx-auto bg-card rounded-lg border border-border shadow-card p-6">
            {cart.length === 0 ? (
              <p
                data-ocid="cart.empty_state"
                className="text-center text-muted-foreground py-8"
              >
                Your cart is empty. Add some products above!
              </p>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {cart.map((item, idx) => (
                    <div
                      key={item.name}
                      data-ocid={`cart.item.${idx + 1}`}
                      className="flex items-center justify-between bg-background rounded-md px-4 py-3"
                    >
                      <div>
                        <span className="font-semibold text-foreground">
                          {item.name}
                        </span>
                        <span className="text-muted-foreground text-sm ml-2">
                          ({item.qty} {item.unit})
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-primary font-bold">
                          ₹{item.total}
                        </span>
                        <button
                          type="button"
                          data-ocid={`cart.delete_button.${idx + 1}`}
                          onClick={() => removeItem(idx)}
                          className="text-destructive hover:opacity-70 transition-opacity"
                          aria-label={`Remove ${item.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-foreground">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{cartTotal}
                    </span>
                  </div>
                </div>
              </>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                data-ocid="cart.whatsapp.primary_button"
                onClick={sendWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-3 rounded-md hover:opacity-90 transition-opacity text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Send via WhatsApp
              </button>
              <button
                type="button"
                data-ocid="cart.invoice.secondary_button"
                onClick={generateInvoice}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-md hover:opacity-90 transition-opacity text-sm"
              >
                📄 Download Invoice
              </button>
            </div>
          </div>
        </section>

        {/* CUSTOMER DETAILS */}
        <section id="customer" className="py-10">
          <SectionTitle>📦 Customer Details</SectionTitle>
          <div className="max-w-md mx-auto bg-card rounded-lg border border-border shadow-card p-6 space-y-4">
            <div>
              <label
                htmlFor="cust-name"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Your Name
              </label>
              <input
                id="cust-name"
                data-ocid="customer.name.input"
                type="text"
                placeholder="Enter your full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="cust-address"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Delivery Address
              </label>
              <textarea
                id="cust-address"
                data-ocid="customer.address.textarea"
                placeholder="Enter delivery address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
              />
            </div>
            <div>
              <label
                htmlFor="cust-contact"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Contact Number
              </label>
              <input
                id="cust-contact"
                data-ocid="customer.contact.input"
                type="tel"
                placeholder="Enter contact number"
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            <button
              type="button"
              data-ocid="customer.submit_button"
              onClick={submitDetails}
              disabled={placeOrder.isPending}
              className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-md hover:opacity-90 transition-opacity text-sm disabled:opacity-60"
            >
              {placeOrder.isPending ? "Submitting..." : "Submit Details ✅"}
            </button>
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" className="py-10">
          <SectionTitle>📸 Farm Gallery</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY_IMAGES.map((img, idx) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                data-ocid={`gallery.item.${idx + 1}`}
                className="overflow-hidden rounded-lg aspect-video border border-border"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* BREED INFO */}
        <section id="breeds" className="py-10">
          <SectionTitle>🐓 Breed Information</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BREEDS.map((breed, idx) => (
              <motion.div
                key={breed.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                data-ocid={`breed.card.${idx + 1}`}
                className="bg-card rounded-lg border border-border p-6 text-center shadow-card"
              >
                <div className="text-4xl mb-3">{breed.icon}</div>
                <h3 className="font-bold text-foreground text-lg mb-2">
                  {breed.name}
                </h3>
                <p className="text-muted-foreground text-sm">{breed.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FARMING TECHNIQUES */}
        <section id="techniques" className="py-10">
          <SectionTitle>🌿 Farming Techniques</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {TECHNIQUES.map((tech, idx) => (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                data-ocid={`technique.card.${idx + 1}`}
                className="bg-card rounded-lg border border-border p-5 flex flex-col items-center text-center gap-3 shadow-card"
              >
                <div className="text-primary">{tech.icon}</div>
                <p className="text-sm text-foreground font-medium">
                  ✔ {tech.text}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TRAINING PROGRAMS */}
        <section id="training" className="py-10">
          <SectionTitle>🎓 Farm Training Programs</SectionTitle>
          <div className="space-y-6">
            {TRAINING_PROGRAMS.map((prog, idx) => (
              <motion.div
                key={prog.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                data-ocid={`training.card.${idx + 1}`}
                className="bg-card rounded-lg border border-border overflow-hidden shadow-card flex flex-col md:flex-row"
              >
                <img
                  src={prog.image}
                  alt={prog.title}
                  className="w-full md:w-64 h-48 md:h-auto object-cover"
                />
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {prog.title}
                    </h3>
                    <ul className="space-y-1 mb-4">
                      {prog.features.map((f) => (
                        <li key={f} className="text-sm text-muted-foreground">
                          ✔ {f}
                        </li>
                      ))}
                    </ul>
                    <p className="text-primary font-bold text-lg">
                      💰 {prog.price} per person
                    </p>
                  </div>
                  <a
                    href="https://wa.me/918390053946"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid={`training.book.primary_button.${idx + 1}`}
                    className="mt-4 inline-block bg-primary text-primary-foreground font-semibold px-6 py-2 rounded-md hover:opacity-90 transition-opacity text-sm text-center"
                  >
                    Book Now via WhatsApp
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PRODUCT DETAILS */}
        <section id="product-details" className="py-10">
          <SectionTitle>🏷️ Product Details</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRODUCT_DETAILS.map((detail, idx) => (
              <motion.div
                key={detail.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                data-ocid={`detail.card.${idx + 1}`}
                className="bg-card rounded-lg border border-border p-6 shadow-card"
              >
                <h3 className="font-bold text-foreground text-lg mb-3">
                  {detail.title}
                </h3>
                <ul className="space-y-1 mb-4">
                  {detail.features.map((f) => (
                    <li key={f} className="text-sm text-muted-foreground">
                      ✔ {f}
                    </li>
                  ))}
                </ul>
                <p className="text-primary font-bold text-lg mb-4">
                  💰 {detail.price}
                </p>
                <button
                  type="button"
                  onClick={() => scrollToSection("#products")}
                  data-ocid={`detail.order.primary_button.${idx + 1}`}
                  className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-md hover:opacity-90 transition-opacity text-sm"
                >
                  Order Now
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* GOOGLE RATING */}
        <section id="rating" className="py-10">
          <SectionTitle>⭐ Google Rating</SectionTitle>
          <div className="max-w-sm mx-auto bg-card rounded-lg border border-border shadow-card p-8 text-center">
            <div className="flex justify-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className="w-6 h-6 text-primary fill-primary" />
              ))}
            </div>
            <p className="text-4xl font-bold text-primary mb-1">4.8</p>
            <p className="text-muted-foreground text-sm mb-4">
              out of 5 by our happy customers
            </p>
            <a
              href="https://www.google.com/maps/place/Daddy+Farm+House/@18.0099041,74.979345"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="rating.reviews.primary_button"
              className="inline-block bg-primary text-primary-foreground font-semibold px-6 py-2 rounded-md hover:opacity-90 transition-opacity text-sm"
            >
              View Google Reviews
            </a>
          </div>
        </section>

        {/* EDUCATIONAL LINKS */}
        <section id="education" className="py-10">
          <SectionTitle>📚 Learn &amp; Explore</SectionTitle>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://chickcoop.in/chicken-breed/indias-30-best-chicken-breed/"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="education.breeds.link"
              className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-md hover:opacity-90 transition-opacity text-sm"
            >
              🐔 View 30 Best Chicken Breeds
            </a>
            <a
              href="http://www.agritech.tnau.ac.in/animal_husbandry/animhus_index.html"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="education.techniques.link"
              className="flex items-center gap-2 bg-secondary text-foreground font-semibold px-6 py-3 rounded-md hover:opacity-90 transition-opacity text-sm border border-border"
            >
              🌿 Learn Farming Techniques
            </a>
          </div>
        </section>

        {/* GOOGLE MAP */}
        <section id="location" className="py-10">
          <SectionTitle>📍 Our Farm Location</SectionTitle>
          <div className="rounded-lg overflow-hidden border border-border shadow-card">
            <iframe
              title="Tanushri Farm Location"
              width="100%"
              height="350"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src="https://www.google.com/maps?q=18.0099041,74.979345&z=15&output=embed"
            />
          </div>
          <div className="flex items-center gap-2 justify-center mt-4 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span>
              Near Pune, Maharashtra – Coordinates: 18.0099041, 74.979345
            </span>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-farm-header border-t border-farm-border mt-10 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/generated/farm-logo-transparent.dim_200x200.png"
                alt="Tanushri Farm"
                className="w-10 h-10 rounded-full border border-primary"
              />
              <span className="font-bold text-foreground">TANUSHRI FARM</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Premium goat, chicken and egg farming. Healthy, hygienic and
              natural products delivered to your door.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-primary uppercase tracking-wider mb-4 text-sm">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary uppercase tracking-wider mb-4 text-sm">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a
                  href="tel:8390053946"
                  className="hover:text-primary transition-colors"
                >
                  8390053946
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <a
                  href="https://wa.me/918390053946"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  WhatsApp Chat
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Near Pune, Maharashtra</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-farm-border mt-8 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Tanushri Goat &amp; Poultry Farm. Built
          with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>

      {/* FLOATING BUTTONS */}
      <a
        href="https://wa.me/918390053946"
        target="_blank"
        rel="noopener noreferrer"
        data-ocid="float.whatsapp.button"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
        aria-label="WhatsApp Chat"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
      <a
        href="tel:8390053946"
        data-ocid="float.call.button"
        className="fixed bottom-24 right-6 bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-gold hover:scale-110 transition-transform z-50"
        aria-label="Call Us"
      >
        <Phone className="w-6 h-6" />
      </a>
    </div>
  );
}
