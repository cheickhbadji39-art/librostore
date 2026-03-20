import { useState, useEffect, useReducer, createContext, useContext } from "react";

// ─── DONNÉES MOCK (simule le backend) ───────────────────────────────────────
const BOOKS_DB = [
  { id: 1, title: "Dune", author: "Frank Herbert", price: 14.90, category: "Science-Fiction", cover: "https://covers.openlibrary.org/b/id/8739161-L.jpg", rating: 4.9, stock: 12, description: "Un chef-d'œuvre de la SF, épopée galactique sur fond de politique et d'écologie.", sold: 340 },
  { id: 2, title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", price: 8.50, category: "Classique", cover: "https://covers.openlibrary.org/b/id/8479576-L.jpg", rating: 4.8, stock: 25, description: "Le conte poétique et philosophique le plus lu au monde.", sold: 890 },
  { id: 3, title: "1984", author: "George Orwell", price: 11.90, category: "Dystopie", cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg", rating: 4.7, stock: 8, description: "Un roman visionnaire sur la surveillance totalitaire et la liberté.", sold: 520 },
  { id: 4, title: "Harry Potter T1", author: "J.K. Rowling", price: 10.50, category: "Fantastique", cover: "https://covers.openlibrary.org/b/id/10110415-L.jpg", rating: 4.9, stock: 30, description: "Le début d'une saga magique qui a marqué des générations.", sold: 1200 },
  { id: 5, title: "L'Étranger", author: "Albert Camus", price: 7.90, category: "Classique", cover: "https://covers.openlibrary.org/b/id/8234849-L.jpg", rating: 4.6, stock: 15, description: "L'absurde existentiel à travers le regard de Meursault.", sold: 280 },
  { id: 6, title: "Fondation", author: "Isaac Asimov", price: 12.90, category: "Science-Fiction", cover: "https://covers.openlibrary.org/b/id/7842354-L.jpg", rating: 4.8, stock: 6, description: "La psychohistoire au service d'une civilisation galactique mourante.", sold: 410 },
  { id: 7, title: "Le Seigneur des Anneaux", author: "J.R.R. Tolkien", price: 24.90, category: "Fantastique", cover: "https://covers.openlibrary.org/b/id/8406786-L.jpg", rating: 5.0, stock: 10, description: "L'épopée fantasy ultime, voyage au cœur de la Terre du Milieu.", sold: 760 },
  { id: 8, title: "Crime et Châtiment", author: "Fiodor Dostoïevski", price: 13.50, category: "Classique", cover: "https://covers.openlibrary.org/b/id/8289890-L.jpg", rating: 4.7, stock: 9, description: "Un chef-d'œuvre psychologique sur la culpabilité et la rédemption.", sold: 190 },
  { id: 9, title: "Sapiens", author: "Yuval Noah Harari", price: 16.90, category: "Non-Fiction", cover: "https://covers.openlibrary.org/b/id/8592348-L.jpg", rating: 4.6, stock: 18, description: "Une histoire fascinante de l'humanité depuis ses origines.", sold: 640 },
  { id: 10, title: "Le Meilleur des Mondes", author: "Aldous Huxley", price: 9.90, category: "Dystopie", cover: "https://covers.openlibrary.org/b/id/8235060-L.jpg", rating: 4.5, stock: 14, description: "Une dystopie d'une actualité troublante sur le contrôle social.", sold: 310 },
  { id: 11, title: "Neuromancien", author: "William Gibson", price: 11.50, category: "Science-Fiction", cover: "https://covers.openlibrary.org/b/id/8386356-L.jpg", rating: 4.4, stock: 7, description: "Le roman fondateur du cyberpunk, visionnaire et électrique.", sold: 230 },
  { id: 12, title: "Les Misérables", author: "Victor Hugo", price: 18.90, category: "Classique", cover: "https://covers.openlibrary.org/b/id/8120521-L.jpg", rating: 4.8, stock: 11, description: "L'œuvre monumentale de Hugo, hymne à la justice et à la dignité.", sold: 450 },
];

const USERS_DB = [
  { id: 1, name: "Alice Martin", email: "alice@example.com", password: "pass123", role: "admin", joined: "2024-01-15", orders: 12 },
  { id: 2, name: "Bob Dupont", email: "bob@example.com", password: "pass123", role: "user", joined: "2024-03-20", orders: 5 },
];

const ORDERS_DB = [
  { id: "CMD-001", userId: 2, date: "2025-03-10", status: "livré", total: 35.80, items: [{ bookId: 1, qty: 1 }, { bookId: 4, qty: 2 }] },
  { id: "CMD-002", userId: 2, date: "2025-03-18", status: "en cours", total: 14.90, items: [{ bookId: 6, qty: 1 }] },
];

// ─── CONTEXT & REDUCER ──────────────────────────────────────────────────────
const AppContext = createContext();

const initialState = {
  user: null,
  cart: [],
  page: "home",
  books: BOOKS_DB,
  users: USERS_DB,
  orders: ORDERS_DB,
  selectedBook: null,
  toast: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN": return { ...state, user: action.payload, page: "home" };
    case "LOGOUT": return { ...state, user: null, cart: [], page: "home" };
    case "SET_PAGE": return { ...state, page: action.payload, selectedBook: null };
    case "SELECT_BOOK": return { ...state, selectedBook: action.payload, page: "book-detail" };
    case "ADD_TO_CART": {
      const exists = state.cart.find(i => i.id === action.payload.id);
      const cart = exists
        ? state.cart.map(i => i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i)
        : [...state.cart, { ...action.payload, qty: 1 }];
      return { ...state, cart, toast: `"${action.payload.title}" ajouté au panier !` };
    }
    case "REMOVE_FROM_CART": return { ...state, cart: state.cart.filter(i => i.id !== action.payload) };
    case "UPDATE_QTY": return { ...state, cart: state.cart.map(i => i.id === action.payload.id ? { ...i, qty: Math.max(1, action.payload.qty) } : i) };
    case "CLEAR_CART": return { ...state, cart: [] };
    case "PLACE_ORDER": {
      const newOrder = {
        id: `CMD-${String(state.orders.length + 1).padStart(3, "0")}`,
        userId: state.user.id,
        date: new Date().toISOString().split("T")[0],
        status: "en cours",
        total: action.payload,
        items: state.cart.map(i => ({ bookId: i.id, qty: i.qty })),
      };
      return { ...state, orders: [...state.orders, newOrder], cart: [], page: "orders", toast: "Commande passée avec succès ! 🎉" };
    }
    case "UPDATE_BOOK": return { ...state, books: state.books.map(b => b.id === action.payload.id ? action.payload : b) };
    case "DELETE_BOOK": return { ...state, books: state.books.filter(b => b.id !== action.payload) };
    case "ADD_BOOK": return { ...state, books: [...state.books, { ...action.payload, id: Date.now() }] };
    case "CLEAR_TOAST": return { ...state, toast: null };
    default: return state;
  }
}

// ─── STYLES GLOBAUX ─────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --ink: #0d0d14;
      --paper: #fafaf7;
      --cream: #f2f0e8;
      --vivid: #ff4d2e;
      --vivid2: #ffb800;
      --vivid3: #00c2a8;
      --vivid4: #6c3fff;
      --muted: #8a8a9a;
      --border: #e0ddd5;
      --card: #ffffff;
      --shadow: 0 4px 24px rgba(13,13,20,0.10);
      --shadow-lg: 0 12px 48px rgba(13,13,20,0.16);
      --radius: 16px;
      --radius-sm: 8px;
      --font-head: 'Syne', sans-serif;
      --font-body: 'DM Sans', sans-serif;
    }

    html { scroll-behavior: smooth; }
    body { font-family: var(--font-body); background: var(--paper); color: var(--ink); min-height: 100vh; }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--cream); }
    ::-webkit-scrollbar-thumb { background: var(--vivid4); border-radius: 99px; }

    .app-wrapper { min-height: 100vh; display: flex; flex-direction: column; }

    /* NAV */
    .nav { background: var(--ink); color: white; padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; height: 64px; position: sticky; top: 0; z-index: 100; }
    .nav-logo { font-family: var(--font-head); font-size: 1.4rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; }
    .nav-logo span { color: var(--vivid); }
    .nav-links { display: flex; align-items: center; gap: 0.5rem; }
    .nav-btn { background: none; border: none; color: rgba(255,255,255,0.7); font-family: var(--font-body); font-size: 0.9rem; padding: 8px 14px; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s; }
    .nav-btn:hover, .nav-btn.active { color: white; background: rgba(255,255,255,0.1); }
    .nav-btn.cta { background: var(--vivid); color: white; font-weight: 600; }
    .nav-btn.cta:hover { background: #e03e22; }
    .cart-badge { background: var(--vivid2); color: var(--ink); border-radius: 99px; font-size: 0.7rem; font-weight: 700; padding: 2px 7px; margin-left: 4px; }

    /* HERO */
    .hero { background: var(--ink); color: white; padding: 5rem 2rem 4rem; text-align: center; position: relative; overflow: hidden; }
    .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 20% 50%, rgba(108,63,255,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,77,46,0.25) 0%, transparent 50%); }
    .hero-content { position: relative; max-width: 680px; margin: 0 auto; }
    .hero h1 { font-family: var(--font-head); font-size: clamp(2.2rem, 5vw, 3.8rem); font-weight: 800; line-height: 1.1; margin-bottom: 1.2rem; }
    .hero h1 em { color: var(--vivid); font-style: normal; }
    .hero p { color: rgba(255,255,255,0.65); font-size: 1.1rem; margin-bottom: 2rem; }
    .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .btn { padding: 12px 28px; border-radius: var(--radius-sm); font-family: var(--font-body); font-size: 1rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; }
    .btn-primary { background: var(--vivid); color: white; }
    .btn-primary:hover { background: #e03e22; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,77,46,0.4); }
    .btn-secondary { background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); }
    .btn-secondary:hover { background: rgba(255,255,255,0.2); }
    .btn-outline { background: transparent; color: var(--ink); border: 2px solid var(--border); }
    .btn-outline:hover { border-color: var(--ink); }
    .btn-danger { background: #fee2e2; color: #dc2626; }
    .btn-danger:hover { background: #fecaca; }

    /* STATS */
    .stats-bar { background: var(--cream); border-bottom: 1px solid var(--border); padding: 1rem 2rem; display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat-value { font-family: var(--font-head); font-size: 1.5rem; font-weight: 800; color: var(--vivid4); }
    .stat-label { font-size: 0.78rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }

    /* SEARCH */
    .search-bar { max-width: 700px; margin: 0 auto; padding: 2rem 2rem 0; }
    .search-inner { display: flex; gap: 0.75rem; align-items: center; background: white; border: 2px solid var(--border); border-radius: var(--radius); padding: 0.5rem 0.75rem; transition: border-color 0.2s; }
    .search-inner:focus-within { border-color: var(--vivid4); }
    .search-inner input { flex: 1; border: none; outline: none; font-family: var(--font-body); font-size: 1rem; background: transparent; }
    .search-icon { color: var(--muted); font-size: 1.2rem; }
    .filters { display: flex; gap: 0.5rem; flex-wrap: wrap; padding: 1rem 2rem; max-width: 700px; margin: 0 auto; }
    .filter-chip { padding: 6px 14px; border-radius: 99px; font-size: 0.82rem; font-weight: 500; cursor: pointer; border: 1.5px solid var(--border); background: white; color: var(--ink); transition: all 0.18s; }
    .filter-chip:hover { border-color: var(--vivid4); color: var(--vivid4); }
    .filter-chip.active { background: var(--vivid4); border-color: var(--vivid4); color: white; }

    /* CATALOGUE */
    .section { padding: 2rem; max-width: 1200px; margin: 0 auto; width: 100%; }
    .section-title { font-family: var(--font-head); font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px; }
    .section-title .count { font-size: 0.85rem; color: var(--muted); font-weight: 400; font-family: var(--font-body); }
    .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.25rem; }

    /* BOOK CARD */
    .book-card { background: var(--card); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); cursor: pointer; transition: all 0.22s; border: 1px solid var(--border); display: flex; flex-direction: column; }
    .book-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
    .book-cover { width: 100%; height: 260px; object-fit: cover; background: var(--cream); display: block; }
    .book-cover-placeholder { width: 100%; height: 260px; background: linear-gradient(135deg, var(--cream), #e0ddd5); display: flex; align-items: center; justify-content: center; font-size: 3rem; }
    .book-info { padding: 1rem; flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .book-category { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--vivid4); }
    .book-title { font-family: var(--font-head); font-size: 0.95rem; font-weight: 700; line-height: 1.3; }
    .book-author { font-size: 0.82rem; color: var(--muted); }
    .book-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 0.75rem; }
    .book-price { font-family: var(--font-head); font-size: 1.1rem; font-weight: 800; color: var(--vivid); }
    .book-rating { font-size: 0.8rem; color: var(--vivid2); display: flex; align-items: center; gap: 3px; }
    .add-to-cart-btn { width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--vivid); color: white; border: none; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; transition: all 0.18s; flex-shrink: 0; }
    .add-to-cart-btn:hover { background: #e03e22; transform: scale(1.1); }
    .stock-badge { font-size: 0.7rem; padding: 2px 7px; border-radius: 99px; font-weight: 600; }
    .in-stock { background: #d1fae5; color: #059669; }
    .low-stock { background: #fef3c7; color: #d97706; }

    /* BOOK DETAIL */
    .book-detail { max-width: 900px; margin: 0 auto; padding: 2rem; }
    .back-btn { display: inline-flex; align-items: center; gap: 8px; color: var(--muted); font-size: 0.9rem; cursor: pointer; margin-bottom: 1.5rem; background: none; border: none; font-family: var(--font-body); }
    .back-btn:hover { color: var(--ink); }
    .book-detail-inner { display: grid; grid-template-columns: 280px 1fr; gap: 2.5rem; align-items: start; }
    .book-detail-cover { width: 100%; border-radius: var(--radius); box-shadow: var(--shadow-lg); }
    .book-detail-category { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--vivid4); margin-bottom: 0.5rem; }
    .book-detail-title { font-family: var(--font-head); font-size: 2rem; font-weight: 800; margin-bottom: 0.25rem; }
    .book-detail-author { color: var(--muted); margin-bottom: 1rem; }
    .book-detail-desc { line-height: 1.7; color: #444; margin-bottom: 1.5rem; }
    .book-detail-price { font-family: var(--font-head); font-size: 2.2rem; font-weight: 800; color: var(--vivid); margin-bottom: 1.5rem; }
    .detail-meta { display: flex; gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .meta-item { text-align: center; }
    .meta-val { font-family: var(--font-head); font-size: 1.2rem; font-weight: 700; }
    .meta-lbl { font-size: 0.75rem; color: var(--muted); }

    /* CART */
    .cart-page { max-width: 800px; margin: 0 auto; padding: 2rem; }
    .cart-item { display: grid; grid-template-columns: 60px 1fr auto; gap: 1rem; align-items: center; background: white; border-radius: var(--radius-sm); padding: 1rem; border: 1px solid var(--border); margin-bottom: 0.75rem; }
    .cart-item-cover { width: 60px; height: 80px; object-fit: cover; border-radius: var(--radius-sm); background: var(--cream); }
    .cart-item-title { font-family: var(--font-head); font-weight: 700; font-size: 0.95rem; }
    .cart-item-author { font-size: 0.82rem; color: var(--muted); }
    .cart-item-price { font-family: var(--font-head); font-weight: 800; color: var(--vivid); }
    .qty-control { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
    .qty-btn { width: 28px; height: 28px; border-radius: 6px; border: 1.5px solid var(--border); background: white; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; }
    .qty-btn:hover { background: var(--cream); }
    .cart-summary { background: var(--ink); color: white; border-radius: var(--radius); padding: 1.5rem; margin-top: 1.5rem; }
    .cart-summary h3 { font-family: var(--font-head); font-size: 1.1rem; margin-bottom: 1rem; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem; color: rgba(255,255,255,0.7); }
    .summary-total { display: flex; justify-content: space-between; font-family: var(--font-head); font-size: 1.3rem; font-weight: 800; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 1rem; margin-top: 0.5rem; }

    /* AUTH */
    .auth-page { max-width: 420px; margin: 3rem auto; padding: 2rem; }
    .auth-card { background: white; border-radius: var(--radius); box-shadow: var(--shadow-lg); padding: 2.5rem; border: 1px solid var(--border); }
    .auth-title { font-family: var(--font-head); font-size: 1.8rem; font-weight: 800; margin-bottom: 0.25rem; }
    .auth-subtitle { color: var(--muted); margin-bottom: 2rem; font-size: 0.9rem; }
    .form-group { margin-bottom: 1.25rem; }
    .form-label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--ink); }
    .form-input { width: 100%; padding: 10px 14px; border: 2px solid var(--border); border-radius: var(--radius-sm); font-family: var(--font-body); font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
    .form-input:focus { border-color: var(--vivid4); }
    .auth-demo { background: var(--cream); border-radius: var(--radius-sm); padding: 0.75rem; margin-top: 1rem; font-size: 0.82rem; color: var(--muted); }
    .auth-demo strong { color: var(--ink); }

    /* ORDERS */
    .orders-page { max-width: 800px; margin: 0 auto; padding: 2rem; }
    .order-card { background: white; border-radius: var(--radius); border: 1px solid var(--border); padding: 1.25rem; margin-bottom: 1rem; }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .order-id { font-family: var(--font-head); font-weight: 700; }
    .order-status { padding: 4px 12px; border-radius: 99px; font-size: 0.78rem; font-weight: 600; }
    .status-livré { background: #d1fae5; color: #059669; }
    .status-en-cours { background: #fef3c7; color: #d97706; }
    .status-annulé { background: #fee2e2; color: #dc2626; }

    /* ADMIN */
    .admin-page { max-width: 1100px; margin: 0 auto; padding: 2rem; }
    .admin-tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 2px solid var(--border); padding-bottom: 0; }
    .admin-tab { padding: 10px 20px; border: none; background: none; font-family: var(--font-body); font-size: 0.9rem; font-weight: 600; cursor: pointer; color: var(--muted); border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.18s; }
    .admin-tab.active { color: var(--vivid4); border-bottom-color: var(--vivid4); }
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .kpi-card { background: white; border-radius: var(--radius); border: 1px solid var(--border); padding: 1.25rem; }
    .kpi-icon { font-size: 1.8rem; margin-bottom: 0.5rem; }
    .kpi-value { font-family: var(--font-head); font-size: 1.8rem; font-weight: 800; }
    .kpi-label { font-size: 0.78rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .kpi-delta { font-size: 0.8rem; font-weight: 600; color: #059669; margin-top: 2px; }
    .data-table { width: 100%; border-collapse: collapse; background: white; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); }
    .data-table th { background: var(--ink); color: white; padding: 12px 16px; text-align: left; font-family: var(--font-head); font-size: 0.82rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .data-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); font-size: 0.88rem; }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table tr:hover td { background: var(--cream); }
    .action-btns { display: flex; gap: 6px; }
    .btn-sm { padding: 5px 12px; font-size: 0.78rem; border-radius: 6px; border: none; cursor: pointer; font-family: var(--font-body); font-weight: 600; transition: all 0.18s; }
    .btn-edit { background: #ede9fe; color: var(--vivid4); }
    .btn-edit:hover { background: #ddd6fe; }
    .btn-del { background: #fee2e2; color: #dc2626; }
    .btn-del:hover { background: #fecaca; }

    /* TOAST */
    .toast { position: fixed; bottom: 24px; right: 24px; background: var(--ink); color: white; padding: 14px 22px; border-radius: var(--radius-sm); box-shadow: var(--shadow-lg); font-size: 0.9rem; font-weight: 500; z-index: 999; animation: slideIn 0.3s ease; max-width: 320px; }
    .toast-bar { height: 3px; background: var(--vivid); border-radius: 99px; animation: shrink 3s linear forwards; margin-top: 8px; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes shrink { from { width: 100%; } to { width: 0%; } }

    /* PROFILE */
    .profile-page { max-width: 700px; margin: 0 auto; padding: 2rem; }
    .profile-header { background: linear-gradient(135deg, var(--vivid4), var(--vivid)); border-radius: var(--radius); padding: 2rem; color: white; margin-bottom: 2rem; display: flex; align-items: center; gap: 1.5rem; }
    .profile-avatar { width: 72px; height: 72px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; font-family: var(--font-head); border: 3px solid rgba(255,255,255,0.3); flex-shrink: 0; }
    .profile-name { font-family: var(--font-head); font-size: 1.5rem; font-weight: 800; }
    .profile-email { font-size: 0.9rem; opacity: 0.8; }
    .profile-role { display: inline-block; background: rgba(255,255,255,0.2); padding: 2px 10px; border-radius: 99px; font-size: 0.75rem; font-weight: 600; margin-top: 4px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .info-card { background: white; border-radius: var(--radius-sm); border: 1px solid var(--border); padding: 1.25rem; }
    .info-card-label { font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.25rem; }
    .info-card-value { font-family: var(--font-head); font-size: 1.3rem; font-weight: 700; }

    /* EMPTY STATES */
    .empty-state { text-align: center; padding: 4rem 2rem; color: var(--muted); }
    .empty-state .icon { font-size: 3.5rem; margin-bottom: 1rem; opacity: 0.5; }
    .empty-state h3 { font-family: var(--font-head); font-size: 1.2rem; color: var(--ink); margin-bottom: 0.5rem; }

    /* MODAL */
    .modal-overlay { position: fixed; inset: 0; background: rgba(13,13,20,0.6); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .modal { background: white; border-radius: var(--radius); padding: 2rem; max-width: 500px; width: 100%; box-shadow: var(--shadow-lg); }
    .modal h2 { font-family: var(--font-head); font-size: 1.4rem; font-weight: 800; margin-bottom: 1.5rem; }
    .modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem; }

    @media (max-width: 600px) {
      .book-detail-inner { grid-template-columns: 1fr; }
      .nav-links .nav-btn:not(.cta):not([data-always]) { display: none; }
      .stats-bar { gap: 1.5rem; }
    }
  `}</style>
);

// ─── COMPOSANTS ─────────────────────────────────────────────────────────────

function Toast() {
  const { state, dispatch } = useContext(AppContext);
  useEffect(() => {
    if (state.toast) {
      const t = setTimeout(() => dispatch({ type: "CLEAR_TOAST" }), 3000);
      return () => clearTimeout(t);
    }
  }, [state.toast]);
  if (!state.toast) return null;
  return (
    <div className="toast">
      {state.toast}
      <div className="toast-bar" />
    </div>
  );
}

function Nav() {
  const { state, dispatch } = useContext(AppContext);
  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => dispatch({ type: "SET_PAGE", payload: "home" })}>
        📚 <span>Libro</span>Store
      </div>
      <div className="nav-links">
        <button className="nav-btn" onClick={() => dispatch({ type: "SET_PAGE", payload: "catalogue" })}>Catalogue</button>
        <button className="nav-btn" onClick={() => dispatch({ type: "SET_PAGE", payload: "cart" })}>
          🛒 Panier {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
        {state.user ? (
          <>
            {state.user.role === "admin" && (
              <button className="nav-btn" onClick={() => dispatch({ type: "SET_PAGE", payload: "admin" })}>⚙️ Admin</button>
            )}
            <button className="nav-btn" onClick={() => dispatch({ type: "SET_PAGE", payload: "profile" })}>👤 {state.user.name.split(" ")[0]}</button>
            <button className="nav-btn cta" onClick={() => dispatch({ type: "LOGOUT" })}>Déconnexion</button>
          </>
        ) : (
          <button className="nav-btn cta" onClick={() => dispatch({ type: "SET_PAGE", payload: "login" })}>Connexion</button>
        )}
      </div>
    </nav>
  );
}

function Hero() {
  const { dispatch } = useContext(AppContext);
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>La librairie <em>moderne</em> qui vous ressemble</h1>
        <p>Des milliers de livres soigneusement sélectionnés. Livraison rapide, prix imbattables.</p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => dispatch({ type: "SET_PAGE", payload: "catalogue" })}>
            📖 Explorer le catalogue
          </button>
          <button className="btn btn-secondary" onClick={() => dispatch({ type: "SET_PAGE", payload: "catalogue" })}>
            🔥 Bestsellers
          </button>
        </div>
      </div>
    </div>
  );
}

function StatsBar({ books }) {
  const totalBooks = books.length;
  const totalSold = books.reduce((s, b) => s + b.sold, 0);
  const categories = [...new Set(books.map(b => b.category))].length;
  return (
    <div className="stats-bar">
      <div className="stat"><div className="stat-value">{totalBooks}</div><div className="stat-label">Livres</div></div>
      <div className="stat"><div className="stat-value">{totalSold.toLocaleString()}</div><div className="stat-label">Ventes</div></div>
      <div className="stat"><div className="stat-value">{categories}</div><div className="stat-label">Catégories</div></div>
      <div className="stat"><div className="stat-value">⭐ 4.7</div><div className="stat-label">Note moyenne</div></div>
    </div>
  );
}

function BookCard({ book }) {
  const { dispatch } = useContext(AppContext);
  return (
    <div className="book-card" onClick={() => dispatch({ type: "SELECT_BOOK", payload: book })}>
      {book.cover
        ? <img src={book.cover} alt={book.title} className="book-cover" onError={e => { e.target.style.display = "none"; }} />
        : <div className="book-cover-placeholder">📚</div>}
      <div className="book-info">
        <div className="book-category">{book.category}</div>
        <div className="book-title">{book.title}</div>
        <div className="book-author">{book.author}</div>
        <div className="book-footer">
          <div>
            <div className="book-price">{book.price.toFixed(2)} €</div>
            <div className="book-rating">⭐ {book.rating}</div>
          </div>
          <button className="add-to-cart-btn" onClick={e => { e.stopPropagation(); dispatch({ type: "ADD_TO_CART", payload: book }); }} title="Ajouter au panier">+</button>
        </div>
        <span className={`stock-badge ${book.stock > 10 ? "in-stock" : "low-stock"}`}>
          {book.stock > 10 ? `✓ En stock` : `⚠ Plus que ${book.stock}`}
        </span>
      </div>
    </div>
  );
}

function Catalogue() {
  const { state } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("Tous");
  const [sort, setSort] = useState("defaut");
  const categories = ["Tous", ...new Set(state.books.map(b => b.category))];

  let filtered = state.books.filter(b =>
    (cat === "Tous" || b.category === cat) &&
    (b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()))
  );
  if (sort === "prix-asc") filtered.sort((a, b) => a.price - b.price);
  if (sort === "prix-desc") filtered.sort((a, b) => b.price - a.price);
  if (sort === "note") filtered.sort((a, b) => b.rating - a.rating);
  if (sort === "pop") filtered.sort((a, b) => b.sold - a.sold);

  return (
    <div>
      <div className="search-bar">
        <div className="search-inner">
          <span className="search-icon">🔍</span>
          <input placeholder="Rechercher un livre, un auteur…" value={search} onChange={e => setSearch(e.target.value)} />
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ border: "none", outline: "none", fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--muted)", background: "transparent" }}>
            <option value="defaut">Pertinence</option>
            <option value="prix-asc">Prix ↑</option>
            <option value="prix-desc">Prix ↓</option>
            <option value="note">Meilleures notes</option>
            <option value="pop">Popularité</option>
          </select>
        </div>
      </div>
      <div className="filters">
        {categories.map(c => (
          <button key={c} className={`filter-chip ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <div className="section">
        <div className="section-title">
          {cat === "Tous" ? "Tous les livres" : cat}
          <span className="count">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</span>
        </div>
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="icon">🔍</div><h3>Aucun résultat</h3><p>Essayez d'autres mots-clés</p></div>
        ) : (
          <div className="books-grid">{filtered.map(b => <BookCard key={b.id} book={b} />)}</div>
        )}
      </div>
    </div>
  );
}

function BookDetail() {
  const { state, dispatch } = useContext(AppContext);
  const book = state.selectedBook;
  if (!book) return null;
  return (
    <div className="book-detail">
      <button className="back-btn" onClick={() => dispatch({ type: "SET_PAGE", payload: "catalogue" })}>← Retour au catalogue</button>
      <div className="book-detail-inner">
        <div>
          {book.cover
            ? <img src={book.cover} alt={book.title} className="book-detail-cover" />
            : <div style={{ width: "100%", height: 380, background: "var(--cream)", borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>📚</div>}
        </div>
        <div>
          <div className="book-detail-category">{book.category}</div>
          <h1 className="book-detail-title">{book.title}</h1>
          <div className="book-detail-author">par {book.author}</div>
          <div className="detail-meta">
            <div className="meta-item"><div className="meta-val">⭐ {book.rating}</div><div className="meta-lbl">Note</div></div>
            <div className="meta-item"><div className="meta-val">{book.sold}</div><div className="meta-lbl">Vendus</div></div>
            <div className="meta-item"><div className="meta-val">{book.stock}</div><div className="meta-lbl">En stock</div></div>
          </div>
          <p className="book-detail-desc">{book.description}</p>
          <div className="book-detail-price">{book.price.toFixed(2)} €</div>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}
            onClick={() => dispatch({ type: "ADD_TO_CART", payload: book })}>
            🛒 Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}

function Cart() {
  const { state, dispatch } = useContext(AppContext);
  const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = total > 35 ? 0 : 3.90;
  if (state.cart.length === 0) return (
    <div className="cart-page">
      <div className="section-title">🛒 Mon panier</div>
      <div className="empty-state"><div className="icon">🛒</div><h3>Votre panier est vide</h3><p>Découvrez notre catalogue !</p>
        <br /><button className="btn btn-primary" onClick={() => dispatch({ type: "SET_PAGE", payload: "catalogue" })}>Explorer les livres</button>
      </div>
    </div>
  );
  return (
    <div className="cart-page">
      <div className="section-title">🛒 Mon panier <span className="count">{state.cart.length} article{state.cart.length > 1 ? "s" : ""}</span></div>
      {state.cart.map(item => (
        <div key={item.id} className="cart-item">
          {item.cover ? <img src={item.cover} alt={item.title} className="cart-item-cover" /> : <div className="cart-item-cover" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>📚</div>}
          <div>
            <div className="cart-item-title">{item.title}</div>
            <div className="cart-item-author">{item.author}</div>
            <div className="qty-control">
              <button className="qty-btn" onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, qty: item.qty - 1 } })}>−</button>
              <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
              <button className="qty-btn" onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, qty: item.qty + 1 } })}>+</button>
              <button className="btn-sm btn-del" onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.id })}>Retirer</button>
            </div>
          </div>
          <div className="cart-item-price">{(item.price * item.qty).toFixed(2)} €</div>
        </div>
      ))}
      <div className="cart-summary">
        <h3>Récapitulatif</h3>
        <div className="summary-row"><span>Sous-total</span><span>{total.toFixed(2)} €</span></div>
        <div className="summary-row"><span>Livraison</span><span>{shipping === 0 ? "Offerte 🎉" : `${shipping.toFixed(2)} €`}</span></div>
        {total < 35 && <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>Plus que {(35 - total).toFixed(2)} € pour la livraison gratuite</div>}
        <div className="summary-total"><span>Total</span><span>{(total + shipping).toFixed(2)} €</span></div>
        <button className="btn btn-primary" style={{ width: "100%", marginTop: "1rem", justifyContent: "center" }}
          onClick={() => {
            if (!state.user) { dispatch({ type: "SET_PAGE", payload: "login" }); return; }
            dispatch({ type: "PLACE_ORDER", payload: (total + shipping).toFixed(2) });
          }}>
          ✅ Commander maintenant
        </button>
      </div>
    </div>
  );
}

