// Servicio local para responder dudas frecuentes del Camino a coste 0€
const RESPUESTAS_CAMINO = {
  agua: "En la etapa actual (Betanzos → Bruma) tienes una fuente de agua potable en Presedo (km 11.8). Te recomiendo rellenar cantimplora allí ya que luego hay un tramo largo sin servicios.",
  ampollas: "Si notas una rozadura, para de inmediato. Limpia la zona, aplica un apósito tipo Compeed o vaselina si aún no se ha abierto. ¡No rompas la piel si es posible!",
  comer: "El punto más popular para comer a mitad de etapa es el Mesón O Pote o parar en Presedo. En Bruma tendrás opciones al llegar al albergue.",
  albergue: "El Albergue Público de Bruma tiene 32 plazas y cuesta 10€. No admite reserva previa, va por orden de llegada."
};

export async function consultarIA(pregunta) {
  // Simula un pequeño tiempo de respuesta de la IA
  await new Promise((resolve) => setTimeout(resolve, 800));

  const query = pregunta.toLowerCase();
  
  if (query.includes('agua') || query.includes('fuente')) return RESPUESTAS_CAMINO.agua;
  if (query.includes('ampolla') || query.includes('pie') || query.includes('rozadura')) return RESPUESTAS_CAMINO.ampollas;
  if (query.includes('comer') || query.includes('restaurante') || query.includes('bar')) return RESPUESTAS_CAMINO.comer;
  if (query.includes('albergue') || query.includes('dormir') || query.includes('hostal')) return RESPUESTAS_CAMINO.albergue;

  return `¡Hola, peregrino! Para la etapa Betanzos → Hospital de Bruma, te sugiero planificar bien el agua y las paradas. ¿Tienes alguna duda concreta sobre alojamiento, comida o el trayecto?`;
}