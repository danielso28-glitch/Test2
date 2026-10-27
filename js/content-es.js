/* ================= CONTENT · ESPAÑOL ================= */
/* Spanish texts for Explore (FEED incl. stories) and the demo groups, merged by id. Missing → English. */
const CONTENT_ES = {
  who150: ["150 minutos a la semana", "La OMS recomienda a los adultos al menos 150–300 minutos de actividad moderada a la semana, como caminar a paso ligero, y ejercicios de fuerza 2 o más días. Las personas mayores también deberían entrenar el equilibrio para evitar caídas."],
  plate: ["Más alimentos de origen vegetal", "La Sociedad Alemana de Nutrición (DGE) recomienda llenar la mayor parte del plato con verdura, fruta, legumbres y cereales integrales, y beber sobre todo agua. Los pequeños cambios suman con los años."],
  balance10: ["10 minutos de equilibrio", "Ejercicios cortos de equilibrio para hacer en casa, apoyándote en una silla. Ideales para los días sin grupo."],
  protein: ["La proteína mantiene tus músculos", "Los músculos necesitan proteína, y a partir de los 65 el cuerpo necesita un poco más. Repártela durante el día: yogur o queso fresco en el desayuno, alubias o lentejas al mediodía, pescado, huevos o tofu por la noche. Funciona mejor junto con ejercicios de fuerza."],
  strength: ["La fuerza protege tu independencia", "La masa muscular disminuye con la edad. Entrenar la fuerza dos veces por semana te ayuda a seguir cargando la compra, subiendo escaleras y jugando con tus nietos."],
  water: ["Bebe antes de tener sed", "Con la edad sentimos la sed más tarde. La DGE recomienda aproximadamente 1,5 litros al día, sobre todo agua o infusiones sin azúcar, y más cuando haces ejercicio o hace calor. Una botella llena en la mesa es un buen recordatorio."],
  lunch15: ["Comida sana en 15 minutos", "Recetas rápidas para días con prisa, para que la opción sana también sea la fácil."],
  sleep: ["Dormir también es entrenar", "La mayoría de los adultos necesita entre 7 y 9 horas de sueño. Acostarse a horas regulares y la luz del día ayudan, sobre todo después de un día largo en la oficina."],
  fiveaday: ["5 al día", "La DGE recomienda 3 raciones de verdura y 2 de fruta al día. Una ración es más o menos un puñado. La verdura congelada también cuenta y se cocina rápido."],
  checkup: ["La revisión gratuita a partir de los 35", "En Alemania, el seguro médico público paga una revisión general cada 3 años a partir de los 35. Resérvala como la revisión del coche: con una fecha fija en tu calendario."],
  salt: ["Menos sal, mejor tensión", "La OMS recomienda menos de 5 g de sal al día, más o menos una cucharadita. La mayor parte de la sal está escondida en el pan, el queso, los embutidos y los platos preparados. Las hierbas y el limón dan sabor en su lugar."],
  together: ["Muévete acompañado, no solo", "A mucha gente le resulta más fácil seguir haciendo ejercicio en grupo. Lleva a un amigo a tu próxima sesión."],
  vitd: ["Los huesos necesitan calcio y vitamina D", "Los lácteos, la verdura de hoja verde y el agua mineral rica en calcio ayudan a tus huesos. En otoño e invierno el sol es demasiado débil para la vitamina D, por eso el NHS aconseja valorar un suplemento. Pregunta a tu médico qué te conviene."],
  desk: ["Estiramientos de 5 minutos en la oficina", "Estiramientos sencillos para la espalda y el cuello entre dos reuniones."],
  nutri: ["Compara con el Nutri-Score", "El Nutri-Score del envase va de la A (verde) a la E (roja). Te ayuda a comparar productos parecidos, por ejemplo dos tipos de muesli o dos pizzas congeladas."],
  taiso: ["La pausa de ejercicio diaria de Japón", "En Japón mucha gente hace una pequeña rutina de ejercicio en grupo llamada Radio Taiso. Cinco minutos juntos valen más que una hora a solas que nunca llega."],
  breakfast: ["Desayuno con proteína", "Ideas fáciles como avena remojada con queso fresco o una tortilla con verduras. Un buen comienzo antes de tu sesión de grupo."],
  meal: ["Come acompañado más a menudo", "Quien come solo suele comer peor. Cocina con un vecino, invita a tu grupo a una sopa o únete a una comida comunitaria de tu barrio."],
  medi: ["Cocina mediterránea", "Verdura, aceite de oliva, pescado, legumbres y frutos secos. La dieta mediterránea se asocia con un corazón más sano, y sabe a vacaciones."],
  alcohol: ["Menos alcohol, mejor sueño", "La DGE aconseja evitar el alcohol, porque no hay una cantidad segura para la salud. Una copa por la noche también hace el sueño más ligero. La cerveza sin alcohol o el agua con gas y limón son buenas alternativas."],
  dancehome: ["Baila en casa 15 minutos", "Coreografías sencillas para seguir en tu salón. Buenas para el equilibrio, la memoria y el ánimo."],
  brisk: ["Camina un poco más rápido", "Caminar a paso ligero significa que todavía puedes hablar, pero no cantar. Prueba 10 minutos a paso ligero después de comer. Todo cuenta para tus 150 minutos."],
  ebike: ["La bici eléctrica también cuenta", "Una bici eléctrica hace más fáciles las cuestas y los trayectos largos, así que sales más a menudo. Sigues pedaleando, así que tu corazón y tus piernas siguen entrenando. Practica primero frenar y tomar curvas en un sitio tranquilo."],
  "st-monika": ["Antes cogía el ascensor hasta el segundo piso. Tres meses con mi grupo de marcha, y ahora soy yo la que espera a los demás arriba de la escalera.", "Grupo de marcha 50+ · dos veces por semana"],
  "st-klaus": ["La app me mostró a los 75, atrapado en el sofá. Esa imagen no se me fue de la cabeza. Cambié la cerveza de la tarde por un paseo y duermo mejor que en años.", "Empezó con Two Paths · paseos por la tarde"],
  "st-hanspeter": ["Mis rodillas dijeron que no al fútbol normal hace años. El walking football me devolvió mi equipo de los sábados, y ahora mi nieto quiere jugar conmigo en el jardín.", "Walking football 50+ · sábados"],
  "st-ayse": ["Solo fui porque mi amiga no quería ir sola. Ahora soy yo la que la arrastra todos los miércoles.", "Baile 50+ · miércoles"],
  "st-juergen": ["Treinta años sentado en una oficina. Mi seguro médico pagó el curso de espalda, y ahora puedo trabajar toda la tarde en el jardín sin dolor.", "Espalda fuerte 50+ · pagado por su seguro médico"],
  "st-birgit": ["Después de caerme en el hielo me daba miedo salir. El yoga suave me devolvió el equilibrio, y también la confianza.", "Yoga suave 50+ · lunes"],
  "st-renate": ["Hasta hace dos años llevaba décadas sin montar en bici. Ahora dirijo yo misma la excursión de los domingos.", "Excursión en bici 50+ · guía voluntaria"],
  "rm-flowers": ["A los 57 le dolían las rodillas en cada cuesta. A los 58 empezó a entrenar en casa con DVD, a los 63 fue por primera vez a un gimnasio. Hoy puede hacer 140 flexiones seguidas.", "Empezó a los 58"],
  "rm-shah": ["No había corrido ni un kilómetro antes de cumplir 50. Corrió su primer maratón a los 50 y llama al running su «segunda vida».", "Empezó a los 50"],
  "rm-crawford": ["A los 64, la artrosis de rodilla no la dejaba subir escaleras. Después de entrenar estaba lo bastante en forma para adoptar el cachorro que siempre había querido.", "Empezó a los 64"],
  "sd-kora": ["Las personas mayores de la región de Augsburgo que eran moderada o muy activas desde los 50 tenían menos riesgo de discapacidad en la vejez, a lo largo de unos 18 años.", "Estudio alemán"]
};
/* YouTube searches in Spanish */
const YT_ES = { balance10: "ejercicios de equilibrio para mayores 10 minutos", lunch15: "recetas saludables rápidas 15 minutos", desk: "estiramientos espalda cuello oficina 5 minutos", breakfast: "desayuno alto en proteínas fácil", medi: "dieta mediterránea recetas fáciles", dancehome: "baile para mayores 15 minutos" };
FEED.forEach(f => {
  if (CONTENT_ES[f.k])
    f.es = CONTENT_ES[f.k];
  if (f.q && YT_ES[f.k])
    f.q.es = YT(YT_ES[f.k]);
});
const GROUPS_ES = { w: ["Grupo de marcha 50+", "Entrada del parque"], d: ["Baile 50+", "Estudio de baile"], f: ["Walking football 50+", "Campo de deporte"], r: ["Espalda fuerte 50+", "Gimnasio"], y: ["Yoga suave 50+", "Centro cívico"], c: ["Excursión en bici 50+", "Aparcamiento del lago"], v: ["Compañeros de paseo del parque", "Paseo del lago"], n: ["Marcha nórdica 50+", "Aparcamiento del bosque"], o: ["Yoga en silla 50+", "Sala de la biblioteca"], l: ["Baile en línea 50+", "Casa del pueblo"] };
GROUPS.forEach(g => { const e = GROUPS_ES[g.id]; if (e) {
  g.name.es = e[0];
  g.place.es = e[1];
} });
