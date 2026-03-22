import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const paymentLabels = {
  wave: "Wave",
  orange: "Orange Money",
  free: "Free Money",
  card: "Carte Bancaire"
};

export async function sendOrderConfirmation({ to, name, orderId, items, total, paymentMethod }) {
  const bookList = items
    .map(i => `• ${i.title} x${i.quantity} — ${(i.price * i.quantity).toFixed(2)} €`)
    .join('\n');

  return emailjs.send(SERVICE_ID, TEMPLATE_ID, {
    email: to,
    customer_name: name,
    order_id: orderId,
    order_date: new Date().toLocaleDateString('fr-FR'),
    payment_method: paymentLabels[paymentMethod] || paymentMethod || "Non précisé",
    book_list: bookList,
    total_amount: parseFloat(total).toFixed(2) + " €",
  }, PUBLIC_KEY);
}