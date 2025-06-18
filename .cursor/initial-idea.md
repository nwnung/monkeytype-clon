# Nombre del proyecto

Proyecto: monkeytype-clon

## Descripción del proyecto

Un clon 1:1 de la aplicación de test de mecanografía Monkeytype, enfocado en replicar la experiencia de usuario fluida y la funcionalidad principal de la prueba. El proyecto servirá como un caso práctico para implementar un stack tecnológico moderno (Next.js App Router, Supabase, Prisma, TailwindCSS) siguiendo un conjunto estricto de reglas de desarrollo, arquitectura y rendimiento. Se explorarán y aplicarán patrones como SSR, SSG, Server Components, Server Actions y Edge functions donde sea apropiado.

## Público objetivo

- Desarrolladores que desean practicar su velocidad de escritura.
- Entusiastas de la mecanografía que buscan una experiencia de prueba limpia y sin distracciones.
- Estudiantes y profesionales que quieren mejorar su velocidad y precisión de escritura.

## Características deseadas

### Core: Experiencia de Test de Mecanografía

- [ ] Renderizar un bloque de texto aleatorio para que el usuario lo escriba.
- [ ] El texto/palabras para los tests se obtendrá de la base de datos de Supabase.
- [ ] Capturar la entrada del teclado del usuario en tiempo real.
- [ ] Proporcionar feedback visual inmediato para caracteres correctos e incorrectos.
- [ ] Lógica de error: el usuario podrá seguir escribiendo incluso después de cometer un error.
- [ ] Un cursor (caret) que avanza con la escritura y muestra la posición actual.
- [ ] Calcular y mostrar métricas en tiempo real (WPM, precisión) en el cliente.
- [ ] Finalizar el test y mostrar una pantalla de resultados detallados con desglose de errores.
- [ ] El test se reiniciará automáticamente al cambiar una configuración (duración, lista de palabras).

### Cuentas de Usuario y Autenticación (Supabase)

- [ ] Registro de usuario con email y contraseña.
- [ ] Inicio de sesión y cierre de sesión.
- [ ] Protección de rutas de perfil y dashboard con middleware.
- [ ] Utilizar el helper `@supabase/ssr` para manejar la sesión de forma segura.

### Persistencia de Datos y Perfil

- [ ] Guardar los resultados de los tests para usuarios autenticados.
- [ ] Página de perfil de usuario que muestra estadísticas históricas.
- [ ] Visualización del historial de tests con gráficos de progreso.

### Configuración del Test (MVP)

- [ ] Permitir al usuario seleccionar la duración del test (ej: 15, 30, 60 segundos).
- [ ] El único modo de test para el MVP será por **tiempo**.
- [ ] Permitir al usuario seleccionar la **lista de palabras** a utilizar.
- [ ] La selección de configuración se realizará a través de iconos/botones clicables en la interfaz.

## Solicitudes de diseño

- [ ] Implementar una interfaz de usuario minimalista y fluida, inspirada en Monkeytype.
- [ ] Utilizar **Shadcn/UI** para los componentes base.
- [ ] Implementar un tema claro y oscuro funcional con **next-themes**.
- [ ] La interfaz del test debe ser completamente responsive.
- [ ] Las animaciones deben ser fluidas (target 60fps).
- [ ] **[Nuevo]** El cursor (caret) tendrá un único estilo por defecto (ej: línea vertical) y no será personalizable en el MVP.
- [ ] Implementar un estado visual de "Guardando..." después de que el test termina.
- [ ] **[Nuevo]** Mostrar una notificación "toast" no intrusiva si falla el guardado del resultado del test.
- [ ] **[Nuevo] [Accesibilidad]** El área de entrada de texto debe recibir el foco (`focus`) automáticamente al cargar la página y al reiniciar un test.

## Arquitectura y Decisiones Técnicas

- **Componentes:** La interfaz del test será un **Client Component**. Los datos iniciales se pasarán como props desde un **Server Component**.
- **Mutaciones de Datos (Server Actions):**
  - [ ] Todas las escrituras en la DB se realizarán vía **Server Actions**.
  - [ ] La Server Action **recalculará las métricas finales (WPM, precisión)** en el servidor antes de guardarlas.
  - [ ] El tipo de retorno de la acción será `{ success: true }` o `{ success: false, error: ... }`.
- **Seguridad:** Se implementará **Row Level Security (RLS)** en Supabase.
- **Edge Functions:** Se explorará el uso de **Next.js Edge Functions** para obtener las palabras del test.
- **Esquema de Base de Datos (Prisma):**
  - [ ] `WordList`: tabla para categorías (id, nombre, lenguaje).
  - [ ] `Word`: tabla para palabras individuales, con clave foránea a `WordList`.
- **Población de Datos:** Se usará **seeding de Prisma** (`prisma/seed.ts`) para poblar las tablas.
- **[Nuevo] Rendimiento Frontend:**
  - [ ] Cada carácter en el texto del test se renderizará como un componente individual optimizado con `React.memo` para minimizar re-renders y asegurar una experiencia de escritura fluida.

## Otras notas

- El proyecto debe adherirse estrictamente a las `rules.md` proporcionadas.
- **Alcance Excluido (MVP):** Características sociales, modos de test avanzados, personalización extensiva de la UI.
