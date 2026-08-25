import { useEffect, useMemo, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { Link, Route, Switch, Router as WouterRouter, useLocation, useParams } from 'wouter';
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Instagram,
  MapPin,
  Minus,
  Move3d,
  Phone,
  Plus,
  RotateCw,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import heroImage from '../attached_assets/generated_images/hero-studio.png';
import sofaImage from '../attached_assets/generated_images/sofa-rust.png';
import tableImage from '../attached_assets/generated_images/table-teak.png';
import bedImage from '../attached_assets/generated_images/bed-oak.png';
import marbleImage from '../attached_assets/generated_images/marble-console.png';

type Category = 'All pieces' | 'Sofa' | 'Dining table' | 'Furniture design' | 'Marble';

type Product = {
  id: string;
  name: string;
  category: Exclude<Category, 'All pieces'>;
  price: number;
  material: string;
  blurb: string;
  image: string;
  note: string;
  size: string;
  palette: string[];
};

type CartItem = { product: Product; quantity: number };

const products: Product[] = [
  {
    id: 'lowline-sofa',
    name: 'Lowline Sofa',
    category: 'Sofa',
    price: 48500,
    material: 'Performance linen · rust',
    blurb: 'A generous, grounded seat for long evenings.',
    image: sofaImage,
    note: 'The room starts here.',
    size: 'W 218 × D 96 × H 76 cm',
    palette: ['#ad553b', '#c78c6c', '#e5d4bf'],
  },
  {
    id: 'grain-table',
    name: 'Grain Table',
    category: 'Dining table',
    price: 38900,
    material: 'Smoked teak · hand-oiled',
    blurb: 'The everyday table, made to take a life.',
    image: tableImage,
    note: 'Gather without a reason.',
    size: 'W 180 × D 90 × H 75 cm',
    palette: ['#68432d', '#a3734b', '#d6b18a'],
  },
  {
    id: 'kora-bed',
    name: 'Kora Bed',
    category: 'Furniture design',
    price: 56200,
    material: 'Natural oak · cane',
    blurb: 'Quiet structure, woven by hand.',
    image: bedImage,
    note: 'A softer way to wake.',
    size: 'W 168 × D 208 × H 105 cm',
    palette: ['#b78d61', '#d9c2a1', '#f3eade'],
  },
  {
    id: 'mora-console',
    name: 'Mora Console',
    category: 'Marble',
    price: 27600,
    material: 'Ivory marble · walnut',
    blurb: 'A clean line with a little weight.',
    image: marbleImage,
    note: 'Useful can be beautiful.',
    size: 'W 120 × D 35 × H 78 cm',
    palette: ['#d6c9bc', '#8b6348', '#efe7dd'],
  },
];

const categories: { name: Category; count: string; descriptor: string }[] = [
  { name: 'Sofa', count: '08 pieces', descriptor: 'Sink in' },
  { name: 'Dining table', count: '05 pieces', descriptor: 'Gather around' },
  { name: 'Furniture design', count: '12 pieces', descriptor: 'Make it yours' },
  { name: 'Marble', count: '06 pieces', descriptor: 'Hold the light' },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const queryClient = new QueryClient();

function ProductCard({ product, onAdd }: { product: Product; onAdd: (product: Product) => void }) {
  return (
    <article className="product-card" data-testid={`card-product-${product.id}`}>
      <Link href={`/product/${product.id}`} className="product-image-wrap" data-testid={`link-product-image-${product.id}`}>
        <img src={product.image} alt={product.name} className="product-image" />
        <span className="image-index">01 / 04</span>
        <span className="view-chip"><Eye size={13} /> View piece</span>
      </Link>
      <div className="product-card-copy">
        <div>
          <span className="eyebrow">{product.category}</span>
          <Link href={`/product/${product.id}`} className="product-name" data-testid={`link-product-${product.id}`}>{product.name}</Link>
          <p>{product.material}</p>
        </div>
        <div className="product-card-bottom">
          <strong>{formatPrice(product.price)}</strong>
          <button className="round-action" onClick={() => onAdd(product)} aria-label={`Add ${product.name} to bag`} data-testid={`button-add-${product.id}`}>
            <Plus size={17} strokeWidth={1.7} />
          </button>
        </div>
      </div>
    </article>
  );
}

function Nav({ cartCount, onCart, onEnquire }: { cartCount: number; onCart: () => void; onEnquire: () => void }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { label: 'The collection', href: '/collection' },
    { label: 'Our approach', href: '/#approach' },
    { label: 'Visit the studio', href: '/#visit' },
  ];
  return (
    <>
      <div className="notice-bar"><span>Made for the way you live</span><span className="notice-center">Delivery available across Thane &amp; Mumbai</span><span>Open today · 11 am onwards</span></div>
      <header className="site-nav">
        <Link href="/" className="brand" data-testid="link-home"><span className="brand-mark">R</span><span>Reliable<br /><i>Furniture Works</i></span></Link>
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={location === link.href ? 'active' : ''} onClick={() => setMenuOpen(false)} data-testid={`link-nav-${link.label.toLowerCase().replaceAll(' ', '-')}`}>{link.label}</Link>
          ))}
          <button className="mobile-enquire" onClick={onEnquire} data-testid="button-mobile-enquire">Start an enquiry <ArrowRight size={14} /></button>
        </nav>
        <div className="nav-actions">
          <button className="nav-icon hide-mobile" onClick={onEnquire} aria-label="Search and enquiry" data-testid="button-search"><Search size={18} strokeWidth={1.6} /></button>
          <button className="nav-enquire hide-mobile" onClick={onEnquire} data-testid="button-enquire">Start an enquiry <ArrowRight size={15} /></button>
          <button className="bag-button" onClick={onCart} aria-label={`Open bag, ${cartCount} items`} data-testid="button-open-cart"><ShoppingBag size={19} strokeWidth={1.6} /><span>{String(cartCount).padStart(2, '0')}</span></button>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" data-testid="button-menu"><span /><span /></button>
        </div>
      </header>
    </>
  );
}

