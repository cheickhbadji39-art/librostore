import { useState, useEffect, useReducer, createContext, useContext, useRef, useCallback } from "react";
import { supabase } from './supabase.js'

// ─── CATALOGUE COMPLET ──────────────────────────────────────────────────────
const BOOKS_DB = [
  // Littérature africaine & sénégalaise
  { id: 1, title: "Les Bouts de Bois de Dieu", author: "Ousmane Sembène", price: 12.50, category: "Littérature africaine", origin: "Sénégal", cover: "", emoji: "✊", rating: 4.9, stock: 18, description: "Le roman phare de Sembène retrace la grande grève des cheminots Dakar-Niger de 1947-48. Une fresque épique sur la lutte ouvrière et la dignité humaine en Afrique coloniale.", sold: 620, reviews: [{ user: "Aminata D.", note: 5, text: "Un chef-d'œuvre absolu. Sembène capture l'âme du peuple sénégalais avec une puissance rare." }, { user: "Jean M.", note: 5, text: "Incontournable. Une lecture qui transforme." }], tags: ["grève", "colonisation", "Sénégal"] },
  { id: 2, title: "Une Si Longue Lettre", author: "Mariama Bâ", price: 9.90, category: "Littérature africaine", origin: "Sénégal", cover: "", emoji: "✉️", rating: 4.8, stock: 22, description: "Épistolaire bouleversant sur la condition des femmes sénégalaises face à la polygamie. Prix Noma 1980, traduit en 16 langues. Un monument de la littérature mondiale.", sold: 540, reviews: [{ user: "Fatou S.", note: 5, text: "Ce livre m'a changé la vie. Mariama Bâ parle de nous toutes." }], tags: ["femme", "polygamie", "société"] },
  { id: 3, title: "L'Aventure Ambiguë", author: "Cheikh Hamidou Kane", price: 10.50, category: "Littérature africaine", origin: "Sénégal", cover: "", emoji: "🌍", rating: 4.7, stock: 15, description: "Le roman philosophique de référence sur le choc des cultures entre Afrique traditionnelle et Occident moderne. Une œuvre d'une profondeur intellectuelle remarquable.", sold: 480, reviews: [{ user: "Moussa K.", note: 5, text: "La question qu'il pose reste d'une actualité brûlante aujourd'hui." }], tags: ["philosophie", "culture", "identité"] },
  { id: 4, title: "La Grève des Bàttu", author: "Aminata Sow Fall", price: 11.00, category: "Littérature africaine", origin: "Sénégal", cover: "", emoji: "🏙️", rating: 4.6, stock: 12, description: "Les mendiants de Dakar décident de faire grève, paralysant une ville dont l'économie spirituelle dépend d'eux. Une satire sociale brillante et originale.", sold: 310, reviews: [{ user: "Dieynaba N.", note: 4, text: "Une ironie magnifique. Sow Fall au sommet de son art." }], tags: ["satire", "Dakar", "société"] },
  { id: 5, title: "Doomi Golo", author: "Boubacar Boris Diop", price: 13.00, category: "Littérature africaine", origin: "Sénégal", cover: "", emoji: "🦊", rating: 4.5, stock: 9, description: "Écrit originellement en wolof, ce roman explore la mémoire, l'identité et la transmission à travers une correspondance intergénérationnelle. Premier grand roman en wolof.", sold: 195, reviews: [], tags: ["wolof", "mémoire", "identité"] },
  { id: 6, title: "Xala", author: "Ousmane Sembène", price: 9.50, category: "Littérature africaine", origin: "Sénégal", cover: "", emoji: "💼", rating: 4.7, stock: 14, description: "Adapté en film par l'auteur lui-même, Xala est une satire féroce de la bourgeoisie sénégalaise post-coloniale et de ses contradictions.", sold: 360, reviews: [{ user: "Omar T.", note: 5, text: "Sembène visionnaire. Ce livre décrit encore notre actualité." }], tags: ["satire", "bourgeoisie", "post-colonialisme"] },
  { id: 7, title: "Quand on Refuse on dit Non", author: "Ahmadou Kourouma", price: 10.00, category: "Littérature africaine", origin: "Côte d'Ivoire", cover: "", emoji: "⚔️", rating: 4.6, stock: 8, description: "Dernier roman de Kourouma, publié posthumément. Birahima traverse la guerre civile ivoirienne avec son regard d'enfant soldier implacable.", sold: 270, reviews: [], tags: ["guerre", "enfance", "Afrique de l'Ouest"] },
  { id: 8, title: "Americanah", author: "Chimamanda Ngozi Adichie", price: 14.90, category: "Littérature africaine", origin: "Nigeria", cover: "", emoji: "🗽", rating: 4.9, stock: 25, description: "Ifemelu quitte le Nigeria pour les États-Unis. Un roman magistral sur la race, l'amour et l'identité dans le monde globalisé. Un des grands livres du XXIe siècle.", sold: 890, reviews: [{ user: "Aïssatou B.", note: 5, text: "Impossible à poser. Adichie est une génie." }, { user: "Marie L.", note: 5, text: "Le meilleur roman que j'ai lu depuis des années." }], tags: ["diaspora", "race", "amour"] },
  { id: 9, title: "Sozaboy", author: "Ken Saro-Wiwa", price: 11.50, category: "Littérature africaine", origin: "Nigeria", cover: "", emoji: "🪖", rating: 4.5, stock: 7, description: "Écrit dans un pidgin anglais inventé, ce roman anti-guerre suit un jeune Nigérian aspiré dans le conflit. Une œuvre unique dans sa forme et bouleversante dans son fond.", sold: 215, reviews: [], tags: ["guerre", "Nigeria", "langue"] },
  // Classiques mondiaux
  { id: 10, title: "Dune", author: "Frank Herbert", price: 14.90, category: "Science-Fiction", origin: "USA", cover: "", emoji: "🏜️", rating: 4.9, stock: 12, description: "L'épopée galactique ultime. Sur la planète Arrakis, Paul Atréides découvre son destin messianique au milieu d'intrigues politiques et de batailles cosmiques.", sold: 740, reviews: [{ user: "Serigne D.", note: 5, text: "La SF à son apogée. Un univers d'une richesse incroyable." }], tags: ["épopée", "politique", "destin"] },
  { id: 11, title: "1984", author: "George Orwell", price: 11.90, category: "Dystopie", origin: "UK", cover: "", emoji: "👁️", rating: 4.7, stock: 18, description: "Dans l'Océania totalitaire, Winston Smith ose penser librement. Un roman visionnaire sur la surveillance, la manipulation et la résistance. Plus actuel que jamais.", sold: 820, reviews: [{ user: "Awa C.", note: 5, text: "À lire absolument en 2026. Orwell avait tout prévu." }], tags: ["surveillance", "liberté", "totalitarisme"] },
  { id: 12, title: "Cent ans de Solitude", author: "Gabriel García Márquez", price: 13.50, category: "Réalisme magique", origin: "Colombie", cover: "", emoji: "🦋", rating: 4.9, stock: 10, description: "L'histoire de la famille Buendía à Macondo. Le sommet du réalisme magique latino-américain, Prix Nobel de Littérature. Une expérience de lecture sans équivalent.", sold: 650, reviews: [{ user: "Lamine S.", note: 5, text: "La lecture la plus envoûtante de ma vie." }], tags: ["famille", "temps", "magie"] },
  { id: 13, title: "Le Meilleur des Mondes", author: "Aldous Huxley", price: 9.90, category: "Dystopie", origin: "UK", cover: "", emoji: "🧬", rating: 4.5, stock: 14, description: "Une humanité conditionée au bonheur parfait et à la consommation. La dystopie la plus prophétique du XXe siècle sur notre addiction au confort et au divertissement.", sold: 510, reviews: [], tags: ["bonheur", "contrôle", "société"] },
  { id: 14, title: "Le Seigneur des Anneaux", author: "J.R.R. Tolkien", price: 24.90, category: "Fantastique", origin: "UK", cover: "", emoji: "💍", rating: 5.0, stock: 10, description: "L'épopée fantasy fondatrice. Frodon et ses compagnons traversent la Terre du Milieu pour détruire l'Anneau Unique. Une mythologie complète, une œuvre de toute une vie.", sold: 960, reviews: [{ user: "Ibrahima F.", note: 5, text: "Le monument de la fantasy. Rien d'équivalent n'existe." }], tags: ["épopée", "amitié", "quête"] },
  { id: 15, title: "Sapiens", author: "Yuval Noah Harari", price: 16.90, category: "Non-Fiction", origin: "Israël", cover: "", emoji: "🦴", rating: 4.6, stock: 20, description: "Comment l'Homo Sapiens a conquis la planète ? Harari retrace 70 000 ans d'histoire humaine avec une clarté et une audace intellectuelle rares.", sold: 840, reviews: [{ user: "Ndéye F.", note: 5, text: "Fascinant du début à la fin. Ma vision du monde a changé." }], tags: ["histoire", "humanité", "société"] },
  { id: 16, title: "L'Alchimiste", author: "Paulo Coelho", price: 10.90, category: "Philosophie", origin: "Brésil", cover: "", emoji: "⭐", rating: 4.7, stock: 30, description: "Santiago, jeune berger andalou, part à la recherche de son trésor personnel à travers le désert du Sahara. Une fable philosophique sur le destin et l'écoute de son cœur.", sold: 1100, reviews: [{ user: "Khadija M.", note: 5, text: "Ce livre m'a donné le courage de tout changer." }], tags: ["voyage", "destin", "rêve"] },
];

const USERS_DB = [];

const ORDERS_DB = [];

// ─── CONTEXT ────────────────────────────────────────────────────────────────
const AppContext = createContext();

const init = {
  user: null, cart: [], wishlist: [],
  page: "home", books: BOOKS_DB, users: USERS_DB, orders: ORDERS_DB,
  selectedBook: null, toast: null, checkoutStep: 0,
};

