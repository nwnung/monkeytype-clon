# Workflow para GitHub MCP en Cursor

## 1. Commits

Usa el siguiente formato para hacer commits:

Haz commit a [repositorio] en la rama [rama] con el mensaje: [tipo: descripción]

Ejemplo:
Haz commit a mi-proyecto en la rama feature/login con el mensaje: [feature: agrega pantalla de login con validación de usuario]

text

Prefijos recomendados:

- feature: para nuevas funcionalidades
- fix: para correcciones de bugs
- docs: para documentación

## 2. Pull Requests (PR)

Formato para crear PRs:

Crea un Pull Request en [repositorio] de la rama [rama origen] a la rama [rama destino]. Título: [título]. Descripción: [descripción].

Ejemplo:
Crea un PR en mi-proyecto de feature/login a main con el título "Agrega pantalla de login" y la descripción "Implementa UI y validación de usuario".

text

Puedes pedir asignar reviewers, etiquetas o checklist.

## 3. Otras acciones útiles

- Listar PRs abiertos:  
  `Muéstrame mis PRs abiertos en [repositorio]`

- Aprobar PR y comentar:  
  `Aprueba el PR #[número] en [repositorio] y comenta "LGTM"`

- Mergear PR:  
  `Haz merge del PR #[número] en [repositorio] a la rama [rama]`

- Crear issue:  
  `Crea un issue en [repositorio] titulado "[título]" con la descripción "[detalle]"`

- Asignar issue o PR:  
  `Asigna el issue #[número] en [repositorio] a [usuario]`

- Cambiar de rama:  
  `Cambia a la rama [nombre] en [repositorio]`

## 4. Flujo típico

1. Haz cambios en el código.
2. Haz commit con el formato indicado.
3. Crea PR para integrar cambios.
4. Revisa, aprueba y mergea PRs.
5. Gestiona issues y ramas desde Cursor.

---

Este archivo debe adjuntarse en cada llamada para que MCP use estas reglas sin necesidad de repetirlas.