function CartDrawer({ items, open, onClose, onUpdate, onEnquire }: { items: CartItem[]; open: boolean; onClose: () => void; onUpdate: (id: string, delta: number) => void; onEnquire: () => void }) {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return (
    <div className={`drawer-layer ${open ? 'visible' : ''}`} aria-hidden={!open}>
      <button className="drawer-backdrop" onClick={onClose} aria-label="Close bag" data-testid="button-close-cart-backdrop" />
      <aside className="cart-drawer" aria-label="Shopping bag">
        <div className="drawer-head"><div><span className="eyebrow">Your selection</span><h2>The bag <sup>{items.length}</sup></h2></div><button className="close-button" onClick={onClose} aria-label="Close bag" data-testid="button-close-cart"><X size={20} /></button></div>
        {items.length === 0 ? (
          <div className="empty-bag"><ShoppingBag size={28} strokeWidth={1.2} /><p>Your bag is waiting.</p><span>Find a piece that makes the room feel like yours.</span><Link href="/collection" onClick={onClose} className="text-link" data-testid="link-browse-collection">Browse the collection <ArrowRight size={14} /></Link></div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(({ product, quantity }) => (
                <div className="cart-item" key={product.id} data-testid={`row-cart-${product.id}`}>
                  <img src={product.image} alt="" />
                  <div className="cart-item-info"><span className="eyebrow">{product.category}</span><strong>{product.name}</strong><span>{formatPrice(product.price)}</span><div className="quantity-control"><button onClick={() => onUpdate(product.id, -1)} aria-label={`Decrease ${product.name}`} data-testid={`button-decrease-${product.id}`}><Minus size={13} /></button><span data-testid={`text-quantity-${product.id}`}>{quantity}</span><button onClick={() => onUpdate(product.id, 1)} aria-label={`Increase ${product.name}`} data-testid={`button-increase-${product.id}`}><Plus size={13} /></button></div></div>
                </div>
              ))}
            </div>
            <div className="drawer-total"><span>Subtotal</span><strong data-testid="text-cart-total">{formatPrice(total)}</strong><small>Delivery is arranged personally after your enquiry.</small></div>
            <button className="button button-dark full-width" onClick={onEnquire} data-testid="button-enquire-from-cart">Enquire about your selection <ArrowRight size={16} /></button>
          </>
        )}
        <div className="drawer-foot"><MapPin size={14} /> Shop No 525 · Furniture Market, Ulhasnagar</div>
      </aside>
    </div>
  );
}