function reducer(state, { type, payload }) {
  switch (type) {
    case "LOGIN": return { ...state, user: payload, page: "home" };
    case "LOGOUT": return { ...state, user: null, cart: [], wishlist: [], page: "home" };
    case "SET_PAGE": return { ...state, page: payload, selectedBook: null, checkoutStep: 0 };
    case "SELECT_BOOK": return { ...state, selectedBook: payload, page: "book" };
    case "ADD_CART": {
      const ex = state.cart.find(i => i.id === payload.id);
      return { ...state, cart: ex ? state.cart.map(i => i.id === payload.id ? { ...i, qty: i.qty + 1 } : i) : [...state.cart, { ...payload, qty: 1 }], toast: { msg: `"${payload.title}" ajouté au panier`, type: "success" } };
    }
    case "REMOVE_CART": return { ...state, cart: state.cart.filter(i => i.id !== payload) };
    case "SET_QTY": return { ...state, cart: state.cart.map(i => i.id === payload.id ? { ...i, qty: Math.max(1, payload.qty) } : i) };
    case "TOGGLE_WISH": {
      const has = state.wishlist.includes(payload);
      return { ...state, wishlist: has ? state.wishlist.filter(id => id !== payload) : [...state.wishlist, payload], toast: { msg: has ? "Retiré des favoris" : "Ajouté aux favoris ♥", type: has ? "info" : "success" } };
    }
    case "CLEAR_CART": return { ...state, cart: [] };
    case "PLACE_ORDER": {
  const o = {
    id: `CMD-00${state.orders.length + 1}`,
    userId: state.user.id,
    date: new Date().toISOString().split("T")[0],
    status: "en cours",
    total: payload,
    items: state.cart.map(i => ({ bookId: i.id, qty: i.qty }))
  };
  supabase.from("orders").insert({
    user_id: state.user?.id,
    total: parseFloat(payload),
    status: "en cours",
    items: state.cart.map(i => ({ bookId: i.id, qty: i.qty }))
  }).then(({ error }) => { if (error) console.error("Erreur order:", error); });
  return { ...state, orders: [...state.orders, o], cart: [], page: "orders", toast: { msg: "Commande confirmée ! Merci 🎉", type: "success" } };
}
    case "UPDATE_BOOK": return { ...state, books: state.books.map(b => b.id === payload.id ? payload : b) };
    case "DELETE_BOOK": return { ...state, books: state.books.filter(b => b.id !== payload) };
    case "ADD_BOOK": return { ...state, books: [...state.books, { ...payload, id: Date.now(), sold: 0, reviews: [], tags: [] }] };
    case "ADD_REVIEW": return { ...state, books: state.books.map(b => b.id === payload.bookId ? { ...b, reviews: [...b.reviews, payload.review], rating: ((b.rating * b.reviews.length + payload.review.note) / (b.reviews.length + 1)).toFixed(1) * 1 } : b), toast: { msg: "Avis publié, merci !", type: "success" } };
    case "SET_CHECKOUT": return { ...state, checkoutStep: payload };
    case "CLEAR_TOAST": return { ...state, toast: null };
    default: return state;
  }
}

