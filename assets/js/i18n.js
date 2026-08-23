// El Remanso — Motor de idiomas (ES / EN)

const DICT = {
  nav: {
    home:    { es: 'Inicio',    en: 'Home' },
    catalog: { es: 'Catálogo',  en: 'Catalog' },
    contact: { es: 'Contacto',  en: 'Contact' }
  },
  header: {
    cta_catalog: { es: 'Ver catálogo',         en: 'View Catalog' },
    cta_talk:    { es: 'Hablar con el equipo', en: 'Talk to Our Team' },
    open_menu:   { es: 'Abrir menú',           en: 'Open menu' }
  },
  aria: {
    whatsapp_float: { es: 'Escribir por WhatsApp', en: 'Chat on WhatsApp' },
    back_to_top: { es: 'Volver arriba', en: 'Back to top' }
  },
  footer: {
    tagline:        { es: 'Mueblería artesanal en mimbre, rattán, yaré y sintético. Piezas hechas a mano, con cariño, para tu hogar.', en: 'Handcrafted furniture in wicker, rattan, yaré and synthetic fiber. Pieces made by hand, with love, for your home.' },
    materials_title:{ es: 'Materiales', en: 'Materials' },
    mat_mimbre:     { es: 'Mimbre natural', en: 'Natural wicker' },
    mat_rattan:     { es: 'Rattán', en: 'Rattan' },
    mat_yare:       { es: 'Yaré', en: 'Yaré' },
    mat_sintetico:  { es: 'Sintético', en: 'Synthetic' },
    whatsapp_line:  { es: 'WhatsApp: +57 310 459 9629', en: 'WhatsApp: +57 310 459 9629' },
    instagram_line: { es: '@muebleria_elremanso', en: '@muebleria_elremanso' },
    bottom_left:    { es: '© {{year}} El Remanso — Mueblería Artesanal', en: '© {{year}} El Remanso — Handcrafted Furniture' },
    bottom_right:   { es: 'Manos con talento, que hacen tus sueños realidad.', en: 'Skilled hands, making your dreams come true.' },

    legal_title: { es: 'Información legal', en: 'Legal Information' },
    legal_terms: { es: 'Términos y Condiciones', en: 'Terms & Conditions' },
    legal_shipping: { es: 'Política de Entrega', en: 'Shipping Policy' },
    legal_refund: { es: 'Política de Reembolso', en: 'Refund Policy' },
    legal_privacy: { es: 'Política de Privacidad', en: 'Privacy Policy' },
    legal_sic: { es: 'Superintendencia de Industria y Comercio', en: 'Superintendency of Industry and Commerce' },

    help_title: { es: 'Ayuda al cliente', en: 'Customer Help' },
    help_faq: { es: 'Preguntas Frecuentes', en: 'FAQ' },
    help_warranty: { es: 'Garantías', en: 'Warranties' },
    help_warranty_request: { es: 'Solicitud de Garantía', en: 'Warranty Request' },
    help_sic: { es: 'Superintendencia de Industria y Comercio', en: 'Superintendency of Industry and Commerce' },
    help_pqr: { es: 'PQR', en: 'Complaints (PQR)' }
  },

  home: {
    meta_title: { es: 'El Remanso | Mueblería Artesanal en Mimbre, Rattán y Yaré', en: 'El Remanso | Handcrafted Furniture in Wicker, Rattan & Yaré' },
    meta_desc: { es: 'Muebles artesanales tejidos a mano en mimbre, rattán, yaré y sintético. Conoce nuestras colecciones y escríbenos por WhatsApp.', en: 'Handcrafted furniture, hand-woven in wicker, rattan, yaré and synthetic fiber. Explore our collections and reach us on WhatsApp.' },

    hero_eyebrow: { es: 'Tejido a mano · Colombia', en: 'Handwoven · Colombia' },
    hero_title:   { es: 'Muebles con el alma de la fibra natural', en: 'Furniture with the soul of natural fiber' },
    hero_lede:    { es: 'En El Remanso tejemos mimbre, rattán, yaré y sintético para crear piezas cálidas y duraderas, pensadas para los momentos en familia.', en: 'At El Remanso we weave wicker, rattan, yaré and synthetic fiber into warm, long-lasting pieces, made for family moments.' },
    badge1: { es: '🌿 100% artesanal', en: '🌿 100% handcrafted' },
    badge2: { es: '🏠 Interior y exterior', en: '🏠 Indoor & outdoor' },
    badge3: { es: '💛 Hecho con cariño', en: '💛 Made with love' },
    hero_cta_primary:   { es: 'Ver catálogo', en: 'View Catalog' },
    hero_cta_secondary: { es: 'Escríbenos por WhatsApp', en: 'Message us on WhatsApp' },
    hero_note: { es: 'Manos con talento, que hacen tus sueños realidad', en: 'Skilled hands, making your dreams come true' },
    hero_art_line1: { es: 'Foto de producto próximamente', en: 'Product photo coming soon' },
    hero_art_line2: { es: '(reemplazar con fotografía real del taller)', en: '(to be replaced with real workshop photography)' },

    materials_eyebrow: { es: 'Nuestros materiales', en: 'Our Materials' },
    materials_title:   { es: 'Cuatro fibras, un mismo oficio', en: 'Four fibers, one craft' },
    materials_lede:    { es: 'Cada material tiene su propio carácter. Te contamos las diferencias para que elijas con confianza — o déjalo en nuestras manos.', en: "Every material has its own character. We'll walk you through the differences so you can choose with confidence — or just leave it to us." },
    mat_mimbre_title: { es: 'Mimbre natural', en: 'Natural Wicker' },
    mat_mimbre_desc:  { es: 'Fibra liviana y cálida, tejida a mano. Perfecta para interiores.', en: 'Light and warm fiber, hand-woven. Perfect for indoor spaces.' },
    mat_rattan_title: { es: 'Rattán', en: 'Rattan' },
    mat_rattan_desc:  { es: 'Mayor densidad y resistencia, con un acabado elegante.', en: 'Denser and more resistant, with an elegant finish.' },
    mat_yare_title:   { es: 'Yaré', en: 'Yaré' },
    mat_yare_desc:    { es: 'Fibra tradicional colombiana, flexible y muy duradera.', en: 'Traditional Colombian fiber, flexible and very durable.' },
    mat_sintetico_title: { es: 'Sintético', en: 'Synthetic' },
    mat_sintetico_desc:  { es: 'Resistente al sol y la lluvia. Ideal para terrazas y exteriores.', en: 'Resistant to sun and rain. Ideal for terraces and outdoor spaces.' },

    flagship_eyebrow: { es: 'Línea insignia', en: 'Signature Line' },
    flagship_title:   { es: 'Remanso: lo mejor de nuestro oficio', en: 'Remanso: the best of our craft' },
    flagship_lede:    { es: 'Así llamamos a las piezas que mejor representan nuestras manos: lo más querido de El Remanso.', en: 'This is what we call the pieces that best represent our hands — the most beloved of El Remanso.' },
    flagship_cta: { es: 'Ver la línea Remanso', en: 'See the Remanso Line' },

    cat_eyebrow: { es: 'Catálogo', en: 'Catalog' },
    cat_title:   { es: 'Nuestras colecciones', en: 'Our Collections' },
    cat_lede:    { es: 'Cada pieza tiene su propio nombre — y una pequeña historia detrás.', en: 'Every piece has its own name — and a small story behind it.' },

    proc_eyebrow: { es: 'Nuestro oficio', en: 'Our Craft' },
    proc_title:   { es: 'Hecho a mano, paso a paso', en: 'Handmade, step by step' },
    proc1_title: { es: 'Selección de fibra', en: 'Fiber Selection' },
    proc1_desc:  { es: 'Escogemos mimbre, rattán o yaré de la mejor calidad.', en: 'We select the best-quality wicker, rattan or yaré.' },
    proc2_title: { es: 'Tejido artesanal', en: 'Artisan Weaving' },
    proc2_desc:  { es: 'Nuestros maestros tejen cada pieza a mano, sin prisa.', en: 'Our craftspeople weave every piece by hand, without rushing.' },
    proc3_title: { es: 'Acabado y color', en: 'Finish & Color' },
    proc3_desc:  { es: 'Aplicamos el tono y protección que elegiste.', en: 'We apply the tone and protection you chose.' },
    proc4_title: { es: 'Entrega', en: 'Delivery' },
    proc4_desc:  { es: 'Llevamos tu mueble terminado hasta tu hogar.', en: 'We bring your finished piece to your home.' },

    comments_eyebrow: { es: 'Comentarios', en: 'Comments' },
    comments_title: { es: 'Lo que cuentan quienes ya tienen su Remanso', en: 'What people with their own Remanso say' },
    c1_quote: { es: '"Encargamos un set de terraza y quedó exactamente en los colores que elegimos. Se nota que cada pieza se hace con calma."', en: '"We ordered a terrace set and it came out in exactly the colors we chose. You can tell every piece is made unhurried."' },
    c1_who: { es: '— Cliente de El Remanso', en: '— El Remanso Customer' },
    c2_quote: { es: '"La mecedora que compramos para la habitación del bebé se volvió el rincón favorito de la casa."', en: '"The rocker we bought for the baby\'s room became the favorite corner of the house."' },
    c2_who: { es: '— Cliente de El Remanso', en: '— El Remanso Customer' },
    c3_quote: { es: '"Se sintió como comprarle a alguien de confianza, no a una tienda más."', en: '"It felt like buying from someone we trust, not just another store."' },
    c3_who: { es: '— Cliente de El Remanso', en: '— El Remanso Customer' },

    final_title: { es: '¿Conversamos sobre tu próximo mueble?', en: 'Shall we talk about your next piece?' },
    final_lede:  { es: 'Explora el catálogo o escríbenos directamente por WhatsApp.', en: 'Explore the catalog or message us directly on WhatsApp.' },
    final_cta1:  { es: 'Ver catálogo', en: 'View Catalog' },
    final_cta2:  { es: 'Escríbenos por WhatsApp', en: 'Message us on WhatsApp' }
  },

  catalog: {
    meta_title: { es: 'Catálogo | El Remanso', en: 'Catalog | El Remanso' },
    meta_desc: { es: 'Nuestras colecciones de muebles artesanales en mimbre, rattán, yaré y sintético.', en: 'Our collections of handcrafted furniture in wicker, rattan, yaré and synthetic fiber.' },
    eyebrow: { es: 'Catálogo', en: 'Catalog' },
    title:   { es: 'Nuestras piezas, una por una', en: 'Our pieces, one by one' },
    lede: { es: 'Cada mueble tiene un nombre propio y una pequeña historia. Escríbenos si algo te enamora.', en: 'Every piece carries its own name and a small story. Write to us if something catches your heart.' },

    filter_all: { es: 'Todas', en: 'All' },
    photo_note: { es: 'Foto próximamente', en: 'Photo coming soon' },
    interest_btn: { es: 'Me interesa', en: "I'm interested" },
    empty_category: { es: 'Pronto agregaremos piezas a esta colección.', en: "We'll be adding pieces to this collection soon." },
    loading: { es: 'Cargando catálogo...', en: 'Loading catalog...' },
    cat_flagship_badge: { es: 'Línea insignia', en: 'Signature line' },

    badge_featured: { es: 'Destacado', en: 'Featured' },
    badge_new: { es: 'Nuevo', en: 'New' },
    badge_soldout: { es: 'Agotado', en: 'Sold out' },

    tag_mimbre: { es: 'Mimbre', en: 'Wicker' },
    tag_rattan: { es: 'Rattán', en: 'Rattan' },
    tag_yare: { es: 'Yaré', en: 'Yaré' },
    tag_sintetico: { es: 'Sintético', en: 'Synthetic' }
  },

  interest: {
    eyebrow: { es: 'Me interesa', en: "I'm interested" },
    lede: { es: 'Déjanos tus datos y te escribimos por WhatsApp para contarte todo sobre esta pieza.', en: "Leave us your details and we'll message you on WhatsApp with everything about this piece." },
    field_name: { es: 'Nombre', en: 'Name' },
    field_phone: { es: 'Teléfono', en: 'Phone' },
    placeholder_name: { es: 'Tu nombre', en: 'Your name' },
    placeholder_phone: { es: 'Ej: 300 000 0000', en: 'E.g. 300 000 0000' },
    consent_html: { es: 'Acepto el tratamiento de mis datos personales según la <a href="ayuda-legal.html#datos" target="_blank" rel="noopener">Política de Tratamiento de Datos Personales</a>.', en: 'I agree to the processing of my personal data under the <a href="ayuda-legal.html#datos" target="_blank" rel="noopener">Personal Data Processing Policy</a>.' },
    btn_send: { es: 'Enviar por WhatsApp', en: 'Send via WhatsApp' },
    wa_greeting: { es: 'Hola El Remanso, me interesa esta pieza:', en: 'Hi El Remanso, I am interested in this piece:' },
    wa_product: { es: 'Producto', en: 'Product' },
    wa_name: { es: 'Nombre', en: 'Name' },
    wa_phone: { es: 'Teléfono', en: 'Phone' },
    wa_consent: { es: 'Acepto el tratamiento de mis datos personales conforme a la Política de Tratamiento de Datos de El Remanso.', en: "I agree to the processing of my personal data under El Remanso's Data Processing Policy." }
  },

  about: {
    eyebrow: { es: 'Nuestra historia', en: 'Our Story' },
    title:   { es: 'El oficio de tejer con calma', en: 'The Craft of Weaving Calmly' },
    lede:    { es: '"Remanso" es ese lugar donde el agua se detiene y todo se vuelve quieto. Así entendemos nuestro trabajo: tomarnos el tiempo necesario para tejer cada mueble a mano, con materiales naturales y mucho cuidado por el detalle.', en: '"Remanso" means a calm pool where the water comes to rest and everything grows still. That\'s how we understand our work: taking the time needed to weave every piece by hand, with natural materials and great care for detail.' },

    photo_line1: { es: 'Foto del taller', en: 'Workshop photo' },
    photo_line2: { es: '(reemplazar con fotografía real)', en: '(to be replaced with real photography)' },

    h2_1: { es: 'Tradición artesanal, hecha para hoy', en: 'Artisan Tradition, Made for Today' },
    p1: { es: 'En El Remanso trabajamos junto a tejedores que dominan el mimbre, el rattán y el yaré desde hace años. Combinamos ese conocimiento tradicional con materiales sintéticos para que también puedas disfrutar de muebles tejidos en tu terraza o jardín, sin preocuparte por el clima.', en: 'At El Remanso we work alongside weavers who have mastered wicker, rattan and yaré for years. We combine that traditional knowledge with synthetic materials so you can also enjoy woven furniture on your terrace or garden, without worrying about the weather.' },
    p2: { es: 'Cada pieza sale de nuestro taller revisada a mano, una por una, antes de llegar a tu casa.', en: 'Every piece leaves our workshop hand-checked, one by one, before it reaches your home.' },

    why_title: { es: 'Por qué elegir El Remanso', en: 'Why Choose El Remanso' },
    why1_title: { es: '100% hecho a mano', en: '100% Handmade' },
    why1_desc:  { es: 'Cada mueble pasa por manos artesanas, sin producción en serie.', en: 'Every piece passes through artisan hands, with no mass production.' },
    why2_title: { es: 'Con nombre y con historia', en: 'Named with a Story' },
    why2_desc:  { es: 'Cada mueble lleva un nombre propio pensado con cariño.', en: 'Every piece carries its own name, chosen with love.' },
    why3_title: { es: 'Acompañamiento cercano', en: 'Close, Personal Support' },
    why3_desc:  { es: 'Te escribimos por WhatsApp para resolver cualquier duda.', en: "We'll message you on WhatsApp to answer any questions." }
  },

  help: {
    meta_title: { es: 'Ayuda y Legal | El Remanso', en: 'Help & Legal | El Remanso' },
    meta_desc: { es: 'Preguntas frecuentes, términos y condiciones, y política de tratamiento de datos personales de El Remanso.', en: "Frequently asked questions, terms and conditions, and El Remanso's personal data processing policy." },
    eyebrow: { es: 'Ayuda y legal', en: 'Help & Legal' },
    title: { es: 'Estamos para ayudarte', en: "We're here to help" },
    lede: { es: 'Aquí encuentras nuestras preguntas frecuentes y toda la información legal de El Remanso.', en: "Here you'll find our frequently asked questions and all of El Remanso's legal information." },

    nav_faq: { es: 'Preguntas frecuentes', en: 'FAQ' },
    nav_terms: { es: 'Términos y condiciones', en: 'Terms & Conditions' },
    nav_data: { es: 'Privacidad y datos', en: 'Privacy & Data' },
    nav_shipping: { es: 'Entregas', en: 'Shipping' },
    nav_refund: { es: 'Reembolsos', en: 'Refunds' },
    nav_warranty: { es: 'Garantías y PQR', en: 'Warranty & Claims' },

    faq_title: { es: 'Preguntas frecuentes', en: 'Frequently Asked Questions' },
    faq1_q: { es: '¿Puedo pedir un mueble en un color o tamaño diferente?', en: 'Can I order furniture in a different color or size?' },
    faq1_a: { es: 'Sí. Escríbenos por WhatsApp contándonos tu idea y te confirmamos las opciones y el tiempo de entrega.', en: "Yes. Message us on WhatsApp with your idea and we'll confirm the options and delivery time." },
    faq2_q: { es: '¿Cómo compro un mueble del catálogo?', en: 'How do I buy a piece from the catalog?' },
    faq2_a: { es: 'Presiona "Me interesa" en la pieza que te guste, déjanos tus datos y seguimos la conversación por WhatsApp.', en: 'Tap "I\'m interested" on the piece you like, leave us your details, and we\'ll continue the conversation on WhatsApp.' },
    faq3_q: { es: '¿Hacen envíos fuera de la ciudad?', en: 'Do you ship outside the city?' },
    faq3_a: { es: 'Sí, coordinamos el envío según tu ciudad. Te confirmamos tiempos y costos por WhatsApp antes de confirmar tu pedido.', en: "Yes, we arrange shipping based on your city. We'll confirm times and costs over WhatsApp before your order is confirmed." },
    faq4_q: { es: '¿Cómo cuido un mueble tejido a mano?', en: 'How do I care for a hand-woven piece?' },
    faq4_a: { es: 'Evita la exposición directa y prolongada al agua en piezas de mimbre o yaré, y límpialas con un paño húmedo. Las líneas en sintético soportan mejor la intemperie.', en: 'Avoid prolonged direct exposure to water on wicker or yaré pieces, and clean them with a damp cloth. Synthetic-fiber pieces handle outdoor exposure better.' },
    faq5_q: { es: '¿Qué medios de pago aceptan?', en: 'What payment methods do you accept?' },
    faq5_a: { es: 'Te contamos las opciones disponibles al confirmar tu pedido por WhatsApp.', en: "We'll share the available options when we confirm your order over WhatsApp." },

    terms_title: { es: 'Términos y condiciones', en: 'Terms and Conditions' },
    terms_p1: { es: 'Estos términos regulan el uso de este sitio web y la relación comercial entre El Remanso y sus clientes.', en: 'These terms govern the use of this website and the commercial relationship between El Remanso and its customers.' },
    terms_legal_name: { es: 'Razón social:', en: 'Legal business name:' },
    terms_nit: { es: 'NIT:', en: 'Tax ID (NIT):' },
    terms_p2: { es: 'El precio final de cada mueble se acuerda directamente por WhatsApp, según el material, el color, el tamaño y las condiciones de entrega.', en: 'The final price of each piece is agreed directly over WhatsApp, based on material, color, size and delivery conditions.' },
    terms_p3: { es: 'Al contactarnos a través del botón "Me interesa" o del formulario de contacto, el cliente autoriza a El Remanso a comunicarse con él para fines comerciales relacionados con su solicitud.', en: 'By contacting us through the "I\'m interested" button or the contact form, the customer authorizes El Remanso to reach out for commercial purposes related to their request.' },
    terms_p4: { es: 'El Remanso se reserva el derecho de actualizar estos términos en cualquier momento. Los cambios se publicarán en esta misma página.', en: 'El Remanso reserves the right to update these terms at any time. Changes will be published on this same page.' },

    data_title: { es: 'Política de tratamiento de datos personales', en: 'Personal Data Processing Policy' },
    data_p1: { es: 'En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013 sobre protección de datos personales en Colombia, El Remanso informa lo siguiente:', en: 'In compliance with Colombian Law 1581 of 2012 and Decree 1377 of 2013 on personal data protection, El Remanso informs the following:' },
    data_responsible_label: { es: 'Responsable del tratamiento:', en: 'Data controller:' },
    data_purpose_title: { es: 'Finalidad', en: 'Purpose' },
    data_purpose_p: { es: 'Los datos que nos compartes (nombre y teléfono) a través del botón "Me interesa" o del formulario de contacto se usan exclusivamente para contactarte por WhatsApp, brindarte información sobre nuestros productos y dar seguimiento a tu solicitud.', en: 'The data you share with us (name and phone number) through the "I\'m interested" button or the contact form is used exclusively to reach you over WhatsApp, provide information about our products, and follow up on your request.' },
    data_rights_title: { es: 'Tus derechos', en: 'Your Rights' },
    data_rights_p: { es: 'Como titular de tus datos personales, tienes derecho a conocer, actualizar, rectificar y solicitar la eliminación de tu información en cualquier momento, escribiéndonos por WhatsApp.', en: 'As the owner of your personal data, you have the right to know, update, correct, and request the deletion of your information at any time by writing to us on WhatsApp.' },
    data_storage_title: { es: 'Cómo se guardan tus datos', en: 'How your data is stored' },
    data_storage_p: { es: 'Este sitio no cuenta con una base de datos propia: la información que dejas en nuestros formularios se envía directamente desde tu dispositivo a nuestro WhatsApp de negocio, donde la conservamos únicamente para dar trámite a tu solicitud.', en: "This site does not have its own database: the information you leave in our forms is sent directly from your device to our business WhatsApp, where we keep it only to process your request." },
    data_contact_p: { es: 'Para cualquier solicitud relacionada con tus datos personales, escríbenos al WhatsApp +57 310 459 9629.', en: 'For any request related to your personal data, write to us on WhatsApp at +57 310 459 9629.' },

    shipping_title: { es: 'Política de entrega', en: 'Shipping Policy' },
    shipping_p1: { es: 'Los tiempos y costos de entrega dependen del tamaño del mueble, el material y tu ciudad de destino. Siempre los confirmamos contigo por WhatsApp antes de cerrar el pedido.', en: 'Delivery times and costs depend on the size of the piece, the material, and your destination city. We always confirm these with you over WhatsApp before finalizing the order.' },
    shipping_p2: { es: 'Para piezas grandes o personalizadas, coordinamos contigo la fecha de entrega según el tiempo de elaboración artesanal.', en: 'For large or custom pieces, we coordinate the delivery date with you based on the handcrafting time required.' },

    refund_title: { es: 'Política de reembolso', en: 'Refund Policy' },
    refund_p1: { es: 'Si tu pedido llega con un defecto de fabricación, lo reportas por WhatsApp dentro de los primeros días después de recibirlo y coordinamos la reparación, el cambio o el reembolso, según corresponda.', en: 'If your order arrives with a manufacturing defect, report it over WhatsApp within the first few days of receiving it, and we will arrange a repair, exchange, or refund as applicable.' },
    refund_p2: { es: 'Al ser piezas hechas a la medida y por encargo, los cambios de opinión sobre color, material o tamaño se evalúan caso a caso — escríbenos y buscamos la mejor solución.', en: 'Since pieces are custom-made to order, changes of mind about color, material or size are evaluated case by case — write to us and we will find the best solution.' },

    warranty_title: { es: 'Garantías y PQR', en: 'Warranty & Claims (PQR)' },
    warranty_p1: { es: 'Nuestros muebles cuentan con la garantía legal establecida por el Estatuto del Consumidor (Ley 1480 de 2011) frente a defectos de fabricación.', en: "Our furniture is covered by the legal warranty established under Colombia's Consumer Protection Statute (Law 1480 of 2011) against manufacturing defects." },
    warranty_request_title: { es: 'Solicitud de garantía', en: 'Warranty Request' },
    warranty_request_p: { es: 'Para solicitar tu garantía, escríbenos por WhatsApp contándonos el problema y adjuntando una foto de la pieza. Te confirmamos los siguientes pasos lo antes posible.', en: 'To request your warranty, message us on WhatsApp describing the issue and attaching a photo of the piece. We will confirm next steps as soon as possible.' },
    pqr_title: { es: 'Peticiones, quejas y reclamos (PQR)', en: 'Requests, Complaints & Claims (PQR)' },
    pqr_p: { es: 'Si tienes una petición, queja o reclamo, escríbenos por WhatsApp contándonos tu caso y con gusto te ayudamos a resolverlo.', en: 'If you have a request, complaint, or claim, write to us on WhatsApp with your case and we will gladly help resolve it.' },
    sic_note: { es: 'Como consumidor, también puedes acudir a la Superintendencia de Industria y Comercio (SIC), la entidad estatal colombiana encargada de proteger tus derechos de consumo.', en: "As a consumer, you can also turn to Colombia's Superintendency of Industry and Commerce (SIC), the government agency responsible for protecting your consumer rights." }
  },

  contact: {
    meta_title: { es: 'Contacto | El Remanso', en: 'Contact | El Remanso' },
    meta_desc: { es: 'Escríbenos por WhatsApp o Instagram. Encuentra nuestra ubicación y resuelve tus dudas sobre muebles artesanales en mimbre, rattán, yaré y sintético.', en: 'Message us on WhatsApp or Instagram. Find our location and get answers about our handcrafted furniture in wicker, rattan, yaré and synthetic fiber.' },
    eyebrow: { es: 'Contacto', en: 'Contact' },
    title:   { es: 'Hablemos de tu próximo mueble', en: "Let's Talk About Your Next Piece" },
    lede:    { es: 'Escríbenos por WhatsApp para la atención más rápida, o usa el formulario y te respondemos por ese mismo medio.', en: "Message us on WhatsApp for the fastest response, or use the form and we'll reply the same way." },

    whatsapp_title: { es: 'WhatsApp', en: 'WhatsApp' },
    whatsapp_hours: { es: '+57 310 459 9629', en: '+57 310 459 9629' },
    whatsapp_btn:   { es: 'Escribir por WhatsApp', en: 'Chat on WhatsApp' },

    instagram_title: { es: 'Instagram', en: 'Instagram' },
    instagram_desc:  { es: 'Mira nuestro trabajo día a día.', en: 'See our day-to-day work.' },

    workshop_title: { es: 'Ubicación', en: 'Location' },
    workshop_line1: { es: 'Encuéntranos en el mapa.', en: 'Find us on the map.' },
    workshop_line2: { es: 'Escríbenos por WhatsApp si necesitas indicaciones para llegar.', en: 'Message us on WhatsApp if you need directions.' },
    directions_btn: { es: 'Cómo llegar', en: 'Get Directions' },

    form_title: { es: 'Escríbenos', en: 'Send Us a Message' },
    field_name: { es: 'Nombre', en: 'Name' },
    field_phone: { es: 'Teléfono', en: 'Phone' },
    field_message: { es: 'Mensaje', en: 'Message' },
    placeholder_name: { es: 'Tu nombre', en: 'Your name' },
    placeholder_phone: { es: 'Ej: 300 000 0000', en: 'E.g. 300 000 0000' },
    placeholder_message: { es: 'Cuéntanos qué necesitas...', en: 'Tell us what you need...' },
    consent_html: { es: 'Acepto el tratamiento de mis datos personales según la <a href="ayuda-legal.html#datos" target="_blank" rel="noopener">Política de Tratamiento de Datos Personales</a>.', en: 'I agree to the processing of my personal data under the <a href="ayuda-legal.html#datos" target="_blank" rel="noopener">Personal Data Processing Policy</a>.' },
    btn_send: { es: 'Enviar por WhatsApp', en: 'Send via WhatsApp' },
    wa_greeting: { es: 'Hola El Remanso, te escribo desde la página web:', en: 'Hi El Remanso, I am writing from the website:' }
  }
};

