# Plan de Implementación

## Fase 1: Configuración del Proyecto y Base de Datos

- [x] Paso 1: Inicialización del Proyecto y Dependencias

  - **Tarea**: Crear un nuevo proyecto Next.js. Instalar y configurar TailwindCSS. Instalar todas las dependencias necesarias: Prisma, cliente de Supabase, Shadcn/UI, next-themes, react-hook-form, zod, etc. Crear la estructura de directorios inicial.
  - **Archivos**:
    - `package.json`: Actualizar con todas las dependencias.
    - `tailwind.config.ts`: Configurar con los colores y fuentes del sistema de diseño.
    - `postcss.config.js`: Configuración estándar.
    - `next.config.mjs`: Configuración básica de Next.js.
    - `styles/globals.css`: Incluir las directivas de Tailwind y variables de color CSS.
    - `.env.local.example`: Definir las variables de entorno necesarias.
  - **Dependencias del Paso**: Ninguna.
  - **Instrucciones del Usuario**:
    1.  Ejecuta `npx create-next-app@lates . monkeytype-clon --typescript --tailwind --eslint`.
    2.  Ejecuta `npm i prisma @prisma/client supabase @supabase/ssr @supabase/auth-helpers-nextjs recharts chart.js react-chartjs-2 next-themes lucide-react class-variance-authority clsx tailwind-merge zod react-hook-form @hookform/resolvers/zod`.
    3.  Ejecuta `npm i -D @types/node ts-node`.
    4.  Crea un archivo `.env.local` a partir de `.env.local.example` y rellena las URL de tu proyecto Supabase.
    5.  Ejecuta `npx shadcn-ui@latest init` y sigue las instrucciones para configurar la CLI.

- [x] Paso 2: Esquema de Base de Datos y Seeding

  - **Tarea**: Definir el esquema completo de la base de datos en `schema.prisma`. Crear un script de seeding para poblar la base de datos con listas de palabras iniciales (p. ej., "english_200"). Configurar el cliente de Prisma.
  - **Archivos**:
    - `prisma/schema.prisma`: Implementar el esquema completo como se define en la especificación.
    - `prisma/seed.ts`: Escribir un script que cree una `WordList` y varias `Word` asociadas.
    - `package.json`: Añadir el script `prisma.seed`.
    - `lib/db.ts`: Crear y exportar una instancia global del cliente de Prisma.
  - **Dependencias del Paso**: Paso 1.
  - **Instrucciones del Usuario**:
    1.  Ejecuta `npx prisma db push` para sincronizar tu esquema con la base de datos de Supabase.
    2.  Ejecuta `npx prisma db seed` para poblar la base de datos.

- [x] Paso 3: Políticas de Seguridad de la Base de Datos (RLS)

  - **Tarea**: Implementar las políticas de seguridad a nivel de fila (RLS) para la tabla `TestResult` para garantizar que los usuarios solo puedan acceder y escribir sus propios datos.
  - **Archivos**: Ninguno (es una operación en la base de datos).
  - **Dependencias del Paso**: Paso 2.
  - **Instrucciones del Usuario**:

    1.  Ve al editor SQL de tu proyecto Supabase.
    2.  Ejecuta el siguiente código SQL:

        ```sql
        -- Habilitar RLS para la tabla TestResult
        ALTER TABLE "TestResult" ENABLE ROW LEVEL SECURITY;

        -- Los usuarios pueden ver sus propios resultados
        CREATE POLICY "Allow users to read their own test results"
        ON "TestResult" FOR SELECT
        USING (auth.uid() = "userId");

        -- Los usuarios pueden insertar resultados para sí mismos
        CREATE POLICY "Allow users to insert their own test results"
        ON "TestResult" FOR INSERT
        WITH CHECK (auth.uid() = "userId");
        ```

## Fase 2: Autenticación y Layout Básico

- [x] Paso 4: Configuración de la Autenticación de Supabase

  - **Tarea**: Configurar los helpers de `@supabase/ssr` para manejar la autenticación en el cliente, servidor y middleware. Crear el middleware para proteger rutas.
  - **Archivos**:
    - `lib/supabase.ts`: Crear los dos clientes (cliente y servidor) usando `createBrowserClient` y `createServerComponentClient` de `@supabase/ssr`.
    - `middleware.ts`: Implementar el middleware que usa `createMiddlewareClient` para refrescar la sesión del usuario en cada petición y proteger las rutas definidas en el `matcher`.
  - **Dependencias del Paso**: Paso 1.