// ─── STYLES ─────────────────────────────────────────────────────────────────
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --night:#0e0e0e;--ink:#1a1a1a;--charcoal:#2e2e2e;
      --gold:#c9a84c;--gold-light:#e8c97a;--gold-pale:#f5e9c8;
      --ivory:#faf8f3;--cream:#f2ede0;--warm:#e8e0cc;
      --muted:#7a7060;--border:#ddd5bf;
      --success:#2d6a4f;--error:#9b2226;
      --font-display:'Playfair Display',Georgia,serif;
      --font-body:'Jost',sans-serif;
      --r:12px;--r-sm:6px;
      --shadow:0 2px 16px rgba(14,14,14,.08);
      --shadow-md:0 6px 32px rgba(14,14,14,.13);
      --shadow-lg:0 16px 56px rgba(14,14,14,.18);
      --transition:all .28s cubic-bezier(.4,0,.2,1);
    }
    html{scroll-behavior:smooth}
    body{font-family:var(--font-body);background:var(--ivory);color:var(--ink);min-height:100vh;-webkit-font-smoothing:antialiased}
    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--cream)}::-webkit-scrollbar-thumb{background:var(--gold);border-radius:99px}
    img{display:block}
    button{font-family:var(--font-body);cursor:pointer}

    /* ── LAYOUT ── */
    .app{min-height:100vh;display:flex;flex-direction:column}
    .main{flex:1}

    /* ── NAV ── */
    .nav{position:sticky;top:0;z-index:100;background:rgba(14,14,14,.97);backdrop-filter:blur(12px);border-bottom:1px solid rgba(201,168,76,.18);display:flex;align-items:center;justify-content:space-between;padding:0 2.5rem;height:68px}
    .nav-logo{display:flex;align-items:center;gap:10px;cursor:pointer;text-decoration:none}
    .nav-logo-mark{width:32px;height:32px;background:var(--gold);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:.9rem;font-weight:700;color:var(--night);flex-shrink:0}
    .nav-logo-text{font-family:var(--font-display);font-size:1.15rem;color:white;letter-spacing:.02em}
    .nav-logo-text span{color:var(--gold-light)}
    .nav-center{display:flex;gap:0;align-items:center}
    .nav-link{background:none;border:none;color:rgba(255,255,255,.55);font-size:.82rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;padding:8px 16px;border-radius:var(--r-sm);transition:var(--transition)}
    .nav-link:hover,.nav-link.active{color:var(--gold-light)}
    .nav-right{display:flex;align-items:center;gap:.5rem}
    .nav-icon-btn{background:none;border:none;color:rgba(255,255,255,.6);font-size:1.1rem;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:var(--transition);position:relative}
    .nav-icon-btn:hover{color:var(--gold-light);background:rgba(201,168,76,.1)}
    .badge{position:absolute;top:4px;right:4px;background:var(--gold);color:var(--night);border-radius:99px;font-size:.62rem;font-weight:700;min-width:16px;height:16px;display:flex;align-items:center;justify-content:center;padding:0 3px}
    .nav-user-btn{background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.3);color:var(--gold-light);font-size:.78rem;font-weight:600;letter-spacing:.05em;padding:7px 16px;border-radius:99px;transition:var(--transition)}
    .nav-user-btn:hover{background:rgba(201,168,76,.22)}
    .nav-cta{background:var(--gold);border:none;color:var(--night);font-size:.8rem;font-weight:700;letter-spacing:.06em;padding:9px 20px;border-radius:99px;transition:var(--transition)}
    .nav-cta:hover{background:var(--gold-light);transform:translateY(-1px);box-shadow:0 4px 16px rgba(201,168,76,.4)}

    /* ── HERO ── */
    .hero{background:var(--night);min-height:92vh;display:grid;grid-template-columns:1fr 1fr;position:relative;overflow:hidden}
    .hero-left{padding:6rem 4rem 4rem;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:2}
    .hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.25);color:var(--gold-light);font-size:.72rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;padding:6px 14px;border-radius:99px;margin-bottom:2rem;animation:fadeUp .7s ease both}
    .hero-eyebrow::before{content:'';width:6px;height:6px;background:var(--gold);border-radius:50%}
    .hero-title{font-family:var(--font-display);font-size:clamp(2.8rem,4.5vw,4.2rem);color:white;line-height:1.08;font-weight:700;margin-bottom:1.5rem;animation:fadeUp .7s .1s ease both}
    .hero-title em{display:block;color:var(--gold);font-style:italic}
    .hero-subtitle{color:rgba(255,255,255,.5);font-size:1rem;line-height:1.7;max-width:440px;margin-bottom:2.5rem;font-weight:300;animation:fadeUp .7s .2s ease both}
    .hero-actions{display:flex;gap:1rem;flex-wrap:wrap;animation:fadeUp .7s .3s ease both}
    .btn-gold{background:var(--gold);border:none;color:var(--night);font-size:.85rem;font-weight:700;letter-spacing:.06em;padding:14px 30px;border-radius:var(--r-sm);transition:var(--transition);display:inline-flex;align-items:center;gap:8px}
    .btn-gold:hover{background:var(--gold-light);transform:translateY(-2px);box-shadow:0 8px 28px rgba(201,168,76,.35)}
    .btn-ghost{background:transparent;border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.7);font-size:.85rem;font-weight:500;letter-spacing:.05em;padding:14px 28px;border-radius:var(--r-sm);transition:var(--transition)}
    .btn-ghost:hover{border-color:rgba(201,168,76,.5);color:var(--gold-light)}
    .hero-right{position:relative;overflow:hidden;animation:fadeIn .9s .1s ease both}
    .hero-mosaic{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;height:100%;gap:3px}
    .mosaic-cell{overflow:hidden;background:var(--charcoal);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;font-size:3.5rem;color:rgba(255,255,255,.12);font-family:var(--font-display);font-style:italic;font-size:1.1rem;font-weight:600;transition:var(--transition);cursor:pointer;position:relative}
    .mosaic-cell:hover{background:rgba(201,168,76,.08)}
    .mosaic-cell::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(201,168,76,.06),transparent)}
    .mosaic-emoji{font-size:2.8rem;transition:var(--transition)}
    .mosaic-cell:hover .mosaic-emoji{transform:scale(1.15)}
    .mosaic-lbl{color:rgba(255,255,255,.35);font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;font-family:var(--font-body)}
    .hero-stat-bar{position:absolute;bottom:0;left:0;right:0;background:rgba(201,168,76,.08);border-top:1px solid rgba(201,168,76,.15);display:flex;justify-content:space-around;padding:1.2rem 2rem;z-index:3}
    .hero-stat{text-align:center}
    .hero-stat-val{font-family:var(--font-display);font-size:1.4rem;color:var(--gold-light);font-weight:600}
    .hero-stat-lbl{font-size:.7rem;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.08em}
    .hero-line{position:absolute;bottom:0;left:0;right:50%;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,.4),transparent);z-index:3}

    /* ── SECTION ── */
    .section{max-width:1280px;margin:0 auto;padding:4rem 2rem;width:100%}
    .section-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:2.5rem;gap:1rem}
    .section-label{font-size:.7rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:.5rem}
    .section-title{font-family:var(--font-display);font-size:clamp(1.6rem,3vw,2.2rem);font-weight:600;color:var(--ink);line-height:1.2}
    .section-link{font-size:.8rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);background:none;border:none;display:flex;align-items:center;gap:6px;white-space:nowrap;transition:var(--transition)}
    .section-link:hover{color:var(--gold)}
    .divider{height:1px;background:linear-gradient(90deg,var(--gold-pale),transparent);margin:0 2rem}

    /* ── CATALOGUE SEARCH ── */
    .catalogue-hero{background:var(--night);padding:3.5rem 2rem 2.5rem;text-align:center}
    .catalogue-title{font-family:var(--font-display);font-size:clamp(1.8rem,4vw,3rem);color:white;margin-bottom:.75rem;font-style:italic}
    .catalogue-sub{color:rgba(255,255,255,.4);font-size:.9rem;font-weight:300}
    .search-wrap{max-width:640px;margin:2rem auto 0;position:relative}
    .search-input{width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(201,168,76,.25);border-radius:var(--r);color:white;font-family:var(--font-body);font-size:.95rem;padding:14px 50px 14px 20px;outline:none;transition:var(--transition)}
    .search-input::placeholder{color:rgba(255,255,255,.3)}
    .search-input:focus{border-color:rgba(201,168,76,.6);background:rgba(255,255,255,.09)}
    .search-icon{position:absolute;right:16px;top:50%;transform:translateY(-50%);color:rgba(201,168,76,.6);font-size:1rem;pointer-events:none}
    .filter-row{background:var(--cream);border-bottom:1px solid var(--border);padding:.8rem 2rem;display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;overflow-x:auto}
    .chip{padding:6px 15px;border-radius:99px;font-size:.78rem;font-weight:600;letter-spacing:.04em;cursor:pointer;border:1.5px solid var(--border);background:white;color:var(--muted);transition:var(--transition);white-space:nowrap}
    .chip:hover{border-color:var(--gold);color:var(--gold)}
    .chip.on{background:var(--gold);border-color:var(--gold);color:var(--night)}
    .filter-sep{width:1px;height:20px;background:var(--border);flex-shrink:0;margin:0 .25rem}
    .sort-sel{border:1.5px solid var(--border);background:white;color:var(--muted);font-family:var(--font-body);font-size:.78rem;font-weight:600;padding:6px 14px;border-radius:99px;outline:none;cursor:pointer;transition:var(--transition)}
    .sort-sel:focus{border-color:var(--gold)}
    .range-label{font-size:.78rem;font-weight:600;color:var(--muted);white-space:nowrap}
    .range-input{accent-color:var(--gold);width:100px}

    /* ── BOOK CARDS ── */
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1.5rem}
    .bk{background:white;border-radius:var(--r);border:1px solid var(--border);overflow:hidden;transition:var(--transition);cursor:pointer;display:flex;flex-direction:column;position:relative}
    .bk:hover{transform:translateY(-5px);box-shadow:var(--shadow-lg);border-color:var(--gold-pale)}
    .bk-cover{width:100%;height:240px;object-fit:cover;display:flex;align-items:center;justify-content:center;font-size:4.5rem;background:linear-gradient(145deg,var(--cream),var(--warm));flex-shrink:0}
    .bk-wish{position:absolute;top:10px;right:10px;width:32px;height:32px;border-radius:50%;background:white;border:none;font-size:.85rem;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow);transition:var(--transition);z-index:2}
    .bk-wish:hover{transform:scale(1.15)}
    .bk-origin{position:absolute;top:10px;left:10px;background:rgba(14,14,14,.7);color:var(--gold-light);font-size:.62rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:99px;backdrop-filter:blur(4px)}
    .bk-body{padding:1rem;flex:1;display:flex;flex-direction:column;gap:4px}
    .bk-cat{font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold)}
    .bk-title{font-family:var(--font-display);font-size:.95rem;font-weight:600;line-height:1.3;color:var(--ink)}
    .bk-author{font-size:.8rem;color:var(--muted);font-style:italic}
    .bk-footer{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:.75rem;border-top:1px solid var(--cream)}
    .bk-price{font-family:var(--font-display);font-size:1.1rem;font-weight:700;color:var(--ink)}
    .bk-stars{font-size:.75rem;color:var(--gold);letter-spacing:1px}
    .bk-add{width:34px;height:34px;border-radius:var(--r-sm);background:var(--night);border:none;color:var(--gold-light);font-size:1rem;display:flex;align-items:center;justify-content:center;transition:var(--transition)}
    .bk-add:hover{background:var(--gold);color:var(--night);transform:scale(1.08)}
    .stock-tag{font-size:.66rem;font-weight:700;padding:2px 7px;border-radius:99px;margin-top:4px;display:inline-block}
    .in{background:#d1fae5;color:#065f46}.low{background:#fef3c7;color:#92400e}

    /* ── BOOK DETAIL ── */
    .detail-wrap{max-width:1000px;margin:0 auto;padding:2.5rem 2rem}
    .back{background:none;border:none;color:var(--muted);font-size:.83rem;font-weight:500;display:flex;align-items:center;gap:6px;margin-bottom:2rem;letter-spacing:.04em;transition:var(--transition)}
    .back:hover{color:var(--gold)}
    .detail-grid{display:grid;grid-template-columns:300px 1fr;gap:3rem;align-items:start}
    .detail-cover-wrap{position:sticky;top:90px}
    .detail-cover{width:100%;aspect-ratio:3/4;border-radius:var(--r);background:linear-gradient(145deg,var(--cream),var(--warm));display:flex;align-items:center;justify-content:center;font-size:6rem;box-shadow:var(--shadow-lg);border:1px solid var(--border)}
    .detail-badge{display:inline-flex;align-items:center;gap:6px;font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin-bottom:.75rem}
    .detail-badge::before{content:'';width:20px;height:1px;background:var(--gold)}
    .detail-title{font-family:var(--font-display);font-size:clamp(1.8rem,3vw,2.6rem);font-weight:700;line-height:1.1;margin-bottom:.4rem}
    .detail-author{font-size:1rem;color:var(--muted);font-style:italic;margin-bottom:1.2rem}
    .detail-meta-row{display:flex;gap:1.5rem;margin-bottom:1.5rem;flex-wrap:wrap}
    .meta-pill{display:flex;align-items:center;gap:6px;font-size:.8rem;font-weight:500;color:var(--muted)}
    .meta-pill strong{color:var(--ink)}
    .detail-desc{font-size:.93rem;line-height:1.75;color:#444;margin-bottom:2rem}
    .detail-tags{display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:1.5rem}
    .tag{background:var(--cream);border:1px solid var(--border);color:var(--muted);font-size:.72rem;font-weight:600;padding:3px 10px;border-radius:99px;letter-spacing:.04em}
    .detail-price-row{display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem}
    .detail-price{font-family:var(--font-display);font-size:2rem;font-weight:700}
    .detail-shipping{font-size:.78rem;color:var(--muted)}
    .detail-actions{display:flex;gap:.75rem;margin-bottom:2rem;flex-wrap:wrap}
    .btn-primary{background:var(--night);border:none;color:var(--gold-light);font-size:.85rem;font-weight:600;letter-spacing:.05em;padding:13px 28px;border-radius:var(--r-sm);transition:var(--transition);display:flex;align-items:center;gap:8px}
    .btn-primary:hover{background:var(--charcoal);transform:translateY(-1px);box-shadow:0 6px 20px rgba(14,14,14,.25)}
    .btn-outline{background:transparent;border:1.5px solid var(--border);color:var(--ink);font-size:.85rem;font-weight:600;padding:12px 22px;border-radius:var(--r-sm);transition:var(--transition);display:flex;align-items:center;gap:8px}
    .btn-outline:hover{border-color:var(--gold);color:var(--gold)}
    .reviews-section{margin-top:2.5rem;padding-top:2.5rem;border-top:1px solid var(--border)}
    .review-card{background:var(--ivory);border:1px solid var(--border);border-radius:var(--r-sm);padding:1.1rem;margin-bottom:.75rem}
    .review-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem}
    .review-user{font-weight:600;font-size:.85rem}
    .review-text{font-size:.85rem;color:var(--muted);line-height:1.6}
    .add-review{background:var(--cream);border-radius:var(--r);padding:1.25rem;margin-top:1rem;border:1px solid var(--border)}
    .add-review h4{font-family:var(--font-display);font-size:1rem;font-weight:600;margin-bottom:.75rem}
    .star-select{display:flex;gap:4px;margin-bottom:.75rem}
    .star-btn{background:none;border:none;font-size:1.3rem;cursor:pointer;transition:transform .15s}
    .star-btn:hover{transform:scale(1.2)}
    .review-input{width:100%;border:1.5px solid var(--border);border-radius:var(--r-sm);padding:10px 14px;font-family:var(--font-body);font-size:.88rem;resize:vertical;min-height:80px;outline:none;transition:var(--transition)}
    .review-input:focus{border-color:var(--gold)}

    /* ── RECOMMANDATIONS ── */
    .reco-section{background:var(--cream);padding:3.5rem 2rem;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
    .reco-inner{max-width:1280px;margin:0 auto}
    .reco-loading{display:flex;align-items:center;gap:12px;color:var(--muted);font-size:.88rem;padding:1.5rem 0}
    .reco-dot{width:6px;height:6px;background:var(--gold);border-radius:50%;animation:pulse 1.2s ease infinite}
    .reco-dot:nth-child(2){animation-delay:.2s}.reco-dot:nth-child(3){animation-delay:.4s}
    @keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
    .reco-ai-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.3);color:var(--gold);font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:4px 12px;border-radius:99px;margin-bottom:.5rem}
    .reco-text{font-size:.88rem;color:var(--muted);line-height:1.6;margin-bottom:1.5rem;font-style:italic;max-width:600px}

    /* ── CART ── */
    .cart-wrap{max-width:820px;margin:0 auto;padding:2.5rem 2rem}
    .cart-item{display:grid;grid-template-columns:70px 1fr auto;gap:1.25rem;align-items:center;background:white;border:1px solid var(--border);border-radius:var(--r);padding:1.1rem;margin-bottom:.75rem;transition:var(--transition)}
    .cart-item:hover{box-shadow:var(--shadow)}
    .ci-cover{width:70px;height:90px;border-radius:var(--r-sm);background:linear-gradient(145deg,var(--cream),var(--warm));display:flex;align-items:center;justify-content:center;font-size:1.8rem;flex-shrink:0}
    .ci-title{font-family:var(--font-display);font-weight:600;font-size:.95rem;margin-bottom:2px}
    .ci-author{font-size:.8rem;color:var(--muted);font-style:italic;margin-bottom:.6rem}
    .ci-price{font-family:var(--font-display);font-size:1rem;font-weight:700;text-align:right}
    .qty-ctrl{display:flex;align-items:center;gap:8px}
    .qty-btn{width:28px;height:28px;border-radius:6px;border:1.5px solid var(--border);background:transparent;font-size:.9rem;display:flex;align-items:center;justify-content:center;transition:var(--transition)}
    .qty-btn:hover{border-color:var(--gold);color:var(--gold)}
    .qty-num{font-weight:700;min-width:22px;text-align:center;font-size:.9rem}
    .rm-btn{background:none;border:none;color:var(--muted);font-size:.75rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;transition:var(--transition);margin-top:6px;display:block}
    .rm-btn:hover{color:#9b2226}
    .cart-summary{background:var(--night);border-radius:var(--r);padding:1.75rem;margin-top:1.5rem}
    .cs-title{font-family:var(--font-display);font-size:1.1rem;font-weight:600;color:white;margin-bottom:1.25rem;padding-bottom:.75rem;border-bottom:1px solid rgba(255,255,255,.1)}
    .cs-row{display:flex;justify-content:space-between;font-size:.85rem;color:rgba(255,255,255,.55);margin-bottom:.6rem}
    .cs-total{display:flex;justify-content:space-between;font-family:var(--font-display);font-size:1.3rem;font-weight:700;color:white;border-top:1px solid rgba(255,255,255,.1);padding-top:1rem;margin-top:.5rem}
    .cs-total span:last-child{color:var(--gold-light)}
    .free-ship{font-size:.75rem;color:rgba(201,168,76,.6);margin-bottom:.75rem}

    /* ── CHECKOUT ── */
    .checkout-wrap{max-width:820px;margin:0 auto;padding:2.5rem 2rem}
    .checkout-steps{display:flex;align-items:center;gap:0;margin-bottom:3rem}
    .step{display:flex;align-items:center;gap:0;flex:1}
    .step-dot{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700;transition:var(--transition);flex-shrink:0;border:2px solid var(--border);background:white;color:var(--muted)}
    .step-dot.done{background:var(--gold);border-color:var(--gold);color:var(--night)}
    .step-dot.active{background:var(--night);border-color:var(--night);color:white}
    .step-line{flex:1;height:1px;background:var(--border);margin:0 8px}
    .step-line.done{background:var(--gold)}
    .step-label{font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);text-align:center;margin-top:6px}
    .step-label.active{color:var(--ink)}
    .checkout-card{background:white;border:1px solid var(--border);border-radius:var(--r);padding:2rem;margin-bottom:1.25rem}
    .checkout-card h3{font-family:var(--font-display);font-size:1.1rem;font-weight:600;margin-bottom:1.25rem;padding-bottom:.75rem;border-bottom:1px solid var(--border)}
    .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
    .form-grp{display:flex;flex-direction:column;gap:5px}
    .form-grp.full{grid-column:1/-1}
    .form-lbl{font-size:.75rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--muted)}
    .form-inp{border:1.5px solid var(--border);border-radius:var(--r-sm);padding:10px 14px;font-family:var(--font-body);font-size:.9rem;outline:none;transition:var(--transition);width:100%}
    .form-inp:focus{border-color:var(--gold)}
    .card-icons{display:flex;gap:.4rem;margin-bottom:1rem}
    .card-icon{background:var(--cream);border:1px solid var(--border);border-radius:4px;padding:4px 10px;font-size:.75rem;font-weight:700;color:var(--muted)}
    .security-badge{display:flex;align-items:center;gap:8px;font-size:.78rem;color:var(--muted);margin-top:1rem}
    .pay-btn{width:100%;background:var(--gold);border:none;color:var(--night);font-size:.9rem;font-weight:700;letter-spacing:.06em;padding:15px;border-radius:var(--r-sm);margin-top:1.5rem;transition:var(--transition);display:flex;align-items:center;justify-content:center;gap:10px}
    .pay-btn:hover{background:var(--gold-light);transform:translateY(-1px);box-shadow:0 6px 24px rgba(201,168,76,.35)}
    .order-confirm{text-align:center;padding:3rem 1rem}
    .confirm-icon{width:80px;height:80px;background:linear-gradient(135deg,var(--gold-pale),var(--cream));border:2px solid var(--gold);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto 1.5rem}
    .confirm-title{font-family:var(--font-display);font-size:1.8rem;font-weight:700;margin-bottom:.5rem}
    .confirm-sub{color:var(--muted);margin-bottom:2rem}

    /* ── AUTH ── */
    .auth-wrap{max-width:420px;margin:4rem auto;padding:0 1.5rem}
    .auth-card{background:white;border-radius:var(--r);border:1px solid var(--border);box-shadow:var(--shadow-lg);overflow:hidden}
    .auth-header{background:var(--night);padding:2.5rem 2rem;text-align:center}
    .auth-logo{font-family:var(--font-display);font-size:1.3rem;color:white;font-style:italic}
    .auth-logo span{color:var(--gold-light)}
    .auth-body{padding:2rem}
    .auth-title{font-family:var(--font-display);font-size:1.5rem;font-weight:700;margin-bottom:.25rem}
    .auth-sub{font-size:.85rem;color:var(--muted);margin-bottom:1.75rem}
    .demo-box{background:var(--cream);border:1px solid var(--border);border-radius:var(--r-sm);padding:.9rem 1rem;margin-top:1.2rem;font-size:.8rem;color:var(--muted);line-height:1.7}
    .demo-box strong{color:var(--ink)}

    /* ── ORDERS ── */
    .orders-wrap{max-width:800px;margin:0 auto;padding:2.5rem 2rem}
    .order-card{background:white;border-radius:var(--r);border:1px solid var(--border);padding:1.25rem 1.5rem;margin-bottom:1rem;transition:var(--transition)}
    .order-card:hover{box-shadow:var(--shadow);border-color:var(--gold-pale)}
    .oc-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.75rem}
    .oc-id{font-family:var(--font-display);font-weight:700;font-size:1rem}
    .oc-date{font-size:.78rem;color:var(--muted)}
    .oc-status{padding:4px 12px;border-radius:99px;font-size:.72rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase}
    .s-livré{background:#d1fae5;color:#065f46}.s-en-cours{background:#fef3c7;color:#92400e}.s-annulé{background:#fee2e2;color:#9b2226}
    .oc-items{font-size:.82rem;color:var(--muted);margin-bottom:.6rem}
    .oc-total{font-family:var(--font-display);font-weight:700;font-size:1rem;color:var(--ink)}

    /* ── PROFILE ── */
    .profile-wrap{max-width:700px;margin:0 auto;padding:2.5rem 2rem}
    .profile-banner{background:var(--night);border-radius:var(--r);padding:2.5rem;display:flex;align-items:center;gap:2rem;margin-bottom:1.75rem;position:relative;overflow:hidden}
    .profile-banner::before{content:'';position:absolute;right:-40px;top:-40px;width:180px;height:180px;border-radius:50%;background:rgba(201,168,76,.07);border:1px solid rgba(201,168,76,.12)}
    .pb-avatar{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-light));display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:1.8rem;font-weight:700;color:var(--night);flex-shrink:0;border:3px solid rgba(201,168,76,.3)}
    .pb-name{font-family:var(--font-display);font-size:1.4rem;font-weight:700;color:white;margin-bottom:2px}
    .pb-email{font-size:.85rem;color:rgba(255,255,255,.45)}
    .pb-role{display:inline-block;background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.3);color:var(--gold-light);font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 10px;border-radius:99px;margin-top:6px}
    .stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.75rem}
    .stat-card{background:white;border:1px solid var(--border);border-radius:var(--r-sm);padding:1.1rem;text-align:center}
    .sc-val{font-family:var(--font-display);font-size:1.4rem;font-weight:700;color:var(--ink)}
    .sc-lbl{font-size:.72rem;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);margin-top:2px}

    /* ── ADMIN ── */
    .admin-wrap{max-width:1200px;margin:0 auto;padding:2.5rem 2rem}
    .admin-topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem}
    .admin-title{font-family:var(--font-display);font-size:1.6rem;font-weight:700}
    .kpi-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:1rem;margin-bottom:2rem}
    .kpi{background:white;border:1px solid var(--border);border-radius:var(--r);padding:1.25rem 1.5rem;position:relative;overflow:hidden}
    .kpi::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--gold),var(--gold-light))}
    .kpi-icon{font-size:1.5rem;margin-bottom:.5rem}
    .kpi-val{font-family:var(--font-display);font-size:1.7rem;font-weight:700}
    .kpi-lbl{font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);margin-top:2px}
    .kpi-delta{font-size:.78rem;color:var(--success);font-weight:600;margin-top:3px}
    .tabs{display:flex;gap:0;border-bottom:2px solid var(--border);margin-bottom:2rem}
    .tab{background:none;border:none;padding:10px 20px;font-size:.82rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);border-bottom:2px solid transparent;margin-bottom:-2px;transition:var(--transition)}
    .tab.on{color:var(--gold);border-bottom-color:var(--gold)}
    .table{width:100%;border-collapse:collapse;background:white;border-radius:var(--r);overflow:hidden;box-shadow:var(--shadow)}
    .table th{background:var(--night);color:rgba(255,255,255,.7);padding:11px 16px;text-align:left;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
    .table td{padding:12px 16px;border-bottom:1px solid var(--border);font-size:.85rem}
    .table tr:last-child td{border-bottom:none}
    .table tr:hover td{background:var(--ivory)}
    .abtn{padding:5px 12px;border-radius:var(--r-sm);font-size:.75rem;font-weight:700;border:none;cursor:pointer;transition:var(--transition)}
    .abtn-edit{background:#ede9fe;color:#5b21b6}.abtn-edit:hover{background:#ddd6fe}
    .abtn-del{background:#fee2e2;color:#9b2226}.abtn-del:hover{background:#fecaca}

    /* ── MODAL ── */
    .overlay{position:fixed;inset:0;background:rgba(14,14,14,.55);z-index:500;display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(4px)}
    .modal{background:white;border-radius:var(--r);padding:2rem;max-width:520px;width:100%;box-shadow:var(--shadow-lg);animation:modalIn .22s ease}
    @keyframes modalIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
    .modal-title{font-family:var(--font-display);font-size:1.3rem;font-weight:700;margin-bottom:1.5rem;padding-bottom:.75rem;border-bottom:1px solid var(--border)}
    .modal-actions{display:flex;gap:.75rem;justify-content:flex-end;margin-top:1.5rem}

    /* ── TOAST ── */
    .toast{position:fixed;bottom:28px;right:28px;background:var(--night);color:white;padding:13px 20px;border-radius:var(--r-sm);box-shadow:var(--shadow-lg);font-size:.86rem;font-weight:500;z-index:999;animation:slideIn .3s ease;max-width:300px;display:flex;gap:10px;align-items:flex-start;border-left:3px solid var(--gold)}
    .toast.success{border-left-color:var(--gold)}.toast.info{border-left-color:#60a5fa}.toast.error{border-left-color:#f87171}
    @keyframes slideIn{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}

    /* ── WISHLIST ── */
    .wishlist-wrap{max-width:1000px;margin:0 auto;padding:2.5rem 2rem}

    /* ── EMPTY ── */
    .empty{text-align:center;padding:5rem 2rem}
    .empty-icon{font-size:3rem;margin-bottom:1rem;opacity:.4}
    .empty h3{font-family:var(--font-display);font-size:1.3rem;margin-bottom:.4rem}
    .empty p{color:var(--muted);font-size:.9rem;margin-bottom:1.5rem}

    /* ── ANIMATIONS ── */
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    .fade-up{animation:fadeUp .55s ease both}
    .fade-up-1{animation:fadeUp .55s .08s ease both}
    .fade-up-2{animation:fadeUp .55s .16s ease both}
    .fade-up-3{animation:fadeUp .55s .24s ease both}
    .fade-up-4{animation:fadeUp .55s .32s ease both}

    /* ── FOOTER ── */
    .footer{background:var(--night);border-top:1px solid rgba(201,168,76,.12);padding:3rem 2rem 1.5rem}
    .footer-inner{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr;gap:3rem;margin-bottom:2.5rem}
    .footer-brand{font-family:var(--font-display);font-size:1.2rem;color:white;margin-bottom:.6rem;font-style:italic}
    .footer-brand span{color:var(--gold-light)}
    .footer-desc{font-size:.82rem;color:rgba(255,255,255,.35);line-height:1.7;max-width:260px}
    .footer-col h4{font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem}
    .footer-col a{display:block;color:rgba(255,255,255,.4);font-size:.83rem;margin-bottom:.4rem;text-decoration:none;transition:var(--transition);cursor:pointer}
    .footer-col a:hover{color:var(--gold-light)}
    .footer-bottom{border-top:1px solid rgba(255,255,255,.06);padding-top:1.25rem;display:flex;justify-content:space-between;align-items:center}
    .footer-copy{font-size:.75rem;color:rgba(255,255,255,.25)}
    .footer-love{font-size:.75rem;color:rgba(255,255,255,.2)}

    @media(max-width:768px){
      .hero{grid-template-columns:1fr;min-height:auto}
      .hero-right{height:300px}
      .hero-left{padding:4rem 1.5rem 2rem}
      .detail-grid{grid-template-columns:1fr}
      .detail-cover-wrap{position:static}
      .form-grid{grid-template-columns:1fr}
      .stat-grid{grid-template-columns:1fr 1fr}
      .footer-inner{grid-template-columns:1fr}
      .nav-center{display:none}
    }
  `}</style>
);

// ─── HELPERS ────────────────────────────────────────────────────────────────
const stars = (n) => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));
const fmt = (n) => parseFloat(n).toFixed(2);
const cartTotal = (cart) => cart.reduce((s, i) => s + i.price * i.qty, 0);

// ─── COMPOSANTS ─────────────────────────────────────────────────────────────

function Toast() {
  const { state, dispatch } = useContext(AppContext);
  useEffect(() => {
    if (state.toast) { const t = setTimeout(() => dispatch({ type: "CLEAR_TOAST" }), 3200); return () => clearTimeout(t); }
  }, [state.toast]);
  if (!state.toast) return null;
  return <div className={`toast ${state.toast.type || "success"}`}><span>{state.toast.msg}</span></div>;
}

function Nav() {
  const { state, dispatch } = useContext(AppContext);
  const cartQty = state.cart.reduce((s, i) => s + i.qty, 0);
  const wishQty = state.wishlist.length;
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => dispatch({ type: "SET_PAGE", payload: "home" })}>
        <div className="nav-logo-mark">L</div>
        <span className="nav-logo-text">Libro<span>Store</span></span>
      </div>
      <div className="nav-center">
        {["home","catalogue","wishlist"].map(p => (
          <button key={p} className={`nav-link ${state.page === p ? "active" : ""}`} onClick={() => dispatch({ type: "SET_PAGE", payload: p })}>
            {p === "home" ? "Accueil" : p === "catalogue" ? "Catalogue" : "Favoris"}
          </button>
        ))}
        {state.user && <button className={`nav-link ${state.page === "orders" ? "active" : ""}`} onClick={() => dispatch({ type: "SET_PAGE", payload: "orders" })}>Commandes</button>}
        {state.user?.role === "admin" && <button className={`nav-link ${state.page === "admin" ? "active" : ""}`} onClick={() => dispatch({ type: "SET_PAGE", payload: "admin" })}>Admin</button>}
      </div>
      <div className="nav-right">
        <button className="nav-icon-btn" onClick={() => dispatch({ type: "SET_PAGE", payload: "wishlist" })} title="Favoris">
          ♡ {wishQty > 0 && <span className="badge">{wishQty}</span>}
        </button>
        <button className="nav-icon-btn" onClick={() => dispatch({ type: "SET_PAGE", payload: "cart" })} title="Panier">
          ◻ {cartQty > 0 && <span className="badge">{cartQty}</span>}
        </button>
        {state.user
          ? <button className="nav-user-btn" onClick={() => dispatch({ type: "SET_PAGE", payload: "profile" })}>◈ {state.user.name.split(" ")[0]}</button>
          : <button className="nav-cta" onClick={() => dispatch({ type: "SET_PAGE", payload: "login" })}>Connexion</button>}
      </div>
    </nav>
  );
}

function Hero() {
  const { state, dispatch } = useContext(AppContext);
  const top4 = [...state.books].sort((a, b) => b.sold - a.sold).slice(0, 4);
  return (
    <section className="hero">
      <div className="hero-left">
        <div className="hero-eyebrow">Librairie de référence · Dakar & Monde</div>
        <h1 className="hero-title">
          L'excellence <em>littéraire</em> à portée de main
        </h1>
        <p className="hero-subtitle">
          De Sembène à Tolkien, d'Adichie à Harari — une sélection soignée de chefs-d'œuvre africains et mondiaux, livrés chez vous.
        </p>
        <div className="hero-actions">
          <button className="btn-gold" onClick={() => dispatch({ type: "SET_PAGE", payload: "catalogue" })}>Explorer le catalogue →</button>
          <button className="btn-ghost" onClick={() => dispatch({ type: "SET_PAGE", payload: "catalogue" })}>Littérature africaine</button>
        </div>
      </div>
      <div className="hero-right">
        <div className="hero-mosaic">
          {top4.map(b => (
            <div key={b.id} className="mosaic-cell" onClick={() => dispatch({ type: "SELECT_BOOK", payload: b })}>
              <div className="mosaic-emoji">{b.emoji}</div>
              <div style={{ color: "rgba(255,255,255,.55)", fontSize: ".78rem", fontFamily: "var(--font-display)", fontStyle: "italic", textAlign: "center", padding: "0 .75rem" }}>{b.title}</div>
              <div className="mosaic-lbl">{b.author}</div>
            </div>
          ))}
        </div>
        <div className="hero-stat-bar">
          {[["16+", "Titres"], ["6", "Pays", ], ["4.7★", "Note moy."], ["3 500+", "Ventes"]].map(([v, l]) => (
            <div key={l} className="hero-stat"><div className="hero-stat-val">{v}</div><div className="hero-stat-lbl">{l}</div></div>
          ))}
        </div>
      </div>
      <div className="hero-line" />
    </section>
  );
}

function BookCard({ book }) {
  const { state, dispatch } = useContext(AppContext);
  const wished = state.wishlist.includes(book.id);
  return (
    <div className="bk fade-up">
      <div className="bk-cover" onClick={() => dispatch({ type: "SELECT_BOOK", payload: book })}>
        <span style={{ fontSize: "5rem" }}>{book.emoji}</span>
      </div>
      <button className="bk-wish" title={wished ? "Retirer des favoris" : "Ajouter aux favoris"}
        onClick={e => { e.stopPropagation(); dispatch({ type: "TOGGLE_WISH", payload: book.id }); }}>
        {wished ? "♥" : "♡"}
      </button>
      <div className="bk-origin">{book.origin}</div>
      <div className="bk-body" onClick={() => dispatch({ type: "SELECT_BOOK", payload: book })}>
        <div className="bk-cat">{book.category}</div>
        <div className="bk-title">{book.title}</div>
        <div className="bk-author">{book.author}</div>
        <span className={`stock-tag ${book.stock > 10 ? "in" : "low"}`}>
          {book.stock > 10 ? `En stock` : `Plus que ${book.stock}`}
        </span>
        <div className="bk-footer">
          <div>
            <div className="bk-price">{fmt(book.price)} €</div>
            <div className="bk-stars">{stars(book.rating)}</div>
          </div>
          <button className="bk-add" title="Ajouter au panier"
            onClick={e => { e.stopPropagation(); dispatch({ type: "ADD_CART", payload: book }); }}>+</button>
        </div>
      </div>
    </div>
  );
}

function Catalogue() {
  const { state } = useContext(AppContext);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Tous");
  const [origin, setOrigin] = useState("Tous");
  const [sort, setSort] = useState("pop");
  const [maxPrice, setMaxPrice] = useState(30);

  const cats = ["Tous", ...new Set(state.books.map(b => b.category))];
  const origins = ["Tous", "Sénégal", "Afrique", "International"];

  let list = state.books.filter(b => {
    const qOk = !q || b.title.toLowerCase().includes(q.toLowerCase()) || b.author.toLowerCase().includes(q.toLowerCase()) || b.tags.some(t => t.includes(q.toLowerCase()));
    const catOk = cat === "Tous" || b.category === cat;
    const origOk = origin === "Tous"
      || (origin === "Sénégal" && b.origin === "Sénégal")
      || (origin === "Afrique" && ["Sénégal","Nigeria","Côte d'Ivoire","Ghana","Kenya"].includes(b.origin))
      || (origin === "International" && !["Sénégal","Nigeria","Côte d'Ivoire","Ghana","Kenya"].includes(b.origin));
    const priceOk = b.price <= maxPrice;
    return qOk && catOk && origOk && priceOk;
  });

  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
  else list.sort((a, b) => b.sold - a.sold);

  return (
    <div>
      <div className="catalogue-hero">
        <h1 className="catalogue-title">Notre catalogue</h1>
        <p className="catalogue-sub">Littérature africaine, sénégalaise et mondiale — soigneusement sélectionnée</p>
        <div className="search-wrap">
          <input className="search-input" placeholder="Rechercher un titre, un auteur, un thème…" value={q} onChange={e => setQ(e.target.value)} />
          <span className="search-icon">⌕</span>
        </div>
      </div>
      <div className="filter-row">
        <span className="range-label">Prix max :</span>
        <input type="range" className="range-input" min={5} max={30} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} />
        <span style={{ fontSize: ".78rem", fontWeight: 700, minWidth: "45px" }}>{maxPrice} €</span>
        <div className="filter-sep" />
        {["Tous","Sénégal","Afrique","International"].map(o => (
          <button key={o} className={`chip ${origin === o ? "on" : ""}`} onClick={() => setOrigin(o)}>{o}</button>
        ))}
        <div className="filter-sep" />
        {cats.slice(0, 5).map(c => (
          <button key={c} className={`chip ${cat === c ? "on" : ""}`} onClick={() => setCat(c)}>{c}</button>
        ))}
        <div className="filter-sep" />
        <select className="sort-sel" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="pop">Popularité</option>
          <option value="rating">Meilleures notes</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
      </div>
      <div className="section">
        <div className="section-header">
          <div>
            <div className="section-label">Résultats</div>
            <div className="section-title">{list.length} œuvre{list.length > 1 ? "s" : ""} trouvée{list.length > 1 ? "s" : ""}</div>
          </div>
        </div>
        {list.length === 0
          ? <div className="empty"><div className="empty-icon">◎</div><h3>Aucun résultat</h3><p>Essayez d'autres filtres</p></div>
          : <div className="grid">{list.map(b => <BookCard key={b.id} book={b} />)}</div>}
      </div>
    </div>
  );
}

function AIRecommendations({ currentBook }) {
  const { state, dispatch } = useContext(AppContext);
  const [recos, setRecos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiNote, setAiNote] = useState("");

  const getRecos = useCallback(async () => {
    setLoading(true); setRecos(null); setAiNote("");
    try {
      const catalog = state.books.filter(b => b.id !== currentBook.id).map(b => `"${b.title}" (${b.author}, ${b.category}, ${b.origin})`).join(", ");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Tu es le libraire expert de LibroStore. Un client vient de consulter : "${currentBook.title}" de ${currentBook.author} (${currentBook.category}, ${currentBook.origin}).

Catalogue disponible : ${catalog}

Réponds UNIQUEMENT en JSON valide, sans backticks ni markdown :
{
  "note": "Une phrase élégante et personnalisée expliquant la sélection (max 120 caractères)",
  "ids": [id1, id2, id3]
}

Les IDs doivent correspondre exactement aux livres du catalogue. Voici les IDs disponibles : ${state.books.filter(b => b.id !== currentBook.id).map(b => `${b.id}="${b.title}"`).join(", ")}`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setAiNote(parsed.note || "");
      setRecos(state.books.filter(b => parsed.ids.includes(b.id)).slice(0, 3));
    } catch {
      setRecos(state.books.filter(b => b.id !== currentBook.id && b.category === currentBook.category).slice(0, 3));
      setAiNote("Sélection basée sur vos préférences");
    }
    setLoading(false);
  }, [currentBook, state.books]);

  useEffect(() => { getRecos(); }, [currentBook.id]);

  return (
    <div className="reco-section">
      <div className="reco-inner">
        <div className="reco-ai-badge">✦ Intelligence artificielle</div>
        <div className="section-label">Recommandations personnalisées</div>
        <div className="section-title" style={{ marginBottom: ".5rem" }}>Vous aimerez aussi</div>
        {aiNote && <div className="reco-text">"{aiNote}"</div>}
        {loading ? (
          <div className="reco-loading">
            <div className="reco-dot" /><div className="reco-dot" /><div className="reco-dot" />
            <span>Notre libraire IA prépare votre sélection…</span>
          </div>
        ) : recos && recos.length > 0 ? (
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", maxWidth: 700 }}>
            {recos.map(b => <BookCard key={b.id} book={b} />)}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function BookDetail() {
  const { state, dispatch } = useContext(AppContext);
  const book = state.selectedBook;
  const [newNote, setNewNote] = useState(5);
  const [newText, setNewText] = useState("");
  if (!book) return null;
  const wished = state.wishlist.includes(book.id);

  const submitReview = () => {
    if (!state.user) { dispatch({ type: "SET_PAGE", payload: "login" }); return; }
    if (!newText.trim()) return;
    dispatch({ type: "ADD_REVIEW", payload: { bookId: book.id, review: { user: state.user.name, note: newNote, text: newText } } });
    setNewText(""); setNewNote(5);
  };

  // get fresh book from state
  const freshBook = state.books.find(b => b.id === book.id) || book;

  return (
    <div>
      <div className="detail-wrap">
        <button className="back" onClick={() => dispatch({ type: "SET_PAGE", payload: "catalogue" })}>← Retour au catalogue</button>
        <div className="detail-grid">
          <div className="detail-cover-wrap">
            <div className="detail-cover"><span style={{ fontSize: "7rem" }}>{freshBook.emoji}</span></div>
            <div style={{ display: "flex", gap: ".5rem", marginTop: "1rem" }}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }}
                onClick={() => dispatch({ type: "ADD_CART", payload: freshBook })}>Ajouter au panier</button>
              <button className="btn-outline" style={{ padding: "13px 14px" }}
                onClick={() => dispatch({ type: "TOGGLE_WISH", payload: freshBook.id })}>
                {wished ? "♥" : "♡"}
              </button>
            </div>
          </div>
          <div>
            <div className="detail-badge">{freshBook.category}</div>
            <h1 className="detail-title">{freshBook.title}</h1>
            <div className="detail-author">par {freshBook.author} · {freshBook.origin}</div>
            <div className="detail-meta-row">
              <div className="meta-pill">⭐ <strong>{freshBook.rating}</strong></div>
              <div className="meta-pill">📦 <strong>{freshBook.sold}</strong> vendus</div>
              <div className="meta-pill">📚 Stock : <strong>{freshBook.stock}</strong></div>
            </div>
            <p className="detail-desc">{freshBook.description}</p>
            <div className="detail-tags">{freshBook.tags.map(t => <span key={t} className="tag">#{t}</span>)}</div>
            <div className="detail-price-row">
              <div className="detail-price">{fmt(freshBook.price)} €</div>
              <div className="detail-shipping">🚚 Livraison offerte dès 35 €</div>
            </div>

            {/* Reviews */}
            <div className="reviews-section">
              <div className="section-label">Avis lecteurs</div>
              <div className="section-title" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                {freshBook.reviews.length} avis · {freshBook.rating} / 5
              </div>
              {freshBook.reviews.length === 0
                ? <div style={{ color: "var(--muted)", fontSize: ".88rem", marginBottom: "1rem" }}>Aucun avis pour l'instant. Soyez le premier !</div>
                : freshBook.reviews.map((r, i) => (
                  <div key={i} className="review-card">
                    <div className="review-header">
                      <span className="review-user">{r.user}</span>
                      <span style={{ color: "var(--gold)", fontSize: ".85rem" }}>{stars(r.note)}</span>
                    </div>
                    <div className="review-text">{r.text}</div>
                  </div>
                ))}
              <div className="add-review">
                <h4>Donner mon avis</h4>
                <div className="star-select">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} className="star-btn" onClick={() => setNewNote(s)}
                      style={{ opacity: s <= newNote ? 1 : .3 }}>★</button>
                  ))}
                  <span style={{ fontSize: ".8rem", color: "var(--muted)", marginLeft: "6px", alignSelf: "center" }}>{newNote}/5</span>
                </div>
                <textarea className="review-input" placeholder="Partagez votre expérience de lecture…"
                  value={newText} onChange={e => setNewText(e.target.value)} />
                <button className="btn-primary" style={{ marginTop: ".75rem" }} onClick={submitReview}>Publier</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AIRecommendations currentBook={freshBook} />
    </div>
  );
}

