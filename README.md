# 🌿 Reserva Natural Otomí — Agua Barranca

> Organización dedicada a la preservación del embalse natural y la cultura Otomí en San Jerónimo Acazulco.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

---

## 📖 Descripción

**Agua Barranca** es el sitio web de la Reserva Natural Otomí, una organización comunitaria dedicada a la conservación ecológica y la preservación de la cultura Hñähñu (Otomí) en la zona de San Jerónimo Acazulco, México. El sitio funciona como punto central de información, difusión de eventos, y herramientas educativas para la comunidad y visitantes.

## ✨ Funcionalidades

### 🏠 Página Principal
- **Hero** — Sección de bienvenida con imagen panorámica de la reserva y llamados a la acción.
- **Quiénes Somos** — Presentación de la misión y visión de la organización.
- **Destacados (Highlights)** — Tarjetas interactivas divididas en dos secciones:
  - *Raíces* — Lengua Hñähñu, gastronomía ancestral, medicina tradicional.
  - *Preservación* — Biodiversidad, reforestación, conservación del agua.
- **Eventos** — Calendario y vista de tarjetas de eventos comunitarios con categorías: Naturaleza, Cultura, Talleres.
- **Testimonios** — Reseñas de participantes en eventos y actividades.
- **Footer** — Información de contacto, mapa de ubicación (Google Maps), y enlaces a redes sociales.

### 📚 Aprender Otomí (`/aprender-otomi`)
Herramienta educativa interactiva para aprender vocabulario en lengua Otomí (Hñähñu) mediante escenarios visuales. Cada escenario contiene elementos interactivos con palabras en Otomí y su traducción al español.

### 🔤 Traductor (`/traductor`)
Traductor Español ↔ Otomí basado en un diccionario local (`data/es-oto.txt`) con más de 100,000 caracteres de entradas de vocabulario.

### 🔧 Panel de Administración (`/admin`)
Panel protegido para gestión de contenido:
- **Gestión de Eventos** — Crear, editar y eliminar eventos con categorías, imágenes y enlaces de registro.
- **Gestión de Testimonios** — Administrar reseñas vinculadas a eventos.
- **Gestión de Highlights** — Administrar tarjetas de destacados (raíces y preservación).
- **Escenarios Otomí** — Crear y administrar escenarios y elementos interactivos para la herramienta de aprendizaje.
- **Diccionario** — Gestión del diccionario Español-Otomí.
- **Uso de Almacenamiento** — Monitoreo del uso de almacenamiento en Supabase Storage.

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| [Next.js 16](https://nextjs.org/) | Framework React con App Router y SSR/SSG |
| [React 19](https://react.dev/) | Librería de UI |
| [TypeScript 5](https://www.typescriptlang.org/) | Tipado estático |
| [Tailwind CSS 4](https://tailwindcss.com/) | Estilos utilitarios |
| [Supabase](https://supabase.com/) | Base de datos PostgreSQL, autenticación, y almacenamiento de archivos |
| [Montserrat](https://fonts.google.com/specimen/Montserrat) | Tipografía principal (via `next/font`) |

---

## 📁 Estructura del Proyecto

```
agua-barranca/
├── data/
│   └── es-oto.txt              # Diccionario Español-Otomí
├── public/
│   └── images/                  # Imágenes estáticas (hero, tarjetas, etc.)
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Layout raíz (Montserrat font, metadata SEO)
│   │   ├── page.tsx             # Página principal
│   │   ├── globals.css          # Estilos globales y variables CSS
│   │   ├── admin/
│   │   │   ├── page.tsx         # Panel de administración
│   │   │   └── components/      # Componentes del panel admin
│   │   │       ├── DictionaryManagerPanel.tsx
│   │   │       ├── EscenariosPanel.tsx
│   │   │       ├── StoragePreviewBar.tsx
│   │   │       ├── TestimonialsPanel.tsx
│   │   │       └── UsagePanel.tsx
│   │   ├── aprender-otomi/
│   │   │   ├── page.tsx         # Página de aprendizaje Otomí
│   │   │   ├── layout.tsx       # Layout del módulo
│   │   │   ├── components/      # Componentes de escenarios interactivos
│   │   │   └── data/            # Datos estáticos de escenarios
│   │   ├── traductor/
│   │   │   └── page.tsx         # Traductor Español-Otomí
│   │   └── api/                 # API Routes (admin y público)
│   ├── components/              # Componentes compartidos
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── QuienesSomos.tsx
│   │   ├── Highlights.tsx
│   │   ├── SectionCard.tsx
│   │   ├── Eventos.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Traductor.tsx
│   │   └── Footer.tsx
│   └── lib/
│       └── supabase.ts          # Cliente Supabase y funciones de acceso a datos
├── supabase/
│   ├── schema.sql               # Schema completo de la base de datos
│   └── migrations/              # Migraciones de base de datos
├── package.json
├── next.config.ts               # Configuración de Next.js (patrones de imágenes remotas)
├── tsconfig.json
└── eslint.config.mjs
```

---

## 🗄️ Base de Datos (Supabase)

### Tablas

| Tabla | Descripción |
|---|---|
| `events` | Eventos comunitarios con categorías (naturaleza, cultura, talleres), fechas, imágenes y enlaces de registro |
| `testimonials` | Testimonios de participantes, vinculados a eventos |
| `highlight_cards` | Tarjetas de contenido destacado, organizadas por sección (raíces / preservación) |
| `otomi_scenarios` | Escenarios visuales para la herramienta de aprendizaje de Otomí |
| `otomi_elements` | Elementos interactivos (palabras Otomí/Español) dentro de cada escenario |

### Almacenamiento

Se utiliza **Supabase Storage** con un bucket público `highlight-images` para almacenar imágenes subidas desde el panel de administración.

### Seguridad (RLS)

- **Lectura pública** habilitada en todas las tablas para que los visitantes puedan ver el contenido.
- **Escritura** controlada por políticas RLS para operaciones de administración.

---

## 🚀 Primeros Pasos

### Prerrequisitos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/) (incluido con Node.js)
- Una cuenta y proyecto en [Supabase](https://supabase.com/)

### 1. Clonar el repositorio

```bash
git clone https://github.com/D4nyArt/reserva-otomi.git
cd reserva-otomi
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

> 💡 Puedes encontrar estas credenciales en tu **Supabase Dashboard** → **Settings** → **API**.

### 4. Configurar la base de datos

Aplica el schema inicial en tu proyecto de Supabase:

```bash
# Si usas Supabase CLI
npx supabase db push

# O ejecuta el contenido de supabase/schema.sql directamente
# en el SQL Editor de tu dashboard de Supabase
```

Asegúrate de crear un **bucket público** llamado `highlight-images` en **Supabase Dashboard** → **Storage** → **New Bucket**.

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta ESLint |

---

## 🌐 Despliegue

El método recomendado para desplegar esta aplicación es [Vercel](https://vercel.com/):

1. Conecta tu repositorio de GitHub en el dashboard de Vercel.
2. Configura las variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3. Vercel detectará automáticamente la configuración de Next.js y desplegará la aplicación.

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m 'Agrega nueva funcionalidad'`).
4. Sube tus cambios (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.


<p align="center">
  Hecho con 💚 para la preservación de la cultura Otomí y el medio ambiente.
</p>
