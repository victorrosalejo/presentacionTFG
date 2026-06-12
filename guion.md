# Guión de Defensa — TimeWidget TFG
**Víctor Arroyo Madera** · Junio 2026 · **objetivo: 15 minutos** + preguntas

> ⚠️ Los tiempos por slide indicados abajo suman ~19 min (versión extendida). Para la defensa real usar el **plan de 15 minutos**:
>
> | Slide | Tiempo | Slide | Tiempo |
> |---|---|---|---|
> | 1 Portada | 0:30 | 10 Arq. inicial | 0:30 |
> | 2 Contexto | 1:00 | 11 Arq. evolucionada | 0:45 |
> | 3 Punto de partida | 0:45 | 12 BVH | 0:45 |
> | 4 Objetivo | 0:30 | 13 WebGPU ¿por qué? | 0:45 |
> | 5 Curvas | 1:00 | 14 Optimizaciones | 0:45 |
> | 6 Sliders y ε | 0:45 | 15 Resultados | 1:15 |
> | 7 Modos y filtros | 0:45 | 16 Validación | 1:00 |
> | 8 Demo animada | 1:00 | 17 Conclusiones | 0:45 |
> | 9 + 9b Demo en vivo | 1:00 | 18 Futuro + cierre | 0:30 |
>
> **Total: ~15:15** (14:15 si se salta la demo en vivo). Qué sacrificar al recortar: el dato de los 120 zettabytes (slide 2), la justificación de algoritmos descartados (slide 12 — está en anexo), y dejar que la matriz de la slide 7 hable sola sin leerla entera. **Nunca recortar resultados (15-16).**

---

## Slide 1 — Portada (0:30)

Buenos días. Soy Víctor Arroyo Madera y voy a presentar mi Trabajo de Fin de Grado titulado *TimeWidget: Motor de Búsqueda Visual de Patrones en Series Temporales*.

Este trabajo ha sido tutorizado por Iván Velasco González y Sofía Bayona Beriso, y se enmarca en un proyecto de investigación internacional en el que participan la Northeastern University en San Francisco, la Universidad de los Andes en Bogotá, y la Fundación Canguro, con quienes colaboramos en el seguimiento clínico de neonatos prematuros.

---

## Slide 2 — Contexto (1:15)

En 2023 se generaron 120 zettabytes de datos a nivel global. Pero más allá del volumen bruto, lo que me interesa es un tipo concreto de dato: la **serie temporal**. Una secuencia ordenada de observaciones a lo largo del tiempo.

El caso más cercano a este trabajo es la Fundación Canguro en Bogotá: 500 familias de neonatos prematuros con seguimiento semanal del estado de salud. Cada semana, una nueva observación. Cada familia, una serie temporal. Cientos de series que un médico o investigador necesita explorar simultáneamente para detectar patrones o anomalías.

Y este problema aparece también en finanzas, en telemetría industrial, en registros médicos de cualquier tipo. El reto es siempre el mismo: cuando el número de series crece, los métodos tradicionales colapsan. La superposición excesiva, el *overplotting*, oculta los patrones en vez de revelarlos. Como pueden ver en la animación, a partir de cierto número de series ya no se distingue nada.

---

## Slide 3 — Punto de Partida (1:15)

El punto de partida de este TFG es **TimeWidget**, una herramienta preexistente desarrollada por este grupo de investigación. Ya ofrecía cosas valiosas: las *TimeBoxes*, rectángulos de selección interactivos para filtrar series, los modos *Intersect* y *Contains*, y un operador NOT aplicable a TimeBoxes individuales. Incluso tenía curvas de referencia, aunque solo como overlay visual sobre la gráfica.

Sin embargo, tenía tres limitaciones estructurales claras que justifican este TFG. Primera: las curvas de referencia eran visuales solamente, no se podía filtrar a través de ellas. Segunda: la lógica booleana era incompleta, el NOT solo funcionaba en TimeBoxes y no se podían mezclar tipos de filtros. Y tercera, la más crítica en términos de escalabilidad: el motor Canvas 2D alcanzaba su límite a 5.000 series con solo 16 fotogramas por segundo.

---

## Slide 4 — Objetivo (0:45)

El objetivo de este trabajo es claro: transformar TimeWidget de un *visualizador* en un **motor de búsqueda visual de patrones**. Para ello avanzo en dos dimensiones complementarias: la expresividad —que es lo que el analista puede preguntar al sistema— y el rendimiento —que es cuántos datos puede manejar sin perder fluidez.

---

## Slide 5 — Curvas de Referencia (1:30)

La primera contribución funcional activa lo que antes era decorativo. Las curvas de referencia pasan de ser un overlay visual a ser **fronteras de filtrado activo**.

