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
    back_to_top: { es: 'Volver arriba', en: 'Back to top' },
    prev: { es: 'Anterior', en: 'Previous' },
    next: { es: 'Siguiente', en: 'Next' }
  },
  footer: {
    tagline:        { es: 'Mueblería artesanal en fibras naturales y materiales de alta resistencia. Piezas hechas a mano, con cariño, para tu hogar.', en: 'Handcrafted furniture in natural fibers and high-resistance materials. Pieces made by hand, with love, for your home.' },
    materials_title:{ es: 'Materiales', en: 'Materials' },
    mat_mimbre:     { es: 'Mimbre', en: 'Wicker' },
    mat_yare:       { es: 'Yaré', en: 'Yaré' },
    mat_rattan:     { es: 'Rattán', en: 'Rattan' },
    mat_calceta:    { es: 'Calceta de plátano', en: 'Banana fiber' },
    mat_sintetico:  { es: 'Sintético', en: 'Synthetic fiber' },
    mat_piola:      { es: 'Piola náutica', en: 'Nautical rope' },
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
    meta_desc: { es: 'Muebles artesanales tejidos a mano en mimbre, yaré, rattán, calceta de plátano, sintético y piola náutica. Conoce nuestras colecciones y escríbenos por WhatsApp.', en: 'Handcrafted furniture, hand-woven in wicker, yaré, rattan, banana fiber, synthetic fiber and nautical rope. Explore our collections and reach us on WhatsApp.' },

    hero_eyebrow: { es: 'Tejido a mano · Colombia', en: 'Handwoven · Colombia' },
    hero_title:   { es: 'Muebles con el alma de la fibra natural', en: 'Furniture with the soul of natural fiber' },
    hero_lede:    { es: 'En El Remanso tejemos fibras naturales y materiales de alta resistencia para crear piezas cálidas y duraderas, pensadas para los momentos en familia.', en: 'At El Remanso we weave natural fibers and high-resistance materials into warm, long-lasting pieces, made for family moments.' },
    badge1: { es: '🌿 100% artesanal', en: '🌿 100% handcrafted' },
    badge2: { es: '🏠 Interior y exterior', en: '🏠 Indoor & outdoor' },
    badge3: { es: '💛 Hecho con cariño', en: '💛 Made with love' },
    hero_cta_primary:   { es: 'Ver catálogo', en: 'View Catalog' },
    hero_cta_secondary: { es: 'Escríbenos por WhatsApp', en: 'Message us on WhatsApp' },
    hero_note: { es: 'Manos con talento, que hacen tus sueños realidad', en: 'Skilled hands, making your dreams come true' },
    hero_art_line1: { es: 'Foto de producto próximamente', en: 'Product photo coming soon' },
    hero_art_line2: { es: '(reemplazar con fotografía real del taller)', en: '(to be replaced with real workshop photography)' },

    materials_eyebrow: { es: 'Nuestros materiales', en: 'Our Materials' },
    materials_title:   { es: 'Cuatro fibras y dos materiales, un mismo oficio', en: 'Four fibers, two materials, one craft' },
    materials_lede:    { es: 'Cada material tiene su textura, su carácter y su mejor lugar en la casa. Te contamos en qué se diferencian para que elijas con confianza — o déjalo en nuestras manos.', en: "Every material has its own texture, its own character and its own best place in the home. We'll walk you through the differences so you can choose with confidence — or just leave it to us." },

    fibers_group_title: { es: 'Fibras naturales', en: 'Natural fibers' },
    fibers_group_note:  { es: 'Se recogen y se trabajan a mano. Su lugar está bajo techo: sala, comedor, alcoba y terrazas cubiertas.', en: 'Gathered and worked by hand. Their place is under a roof: living room, dining room, bedroom and covered terraces.' },
    tech_group_title:   { es: 'Materiales de alta resistencia', en: 'High-resistance materials' },
    tech_group_note:    { es: 'Se tejen con la misma técnica artesanal, pero están pensados para aguantar sol, lluvia y uso diario sin perder la forma.', en: 'Woven with the same artisan technique, but made to take sun, rain and daily use without losing their shape.' },

    mat_mimbre_title: { es: 'Mimbre', en: 'Wicker' },
    mat_mimbre_desc:  { es: 'Fibra clara y liviana que se dobla sin quebrarse. Es la más noble para tejidos finos y detalles: cálida al tacto y fácil de combinar con cualquier cojinería.', en: 'A pale, light fiber that bends without breaking. The kindest one for fine weaves and detail work: warm to the touch and easy to pair with any upholstery.' },
    mat_yare_title:   { es: 'Yaré', en: 'Yaré' },
    mat_yare_desc:    { es: 'Raíz tradicional colombiana, muy flexible y de una resistencia enorme. Aguanta el uso diario y con los años toma un tono más profundo.', en: 'A traditional Colombian root, very flexible and remarkably strong. It stands up to daily use and deepens into a richer tone over the years.' },
    mat_rattan_title: { es: 'Rattán', en: 'Rattan' },
    mat_rattan_desc:  { es: 'La más firme de las fibras naturales. Su bejuco macizo sostiene estructuras grandes —sofás, comedores, camas— con un acabado elegante y sobrio.', en: 'The firmest of the natural fibers. Its solid cane holds up large structures — sofas, dining sets, beds — with an elegant, understated finish.' },
    mat_calceta_title: { es: 'Calceta de plátano', en: 'Banana fiber' },
    mat_calceta_desc:  { es: 'Se obtiene del tallo seco del plátano, lo que el cultivo ya no usa. De textura gruesa y tono tierra: da un tejido rústico, con mucho carácter.', en: 'Made from the dried banana stem — what the harvest leaves behind. Thick in texture and earthy in tone, it gives a rustic weave with real character.' },
    mat_sintetico_title: { es: 'Sintético', en: 'Synthetic fiber' },
    mat_sintetico_desc:  { es: 'Fibra técnica tejida igual que la natural. No se decolora con el sol ni se daña con la lluvia: es la que recomendamos para terraza, piscina y jardín.', en: "A technical fiber woven just like the natural ones. It doesn't fade in the sun or suffer in the rain: our pick for terraces, poolsides and gardens." },
    mat_piola_title: { es: 'Piola náutica', en: 'Nautical rope' },
    mat_piola_desc:  { es: 'Cuerda trenzada de uso marino, suave al sentarse y muy resistente a la humedad y al roce. Ideal para columpios, mecedoras y piezas de uso diario.', en: 'Braided marine rope — soft to sit on, and highly resistant to damp and friction. Ideal for swings, rockers and everyday pieces.' },

    flagship_eyebrow: { es: 'Línea insignia', en: 'Signature Line' },
    flagship_title:   { es: 'Remanso: lo mejor de nuestro oficio', en: 'Remanso: the best of our craft' },
    flagship_lede:    { es: 'Así llamamos a las piezas que mejor representan nuestras manos: lo más querido de El Remanso.', en: 'This is what we call the pieces that best represent our hands — the most beloved of El Remanso.' },
    flagship_cta: { es: 'Ver la línea Remanso', en: 'See the Remanso Line' },

    cat_eyebrow: { es: 'Catálogo', en: 'Catalog' },
    cat_title:   { es: 'Nuestras colecciones', en: 'Our Collections' },
    cat_lede:    { es: 'Cada pieza tiene su propio nombre — y una pequeña historia detrás.', en: 'Every piece has its own name — and a small story behind it.' },

    proc_eyebrow: { es: 'Nuestro oficio', en: 'Our Craft' },
    proc_title:   { es: 'De tu idea a tu casa, en siete pasos', en: 'From your idea to your home, in seven steps' },
    proc_lede:    { es: 'Los primeros cuatro pasos los decidimos contigo; los tres últimos ocurren en el taller. Así sabes siempre en qué va tu mueble.', en: 'The first four steps we decide together; the last three happen in the workshop. That way you always know where your piece stands.' },
    proc1_title: { es: 'Medidas', en: 'Measurements' },
    proc1_desc:  { es: 'Tomamos las medidas del espacio donde va a vivir el mueble, para que entre justo y se sienta cómodo.', en: 'We take the measurements of the space the piece will live in, so it fits just right and feels comfortable.' },
    proc2_title: { es: 'Diseño', en: 'Design' },
    proc2_desc:  { es: 'Elegimos juntos la forma: un modelo del catálogo tal cual, o una versión pensada a tu medida.', en: 'We choose the shape together: a catalog model as it is, or a version made to your own measurements.' },
    proc3_title: { es: 'Material', en: 'Material' },
    proc3_desc:  { es: 'Escogemos la fibra según el uso y el lugar: natural para interiores; sintético o piola náutica si va a estar a la intemperie.', en: 'We pick the fiber by use and place: natural indoors; synthetic or nautical rope if it will face the weather.' },
    proc4_title: { es: 'Color y cojinería', en: 'Color & Upholstery' },
    proc4_desc:  { es: 'Eliges el tono del tejido y la tela de los cojines. Te mostramos muestras reales antes de empezar a tejer.', en: 'You choose the tone of the weave and the fabric for the cushions. We show you real samples before any weaving starts.' },
    proc5_title: { es: 'Tejido', en: 'Weaving' },
    proc5_desc:  { es: 'Nuestros maestros tejen la pieza a mano, hebra por hebra. Es el paso más lento — y el que marca la diferencia.', en: "Our craftspeople weave the piece by hand, strand by strand. It's the slowest step — and the one that makes the difference." },
    proc6_title: { es: 'Acabado', en: 'Finish' },
    proc6_desc:  { es: 'Aplicamos el color y la protección, y revisamos la pieza completa: uniones, nivelación y terminados.', en: 'We apply the color and the protective coat, then check the whole piece: joints, leveling and finishing.' },
    proc7_title: { es: 'Entrega', en: 'Delivery' },
    proc7_desc:  { es: 'Coordinamos la fecha contigo y llevamos tu mueble armado hasta tu hogar.', en: 'We agree a date with you and bring your finished piece home, fully assembled.' },

    comments_eyebrow: { es: 'Comentarios', en: 'Comments' },
    comments_title: { es: 'Lo que cuentan quienes ya tienen su Remanso', en: 'What people with their own Remanso say' },

    final_title: { es: '¿Conversamos sobre tu próximo mueble?', en: 'Shall we talk about your next piece?' },
    final_lede:  { es: 'Explora el catálogo o escríbenos directamente por WhatsApp.', en: 'Explore the catalog or message us directly on WhatsApp.' },
    final_cta1:  { es: 'Ver catálogo', en: 'View Catalog' },
    final_cta2:  { es: 'Escríbenos por WhatsApp', en: 'Message us on WhatsApp' }
  },

  opinion: {
    eyebrow: { es: 'Cuéntanos', en: 'Tell us' },
    title:   { es: '¿Cómo te fue con nosotros?', en: 'How did it go with us?' },
    lede:    { es: 'Nos ayuda muchísimo saberlo — hayas comprado o no. Se lee todo, de verdad.', en: 'It helps us enormously to know — whether you bought or not. We read every single one.' },
    label_name:  { es: 'Tu nombre', en: 'Your name' },
    ph_name:     { es: 'Como quieres que aparezca', en: 'How you want it to appear' },
    label_city:  { es: 'Ciudad', en: 'City' },
    ph_city:     { es: 'Ej: Medellín', en: 'e.g. Medellín' },
    optional:    { es: '(opcional)', en: '(optional)' },
    label_stage: { es: '¿En qué quedó tu contacto con nosotros?', en: 'Where did things land with us?' },
    stage_choose:   { es: 'Elige una opción', en: 'Pick one' },
    stage_bought:   { es: 'Compré y ya tengo mi mueble', en: 'I bought it and already have my piece' },
    stage_ordered:  { es: 'Ya encargué, lo estoy esperando', en: 'I ordered it and am waiting' },
    stage_quoted:   { es: 'Pedí cotización y lo estoy pensando', en: 'I asked for a quote and am thinking it over' },
    stage_declined: { es: 'Pregunté pero al final no compré', en: 'I asked but did not end up buying' },
    stage_other:    { es: 'Otra cosa', en: 'Something else' },
    label_piece: { es: '¿Qué pieza?', en: 'Which piece?' },
    ph_piece:    { es: 'Ej: Mecedora Nana', en: 'e.g. Nana rocker' },
    label_message: { es: 'Tu comentario', en: 'Your comment' },
    ph_message:    { es: 'Cuéntanos cómo te fue, qué te gustó y qué podríamos hacer mejor...', en: 'Tell us how it went, what you liked and what we could do better...' },
    consent: { es: 'Autorizo a El Remanso a publicar mi comentario y mi nombre en su página.', en: 'I authorize El Remanso to publish my comment and my name on their site.' },
    note:    { es: 'Si prefieres que no se publique, escríbenos por WhatsApp: también queremos oírlo.', en: 'If you would rather it not be published, message us on WhatsApp: we want to hear it too.' },
    btn_send: { es: 'Enviar mi comentario', en: 'Send my comment' },
    sent:  { es: '¡Gracias! Lo leemos y, si nos diste permiso, lo publicamos pronto.', en: 'Thank you! We will read it and, if you gave us permission, publish it soon.' },
    error: { es: 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.', en: 'It could not be sent. Check your connection and try again.' }
  },

  catalog: {
    meta_title: { es: 'Catálogo | El Remanso', en: 'Catalog | El Remanso' },
    meta_desc: { es: 'Nuestras colecciones de muebles artesanales en mimbre, yaré, rattán, calceta de plátano, sintético y piola náutica.', en: 'Our collections of handcrafted furniture in wicker, yaré, rattan, banana fiber, synthetic fiber and nautical rope.' },
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

    custom_title: { es: 'Ninguna pieza existe antes de que la pidas.', en: 'No piece exists until you ask for it.' },
    custom_desc:  { es: 'Cada mueble se teje desde cero para ti: tus medidas, tu fibra, tu color y la tela que elijas para los cojines. Cuéntanos cómo lo imaginas y lo definimos juntos, sin afán.', en: "Every piece is woven from scratch for you: your measurements, your fiber, your color and the fabric you pick for the cushions. Tell us how you imagine it and we'll settle it together, unhurried." },
    tag_custom: { es: 'Hecho para ti', en: 'Made for you' },
    tag_mimbre: { es: 'Mimbre', en: 'Wicker' },
    tag_yare: { es: 'Yaré', en: 'Yaré' },
    tag_rattan: { es: 'Rattán', en: 'Rattan' },
    tag_calceta: { es: 'Calceta de plátano', en: 'Banana fiber' },
    tag_sintetico: { es: 'Sintético', en: 'Synthetic' },
    tag_piola: { es: 'Piola náutica', en: 'Nautical rope' }
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
    p1: { es: 'En El Remanso trabajamos junto a tejedores que dominan el mimbre, el yaré, el rattán y la calceta de plátano desde hace años. Combinamos ese conocimiento tradicional con fibra sintética y piola náutica para que también puedas disfrutar de muebles tejidos en tu terraza o jardín, sin preocuparte por el clima.', en: 'At El Remanso we work alongside weavers who have mastered wicker, yaré, rattan and banana fiber for years. We combine that traditional knowledge with synthetic fiber and nautical rope so you can also enjoy woven furniture on your terrace or garden, without worrying about the weather.' },
    p2: { es: 'Cada pieza sale de nuestro taller revisada a mano, una por una, antes de llegar a tu casa.', en: 'Every piece leaves our workshop hand-checked, one by one, before it reaches your home.' },

    why_title: { es: 'Por qué la gente vuelve', en: 'Why People Come Back' },
    why1_title: { es: 'Sin prisa', en: 'Unhurried' },
    why1_desc:  { es: 'Cada mueble pasa por manos que llevan años haciendo esto, y que no se apuran.', en: 'Every piece passes through hands that have done this for years, and never rush.' },
    why2_title: { es: 'Con nombre propio', en: 'A Name of Its Own' },
    why2_desc:  { es: 'Le ponemos nombre a cada pieza antes de que tenga dueño.', en: 'We name every piece before it has an owner.' },
    why3_title: { es: 'De la mano', en: 'Alongside You' },
    why3_desc:  { es: 'Desde la primera medida hasta que lo vemos entrar por tu puerta.', en: 'From the first measurement until we watch it come through your door.' }
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
