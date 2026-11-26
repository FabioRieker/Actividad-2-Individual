# Checklist de capturas manuales — DI_Actividad2

Estado: todas las capturas están **pendientes**. Ningún resultado está fabricado: marca cada paso cuando lo ejecutes y anota fecha y archivo.

Las capturas manuales con Chrome DevTools son las que cuentan para la rúbrica (el PDF exige consola e inspector visibles). Las capturas automáticas de Playwright son solo apoyo.

## Reglas generales

1. Abre Chrome, ejecuta la app en local (`ionic serve`) y abre DevTools con F12 o Ctrl+Shift+I.
2. Deja visibles la pestaña **Console** y la pestaña **Elements** (inspector) en la misma captura.
3. Para simular móvil: Ctrl+Shift+M (Device toolbar). Viewports:
   - **Pixel 7**: 412 × 915 (preset «Pixel 7» en el desplegable).
   - **iPhone 14**: 390 × 844 (preset «iPhone 14»).
4. Captura de pantalla completa de la ventana del navegador con DevTools abierto. No recortes la consola.
5. Rutas relativas a la raíz del repositorio. Los nombres marcados `(propuesto)` no están fijados en la especificación: confírmalos antes de guardar y luego actualiza el LEDGER.
6. Tras cada captura, anota en el LEDGER la fecha y la ruta real. No cambies el estado a `verificado` tú mismo: lo verifica otra persona.

---

## Tarea 1 — Creación, modelo, tsconfig y ionic serve (RA1, CE1.c/CE1.d)

1. **Terminal de creación (EV-T1-01).** Abre una terminal en la carpeta del proyecto y muestra la salida de `ionic start`. Guarda la captura en `evidence/tarea1/01-terminal-creacion.png`. Guarda también la salida en `evidence/tarea1/ionic-start.log`.
2. **Modelo y servicio tipados (EV-T1-02).** Abre el editor con el modelo `WarehousePackage` y `PackageService` visibles, sin `any`. Guarda en `evidence/tarea1/02-modelo-servicio.png`.
3. **tsconfig strict (EV-T1-03).** Abre `tsconfig.json` con `"strict": true` visible. Guarda en `evidence/tarea1/03-tsconfig-strict.png`.
4. **ionic serve en navegador (EV-T1-04).** Ejecuta `ionic serve`, abre la URL local en Chrome con DevTools (Console y Elements) visibles. Pixel 7 o escritorio. Guarda en `evidence/tarea1/04-ionic-serve.png`.
5. **Logs (EV-T1-05, ya en `implementado`).** Guarda la salida de cada comando (`npx tsc --noEmit`, `npm run build`, `npm test`) en `evidence/tarea1/tsc.log`, `evidence/tarea1/build.log` y `evidence/tarea1/test.log` (nombres propuestos, confirma los existentes).

Fecha ejecución: ____ / Archivos confirmados: ____

## Tarea 2 — Template, viewport móvil, consola y @empty (RA2, CE2.b/CE2.c)

1. **Template HTML (EV-T2-01).** Abre la plantilla HTML del componente en el editor y captúrala. Nombre propuesto: `evidence/tarea2/01-template.png`.
2. **Viewport móvil con estados (EV-T2-02).** Con DevTools en Pixel 7 (412 × 915), muestra los estados de la vista que describe la memoria. Captura en `evidence/tarea2/02-movil-estados.png`. Opcional: repite en iPhone 14 (390 × 844) con el nombre `evidence/tarea2/02b-movil-iphone14.png` (propuesto).
3. **Consola sin warnings (EV-T2-03).** Recarga la app, recorre sus pantallas y muestra la pestaña Console con el filtro de errores y avisos vacío. Captura en `evidence/tarea2/03-consola-limpia.png`.
4. **Estado @empty (EV-T2-04).** Muestra la vista con la lista vacía (sin datos), con DevTools abierto. Captura en `evidence/tarea2/04-empty.png`.

Fecha ejecución: ____ / Archivos confirmados: ____

## Tarea 3 — Componente hijo, integración y acción antes/después (RA3, CE3.b/CE3.c)

