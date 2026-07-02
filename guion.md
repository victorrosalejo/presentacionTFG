# Guión de Defensa

**Trabajo de Fin de Grado**
*TimeWidget: Motor de Búsqueda Visual de Patrones en Series Temporales*

**Autor:** Víctor Arroyo Madera
**Tutores:** Iván Velasco González · Sofía Bayona Beriso
**Titulación:** Grado en Ingeniería de Software — ETSII, URJC
**Convocatoria:** Junio 2026

---

## Distribución de tiempo (15 minutos)

| Diapositiva | Contenido | Tiempo |
|---|---|---|
| 1 | Portada y presentación | 0:30 |
| 2 | Índice | 0:20 |
| 3 | Contexto y motivación | 1:00 |
| 4 | Punto de partida y objetivo | 1:00 |
| 5 | Metodología | 0:25 |
| 6 | Contribución 1 — Curvas de referencia activas | 1:00 |
| 7 | Contribución 1 — Herramientas + lógica | 0:45 |
| 8 | Arquitectura inicial | 0:30 |
| 9 | Arquitectura evolucionada | 0:40 |
| 10 | Contribución 2 — BVH: fase amplia | 0:45 |
| 11 | Contribución 2 — BVH: fase estrecha | 0:40 |
| 12 | Contribución 3 — Canvas 2D: el cuello de botella | 0:45 |
| 13 | Contribución 3 — WebGPU: la migración | 0:35 |
| 14 | Contribución 3 — Optimizaciones WebGPU | 0:45 |
| 15 | Resultados de rendimiento | 1:10 |
| 16 | Validación funcional y usabilidad | 0:55 |
| 17 | Sistema de ayuda integrado | 0:20 |
| 18 | Conclusiones | 0:45 |
| 19 | Líneas futuras | 0:25 |
| 20 | Cierre | 0:10 |
| | **Total** | **~13:25** |

> La diapositiva de demo en vivo (id `sl-demo`) queda **oculta** (`slides-config.json → hidden`), igual que el backup "Cinco frentes de evolución": disponible por si el tribunal pide verla, pero fuera del flujo y del conteo numerado.

---

## Diapositiva 1 — Portada (0:30)

Buenos días. Soy Víctor Arroyo Madera y voy a presentar mi Trabajo de Fin de Grado titulado *TimeWidget: Motor de Búsqueda Visual de Patrones en Series Temporales*.

Este trabajo ha sido tutorizado por Iván Velasco González y Sofía Bayona Beriso, y se enmarca en un proyecto de investigación internacional en el que participan la Northeastern University en San Francisco, la Universidad de los Andes en Bogotá y la Fundación Canguro, con quienes colaboramos en el seguimiento clínico de neonatos prematuros.

---

## Diapositiva 2 — Índice (0:20)

El trabajo se organiza en cinco bloques: contexto y problema, punto de partida con el objetivo y la metodología, las tres contribuciones técnicas —el núcleo del trabajo—, los resultados y su validación, y por último las conclusiones y el trabajo futuro.

---

## Diapositiva 3 — Contexto y motivación (1:00)

En 2023 se generaron 120 zettabytes de datos a nivel global. Pero más allá del volumen bruto, lo que me interesa es un tipo concreto de dato: la **serie temporal**, una secuencia ordenada de observaciones a lo largo del tiempo.

El caso más cercano a este trabajo es la Fundación Canguro en Bogotá: 500 familias de neonatos prematuros con seguimiento semanal del estado de salud. Cada semana, una nueva observación. Cada familia, una serie temporal. Cientos de series que un médico o investigador necesita explorar simultáneamente para detectar patrones o anomalías.

Este problema aparece también en finanzas, en telemetría industrial y en registros médicos de cualquier tipo. El reto es siempre el mismo: cuando el número de series crece, los métodos tradicionales colapsan. La superposición excesiva —el *overplotting*— oculta los patrones en vez de revelarlos.

---

## Diapositiva 4 — Punto de partida y objetivo (1:00)