function Cart() {
  const { state, dispatch } = useContext(AppContext);
  const total = cartTotal(state.cart);
  const shipping = total >= 35 ? 0 : 3.90;
  if (state.cart.length === 0) return (
    <div className="cart-wrap">
      <div className="section-label">Mon panier</div>
      <div className="section-title" style={{ marginBottom: "2rem" }}>Panier vide</div>
      <div className="empty"><div className="empty-icon">◻</div><h3>Votre panier est vide</h3><p>Découvrez notre sélection</p>
        <button className="btn-gold" onClick={() => dispatch({ type: "SET_PAGE", payload: "catalogue" })}>Explorer le catalogue</button>
      </div>
    </div>
  );
  return (
    <div className="cart-wrap">
      <div className="section-label">Mon panier</div>
      <div className="section-title" style={{ marginBottom: "2rem" }}>
        {state.cart.length} article{state.cart.length > 1 ? "s" : ""} sélectionné{state.cart.length > 1 ? "s" : ""}
      </div>
      {state.cart.map(item => (
        <div key={item.id} className="cart-item">
          <div className="ci-cover">{item.emoji}</div>
          <div>
            <div className="ci-title">{item.title}</div>
            <div className="ci-author">{item.author}</div>
            <div className="qty-ctrl">
              <button className="qty-btn" onClick={() => dispatch({ type: "SET_QTY", payload: { id: item.id, qty: item.qty - 1 } })}>−</button>
              <span className="qty-num">{item.qty}</span>
              <button className="qty-btn" onClick={() => dispatch({ type: "SET_QTY", payload: { id: item.id, qty: item.qty + 1 } })}>+</button>
            </div>
            <button className="rm-btn" onClick={() => dispatch({ type: "REMOVE_CART", payload: item.id })}>Retirer</button>
          </div>
          <div className="ci-price">{fmt(item.price * item.qty)} €</div>
        </div>
      ))}
      <div className="cart-summary">
        <div className="cs-title">Récapitulatif de commande</div>
        <div className="cs-row"><span>Sous-total</span><span>{fmt(total)} €</span></div>
        <div className="cs-row"><span>Livraison</span><span>{shipping === 0 ? "Offerte ✓" : fmt(shipping) + " €"}</span></div>
        {total < 35 && <div className="free-ship">Plus que {fmt(35 - total)} € pour la livraison gratuite</div>}
        <div className="cs-total"><span>Total</span><span>{fmt(total + shipping)} €</span></div>
        <button className="btn-gold" style={{ width: "100%", justifyContent: "center", marginTop: "1.25rem", padding: "15px" }}
          onClick={() => dispatch({ type: "SET_PAGE", payload: "checkout" })}>
          Passer à la caisse →
        </button>
      </div>
    </div>
  );
}