El analista puede definir tres tipos: una función matemática continua, un umbral simple, o un conjunto de puntos discretos con tolerancia ε. Sobre cada una de ellas puede anclar filtros que seleccionan las series que quedan por encima, por debajo, o dentro de un radio configurable.

En el diagrama pueden ver el corredor superior activo: las series en rojo son las seleccionadas, las grises no cumplen el criterio. El punto con el círculo pulsante representa la tolerancia ε. Técnicamente, estas curvas se integran en el BVH de forma incremental: añadir o eliminar una curva tiene coste O(k), sin reconstruir la rejilla completa.

---

## Slide 6 — Sliders y Tolerancia ε (1:15)

Sobre las curvas se construyen dos herramientas de selección topológica. Los **sliders** definen un corredor —above o below— y el usuario elige entre *Intersect*, que basta con que la serie cruce el área, o *Contains*, que exige que esté completamente dentro. En el SVG pueden ver los círculos con animación de pulso: representan la tolerancia ε expandiéndose y contrayéndose. Ese radio es ajustable en tiempo real sin recalcular nada.

He verificado formalmente la propiedad de monotonía del parámetro ε: si el radio crece, el número de series seleccionadas no puede decrecer. En los experimentos, con ε igual a 2, 6 y 12 obtuve 94, 244 y 338 series respectivamente, en ese orden creciente. Esto confirma el comportamiento correcto.

---

## Slide 7 — Modos y Filtros (1:00)

Esta matriz resume qué capacidades tenía el sistema original y cuáles son nuevas. En verde, lo que ya existía: TimeBoxes con Intersect, Contains y NOT. En rojo, lo que aporta este TFG: los sliders y los puntos ε, con sus respectivos modos de selección, y la extensión del operador NOT a todos los tipos de filtro.

Lo clave es que todos comparten el mismo contrato: `getResults() → Set<id>`. Esto permite combinarlos libremente con AND entre filtros del mismo grupo y OR entre grupos distintos.

---

## Slide 8 — Demo Animada (1:45)

> ⏸ *Control: un clic sobre la animación la pausa en la fase actual (el rótulo inferior se marca en ámbar); otro clic la reanuda. Útil para detenerse a explicar una fase concreta.*

Esta animación muestra el flujo de interacción sin necesidad de tocar nada. Primero aparece la curva de umbral clínico. Luego se dibuja un TimeBox en la región central y un slider *above* en el lado izquierdo: los grupos quedan activos por separado. Al combinarlos con AND, solo quedan destacadas las series que satisfacen ambos criterios simultáneamente. La etiqueta muestra cuántas series pasan el filtro combinado.

Después la animación muestra el ciclo de modo: el mismo filtro cambia de *Intersect* a *Contains* y la selección se reduce porque ahora exige que la serie esté completamente dentro, no solo que la cruce. Finalmente aparece el escenario del corredor bilateral: dos sliders, uno above y uno below, crean una banda de selección alrededor de la curva de referencia.

---

## Slide 9 — Demo Real (0:45)

Esta captura muestra el sistema funcionando con el dataset clínico real: 500 series a 117 fotogramas por segundo con el renderer WebGPU activo. El umbral clínico está visible como línea discontinua, el corredor superior está activo, y el panel lateral muestra los filtros con sus operadores lógicos. La interacción es completamente fluida.

---

## Slide 9b — Demo en Vivo (1:00, opcional/flexible)

> 🟢 *El widget REAL embebido e interactivo a pantalla completa (requiere servir la presentación por HTTP, no `file://`). Plan B: si falla la GPU o la red del proyector, se salta esta slide — la anterior (captura) ya cubre la evidencia.*

Y esto no es un vídeo: es la herramienta real ejecutándose ahora mismo. *(Cargar 200 series con Canvas 2D, dibujar un TimeBox en directo. Después cambiar el selector a WebGPU, subir a 50.000 series y recargar: la interacción sigue fluida.)* Esta es exactamente la diferencia que cuantificaré en los resultados.

---

## Slide 10 — Arquitectura Inicial (0:45)

La arquitectura de partida era un flujo simple: TimeWidget delegaba el renderizado a TimeLineOverview, que dibujaba en Canvas 2D. BrushInteraction gestionaba los filtros con un BVH básico que solo resolvía colisiones segmento-rectángulo. Lo que existía, y es importante reconocerlo, era el mecanismo de curvas visuales y el operador NOT para TimeBoxes. Lo que no existía era ninguna capacidad de filtrar a través de esas curvas, ni sliders, ni tolerancia ε.

---

## Slide 11 — Arquitectura Evolucionada (1:00)