- [] Paso 5: Layout Principal y Sistema de Temas

  - **Tarea**: Crear el layout raíz de la aplicación, incluyendo el `ThemeProvider` para el cambio de tema claro/oscuro. Instalar y crear un componente `Header` básico y un `ThemeToggle`.
  - **Archivos**:
    - `app/(main)/layout.tsx`: Definir el layout principal, envolviendo `children` con `ThemeProvider`.
    - `components/layout/ThemeProvider.tsx`: Componente cliente para `next-themes`.
    - `components/layout/Header.tsx`: Un header simple con el título del proyecto.
    - `components/layout/ThemeToggle.tsx`: Un botón que cambia entre tema claro y oscuro usando `useTheme`.
    - `components/ui/button.tsx`: Instalar el componente Button de Shadcn.
    - `components/ui/dropdown-menu.tsx`: Instalar el componente DropdownMenu de Shadcn (para el toggle).
  - **Dependencias del Paso**: Paso 1.
  - **Instrucciones del Usuario**:
    1.  Ejecuta `npx shadcn-ui@latest add button dropdown-menu`.

- [] Paso 6: Páginas y Formularios de Autenticación

  - **Tarea**: Crear las páginas de Iniciar Sesión (`/login`) y Registrarse (`/signup`). Implementar los formularios usando `react-hook-form` y `zod` para la validación, y llamar a los métodos de autenticación de Supabase en el envío.
  - **Archivos**:
    - `app/(auth)/login/page.tsx`: Componente de cliente con el formulario de inicio de sesión.
    - `app/(auth)/signup/page.tsx`: Componente de cliente con el formulario de registro.
    - `app/(auth)/layout.tsx`: Un layout simple para centrar los formularios de autenticación.
    - `components/ui/input.tsx`: Instalar el componente Input de Shadcn.
    - `components/ui/label.tsx`: Instalar el componente Label de Shadcn.
    - `components/ui/card.tsx`: Instalar el componente Card de Shadcn.
  - **Dependencias del Paso**: Paso 4, Paso 5.
  - **Instrucciones del Usuario**:
    1.  Ejecuta `npx shadcn-ui@latest add input label card`.

- [ ] Paso 7: Actualizar Header con Estado de Autenticación
  - **Tarea**: Modificar el componente `Header` para que muestre condicionalmente los enlaces "Login"/"Signup" o "Profile" y un botón de "Logout" basado en el estado de la sesión del usuario.
  - **Archivos**:
    - `components/layout/Header.tsx`: Usar el cliente de Supabase para obtener la sesión y renderizar condicionalmente. El componente deberá ser asíncrono.
    - `actions/auth.ts`: Crear server actions para `login`, `signup`, y `logout` que envuelvan las llamadas de Supabase.
  - **Dependencias del Paso**: Paso 6.

## Fase 3: Implementación del Test de Mecanografía

- [ ] Paso 8: Página Principal y Carga Inicial de Palabras

  - **Tarea**: Crear la página de inicio `app/(main)/page.tsx` como un Server Component que obtiene el conjunto inicial de palabras de la base de datos (usando el cliente Prisma) y las pasa como props a un componente de cliente contenedor.
  - **Archivos**:
    - `app/(main)/page.tsx`: Server Component que llama a una función para obtener palabras y renderiza `TypingTestContainer`.
    - `lib/words.ts`: Crear una función `getWords(wordlist: string)` que obtenga ~200 palabras aleatorias de una lista.
    - `components/core/TypingTestContainer.tsx`: Crear el esqueleto del componente (Client Component) que recibe `initialWords`.
  - **Dependencias del Paso**: Paso 2, Paso 5.

- [ ] Paso 9: Renderizado Estático del Test y Estilos

  - **Tarea**: Implementar el renderizado visual del test. Mapear las palabras y caracteres usando los componentes `Character` (memoizado) y `Caret`. Aplicar los estilos correctos para los estados `pending`, `correct`, `incorrect`.
  - **Archivos**:
    - `components/core/TypingTestContainer.tsx`: Añadir la lógica de renderizado para mostrar las palabras.
    - `components/core/Character.tsx`: Componente `<span>` memoizado que aplica clases de CSS basadas en el prop `status`.
    - `components/core/Caret.tsx`: Componente para el cursor, inicialmente posicionado al principio.
    - `lib/types.ts`: Definir los tipos de TypeScript para el estado de los caracteres y del test.
  - **Dependencias del Paso**: Paso 8.

- [ ] Paso 10: Gestión de Estado e Interacción del Teclado

  - **Tarea**: Implementar la lógica principal del test. Usar un `useReducer` en `TypingTestContainer` para manejar el estado complejo del test. Añadir un listener de `keydown` para procesar la entrada del usuario (caracteres, backspace, espacio).
  - **Archivos**:
    - `components/core/TypingTestContainer.tsx`: Introducir `useReducer` y el listener `useEffect` para `keydown`. Implementar la lógica que actualiza el estado de los caracteres y la posición del cursor en respuesta a la entrada. El área debe tener `autoFocus`.
  - **Dependencias del Paso**: Paso 9.