1. **Componente hijo (EV-T3-01).** Abre el `.ts` y el `.html` del hijo (`input.required()` y `output()` tipados con `WarehousePackage`). Captura en `evidence/tarea3/01-hijo.png` (propuesto). Indica en el LEDGER la ruta real del componente.
2. **Integración en el padre (EV-T3-02).** Abre la plantilla del padre con el hijo usado (`[input]` y `(output)`) y en DevTools Elements el DOM renderizado. Captura en `evidence/tarea3/02-integracion-padre.png` (propuesto).
3. **Antes de la acción (EV-T3-03).** Con la app en Pixel 7, muestra el estado previo a la acción de la Tarea 3 con la consola visible. Captura en `evidence/tarea3/03-antes.png` (propuesto).
4. **Después de la acción (EV-T3-04).** Ejecuta la misma acción y captura el estado resultante con la consola visible. Captura en `evidence/tarea3/04-despues.png` (propuesto). Usa el mismo viewport y la misma ruta que en el paso 3.

Fecha ejecución: ____ / Archivos confirmados: ____

## Tarea 4 — Lighthouse inicial y final, tabla WCAG y diff (RA4, CE4.a/CE4.b/CE4.c)

1. **Lighthouse inicial (EV-T4-01).** DevTools > pestaña Lighthouse. Marca Mobile y Accessibility, y ejecuta sobre la URL local. Captura del informe en `evidence/tarea4/01-lighthouse-inicial.png` (propuesto). Usa «Save report» para exportar el JSON a `evidence/tarea4/01-lighthouse-inicial.json` (propuesto).
2. **Tabla WCAG (EV-T4-02).** Es un documento, no una captura. Redacta `evidence/tarea4/02-tabla-wcag.md` a partir de los hallazgos del paso 1. No copies puntuaciones que no vengan del informe real.
3. **Lighthouse final (EV-T4-03).** Repite el paso 1 tras las correcciones. Guarda `evidence/tarea4/03-lighthouse-final.png` y `evidence/tarea4/03-lighthouse-final.json` (propuestos).
4. **Diff de accesibilidad (EV-T4-04).** En la terminal, ejecuta `git diff <commit-inicial> -- src > evidence/tarea4/04-diff-a11y.diff` (sustituye `<commit-inicial>` por el commit real antes de ejecutar). Captura la terminal si también se pide visualmente: `evidence/tarea4/04-diff-a11y.png` (propuesto).

Fecha ejecución: ____ / Archivos confirmados: ____

## Tarea 5 — Cadena de custodia de IA (transversal RA1–RA3)

No requiere capturas de pantalla. Son documentos. Comprueba que existen con:

1. `ls -l evidence/tarea5/`
2. Prompt (EV-T5-01): `evidence/tarea5/prompt-ia-rxjs.md`.
3. Respuesta sellada (EV-T5-02): `evidence/tarea5/respuesta-ia-rxjs.md`. **Solo lectura, protegido por hook. No lo edites.**
4. Sello (EV-T5-03): `sha256sum -c evidence/tarea5/SEAL.sha256`. Anota el resultado real. **No edites `SEAL.sha256`.**
5. Análisis crítico firmado por ti (EV-T5-04): `evidence/tarea5/analisis-critico.md` (propuesto).
6. Diff final (EV-T5-05): `git diff <commit-inicial> -- evidence/tarea5 > evidence/tarea5/diff-final.diff` (propuesto).
7. Cita APA 7 de la respuesta de IA en la bibliografía de la memoria: `Anthropic. (2026). ... [Modelo de IA]. Claude Code. <URL o [URL de la conversación no disponible]>`.

Fecha ejecución: ____ / Archivos confirmados: ____

## Extra — Despliegue (EV-DEPLOY-01..03)

1. **Docker (EV-DEPLOY-01).** En la terminal, ejecuta `docker compose config` y captura la salida. Guarda en `evidence/deploy/01-docker-compose-config.png` (propuesto).
2. **Vercel (EV-DEPLOY-02).** Ejecuta `curl -I <URL-Vercel>` y captura las cabeceras. Guarda en `evidence/deploy/02-curl-vercel-headers.png` (propuesto). No hagas push a Vercel sin orden explícita del alumno.
3. **CI verde (EV-DEPLOY-03).** Abre la ejecución del workflow en GitHub Actions con el estado en verde. Guarda en `evidence/deploy/03-ci-verde.png` (propuesto).

Fecha ejecución: ____ / Archivos confirmados: ____