La nueva arquitectura introduce TimeLineOverview como **fachada**: detecta en tiempo de inicialización si el navegador soporta WebGPU y, si es así, delega todo el renderizado a WebGPURenderer. Si no lo soporta, cae silenciosamente a Canvas 2D sin ningún cambio en el código cliente.

El BVH ha sido completamente reescrito para admitir tres categorías de entidades, y BrushInteraction incorpora el motor booleano unificado. Lo más importante: las curvas de referencia ya no son solo visuales, sino que alimentan directamente los nuevos tipos de filtro.

---

## Slide 12 — BVH: Dos Fases (1:00)

La estructura de datos espacial trabaja en dos fases. La **fase amplia** usa una rejilla uniforme: dado cualquier filtro, calculamos directamente qué celdas de la rejilla intersectan su región de interés en tiempo O(1) por división entera. En la animación pueden ver cómo las celdas dentro de la región consultada se iluminan en secuencia: eso es la fase amplia identificando los candidatos.

Al pulsar el fragmento, aparece la **fase estrecha**: sobre esos candidatos se aplican cuatro primitivas geométricas según el tipo de filtro. Segmento-rectángulo para TimeBoxes, segmento-segmento paramétrico para curvas continuas, ray casting para sliders, y distancia punto-segmento para la tolerancia ε. Descartamos algoritmos como Sweep Line o GJK porque están diseñados para responder preguntas estáticas, no para evaluar en tiempo real qué series cruzan una región que cambia con cada movimiento del ratón.

---

## Slide 13 — WebGPU: ¿Por qué GPU? (1:00)

Para entender por qué WebGPU marca la diferencia, hay que entender el modelo de ejecución. Con Canvas 2D, cada polilínea ocupa el hilo JavaScript: N líneas implica N llamadas secuenciales a `ctx.stroke()`. Con N igual a 50.000, eso bloquea la UI durante segundos.

WebGPU cambia el paradigma: toda la geometría se sube a la GPU una sola vez. Un único *draw call* lanza la GPU, y sus miles de unidades de procesamiento renderizan todas las líneas en paralelo. El hilo JavaScript queda completamente libre para responder a la interacción del usuario. La diferencia es estructural, no incremental.

---

## Slide 14 — WebGPU: Optimizaciones (1:00)

Sobre ese fundamento implementé cuatro optimizaciones específicas. Primero, el **upload único de geometría**: la geometría se sube a la GPU una vez y solo los estilos —colores y alphas— se re-envían cuando cambia la selección. Segundo, un **cache de estilos por frame**: si la selección no ha cambiado entre dos frames, el re-upload se omite completamente. Tercero, **MSAA adaptativo**: el antialiasing se desactiva automáticamente para más de 10.000 líneas, donde no aporta mejora visual perceptible pero cuesta cuatro veces más.

Y el **LOD adaptativo de dos etapas**: la etapa 1 reduce el número de muestras por línea cuando N supera los 20.000. La etapa 2 salta líneas enteras a partir de 60.000. El efecto es visible en el diagrama: de 72.9 millones de fragmentos por frame se baja a 36.5 millones, un 50% menos de carga en el rasterizador.

---

## Slide 15 — Resultados de Rendimiento (1:15)

Los resultados validan las decisiones de diseño. Con 500 y 1.000 series ambos motores son equivalentes: la diferencia es de un 4%, dentro del margen de ruido. La divergencia comienza en 5.000 series: Canvas 2D cae a 16 fps cruzando el umbral de inutilizabilidad, mientras WebGPU se mantiene en 41 fps, todavía en zona visible.

A 100.000 series, Canvas llega a 0.9 fps y WebGPU mantiene 16.7 fps. El factor de mejora es de 19.18 veces. Y lo más relevante: ese factor crece con N. Confirma que la ventaja estructural del pipeline GPU se amplifica con el volumen de datos, exactamente como predice la teoría.

---

## Slide 16 — Validación (1:30)

El sistema ha pasado los ocho escenarios de validación funcional con enfoque de caja negra orientada a propiedades. Para cada tipo de filtro se definió una propiedad matemática que debe cumplirse siempre, se construyó el caso que la hace observable y se verificó que el sistema la satisface. Los ocho: Pass.

En paralelo, el estudio de usabilidad con cinco participantes de perfiles heterogéneos —dos ingenieros informáticos, un ingeniero mecánico, una técnica de radiodiagnóstico y una persona sin formación técnica— obtuvo una puntuación SUS media de 88.0, categoría Excelente según los umbrales de Brooke. Los ítems más valorados fueron la descubribilidad del parámetro ε y la expresividad percibida del sistema combinado, ambos con 4.8 sobre 5.