function EnquiryModal({ open, onClose, selectedName }: { open: boolean; onClose: () => void; selectedName?: string }) {
  const [sent, setSent] = useState(false);
  useEffect(() => { if (!open) setSent(false); }, [open]);
  if (!open) return null;
  return (
    <div className="modal-layer">
      <button className="drawer-backdrop" onClick={onClose} aria-label="Close enquiry" data-testid="button-close-enquiry-backdrop" />
      <div className="enquiry-modal" role="dialog" aria-modal="true">
        <button className="close-button modal-close" onClick={onClose} aria-label="Close enquiry" data-testid="button-close-enquiry"><X size={19} /></button>
        {!sent ? (
          <>
            <span className="eyebrow accent-label">A good place to start</span>
            <h2>Let&apos;s find the<br /><i>right piece.</i></h2>
            <p>Tell us a little about the room. We&apos;ll reply from the shop with considered options, not a catalogue dump.</p>
            {selectedName && <div className="selected-note"><Check size={15} /> Asking about {selectedName}</div>}
            <form onSubmit={(event) => { event.preventDefault(); setSent(true); }} className="enquiry-form">
              <label>Your name<input required placeholder="How should we call you?" data-testid="input-enquiry-name" /></label>
              <label>Phone number<input required type="tel" placeholder="+91" data-testid="input-enquiry-phone" /></label>
              <label>What are you looking for?<textarea required placeholder="A dining table for six, perhaps..." data-testid="input-enquiry-message" /></label>
              <button className="button button-dark full-width" type="submit" data-testid="button-submit-enquiry">Send enquiry <ArrowRight size={16} /></button>
            </form>
          </>
        ) : (
          <div className="enquiry-sent"><div className="sent-mark"><Check size={22} /></div><span className="eyebrow accent-label">It&apos;s on its way</span><h2>We&apos;ll be in touch<br /><i>from the shop.</i></h2><p>Thank you. A member of the Reliable team will call you shortly.</p><button className="button button-outline" onClick={onClose} data-testid="button-finish-enquiry">Back to the showroom</button></div>
        )}
      </div>
    </div>
  );
}

function Shell({ children, cartItems, onUpdate, cartOpen, setCartOpen, enquiryOpen, setEnquiryOpen, selectedName }: { children: ReactNode; cartItems: CartItem[]; onUpdate: (id: string, delta: number) => void; cartOpen: boolean; setCartOpen: (open: boolean) => void; enquiryOpen: boolean; setEnquiryOpen: (open: boolean) => void; selectedName?: string }) {
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  return <div className="app-shell"><Nav cartCount={cartCount} onCart={() => setCartOpen(true)} onEnquire={() => setEnquiryOpen(true)} />{children}<CartDrawer items={cartItems} open={cartOpen} onClose={() => setCartOpen(false)} onUpdate={onUpdate} onEnquire={() => { setCartOpen(false); setEnquiryOpen(true); }} /><EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} selectedName={selectedName} /></div>;
}

function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <div className="section-label"><span>{number}</span><span>{children}</span></div>;
}