El punto de partida de este TFG es **TimeWidget**, una herramienta preexistente desarrollada por este grupo de investigación. Ya ofrecía cosas valiosas: TimeBoxes con *Intersect*/*Contains*, grupos combinados con AND/OR, un NOT aplicable a TimeBoxes, y curvas de referencia, aunque solo como superposición visual. Su techo práctico era Canvas 2D a N≈5.000 series.

El objetivo de este TFG es claro: transformar TimeWidget de un *visualizador* en un **motor de búsqueda visual de patrones**, avanzando en dos dimensiones. En **expresividad**: las curvas pasan a ser filtro activo (func/threshold/points), se añaden sliders de corredor above/below, tolerancia ε ajustable en tiempo real, y AND/OR/NOT sobre todos los filtros. En **escala**: WebGPU + LOD llevan el sistema de 5.000 a 100.000 series en tiempo real.

---

## Diapositiva 5 — Metodología (0:25)

La metodología sigue cuatro fases secuenciales entre dimensiones e incrementales dentro de cada una: primero el análisis del sistema nativo, después la expresividad —curvas activas, sliders y ε, lógica booleana—, luego el rendimiento —BVH, WebGPU, LOD— y por último la validación. El orden no es arbitrario: había que saber qué filtrar antes de optimizar cómo renderizarlo, y cada incremento se probó sobre datos reales de neonatos.

---

## Diapositiva 6 — Curvas de referencia activas (1:00)

La primera contribución funcional activa lo que antes era decorativo. En el lado izquierdo de la diapositiva se ve el sistema nativo: la curva −2SD de la OMS existe, pero ningún filtro puede anclarse a ella. En el lado derecho, la misma curva se convierte en **frontera de filtrado activo**: selecciona directamente los pacientes en riesgo.

El analista puede definir tres tipos de curva: una función matemática continua —`func`—, un umbral simple —`threshold`—, o un conjunto de puntos discretos —`points`— con tolerancia ε ajustable en tiempo real.

En el diagrama puede verse el corredor superior activo: las series en rojo son las seleccionadas, las grises no cumplen el criterio. Técnicamente, estas curvas se integran en el BVH de forma incremental: añadir o eliminar una curva tiene coste O(k), sin reconstruir la rejilla completa.

---

## Diapositiva 7 — Herramientas y lógica (0:45)

> Hay 3 fragmentos. Se revelan al avanzar con → / clicker.

Sobre las curvas activas se construyen dos herramientas de selección nuevas, que se revelan progresivamente en esta diapositiva.

**[Frag 1 — slider]** Los **sliders** definen un corredor superior o inferior. El usuario elige entre *Intersect*, que basta con que la serie cruce el área, o *Contains*, que exige que esté completamente dentro.

**[Frag 2 — ε]** La **tolerancia ε** selecciona series por proximidad a puntos discretos. Ese radio es ajustable en tiempo real sin recalcular nada. He verificado formalmente la propiedad de monotonía: ε igual a 2, 6 y 12 produce 94, 244 y 338 series, en ese orden creciente.

**[Frag 3 — AND/OR/NOT]** El tercer elemento es la **lógica booleana unificada**: AND dentro de grupo, OR entre grupos, NOT invertible sobre cualquier tipo de filtro. El contrato común `getResults() → Set<id>` hace que la combinación sea pura teoría de conjuntos, independientemente del tipo de filtro.

---

## Diapositiva 8 — Arquitectura inicial (0:30)

La arquitectura de partida era un flujo simple: TimeWidget delegaba el renderizado a TimeLineOverview, que dibujaba en Canvas 2D. BrushInteraction gestionaba los filtros con un BVH básico que solo resolvía colisiones segmento-rectángulo. Lo que existía, y es importante reconocerlo, era el mecanismo de curvas visuales y el operador NOT para TimeBoxes. Lo que no existía era ninguna capacidad de filtrar a través de esas curvas, ni sliders, ni tolerancia ε.

---

## Diapositiva 9 — Arquitectura evolucionada (0:40)

La nueva arquitectura introduce TimeLineOverview como **fachada**: detecta en tiempo de inicialización si el navegador soporta WebGPU y, si es así, delega todo el renderizado a WebGPURenderer. Si no lo soporta, cae silenciosamente a Canvas 2D sin ningún cambio en el código cliente.

El BVH ha sido completamente reescrito para admitir tres categorías de entidades, y BrushInteraction incorpora el motor booleano unificado. Las curvas de referencia ya no son solo visuales: alimentan directamente los nuevos tipos de filtro.

---

## Diapositiva 10 — BVH: fase amplia (0:45)

La estructura de datos espacial trabaja en dos fases. Esta diapositiva muestra la primera: la **fase amplia** usa una rejilla uniforme. Dado cualquier filtro, se calculan directamente qué celdas de la rejilla intersectan su región de interés en tiempo O(1) por división entera.

En la animación puede verse cómo las celdas dentro de la región consultada se identifican en secuencia: eso es la fase amplia obteniendo los candidatos.

Se descartó un quadtree porque para el patrón de acceso de TimeWidget —consultas de región rectangular repetidas a alta frecuencia sobre datos relativamente uniformes— la rejilla ofrece acceso en O(1) sin recorrer un árbol. Los árboles jerárquicos son más eficientes cuando los datos tienen distribución muy desigual, que no es el caso habitual en series temporales clínicas.

---

## Diapositiva 11 — BVH: fase estrecha (0:40)

> Hay 3 fragmentos que iluminan progresivamente las 4 primitivas.

Sobre los candidatos de la fase amplia, la **fase estrecha** aplica cuatro primitivas geométricas según el tipo de filtro.

**[Frag 1 — seg–rect]** Segmento-rectángulo para TimeBoxes, con la fórmula paramétrica clásica.

**[Frag 2 — seg–seg]** Segmento-segmento paramétrico para curvas continuas. El parámetro t, u ∈ [0,1] garantiza que solo se detectan intersecciones dentro del segmento real, no en la prolongación —sin falsos positivos.

**[Frag 3 — ray casting y dist pt–seg]** Ray casting con `d3.polygonContains` para los corredores above/below —cruces impares implican punto interior. Y distancia punto-segmento con proyección acotada para la tolerancia ε.

Las tres primitivas nuevas se integran en el BVH con la misma estructura de celdas; solo cambia la función de colisión.

---

## Diapositiva 12 — Canvas 2D: el cuello de botella (0:45)

Para entender por qué WebGPU marca la diferencia, hay que entender el modelo de ejecución de Canvas 2D. Con Canvas 2D, el bucle dibuja serie a serie: N series implica N llamadas secuenciales a `ctx.stroke()`. Cada llamada es un *draw call* independiente al driver de GPU con sincronización CPU-GPU. Con N igual a 100.000, ese overhead acumulado es el cuello de botella.

Es importante matizar: Canvas 2D sí usa la GPU para rasterizar —el hardware gráfico trabaja—. El problema no es que la GPU esté ociosa, sino que la recibe N comandos uno a uno, con N sincronizaciones. No es posible agrupar esas llamadas si cada serie necesita su propio color u opacidad para mostrar la selección.

---

## Diapositiva 13 — WebGPU: la migración (0:35)

WebGPU cambia el modelo de forma estructural. Toda la geometría se sube a la GPU una sola vez. El número de draw calls es **constante** —≤11 pasadas lógicas, independiente de N— y sus miles de unidades de procesamiento renderizan todas las líneas en paralelo. El hilo JavaScript queda libre para responder a la interacción del usuario.

La diferencia no es incremental: el factor de mejora crece con N, de 1,00× a 500 series hasta ~8× a 100.000, precisamente porque el overhead estructural de Canvas 2D es lineal en N mientras que el de WebGPU es constante.

---

## Diapositiva 14 — Optimizaciones WebGPU (0:45)

Sobre ese fundamento se implementaron cuatro optimizaciones específicas.

**Upload único de geometría:** la geometría se sube a la GPU una vez al inicio; cuando cambia la selección, solo se re-envían los estilos —colores y valores alfa— que pesan órdenes de magnitud menos.

**Caché de estilos por frame:** si la selección no ha cambiado entre dos frames consecutivos, el re-upload se omite completamente.

**MSAA adaptativo:** el antialiasing de múltiple muestra se desactiva automáticamente para más de 10.000 series, donde no aporta mejora visual perceptible pero multiplica por cuatro el coste en el rasterizador.

**LOD adaptativo de dos etapas:** la primera etapa reduce el número de muestras por línea cuando N supera los 20.000. La segunda salta líneas enteras a partir de 60.000. El resultado: de 72,9 millones de fragmentos por frame se baja a 36,5 millones, un 50% menos de carga.

---

## Diapositiva 15 — Resultados (1:10)

Los resultados validan las decisiones de diseño. Con 500 y 1.000 series ambos motores son equivalentes. La ventaja de WebGPU emerge en 5.000 series: Canvas baja a 20 fps —todavía Visible— mientras WebGPU alcanza 60 fps en zona Fluida. El umbral de inutilizabilidad de Canvas llega en 10.000 series: 10 fps. WebGPU sigue en zona Visible con 30 fps.

Aquí la gráfica muestra **dos líneas azules**. La línea discontinua es WebGPU sin LOD: a 100.000 series cae a 9 fps, cruzando también al rojo. La línea sólida es WebGPU con LOD activo: se mantiene en 17 fps, dentro de zona Visible. Es la **combinación de GPU + LOD** la que cruza el umbral de usabilidad, no el motor solo.

El factor de mejora es de ~8 veces a 100.000 series. Y lo más relevante: ese factor **crece con N** —de 1,00× a 500 series hasta 8,18× a 100.000—. La ventaja estructural del pipeline de GPU se amplifica con el volumen de datos.

Los benchmarks se ejecutaron en una gráfica integrada Intel UHD, el escenario más conservador posible.

---

## Diapositiva 16 — Validación funcional y usabilidad (0:55)

El sistema ha pasado los ocho escenarios de validación funcional con enfoque de caja negra orientada a propiedades. Para cada tipo de filtro se definió una propiedad matemática que debe cumplirse siempre —por ejemplo, la monotonía de ε o la correcta semántica del operador NOT—, se construyó el caso de prueba que la hace observable, y se verificó que el sistema la satisface. Resultado: ocho sobre ocho, todos Pass.

El estudio de usabilidad con cinco participantes de perfiles heterogéneos —dos ingenieros informáticos, un ingeniero mecánico, una técnica de radiodiagnóstico y una persona sin formación técnica— obtuvo una puntuación SUS media de 88,0, categoría Excelente. Los ítems más valorados fueron la descubribilidad del parámetro ε y la expresividad percibida del sistema combinado, ambos con 4,8 sobre 5.

---

## Diapositiva 17 — Sistema de ayuda integrado (0:20)

El estudio think-aloud reveló que los participantes sin perfil técnico necesitaban orientación sobre ε y los modos de filtro. Como respuesta directa se integró un sistema de ayuda: botón **?** permanente que abre un modal con 11 secciones acordeón, y un tour guiado de 7 pasos con efecto spotlight. El flujo completo fue validado: botón visible, modal abre, tour avanza correctamente.

---

## Diapositiva 18 — Conclusiones (0:45)

El cuadro antes/después resume la transformación. A la izquierda, las tres limitaciones del sistema de partida. A la derecha, las tres contribuciones que las resuelven. Los números respaldan las tres hipótesis de trabajo:

- **H1** confirmada: filtrado en tiempo real —sliders, ε y throttle dinámico— hasta 100.000 series.
- **H2** confirmada: SUS de 88,0, categoría Excelente.
- **H3** confirmada: factor de mejora ~8× creciente con N (1,00× → 8,18× con LOD activo).

TimeWidget es ahora un motor de búsqueda visual de patrones.

---

## Diapositiva 19 — Líneas futuras (0:25)

Como líneas de trabajo futuro identifico tres direcciones principales. En **usabilidad**: ampliar el estudio con más de 20 participantes del entorno clínico real y adaptar la terminología a perfiles no técnicos. En **rendimiento**: repetir los benchmarks con GPU dedicada, ya que los resultados actuales se obtuvieron en una gráfica integrada Intel UHD. En **despliegue**: el objetivo último es un piloto real con los datos de seguimiento de neonatos de la Fundación Canguro en Bogotá.

---

## Diapositiva 20 — Cierre (0:10)

Muchas gracias. Quedo a su disposición para cualquier pregunta.

---

## Preguntas previsibles del tribunal

**¿Por qué WebGPU y no WebGL?**

WebGPU expone acceso directo al pipeline gráfico moderno —Vulkan, Metal, D3D12— con gestión explícita de buffers y pipelines. En WebGL la GPU recibe comandos inmediatos uno a uno; en WebGPU se graban en *command buffers* que se envían en lote, reduciendo el overhead por frame. Además, WebGPU tiene un modelo de seguridad más estricto y está diseñado para las API modernas, mientras que WebGL sigue el modelo OpenGL de los años 90.

**¿Por qué rejilla uniforme y no quadtree o k-d tree?**

Para el patrón de acceso de TimeWidget —consultas de región rectangular repetidas a muy alta frecuencia sobre datos distribuidos de forma relativamente uniforme— la rejilla uniforme ofrece acceso en O(1) sin recorrer un árbol. Las estructuras jerárquicas son más eficientes cuando los datos tienen distribución muy desigual, que no es el caso habitual en series temporales clínicas. La simplicidad de implementación y mantenimiento también pesó en la decisión.

**¿Qué ocurre si WebGPU no está disponible en el navegador?**

TimeLineOverview actúa como fachada y detecta en tiempo de inicialización si WebGPU está disponible. Si no lo está, cae automáticamente a Canvas 2D sin ningún cambio en el código cliente. El usuario verá degradación de rendimiento a partir de N=5.000, pero el sistema sigue siendo funcional. Como línea futura está añadir un indicador visible del motor activo.

**¿Por qué solo 5 participantes en el estudio de usabilidad?**

El estudio fue diseñado como piloto exploratorio con protocolo think-aloud. Nielsen establece que con 5 participantes se detecta el 85% de los problemas de usabilidad más frecuentes. Los resultados son suficientes para validar la hipótesis H2. La ampliación a 20 o más participantes con perfil clínico real está planteada como línea futura explícita.

**¿El LOD no afecta a la corrección de las selecciones?**

No. El LOD opera exclusivamente sobre el renderizado: reduce las líneas y puntos dibujados en pantalla. El BVH evalúa siempre el conjunto completo de polilíneas, independientemente de N. Los conteos de selección son siempre exactos. Lo único que varía es la representación visual, que a densidades de 80.000 series o más ya presenta un solapamiento superior a 200 veces, por lo que la reducción no es perceptible.

**¿Cómo escala el BVH con curvas de referencia complejas?**

Cada segmento de una curva de referencia se registra en las celdas de la rejilla que ocupa, igual que los segmentos de los datos. La actualización incremental tiene coste O(k), donde k es el número de segmentos de la curva modificada. Añadir o eliminar una curva completa de 500 puntos es mucho más rápido que reconstruir la rejilla completa, que sería O(N·m).

**¿Por qué no optimizar Canvas 2D reduciendo las llamadas a stroke() en lugar de migrar a WebGPU?**

Canvas 2D sí usa la GPU para rasterizar: el hardware gráfico trabaja. El problema no es que la GPU esté ociosa, sino que cada llamada a `ctx.stroke()` es un *draw call* independiente con sincronización CPU→GPU. Con N series hay N *draw calls*: el overhead crece linealmente. No es posible agruparlos en una sola operación por lotes si cada serie necesita su propio color u opacidad para mostrar la selección. WebGPU resuelve esto cambiando el modelo: geometría subida una vez, estilos por serie en un buffer de GPU, draw calls constantes (≤11 pasadas, independiente de N). Por eso el factor de mejora crece con N —de 1,00× a 500 series hasta 8,18× a 100.000 con LOD activo (8,88× sin LOD)— en lugar de ser constante.