// ---- Motor ----

function getLang() {
  return localStorage.getItem('er_lang') || 'es';
}

function setLang(lang) {
  localStorage.setItem('er_lang', lang);
}

function t(key) {
  const parts = key.split('.');
  let node = DICT;
  for (const p of parts) {
    if (node == null) break;
    node = node[p];
  }
  if (!node) return key;
  const lang = getLang();
  return node[lang] || node.es || key;
}

function interpolate(str) {
  return str.replace(/\{\{year\}\}/g, new Date().getFullYear());
}

function applyTranslations() {
  document.documentElement.lang = getLang();

  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = interpolate(t(el.dataset.i18n));
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = interpolate(t(el.dataset.i18nHtml));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', interpolate(t(el.dataset.i18nPlaceholder)));
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', interpolate(t(el.dataset.i18nAria)));
  });
  document.querySelectorAll('[data-i18n-content]').forEach(el => {
    el.setAttribute('content', interpolate(t(el.dataset.i18nContent)));
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === getLang());
  });
}

function initLangToggle() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.lang === getLang()) return;
      setLang(btn.dataset.lang);
      applyTranslations();
      document.dispatchEvent(new CustomEvent('langchange'));
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  initLangToggle();
});

window.ErI18n = { t, interpolate, getLang, setLang };