function Checkout() {
  const { state, dispatch } = useContext(AppContext);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ fname: "", lname: "", email: state.user?.email || "", address: "", city: "", zip: "", card: "", expiry: "", cvv: "" });
  const total = cartTotal(state.cart);
  const shipping = total >= 35 ? 0 : 3.90;
  const grand = fmt(total + shipping);
  const [payMethod, setPayMethod] = useState("");

  if (!state.user) return <Login />;

  const steps = ["Livraison", "Paiement", "Confirmation"];
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  if (step === 2) return (
    <div className="checkout-wrap">
      <div className="order-confirm">
        <div className="confirm-icon">✓</div>
        <div className="confirm-title">Commande confirmée !</div>
        <div className="confirm-sub">Merci pour votre confiance. Vous recevrez une confirmation par email.</div>
        <div style={{ background: "var(--cream)", borderRadius: "var(--r)", padding: "1.25rem", marginBottom: "1.5rem", textAlign: "left" }}>
          <div style={{ fontSize: ".8rem", color: "var(--muted)", marginBottom: ".4rem" }}>Récapitulatif</div>
          {state.cart.map(i => <div key={i.id} style={{ fontSize: ".88rem", marginBottom: ".2rem" }}>{i.emoji} {i.title} ×{i.qty}</div>)}
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", marginTop: ".75rem", paddingTop: ".75rem", borderTop: "1px solid var(--border)" }}>Total : {grand} €</div>
        </div>
        <button className="btn-gold" onClick={() => { dispatch({ type: "PLACE_ORDER", payload: grand }); }}>Voir mes commandes</button>
      </div>
    </div>
  );

  return (
    <div className="checkout-wrap">
      <div className="section-label">Finaliser</div>
      <div className="section-title" style={{ marginBottom: "2rem" }}>Ma commande</div>
      <div className="checkout-steps">
        {steps.map((s, i) => (
          <div key={s} className="step" style={{ flex: i < steps.length - 1 ? 1 : "initial" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className={`step-dot ${i < step ? "done" : i === step ? "active" : ""}`}>{i < step ? "✓" : i + 1}</div>
              <div className={`step-label ${i === step ? "active" : ""}`}>{s}</div>
            </div>
            {i < steps.length - 1 && <div className={`step-line ${i < step ? "done" : ""}`} />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="checkout-card fade-up">
          <h3>Adresse de livraison</h3>
          <div className="form-grid">
            {[["fname","Prénom"],["lname","Nom"]].map(([k,l]) => (
              <div key={k} className="form-grp"><label className="form-lbl">{l}</label><input className="form-inp" value={form[k]} onChange={e => upd(k, e.target.value)} placeholder={l} /></div>
            ))}
            <div className="form-grp full"><label className="form-lbl">Email</label><input className="form-inp" value={form.email} onChange={e => upd("email", e.target.value)} placeholder="votre@email.com" /></div>
            <div className="form-grp full"><label className="form-lbl">Adresse</label><input className="form-inp" value={form.address} onChange={e => upd("address", e.target.value)} placeholder="N° et nom de rue" /></div>
            {[["city","Ville"],["zip","Code postal"]].map(([k,l]) => (
              <div key={k} className="form-grp"><label className="form-lbl">{l}</label><input className="form-inp" value={form[k]} onChange={e => upd(k, e.target.value)} placeholder={l} /></div>
            ))}
          </div>
          <button className="pay-btn" onClick={() => setStep(1)}>Continuer vers le paiement →</button>
        </div>
      )}

      {step === 1 && (
  <div className="checkout-card fade-up">
    <h3>Choisir le moyen de paiement</h3>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
      {[
        { id: "wave", label: "Wave", color: "#1DC8FF", bg: "#E8F9FF", textColor: "#0099CC", desc: "Paiement instantané", logo: "W" },
{ id: "orange", label: "Orange Money", color: "#FF6600", bg: "#FFF3E0", textColor: "#FF6600", desc: "Orange Money Sénégal", logo: "OM" },
{ id: "free", label: "Free Money", color: "#CC0000", bg: "#FFE8E8", textColor: "#CC0000", desc: "Free Money Sénégal", logo: "FM" },
{ id: "card", label: "Carte bancaire", color: "#1A1F71", bg: "#E8EAF6", textColor: "#1A1F71", desc: "Visa, Mastercard, Amex", logo: "💳" },
      ].map(m => (
        <div key={m.id} onClick={() => setPayMethod(m.id)}
          style={{ border: `2px solid ${payMethod === m.id ? m.color : "var(--border)"}`, borderRadius: "var(--r)", padding: "1.25rem", cursor: "pointer", transition: "var(--transition)", background: payMethod === m.id ? `${m.color}10` : "white" }}>
          <div style={{ fontSize: "1.8rem", marginBottom: ".4rem" }}>{<div style={{ width: "48px", height: "48px", borderRadius: "8px", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: m.logo.length > 1 ? ".8rem" : "1.4rem", marginBottom: ".5rem" }}>
  {m.logo}
</div>}</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: ".95rem" }}>{m.label}</div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)" }}>{m.desc}</div>
        </div>
      ))}
    </div>

    {payMethod === "wave" && (
      <div style={{ background: "#1DC8FF10", border: "1.5px solid #1DC8FF40", borderRadius: "var(--r)", padding: "1.25rem", marginBottom: "1rem" }}>
        <div style={{ fontWeight: 700, marginBottom: ".5rem" }}>🌊 Paiement Wave</div>
        <div style={{ fontSize: ".85rem", color: "var(--muted)", marginBottom: ".75rem" }}>Entrez votre numéro Wave pour recevoir la demande de paiement</div>
        <input className="form-inp" placeholder="ex: 77 123 45 67" value={form.phone} onChange={e => upd("phone", e.target.value)} />
      </div>
    )}
    {payMethod === "orange" && (
      <div style={{ background: "#FF660010", border: "1.5px solid #FF660040", borderRadius: "var(--r)", padding: "1.25rem", marginBottom: "1rem" }}>
        <div style={{ fontWeight: 700, marginBottom: ".5rem" }}>🟠 Orange Money</div>
        <div style={{ fontSize: ".85rem", color: "var(--muted)", marginBottom: ".75rem" }}>Entrez votre numéro Orange Money</div>
        <input className="form-inp" placeholder="ex: 77 123 45 67" value={form.phone} onChange={e => upd("phone", e.target.value)} />
      </div>
    )}
    {payMethod === "free" && (
      <div style={{ background: "#E2001A10", border: "1.5px solid #E2001A40", borderRadius: "var(--r)", padding: "1.25rem", marginBottom: "1rem" }}>
        <div style={{ fontWeight: 700, marginBottom: ".5rem" }}>🔴 Free Money</div>
        <div style={{ fontSize: ".85rem", color: "var(--muted)", marginBottom: ".75rem" }}>Entrez votre numéro Free Money</div>
        <input className="form-inp" placeholder="ex: 76 123 45 67" value={form.phone} onChange={e => upd("phone", e.target.value)} />
      </div>
    )}
    {payMethod === "card" && (
      <div style={{ marginBottom: "1rem" }}>
        <div className="card-icons" style={{ marginBottom: "1rem" }}>
          {["VISA","MC","Amex"].map(c => <div key={c} className="card-icon">{c}</div>)}
        </div>
        <div className="form-grid">
          <div className="form-grp full">
            <label className="form-lbl">Numéro de carte</label>
            <input className="form-inp" value={form.card} onChange={e => upd("card", e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim())} placeholder="0000 0000 0000 0000" maxLength={19} />
          </div>
          <div className="form-grp">
            <label className="form-lbl">Expiration</label>
            <input className="form-inp" value={form.expiry} onChange={e => upd("expiry", e.target.value)} placeholder="MM / AA" maxLength={7} />
          </div>
          <div className="form-grp">
            <label className="form-lbl">CVV</label>
            <input className="form-inp" value={form.cvv} onChange={e => upd("cvv", e.target.value.replace(/\D/g,"").slice(0,3))} placeholder="•••" type="password" maxLength={3} />
          </div>
        </div>
      </div>
    )}
    <div className="security-badge">🔒 <span>Paiement 100% sécurisé — SSL</span></div>
    <div style={{ background: "var(--cream)", borderRadius: "var(--r-sm)", padding: "1rem", marginTop: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".88rem" }}>
        <span style={{ color: "var(--muted)" }}>Total à payer</span>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem" }}>{grand} €</span>
      </div>
    </div>
    <button className="pay-btn" onClick={() => payMethod ? setStep(2) : null}
      style={{ opacity: payMethod ? 1 : 0.5 }}>
      🔒 Payer {grand} € — {payMethod === "wave" ? "Wave" : payMethod === "orange" ? "Orange Money" : payMethod === "free" ? "Free Money" : payMethod === "card" ? "Carte" : "Choisir un moyen"}
    </button>
    <button className="btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: ".5rem", border: "none", color: "var(--muted)", fontSize: ".82rem" }} onClick={() => setStep(0)}>← Modifier la livraison</button>
  </div>
)}
    </div>
  );
}