function Login() {
  const { state, dispatch } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const handleLogin = () => {
    const user = state.users.find(u => u.email === email && u.password === pass);
    if (user) { dispatch({ type: "LOGIN", payload: user }); }
    else setErr("Email ou mot de passe incorrect.");
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-title">Connexion</div>
        <div className="auth-subtitle">Bon retour parmi nous ! 📚</div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Mot de passe</label>
          <input className="form-input" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>
        {err && <div style={{ color: "#dc2626", fontSize: "0.85rem", marginBottom: "1rem" }}>{err}</div>}
        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleLogin}>Se connecter</button>
        <div className="auth-demo">
          <strong>Comptes de démo :</strong><br />
          👤 <strong>Admin :</strong> alice@example.com / pass123<br />
          👤 <strong>User :</strong> bob@example.com / pass123
        </div>
      </div>
    </div>
  );
}

function Orders() {
  const { state } = useContext(AppContext);
  const myOrders = state.orders.filter(o => o.userId === state.user?.id);
  if (!state.user) return <div className="empty-state" style={{ padding: "4rem" }}><div className="icon">🔒</div><h3>Connectez-vous pour voir vos commandes</h3></div>;
  return (
    <div className="orders-page">
      <div className="section-title">📦 Mes commandes</div>
      {myOrders.length === 0 ? (
        <div className="empty-state"><div className="icon">📦</div><h3>Aucune commande</h3><p>Passez votre première commande !</p></div>
      ) : myOrders.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <div>
              <div className="order-id">{order.id}</div>
              <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Passée le {order.date}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className={`order-status status-${order.status.replace(" ", "-")}`}>{order.status}</span>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.1rem", marginTop: "4px" }}>{order.total} €</div>
            </div>
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
            {order.items.map(i => {
              const book = state.books.find(b => b.id === i.bookId);
              return book ? <span key={i.bookId} style={{ marginRight: "0.5rem" }}>📖 {book.title} ×{i.qty}</span> : null;
            })}
          </div>
        </div>
      ))}
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
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">{user.name[0]}</div>
        <div>
          <div className="profile-name">{user.name}</div>
          <div className="profile-email">{user.email}</div>
          <span className="profile-role">{user.role === "admin" ? "👑 Administrateur" : "👤 Client"}</span>
        </div>
      </div>
      <div className="info-grid">
        <div className="info-card"><div className="info-card-label">Commandes</div><div className="info-card-value">{myOrders.length}</div></div>
        <div className="info-card"><div className="info-card-label">Total dépensé</div><div className="info-card-value">{totalSpent.toFixed(2)} €</div></div>
        <div className="info-card"><div className="info-card-label">Membre depuis</div><div className="info-card-value">{user.joined}</div></div>
        <div className="info-card"><div className="info-card-label">Panier actuel</div><div className="info-card-value">{state.cart.length} article{state.cart.length > 1 ? "s" : ""}</div></div>
      </div>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <button className="btn btn-outline" onClick={() => dispatch({ type: "SET_PAGE", payload: "orders" })}>Voir mes commandes</button>
        <button className="btn btn-danger" onClick={() => dispatch({ type: "LOGOUT" })}>Se déconnecter</button>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { state, dispatch } = useContext(AppContext);
  const [tab, setTab] = useState("overview");
  const [editBook, setEditBook] = useState(null);
  const [showAddBook, setShowAddBook] = useState(false);
  const [newBook, setNewBook] = useState({ title: "", author: "", price: "", category: "", stock: "", description: "", rating: 4.5, sold: 0, cover: "" });

  if (!state.user || state.user.role !== "admin") return (
    <div className="empty-state" style={{ padding: "4rem" }}><div className="icon">🔒</div><h3>Accès réservé aux administrateurs</h3></div>
  );

  const totalRevenue = state.orders.reduce((s, o) => s + parseFloat(o.total), 0);
  const tabs = [{ id: "overview", label: "📊 Vue d'ensemble" }, { id: "books", label: "📚 Livres" }, { id: "orders", label: "📦 Commandes" }, { id: "users", label: "👥 Utilisateurs" }];

  return (
    <div className="admin-page">
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontFamily: "var(--font-head)", fontSize: "1.8rem", fontWeight: 800 }}>⚙️ Administration</div>
        <div style={{ color: "var(--muted)" }}>Tableau de bord LibroStore</div>
      </div>
      <div className="admin-tabs">{tabs.map(t => <button key={t.id} className={`admin-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>)}</div>

      {tab === "overview" && (
        <div>
          <div className="kpi-grid">
            <div className="kpi-card"><div className="kpi-icon">📚</div><div className="kpi-value">{state.books.length}</div><div className="kpi-label">Livres</div><div className="kpi-delta">+2 ce mois</div></div>
            <div className="kpi-card"><div className="kpi-icon">📦</div><div className="kpi-value">{state.orders.length}</div><div className="kpi-label">Commandes</div><div className="kpi-delta">+5 ce mois</div></div>
            <div className="kpi-card"><div className="kpi-icon">👥</div><div className="kpi-value">{state.users.length}</div><div className="kpi-label">Utilisateurs</div><div className="kpi-delta">+1 ce mois</div></div>
            <div className="kpi-card"><div className="kpi-icon">💰</div><div className="kpi-value">{totalRevenue.toFixed(0)} €</div><div className="kpi-label">Revenus</div><div className="kpi-delta">+12%</div></div>
          </div>
          <div className="section-title" style={{ marginTop: "1rem" }}>🔥 Top ventes</div>
          <div className="books-grid">{[...state.books].sort((a, b) => b.sold - a.sold).slice(0, 4).map(b => <BookCard key={b.id} book={b} />)}</div>
        </div>
      )}

      {tab === "books" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div className="section-title" style={{ marginBottom: 0 }}>Gestion des livres</div>
            <button className="btn btn-primary" onClick={() => setShowAddBook(true)}>+ Ajouter un livre</button>
          </div>
          <table className="data-table">
            <thead><tr><th>Titre</th><th>Auteur</th><th>Prix</th><th>Stock</th><th>Ventes</th><th>Actions</th></tr></thead>
            <tbody>
              {state.books.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{b.title}</td>
                  <td style={{ color: "var(--muted)" }}>{b.author}</td>
                  <td style={{ fontFamily: "var(--font-head)", color: "var(--vivid)" }}>{b.price.toFixed(2)} €</td>
                  <td><span className={`stock-badge ${b.stock > 10 ? "in-stock" : "low-stock"}`}>{b.stock}</span></td>
                  <td>{b.sold}</td>
                  <td><div className="action-btns">
                    <button className="btn-sm btn-edit" onClick={() => setEditBook({ ...b })}>✏️ Éditer</button>
                    <button className="btn-sm btn-del" onClick={() => { if (window.confirm(`Supprimer "${b.title}" ?`)) dispatch({ type: "DELETE_BOOK", payload: b.id }); }}>🗑️</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "orders" && (
        <div>
          <div className="section-title">Toutes les commandes</div>
          <table className="data-table">
            <thead><tr><th>ID</th><th>Client</th><th>Date</th><th>Total</th><th>Statut</th></tr></thead>
            <tbody>
              {state.orders.map(o => {
                const user = state.users.find(u => u.id === o.userId);
                return (
                  <tr key={o.id}>
                    <td style={{ fontFamily: "var(--font-head)", fontWeight: 700 }}>{o.id}</td>
                    <td>{user?.name || "Inconnu"}</td>
                    <td style={{ color: "var(--muted)" }}>{o.date}</td>
                    <td style={{ fontFamily: "var(--font-head)", color: "var(--vivid)" }}>{o.total} €</td>
                    <td><span className={`order-status status-${o.status.replace(" ", "-")}`}>{o.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === "users" && (
        <div>
          <div className="section-title">Utilisateurs inscrits</div>
          <table className="data-table">
            <thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Inscrit le</th><th>Commandes</th></tr></thead>
            <tbody>
              {state.users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td style={{ color: "var(--muted)" }}>{u.email}</td>
                  <td><span style={{ background: u.role === "admin" ? "#ede9fe" : "#f0fdf4", color: u.role === "admin" ? "var(--vivid4)" : "#059669", borderRadius: "99px", padding: "2px 10px", fontSize: "0.78rem", fontWeight: 600 }}>{u.role}</span></td>
                  <td style={{ color: "var(--muted)" }}>{u.joined}</td>
                  <td>{state.orders.filter(o => o.userId === u.id).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT MODAL */}
      {editBook && (
        <div className="modal-overlay" onClick={() => setEditBook(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>✏️ Éditer "{editBook.title}"</h2>
            {[["title", "Titre"], ["author", "Auteur"], ["category", "Catégorie"]].map(([k, l]) => (
              <div className="form-group" key={k}>
                <label className="form-label">{l}</label>
                <input className="form-input" value={editBook[k]} onChange={e => setEditBook({ ...editBook, [k]: e.target.value })} />
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Prix (€)</label>
                <input className="form-input" type="number" step="0.01" value={editBook.price} onChange={e => setEditBook({ ...editBook, price: parseFloat(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input className="form-input" type="number" value={editBook.stock} onChange={e => setEditBook({ ...editBook, stock: parseInt(e.target.value) })} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setEditBook(null)}>Annuler</button>
              <button className="btn btn-primary" onClick={() => { dispatch({ type: "UPDATE_BOOK", payload: editBook }); setEditBook(null); }}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD BOOK MODAL */}
      {showAddBook && (
        <div className="modal-overlay" onClick={() => setShowAddBook(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>➕ Nouveau livre</h2>
            {[["title", "Titre"], ["author", "Auteur"], ["category", "Catégorie"], ["description", "Description"]].map(([k, l]) => (
              <div className="form-group" key={k}>
                <label className="form-label">{l}</label>
                <input className="form-input" value={newBook[k]} onChange={e => setNewBook({ ...newBook, [k]: e.target.value })} />
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Prix (€)</label>
                <input className="form-input" type="number" step="0.01" value={newBook.price} onChange={e => setNewBook({ ...newBook, price: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input className="form-input" type="number" value={newBook.stock} onChange={e => setNewBook({ ...newBook, stock: e.target.value })} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowAddBook(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={() => {
                dispatch({ type: "ADD_BOOK", payload: { ...newBook, price: parseFloat(newBook.price), stock: parseInt(newBook.stock), sold: 0, rating: 4.5 } });
                setShowAddBook(false);
                setNewBook({ title: "", author: "", price: "", category: "", stock: "", description: "", rating: 4.5, sold: 0, cover: "" });
              }}>Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP ROOT ───────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const renderPage = () => {
    switch (state.page) {
      case "home": return (<><Hero /><StatsBar books={state.books} /><Catalogue /></>);
      case "catalogue": return <Catalogue />;
      case "book-detail": return <BookDetail />;
      case "cart": return <Cart />;
      case "login": return <Login />;
      case "orders": return <Orders />;
      case "profile": return <Profile />;
      case "admin": return <AdminDashboard />;
      default: return <Catalogue />;
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <GlobalStyle />
      <div className="app-wrapper">
        <Nav />
        <main style={{ flex: 1 }}>{renderPage()}</main>
        <footer style={{ background: "var(--ink)", color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "1.5rem", fontSize: "0.82rem", marginTop: "3rem" }}>
          © 2026 LibroStore — Fait avec ❤️ et React
        </footer>
      </div>
      <Toast />
    </AppContext.Provider>
  );
}