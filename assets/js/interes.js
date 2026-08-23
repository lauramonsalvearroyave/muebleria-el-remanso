// El Remanso — "Me interesa": captura el nombre/teléfono del cliente,
// exige la aceptación de tratamiento de datos (habeas data) y abre
// WhatsApp con un mensaje ya redactado dirigido al número del negocio.
// No hay backend: el propio dispositivo del cliente envía el mensaje.

const INTEREST_WHATSAPP_NUMBER = '573104599629';

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('interestModal');
  if (!overlay) return;

  const nameInput = document.getElementById('interestName');
  const phoneInput = document.getElementById('interestPhone');
  const consentInput = document.getElementById('interestConsent');
  const sendBtn = document.getElementById('interestSend');
  const productNameEl = document.getElementById('modalProductName');
  let currentProduct = '';

  function validate() {
    const ok = nameInput.value.trim().length > 1 &&
               phoneInput.value.trim().length > 6 &&
               consentInput.checked;
    sendBtn.disabled = !ok;
  }

  function openModal(productName) {
    currentProduct = productName;
    productNameEl.textContent = productName;
    nameInput.value = '';
    phoneInput.value = '';
    consentInput.checked = false;
    validate();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Delegación: el catálogo se dibuja después de cargar Firestore, así que
  // las tarjetas ".product-card" no existen todavía en el DOMContentLoaded.
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-interest');
    if (!btn) return;
    const card = btn.closest('.product-card');
    const name = card ? card.querySelector('h3').textContent.trim() : '';
    openModal(name);
  });

  document.getElementById('modalClose').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  [nameInput, phoneInput].forEach(el => el.addEventListener('input', validate));
  consentInput.addEventListener('change', validate);

  sendBtn.addEventListener('click', () => {
    const t = window.ErI18n.t;
    const nombre = nameInput.value.trim();
    const telefono = phoneInput.value.trim();
    const lines = [
      t('interest.wa_greeting'),
      `${t('interest.wa_product')}: ${currentProduct}`,
      `${t('interest.wa_name')}: ${nombre}`,
      `${t('interest.wa_phone')}: ${telefono}`,
      t('interest.wa_consent')
    ];
    const msg = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${INTEREST_WHATSAPP_NUMBER}?text=${msg}`, '_blank');

    if (window.ErFirebase) {
      window.ErFirebase.saveLead({
        source: 'interes',
        product: currentProduct,
        name: nombre,
        phone: telefono,
        consent: true
      });
      window.ErFirebase.track('generate_lead', { method: 'interes', product: currentProduct });
    }

    closeModal();
  });
});