function Login() {
  const { dispatch } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleAuth = async () => {
    setLoading(true); setErr("");
    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({ email, password: pass });
      if (error) { setErr(error.message); setLoading(false); return; }
      await supabase.from("profiles").insert({ id: data.user.id, email, name, role: "user" });
      dispatch({ type: "LOGIN", payload: { id: data.user.id, name, email, role: "user", avatar: name[0] } });
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) { setErr("Email ou mot de passe incorrect."); setLoading(false); return; }
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
      dispatch({ type: "LOGIN", payload: { id: data.user.id, name: profile?.name || email, email, role: profile?.role || "user", avatar: (profile?.name || email)[0] } });
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">Libro<span>Store</span></div>
          <div style={{ color: "rgba(255,255,255,.35)", fontSize: ".8rem", marginTop: ".25rem" }}>Votre librairie de référence</div>
        </div>
        <div className="auth-body">
          <div className="auth-title">{isSignup ? "Créer un compte" : "Connexion"}</div>
          <div className="auth-sub">{isSignup ? "Rejoignez LibroStore" : "Bon retour parmi nous"}</div>
          {isSignup && (
            <div className="form-grp" style={{ marginBottom: "1rem" }}>
              <label className="form-lbl">Prénom et nom</label>
              <input className="form-inp" value={name} onChange={e => setName(e.target.value)} placeholder="Votre nom complet" />
            </div>
          )}
          <div className="form-grp" style={{ marginBottom: "1rem" }}>
            <label className="form-lbl">Email</label>
            <input className="form-inp" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" />
          </div>
          <div className="form-grp" style={{ marginBottom: "1rem" }}>
  <label className="form-lbl">Mot de passe</label>
  <div style={{ position: "relative" }}>
    <input className="form-inp" type={showPass ? "text" : "password"} value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleAuth()} style={{ paddingRight: "40px" }} />
    <button type="button" onClick={() => setShowPass(!showPass)}
      style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "1rem" }}>
      {showPass ? "🙈" : "👁️"}
    </button>
  </div>