- [ ] Paso 11: Temporizador, Cálculo de Métricas y Finalización

  - **Tarea**: Añadir la lógica del temporizador que se inicia cuando el usuario empieza a escribir. Calcular y mostrar WPM y precisión en tiempo real en la UI. Detener el test cuando el tiempo llega a cero y cambiar el estado a `finished`.
  - **Archivos**:
    - `components/core/TypingTestContainer.tsx`: Añadir estado para el temporizador, WPM y precisión. Implementar `useEffect` para el `setInterval` del temporizador. Calcular métricas en cada `keystroke`.
    - `lib/utils.ts`: Añadir funciones puras para calcular `wpm` y `accuracy`.
  - **Dependencias del Paso**: Paso 10.

- [ ] Paso 12: Pantalla de Resultados y Server Action para Guardar
  - **Tarea**: Crear el componente de `Results` que se muestra cuando el test finaliza. Crear la Server Action `saveTestResult` que recalcula las métricas en el servidor y las guarda en la base de datos. Conectar el `TypingTestContainer` para que llame a esta acción al finalizar el test.
  - **Archivos**:
    - `components/core/Results.tsx`: Componente que muestra las métricas finales (WPM, precisión).
    - `actions/test.ts`: Crear la Server Action `saveTestResult` como se especifica (obtiene sesión, recalcula métricas, usa Prisma para crear `TestResult`).
    - `components/core/TypingTestContainer.tsx`: Cuando el estado es `finished`, renderizar `<Results />` y llamar a `saveTestResult`. Manejar el estado de "Guardando..." y mostrar un toast en caso de error.
    - `components/ui/toast.tsx` y `components/ui/use-toast.ts`: Instalar los componentes de Toast de Shadcn.
  - **Dependencias del Paso**: Paso 11, Paso 3.
  - **Instrucciones del Usuario**:
    1.  Ejecuta `npx shadcn-ui@latest add toast`.

## Fase 4: Características Adicionales y Pruebas

- [ ] Paso 13: Página de Perfil de Usuario

  - **Tarea**: Crear la página de perfil `/profile` que obtiene y muestra el historial de tests del usuario autenticado.
  - **Archivos**:
    - `app/profile/page.tsx`: Server Component que obtiene la sesión y recupera los `TestResult` del usuario desde la base de datos.
    - `components/core/ProfileDashboard.tsx`: Client Component que recibe el historial como prop y lo muestra en una tabla y/o como estadísticas agregadas.
    - `components/ui/table.tsx`: Instalar el componente Table de Shadcn.
  - **Dependencias del Paso**: Paso 12, Paso 7.
  - **Instrucciones del Usuario**:
    1.  Ejecuta `npx shadcn-ui@latest add table`.

- [ ] Paso 14: Gráfico de Historial en el Perfil

  - **Tarea**: Integrar una librería de gráficos (p. ej., `recharts`) para visualizar el progreso del WPM del usuario a lo largo del tiempo en la página de perfil.
  - **Archivos**:
    - `components/core/ProfileChart.tsx`: Client Component que usa `recharts` para renderizar un gráfico de líneas con los datos del historial.
    - `components/core/ProfileDashboard.tsx`: Importar y usar el `ProfileChart`.
  - **Dependencias del Paso**: Paso 13.

- [ ] Paso 15: Configuración del Test

  - **Tarea**: Añadir controles a la UI en la página principal para permitir al usuario seleccionar la duración del test (15, 30, 60s). Al cambiar una opción, el test debe reiniciarse.
  - **Archivos**:
    - `components/core/TestConfigurator.tsx`: Componente con botones para seleccionar la duración.
    - `app/(main)/page.tsx`: Usar `useSearchParams` para manejar el estado de la configuración en la URL.
    - `components/core/TypingTestContainer.tsx`: Recibir la configuración como props y reiniciar el estado (`dispatch` a una acción de `RESET`) cuando cambien.
  - **Dependencias del Paso**: Paso 11.

- [ ] Paso 16: Pruebas Unitarias

  - **Tarea**: Configurar Jest y React Testing Library. Escribir pruebas unitarias para las funciones de utilidad críticas, como las de cálculo de métricas.
  - **Archivos**:
    - `jest.config.ts`, `jest.setup.ts`: Archivos de configuración de Jest.
    - `__tests__/utils.test.ts`: Escribir casos de prueba para `calculateWPM` y `calculateAccuracy`.
  - **Dependencias del Paso**: Paso 11.

- [ ] Paso 17: Pruebas End-to-End
  - **Tarea**: Configurar Playwright. Escribir una prueba E2E para el flujo de trabajo más crítico: completar un test como invitado.
  - **Archivos**:
    - `playwright.config.ts`: Archivo de configuración de Playwright.
    - `e2e/guest-test.spec.ts`: Escribir el script de prueba que navega a la página, simula la escritura y verifica que se muestren los resultados.
  - **Dependencias del Paso**: Paso 12.