function Home({ onAdd, onEnquire }: { onAdd: (product: Product) => void; onEnquire: () => void }) {
  const featured = products.slice(0, 3);
  return (
    <main>
      <section className="hero">
        <div className="hero-copy reveal-up"><div className="hero-kicker"><span className="dot" /> A furniture studio in Ulhasnagar</div><h1>Rooms with<br /><i>good bones.</i></h1><p>Thoughtfully chosen furniture for the rituals that make a home. Pieces with a point of view, made to stay awhile.</p><div className="hero-actions"><Link className="button button-dark" href="/collection" data-testid="link-shop-collection">Shop the collection <ArrowDownRight size={16} /></Link><button className="button button-quiet" onClick={onEnquire} data-testid="button-hero-enquire">Tell us what you need <ArrowRight size={16} /></button></div></div>
        <div className="hero-art reveal-fade"><img src={heroImage} alt="Warm Reliable Furniture Works showroom" /><div className="hero-art-note"><span>01</span><span>Objects for<br />everyday living</span></div><div className="hero-scroll">Scroll to explore <ArrowDownRight size={14} /></div></div>
        <div className="hero-stamp">RFW<br /><span>Est. locally<br />in Maharashtra</span></div>
      </section>
      <div className="marquee"><div>SOFT EDGES <span>✳</span> HONEST MATERIALS <span>✳</span> LIVED-IN BEAUTY <span>✳</span> MADE TO LAST <span>✳</span> </div></div>
      <section className="intro-section" id="approach">
        <SectionLabel number="01">The Reliable point of view</SectionLabel>
        <div className="intro-grid"><h2>Furniture that gets<br /><i>better with living.</i></h2><div className="intro-copy"><p>We look for the pieces you keep reaching for: an unshowy sofa, a table that gathers everyone, a bed that makes Monday feel softer.</p><p>Our collection is small by design. Materials you can feel. Proportions that breathe. No hurry.</p><Link href="/collection" className="text-link" data-testid="link-read-collection">See everything we love <ArrowRight size={14} /></Link></div></div>
      </section>
      <section className="featured-section">
        <div className="section-head"><SectionLabel number="02">A few good things</SectionLabel><Link href="/collection" className="text-link" data-testid="link-view-all">View all pieces <ArrowRight size={14} /></Link></div>
        <div className="product-grid">{featured.map((product, index) => <div key={product.id} className={index === 1 ? 'offset-card' : ''}><ProductCard product={product} onAdd={onAdd} /></div>)}</div>
      </section>
      <section className="category-section">
        <div className="category-intro"><SectionLabel number="03">Find your starting point</SectionLabel><p>Begin with the feeling you want the room to hold.</p></div>
        <div className="category-list">{categories.map((category, index) => <Link href={`/collection?category=${encodeURIComponent(category.name)}`} className="category-row" key={category.name} data-testid={`link-category-${category.name.toLowerCase().replaceAll(' ', '-')}`}><span className="category-num">0{index + 1}</span><span className="category-name">{category.name}</span><span className="category-desc">{category.descriptor}</span><span className="category-count">{category.count}</span><ArrowRight size={19} /></Link>)}</div>
      </section>
      <section className="visit-section" id="visit">
        <div className="visit-image"><img src={tableImage} alt="Smoked teak dining table" /><span>Made for the<br /><i>long table.</i></span></div>
        <div className="visit-copy"><SectionLabel number="04">Come by, feel the grain</SectionLabel><h2>Some things are<br /><i>better in person.</i></h2><p>See the colours in daylight. Sit for a minute. Bring your room measurements and we&apos;ll help you make sense of them.</p><div className="address"><MapPin size={17} /><div><strong>Reliable Furniture Works</strong><span>Shop No 525, opposite Bank Of Maharashtra,<br />Furniture Market, Press Bazar,<br />Ulhasnagar, Maharashtra 421002</span></div></div><div className="visit-actions"><button className="button button-dark" onClick={onEnquire} data-testid="button-visit-enquire">Plan a visit <ArrowRight size={16} /></button><span className="proof-point"><span className="tiny-stars">★</span> 3.1 local rating</span></div></div>
      </section>
      <Footer onEnquire={onEnquire} />
    </main>
  );
}

