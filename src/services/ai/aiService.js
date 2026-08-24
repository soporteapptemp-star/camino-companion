// Servicio local para responder dudas frecuentes del Camino a coste 0€
const RESPUESTAS_CAMINO = {
  es: {
    agua: "En la etapa actual (Betanzos → Bruma) tienes una fuente de agua potable en Presedo (km 11.8). Te recomiendo rellenar cantimplora allí ya que luego hay un tramo largo sin servicios.",
    ampollas: "Si notas una rozadura, para de inmediato. Limpia la zona, aplica un apósito tipo Compeed o vaselina si aún no se ha abierto. ¡No rompas la piel si es posible!",
    comer: "El punto más popular para comer a mitad de etapa es el Mesón O Pote o parar en Presedo. En Bruma tendrás opciones al llegar al albergue.",
    albergue: "El Albergue Público de Bruma tiene 32 plazas y cuesta 10€. No admite reserva previa, va por orden de llegada.",
    default: "¡Hola, peregrino! Para la etapa Betanzos → Hospital de Bruma, te sugiero planificar bien el agua y las paradas. ¿Tienes alguna duda concreta sobre alojamiento, comida o el trayecto?"
  },
  en: {
    agua: "On the current stage (Betanzos → Bruma) you have a drinking water fountain in Presedo (km 11.8). Fill your water bottle there, as there is a long stretch without services afterward.",
    ampollas: "If you feel a blister forming, stop immediately. Clean the area, apply a Compeed plaster or vaseline. Try not to pop the skin if possible!",
    comer: "The most popular place to eat halfway is Mesón O Pote or stopping in Presedo. In Bruma you will find food options near the hostel.",
    albergue: "The Public Hostel in Bruma has 32 beds and costs €10. It cannot be booked in advance; beds are assigned on a first-come, first-served basis.",
    default: "Hello, pilgrim! For the Betanzos → Hospital de Bruma stage, make sure to plan your water and stops carefully. Do you have any specific questions about accommodation, food, or the route?"
  }
};

export async function consultarIA(pregunta, lang = 'es') {
  // Simula un pequeño tiempo de respuesta de la IA
  await new Promise((resolve) => setTimeout(resolve, 800));

  const query = pregunta.toLowerCase();
  const currentLang = lang === 'en' ? 'en' : 'es';
  const dict = RESPUESTAS_CAMINO[currentLang];

  if (query.includes('agua') || query.includes('fuente') || query.includes('water') || query.includes('fountain')) return dict.agua;
  if (query.includes('ampolla') || query.includes('pie') || query.includes('rozadura') || query.includes('blister') || query.includes('feet')) return dict.ampollas;
  if (query.includes('comer') || query.includes('restaurante') || query.includes('bar') || query.includes('eat') || query.includes('food')) return dict.comer;
  if (query.includes('albergue') || query.includes('dormir') || query.includes('hostal') || query.includes('hostel') || query.includes('sleep')) return dict.albergue;

  return dict.default;
}