---

## Slide 17 — Conclusiones (0:45)

El cuadro antes/después resume la transformación. A la izquierda, las limitaciones del sistema de partida. A la derecha, las tres contribuciones que las resuelven. Los números respaldan las tres hipótesis de trabajo: H1 confirmada con respuesta en tiempo real hasta 100.000 series, H2 con un SUS de 88.0, y H3 con un factor de mejora de 19 veces que crece con el volumen de datos.

TimeWidget es ahora un motor de búsqueda visual de patrones.

---

## Slide 18 — Trabajo Futuro + Q&A (0:30)

Como líneas de trabajo futuro identifico cinco direcciones. Ampliar el estudio de usabilidad con más participantes del entorno clínico real, especialmente de la Fundación Canguro. Añadir un indicador visible del motor activo. Medir el rendimiento con GPU dedicada, porque los resultados actuales son conservadores. Adaptar la terminología para perfiles no técnicos. Y como línea más ambiciosa, desplegar la herramienta en un piloto real con los datos de seguimiento de neonatos de la Fundación Canguro en Bogotá.

Muchas gracias. Quedo a su disposición para cualquier pregunta.

---

## Lanzar la presentación

```
npx -y http-server "C:\Users\victo\Desktop\TFG" -p 8765 -c-1
→ http://localhost:8765/presentacionTFG/presentation.html
```

Atajos: `S` vista de orador (notas + cronómetro) · `F` pantalla completa · `?print-pdf` para exportar PDF de respaldo. Tras la slide de "Gracias" hay **5 anexos ocultos** (no cuentan en la numeración, se llega con flecha derecha) que cubren las 6 preguntas previsibles: ① WebGPU vs WebGL · ② rejilla vs quadtree/sweep-line · ③ LOD-corrección + 5 participantes · ④ fallback sin WebGPU · ⑤ escalado BVH con curvas complejas.

---

## Posibles preguntas del tribunal

**¿Por qué WebGPU y no WebGL?**
WebGPU expone acceso directo al pipeline gráfico moderno —Vulkan, Metal, D3D12— con gestión explícita de buffers y pipelines. En WebGL la GPU recibe comandos inmediatos uno a uno; en WebGPU se graban en *command buffers* que se envían en lote, reduciendo el overhead por frame. Además, WebGPU tiene un modelo de seguridad más estricto y está diseñado para las APIs modernas, mientras que WebGL sigue el modelo OpenGL de los 90.

**¿Por qué rejilla uniforme y no quadtree o k-d tree?**
Para el patrón de acceso de TimeWidget —consultas de región rectangular repetidas a muy alta frecuencia sobre datos distribuidos de forma relativamente uniforme— la rejilla uniforme ofrece acceso en O(1) sin recorrer un árbol. Las estructuras jerárquicas son más eficientes cuando los datos tienen distribución muy desigual, que no es nuestro caso. La simplicidad de implementación y mantenimiento también pesó en la decisión.

**¿Qué pasa si WebGPU no está disponible?**
TimeLineOverview actúa como fachada y detecta en tiempo de inicialización si WebGPU está disponible. Si no lo está, cae automáticamente a Canvas 2D sin ningún cambio en el código cliente. El usuario verá una degradación de rendimiento a partir de N=5.000, pero el sistema sigue siendo funcional. Como línea futura está añadir una notificación explícita de qué motor está activo.

**¿Por qué solo 5 participantes en el estudio?**
El estudio fue diseñado como piloto exploratorio con protocolo think-aloud. Nielsen estableció que con 5 participantes se detecta el 85% de los problemas de usabilidad más frecuentes. Los resultados son suficientes para validar la hipótesis H2 cualitativamente. La ampliación a N≥20 con perfil clínico real está planteada como línea futura explícita.

**¿El LOD no afecta a la corrección de las selecciones?**
No. El LOD opera exclusivamente sobre el renderizado: reduce las líneas y puntos dibujados en la GPU. El BVH evalúa siempre el conjunto completo de polilíneas, independientemente de N. Los conteos de selección son siempre exactos. Lo único que varía es la representación visual, que a densidades de 80.000+ series ya tiene un solapamiento superior a 200×, por lo que la reducción no es perceptible para el ojo humano.

**¿Cómo escala el BVH con curvas de referencia complejas?**
Cada segmento de una curva de referencia se registra en las celdas de la rejilla que ocupa, igual que los segmentos de los datos. La actualización incremental tiene coste O(k) donde k es el número de segmentos de la curva modificada. Añadir o eliminar una curva completa de 500 puntos es mucho más rápido que reconstruir la rejilla completa, que sería O(N·m).