function Collection({ onAdd }: { onAdd: (product: Product) => void }) {
  const [location, setLocation] = useLocation();
  const queryCategory = new URLSearchParams(location.split('?')[1] || '').get('category') as Category | null;
  const [active, setActive] = useState<Category>(queryCategory || 'All pieces');
  const filtered = active === 'All pieces' ? products : products.filter((product) => product.category === active);
  return (
    <main className="collection-page">
      <section className="collection-hero"><div><SectionLabel number="Collection">The pieces</SectionLabel><h1>For rooms<br /><i>with a pulse.</i></h1></div><p>Furniture with a little character, a lot of tactility, and room for your life to happen around it.</p></section>
      <div className="filter-bar"><div className="filter-scroll">{(['All pieces', ...categories.map((category) => category.name)] as Category[]).map((category) => <button key={category} className={active === category ? 'filter-button active' : 'filter-button'} onClick={() => { setActive(category); setLocation(category === 'All pieces' ? '/collection' : `/collection?category=${encodeURIComponent(category)}`); }} data-testid={`button-filter-${category.toLowerCase().replaceAll(' ', '-')}`}>{category}</button>)}</div><span className="results-count">{filtered.length.toString().padStart(2, '0')} pieces</span></div>
      <section className="collection-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} />)}</section>
      <section className="collection-note"><Sparkles size={19} /><p>Can&apos;t find the exact thing? <button onClick={() => window.dispatchEvent(new CustomEvent('open-enquiry'))} data-testid="button-custom-piece">Tell us about a custom piece.</button></p></section>
      <Footer />
    </main>
  );
}

function ProductDetail({ onAdd, onEnquire }: { onAdd: (product: Product) => void; onEnquire: (name: string) => void }) {
  const params = useParams<{ id: string }>();
  const product = products.find((item) => item.id === params.id) || products[0];
  const [rotation, setRotation] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const rotate = (event: PointerEvent) => { if (dragStart !== null) setRotation((value) => value + (event.clientX - dragStart) * 0.45); };
  return (
    <main className="detail-page">
      <Link href="/collection" className="back-link" data-testid="link-back-collection"><ArrowLeft size={15} /> Back to the collection</Link>
      <div className="detail-layout">
        <div className="viewer-column">
          <div className="product-viewer" onPointerDown={(event) => { setDragStart(event.clientX); (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId); }} onPointerMove={rotate} onPointerUp={() => setDragStart(null)} onPointerLeave={() => setDragStart(null)} style={{ '--rotation': `${rotation}deg` } as CSSProperties} data-testid="viewer-product">
            <div className="viewer-grid" /><img src={product.image} alt={`${product.name} furniture detail`} className="detail-image" /><span className="viewer-label"><Move3d size={15} /> Drag to rotate</span><span className="viewer-counter">01 <i>/</i> 04</span>
          </div>
          <div className="viewer-controls"><button onClick={() => setRotation((value) => value - 20)} aria-label="Rotate left" data-testid="button-rotate-left"><ArrowLeft size={16} /></button><span><RotateCw size={14} /> 360° view</span><button onClick={() => setRotation((value) => value + 20)} aria-label="Rotate right" data-testid="button-rotate-right"><ArrowRight size={16} /></button></div>
        </div>
        <div className="detail-copy"><span className="eyebrow accent-label">{product.category} · 01 / 04</span><h1>{product.name}</h1><p className="detail-blurb">{product.blurb}</p><div className="detail-price">{formatPrice(product.price)} <span>incl. taxes</span></div><div className="detail-rule" /><div className="detail-meta"><div><span className="eyebrow">Material</span><strong>{product.material}</strong></div><div><span className="eyebrow">Dimensions</span><strong>{product.size}</strong></div></div><div className="palette"><span className="eyebrow">Available tones</span><div>{product.palette.map((color) => <span key={color} style={{ backgroundColor: color }} />)}</div></div><button className={`button button-dark full-width ${added ? 'button-added' : ''}`} onClick={() => { onAdd(product); setAdded(true); setTimeout(() => setAdded(false), 1800); }} data-testid="button-add-to-bag">{added ? <><Check size={16} /> Added to your bag</> : <>Add to your bag <Plus size={16} /></>}</button><button className="detail-enquire" onClick={() => onEnquire(product.name)} data-testid="button-detail-enquire">Have a question about this piece? <ArrowRight size={14} /></button><div className="detail-assurance"><div><Check size={14} /><span>Delivery available</span></div><div><Check size={14} /><span>Visit in Ulhasnagar</span></div><div><Check size={14} /><span>Made for real homes</span></div></div></div>
      </div>
      <section className="detail-story"><div className="story-quote"><span className="eyebrow">The thinking behind it</span><h2>&ldquo;{product.note}&rdquo;</h2></div><div><p>Good furniture doesn&apos;t ask to be admired from a distance. It earns its place slowly — with a coffee ring, a late dinner, a Sunday nap.</p><Link href="/#visit" className="text-link" data-testid="link-detail-visit">Visit the studio <ArrowRight size={14} /></Link></div></section>
      <Footer />
    </main>
  );
}