</div>
          {err && <div style={{ color: "#9b2226", fontSize: ".82rem", marginBottom: ".75rem" }}>{err}</div>}
          <button className="btn-gold" style={{ width: "100%", justifyContent: "center", padding: "13px", opacity: loading ? .7 : 1 }} onClick={handleAuth} disabled={loading}>
            {loading ? "Chargement..." : isSignup ? "Créer mon compte" : "Se connecter"}
          </button>
          <div style={{ textAlign: "center", marginTop: "1rem", fontSize: ".85rem", color: "var(--muted)" }}>
            {isSignup ? "Déjà un compte ?" : "Pas encore de compte ?"}
            <button style={{ background: "none", border: "none", color: "var(--gold)", fontWeight: 700, marginLeft: "6px", cursor: "pointer" }} onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Se connecter" : "S'inscrire"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function Orders() {
  const { state, dispatch } = useContext(AppContext);
  if (!state.user) return <Login />;
  const myOrders = state.orders.filter(o => o.userId === state.user.id).reverse();
  return (
    <div className="orders-wrap">
      <div className="section-label">Historique</div>
      <div className="section-title" style={{ marginBottom: "2rem" }}>Mes commandes</div>
      {myOrders.length === 0
        ? <div className="empty"><div className="empty-icon">📦</div><h3>Aucune commande</h3><p>Passez votre première commande</p>
            <button className="btn-gold" onClick={() => dispatch({ type: "SET_PAGE", payload: "catalogue" })}>Explorer le catalogue</button>
          </div>
        : myOrders.map(o => (
          <div key={o.id} className="order-card">
            <div className="oc-header">
              <div><div className="oc-id">{o.id}</div><div className="oc-date">{o.date}</div></div>
              <div style={{ textAlign: "right" }}>
                <div><span className={`oc-status s-${o.status.replace(" ", "-")}`}>{o.status}</span></div>
                <div className="oc-total" style={{ marginTop: "4px" }}>{o.total} €</div>
              </div>
            </div>
            <div className="oc-items">
              {o.items.map(i => { const b = state.books.find(b => b.id === i.bookId); return b ? <span key={i.bookId} style={{ marginRight: ".5rem" }}>{b.emoji} {b.title} ×{i.qty}</span> : null; })}
            </div>
          </div>
        ))}
    </div>
  );
}

function Wishlist() {
  const { state, dispatch } = useContext(AppContext);
  const wished = state.books.filter(b => state.wishlist.includes(b.id));
  return (
    <div className="wishlist-wrap">
      <div className="section-label">Mes favoris</div>
      <div className="section-title" style={{ marginBottom: "2rem" }}>Liste de souhaits — {wished.length} livre{wished.length > 1 ? "s" : ""}</div>
      {wished.length === 0
        ? <div className="empty"><div className="empty-icon">♡</div><h3>Aucun favori</h3><p>Cliquez sur ♡ sur n'importe quel livre</p>
            <button className="btn-gold" onClick={() => dispatch({ type: "SET_PAGE", payload: "catalogue" })}>Explorer le catalogue</button>
          </div>
        : <div className="grid">{wished.map(b => <BookCard key={b.id} book={b} />)}</div>}
    </div>
  );
}

