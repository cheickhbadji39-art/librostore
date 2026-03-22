import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_85l1sbn';
const TEMPLATE_ID = 'template_j6i8sfd';
const PUBLIC_KEY = 'j-jYsgpmqZkPfQ15L';

const paymentLabels = {
  wave: "Wave",
  orange: "Orange Money",
  free: "Free Money",
  card: "Carte Bancaire"
};

export async function sendOrderConfirmation({ to, name, orderId, items, total, paymentMethod }) {
  const bookList = items
    .map(i => `• ${i.title} x${i.quantity} — ${(i.price * i.quantity).toLocaleString()} FCFA`)
    .join('\n');

  return emailjs.send(SERVICE_ID, TEMPLATE_ID, {
    email: to,
    customer_name: name,
    order_id: orderId,
    order_date: new Date().toLocaleDateString('fr-FR'),
    payment_method: paymentLabels[paymentMethod] || paymentMethod || "Non précisé",
    book_list: bookList,
    total_amount: total,
  }, PUBLIC_KEY);
}