function Footer({ onEnquire }: { onEnquire?: () => void }) {
  return <footer className="site-footer"><div className="footer-top"><div className="footer-brand"><span className="brand-mark">R</span><h2>Reliable<br /><i>Furniture Works</i></h2><p>Thoughtful pieces<br />for lived-in rooms.</p></div><div className="footer-links"><div><span className="eyebrow">Explore</span><Link href="/collection" data-testid="link-footer-collection">The collection</Link><Link href="/#approach" data-testid="link-footer-approach">Our approach</Link><Link href="/#visit" data-testid="link-footer-visit">Visit the studio</Link></div><div><span className="eyebrow">Talk to us</span><button onClick={onEnquire} data-testid="button-footer-enquire">Start an enquiry <ArrowRight size={14} /></button><a href="tel:+912512700525" data-testid="link-footer-phone"><Phone size={14} /> +91 251 270 0525</a><a href="https://instagram.com" target="_blank" rel="noreferrer" data-testid="link-footer-instagram"><Instagram size={14} /> Instagram</a></div></div></div><div className="footer-bottom"><span>© 2024 Reliable Furniture Works</span><span>Made locally in Maharashtra</span><span>Furniture Market · Press Bazar</span></div></footer>;
}

function RouterView({ onAdd, onEnquire }: { onAdd: (product: Product) => void; onEnquire: (name?: string) => void }) {
  return <Switch><Route path="/collection"><Collection onAdd={onAdd} /></Route><Route path="/product/:id"><ProductDetail onAdd={onAdd} onEnquire={onEnquire} /></Route><Route path="/"><Home onAdd={onAdd} onEnquire={() => onEnquire()} /></Route><Route component={NotFound} /></Switch>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedName, setSelectedName] = useState<string>();
  const addToCart = (product: Product) => setCartItems((items) => { const existing = items.find((item) => item.product.id === product.id); return existing ? items.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { product, quantity: 1 }]; });
  const updateCart = (id: string, delta: number) => setCartItems((items) => items.flatMap((item) => item.product.id === id ? (item.quantity + delta > 0 ? [{ ...item, quantity: item.quantity + delta }] : []) : [item]));
  const openEnquiry = (name?: string) => { setSelectedName(name); setEnquiryOpen(true); };
  useEffect(() => { const open = () => openEnquiry(); window.addEventListener('open-enquiry', open); return () => window.removeEventListener('open-enquiry', open); }, []);
  const shellProps = useMemo(() => ({ cartItems, onUpdate: updateCart, cartOpen, setCartOpen, enquiryOpen, setEnquiryOpen, selectedName }), [cartItems, cartOpen, enquiryOpen, selectedName]);
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><RoutedErrorBoundary><Shell {...shellProps}>{<RouterView onAdd={addToCart} onEnquire={openEnquiry} />}</Shell></RoutedErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;