function Profile() {
  const { state, dispatch } = useContext(AppContext);
  if (!state.user) return <Login />;
  const { user } = state;
  const myOrders = state.orders.filter(o => o.userId === user.id);
  const totalSpent = myOrders.reduce((s, o) => s + parseFloat(o.total), 0);
  return (
    <div className="profile-wrap">
      <div className="profile-banner">
        <div className="pb-avatar">{user.avatar}</div>
        <div>
          <div className="pb-name">{user.name}</div>
          <div className="pb-email">{user.email}</div>
          <span className="pb-role">{user.role === "admin" ? "✦ Administrateur" : "◈ Client"}</span>
        </div>
      </div>
      <div className="stat-grid">
        {[[myOrders.length, "Commandes"], [fmt(totalSpent) + " €", "Dépenses"], [state.wishlist.length, "Favoris"], [user.joined, "Membre depuis"]].map(([v, l]) => (
          <div key={l} className="stat-card"><div className="sc-val">{v}</div><div className="sc-lbl">{l}</div></div>
        ))}
      </div>
      <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
        <button className="btn-primary" onClick={() => dispatch({ type: "SET_PAGE", payload: "orders" })}>Mes commandes</button>
        <button className="btn-primary" onClick={() => dispatch({ type: "SET_PAGE", payload: "wishlist" })}>Mes favoris</button>
        <button className="btn-outline" style={{ marginLeft: "auto" }} onClick={() => dispatch({ type: "LOGOUT" })}>Se déconnecter</button>
      </div>
    </div>
  );
}

function Admin() {
  const { state, dispatch } = useContext(AppContext);
  const [tab, setTab] = useState("dash");
  const [editB, setEditB] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [nb, setNb] = useState({ title: "", author: "", price: "", category: "", stock: "", description: "", emoji: "📚", origin: "Sénégal", rating: 4.5 });
  if (!state.user || state.user.role !== "admin") return <div className="empty" style={{ padding: "4rem" }}><div className="empty-icon">🔒</div><h3>Accès réservé</h3></div>;
  const rev = state.orders.reduce((s, o) => s + parseFloat(o.total), 0);
  return (
    <div className="admin-wrap">
      <div className="admin-topbar">
        <div><div className="section-label">Tableau de bord</div><div className="admin-title">Administration</div></div>
      </div>
      <div className="kpi-row">
        {[["📚", state.books.length, "Titres", "+2 ce mois"], ["📦", state.orders.length, "Commandes", "+5 ce mois"], ["👥", state.users.length, "Clients", "+1"], ["💰", fmt(rev) + " €", "Revenus", "+18%"]].map(([icon, val, lbl, delta]) => (
          <div key={lbl} className="kpi"><div className="kpi-icon">{icon}</div><div className="kpi-val">{val}</div><div className="kpi-lbl">{lbl}</div><div className="kpi-delta">↑ {delta}</div></div>
        ))}
      </div>
      <div className="tabs">
        {[["dash","Vue d'ensemble"],["books","Livres"],["orders","Commandes"],["users","Utilisateurs"]].map(([id,lbl]) => (
          <button key={id} className={`tab ${tab === id ? "on" : ""}`} onClick={() => setTab(id)}>{lbl}</button>
        ))}
      </div>

      {tab === "dash" && (
        <div>
          <div className="section-label" style={{ marginBottom: ".5rem" }}>Meilleures ventes</div>
          <div className="grid">{[...state.books].sort((a,b) => b.sold - a.sold).slice(0,4).map(b => <BookCard key={b.id} book={b} />)}</div>
        </div>
      )}

      {tab === "books" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
            <button className="btn-gold" onClick={() => setShowAdd(true)}>+ Nouveau livre</button>
          </div>
          <table className="table">
            <thead><tr><th>Titre</th><th>Auteur</th><th>Catégorie</th><th>Prix</th><th>Stock</th><th>Ventes</th><th>Actions</th></tr></thead>
            <tbody>{state.books.map(b => (
              <tr key={b.id}>
                <td style={{ fontWeight: 600 }}>{b.emoji} {b.title}</td>
                <td style={{ fontStyle: "italic", color: "var(--muted)" }}>{b.author}</td>
                <td>{b.category}</td>
                <td style={{ fontWeight: 700 }}>{fmt(b.price)} €</td>
                <td><span className={`stock-tag ${b.stock > 10 ? "in" : "low"}`}>{b.stock}</span></td>
                <td>{b.sold}</td>
                <td><div style={{ display: "flex", gap: "4px" }}>
                  <button className="abtn abtn-edit" onClick={() => setEditB({ ...b })}>Éditer</button>
                  <button className="abtn abtn-del" onClick={() => window.confirm(`Supprimer "${b.title}" ?`) && dispatch({ type: "DELETE_BOOK", payload: b.id })}>✕</button>
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {tab === "orders" && (
        <table className="table">
          <thead><tr><th>ID</th><th>Client</th><th>Date</th><th>Total</th><th>Livres</th><th>Statut</th></tr></thead>
          <tbody>{state.orders.map(o => {
            const u = state.users.find(u => u.id === o.userId);
           return <tr key={o.id}>
  <td style={{ fontWeight: 700 }}>{o.id}</td>
  <td>{u?.name}</td>
  <td style={{ color: "var(--muted)" }}>{o.date}</td>
  <td style={{ fontWeight: 700 }}>{o.total} €</td>
  <td>
    {o.items?.map(i => {
      const book = state.books.find(b => b.id === i.bookId);
      return book ? <div key={i.bookId} style={{ fontSize: ".78rem" }}>{book.emoji} {book.title} ×{i.qty}</div> : null;
    })}
  </td>
  <td><span className={`oc-status s-${o.status?.replace(" ","-")}`}>{o.status}</span></td>
</tr>
          })}</tbody>
        </table>
      )}

      {tab === "users" && (
        <table className="table">
          <thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Membre depuis</th><th>Commandes</th></tr></thead>
          <tbody>{state.users.map(u => (
            <tr key={u.id}><td style={{ fontWeight: 600 }}>{u.name}</td><td style={{ color: "var(--muted)" }}>{u.email}</td>
              <td><span style={{ background: u.role === "admin" ? "#ede9fe" : "#d1fae5", color: u.role === "admin" ? "#5b21b6" : "#065f46", borderRadius: "99px", padding: "2px 10px", fontSize: ".72rem", fontWeight: 700 }}>{u.role}</span></td>
              <td style={{ color: "var(--muted)" }}>{u.joined}</td><td>{state.orders.filter(o => o.userId === u.id).length}</td>
            </tr>
          ))}</tbody>
        </table>
      )}

      {/* EDIT MODAL */}
      {editB && (
        <div className="overlay" onClick={() => setEditB(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Modifier le livre</div>
            <div className="form-grid">
              {[["title","Titre"],["author","Auteur"],["category","Catégorie"],["origin","Origine"]].map(([k,l]) => (
                <div key={k} className="form-grp" style={{ gridColumn: k === "title" ? "1/-1" : "" }}>
                  <label className="form-lbl">{l}</label>
                  <input className="form-inp" value={editB[k]} onChange={e => setEditB({ ...editB, [k]: e.target.value })} />
                </div>
              ))}
              <div className="form-grp"><label className="form-lbl">Prix (€)</label><input className="form-inp" type="number" step=".01" value={editB.price} onChange={e => setEditB({ ...editB, price: +e.target.value })} /></div>
              <div className="form-grp"><label className="form-lbl">Stock</label><input className="form-inp" type="number" value={editB.stock} onChange={e => setEditB({ ...editB, stock: +e.target.value })} /></div>
            </div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setEditB(null)}>Annuler</button>
              <button className="btn-gold" onClick={() => { dispatch({ type: "UPDATE_BOOK", payload: editB }); setEditB(null); }}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD BOOK MODAL */}
      {showAdd && (
        <div className="overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Ajouter un livre</div>
            <div className="form-grid">
              {[["title","Titre","full"],["author","Auteur",""],["category","Catégorie",""],["origin","Origine",""],["emoji","Emoji",""],["price","Prix (€)",""],["stock","Stock",""],["description","Description","full"]].map(([k,l,span]) => (
                <div key={k} className={`form-grp ${span}`}><label className="form-lbl">{l}</label>
                  <input className="form-inp" value={nb[k]} onChange={e => setNb({ ...nb, [k]: e.target.value })} type={["price","stock"].includes(k) ? "number" : "text"} />
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setShowAdd(false)}>Annuler</button>
              <button className="btn-gold" onClick={() => { dispatch({ type: "ADD_BOOK", payload: { ...nb, price: +nb.price, stock: +nb.stock } }); setShowAdd(false); }}>Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Footer() {
  const { dispatch } = useContext(AppContext);
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">Libro<span>Store</span></div>
          <div className="footer-desc">La librairie de référence pour la littérature africaine et mondiale. Soigneusement sélectionnée, livrée avec passion.</div>
        </div>
        <div className="footer-col">
          <h4>Navigation</h4>
          {[["home","Accueil"],["catalogue","Catalogue"],["wishlist","Favoris"],["orders","Commandes"]].map(([p,l]) => (
            <a key={p} onClick={() => dispatch({ type: "SET_PAGE", payload: p })}>{l}</a>
          ))}
        </div>
        <div className="footer-col">
          <h4>À propos</h4>
          <a>Notre sélection</a><a>Auteurs africains</a><a>Livraison</a><a>Contact</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">© 2026 LibroStore — Dakar, Sénégal</div>
        <div className="footer-love">Fait avec ♥ et React</div>
      </div>
    </footer>
  );
}

// ─── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, init);
  const renderPage = () => {
    switch (state.page) {
      case "home": return <><Hero /><div className="divider" /><div className="section"><div className="section-header"><div><div className="section-label">Sélection du moment</div><div className="section-title">Coups de cœur</div></div><button className="section-link" onClick={() => dispatch({ type: "SET_PAGE", payload: "catalogue" })}>Tout voir →</button></div><div className="grid">{[...state.books].sort((a,b) => b.rating - a.rating).slice(0,8).map(b => <BookCard key={b.id} book={b} />)}</div></div></>;
      case "catalogue": return <Catalogue />;
      case "book": return <BookDetail />;
      case "cart": return <Cart />;
      case "checkout": return <Checkout />;
      case "login": return <Login />;
      case "orders": return <Orders />;
      case "wishlist": return <Wishlist />;
      case "profile": return <Profile />;
      case "admin": return <Admin />;
      default: return <Catalogue />;
    }
  };
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Styles />
      <div className="app">
        <Nav />
        <main className="main">{renderPage()}</main>
        <Footer />
      </div>
      <Toast />
    </AppContext.Provider>
  );
}