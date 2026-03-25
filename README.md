
=======
# BTG Fondos — Prueba Técnica Front-End

Aplicación web interactiva para la gestión de Fondos de Pensiones Voluntarias (FPV) y Fondos de Inversión Colectiva (FIC) para clientes BTG Pactual.

Construida con **Angular 19+** (standalone components), manejo de estado con observables.

---

## Requisitos previos

Asegúrate de tener instalado lo siguiente antes de continuar:

| Herramienta | Versión mínima | Verificar con |
|-------------|---------------|---------------|
| Node.js | 22.14.0 o superior | `node -v` |
| npm | 10.9.2 o superior | `npm -v` |
| Angular CLI | 19.2.22 o superior | `ng version` |

Si no tienes Angular CLI instalado:

```bash
npm install -g @angular/cli
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/jhoanmartinez/manejo-de-fondos.git
cd manejo-de-fondos
```

### 2. Instalar dependencias

```bash
npm install
```

---

## Ejecución en desarrollo

```bash
ng serve
```

Luego abre tu navegador en:
>>>>>>> 05aa2f0 (Revise README installation instructions and content)

```
manejo-de-fondos
├─ .editorconfig
├─ angular.json
├─ package-lock.json
├─ package.json
├─ public
│  └─ favicon.ico
├─ README.md
├─ src
│  ├─ app
│  │  ├─ app.component.css
│  │  ├─ app.component.html
│  │  ├─ app.component.spec.ts
│  │  ├─ app.component.ts
│  │  ├─ app.config.ts
│  │  ├─ app.routes.ts
│  │  ├─ core
│  │  └─ features
│  │     ├─ dashboard
│  │     │  ├─ dashboard.route.ts
│  │     │  └─ pages
│  │     │     └─ dashboard-layout
│  │     │        ├─ dashboard-layout.component.css
│  │     │        ├─ dashboard-layout.component.html
│  │     │        └─ dashboard-layout.component.ts
│  │     └─ home
│  │        ├─ components
│  │        ├─ home.route.ts
│  │        └─ pages
│  │           └─ home-layout
│  │              ├─ home-layout.component.css
│  │              ├─ home-layout.component.html
│  │              └─ home-layout.component.ts
│  ├─ index.html
│  ├─ main.ts
│  └─ styles.css
├─ tsconfig.app.json
├─ tsconfig.json
└─ tsconfig.spec.json

<<<<<<< HEAD
```
=======
---

## Estructura del proyecto


```
manejo-de-fondos
├─ .editorconfig
├─ angular.json
├─ package-lock.json
├─ package.json
├─ public
│  └─ favicon.ico
├─ README.md
├─ src
│  ├─ app
│  │  ├─ app.component.css
│  │  ├─ app.component.html
│  │  ├─ app.component.spec.ts
│  │  ├─ app.component.ts
│  │  ├─ app.config.ts
│  │  ├─ app.routes.ts
│  │  ├─ features
│  │  │  ├─ dashboard
│  │  │  │  ├─ dashboard.route.ts
│  │  │  │  └─ pages
│  │  │  │     ├─ dashboard-layout
│  │  │  │     │  ├─ dashboard-layout.component.css
│  │  │  │     │  ├─ dashboard-layout.component.html
│  │  │  │     │  └─ dashboard-layout.component.ts
│  │  │  │     ├─ fondos-page
│  │  │  │     │  ├─ fondos-page.component.css
│  │  │  │     │  ├─ fondos-page.component.html
│  │  │  │     │  ├─ fondos-page.component.spec.ts
│  │  │  │     │  └─ fondos-page.component.ts
│  │  │  │     └─ historial-page
│  │  │  │        ├─ historial-page.component.css
│  │  │  │        ├─ historial-page.component.html
│  │  │  │        ├─ historial-page.component.spec.ts
│  │  │  │        └─ historial-page.component.ts
│  │  │  └─ home
│  │  │     ├─ home.route.ts
│  │  │     └─ pages
│  │  │        └─ home-layout
│  │  │           ├─ home-layout.component.css
│  │  │           ├─ home-layout.component.html
│  │  │           └─ home-layout.component.ts
│  │  └─ shared
│  │     ├─ components
│  │     │  └─ sidebar
│  │     │     ├─ sidebar.component.css
│  │     │     ├─ sidebar.component.html
│  │     │     ├─ sidebar.component.spec.ts
│  │     │     └─ sidebar.component.ts
│  │     └─ services
│  │        └─ fondos.service.ts
│  ├─ index.html
│  ├─ main.ts
│  └─ styles.css
├─ tsconfig.app.json
├─ tsconfig.json
└─ tsconfig.spec.json

```

---

## Funcionalidades

| # | Funcionalidad | Descripción |
|---|--------------|-------------|
| 1 | Visualizar fondos | Lista los 5 fondos disponibles con nombre, categoría y monto mínimo |
| 2 | Suscribirse a un fondo | Valida monto mínimo y saldo disponible antes de confirmar |
| 3 | Cancelar suscripción | Reintegra el monto al saldo del usuario |
| 4 | Historial de transacciones | Registro completo con fechas, montos y variación de saldo |
| 5 | Canal de notificación | Selección de Email o SMS al suscribirse |
| 6 | Mensajes de error | Feedback claro ante saldo insuficiente o formulario inválido |

---

## Fondos disponibles

| ID | Nombre | Monto mínimo | Categoría |
|----|--------|-------------|-----------|
| 1 | FPV_BTG_PACTUAL_RECAUDADORA | COP $75.000 | FPV |
| 2 | FPV_BTG_PACTUAL_ECOPETROL | COP $125.000 | FPV |
| 3 | DEUDAPRIVADA | COP $50.000 | FIC |
| 4 | FDO-ACCIONES | COP $250.000 | FIC |
| 5 | FPV_BTG_PACTUAL_DINAMICA | COP $100.000 | FPV |

> El usuario inicia con un saldo de **COP $500.000**. No se requiere autenticación.

## Scripts disponibles

```bash
ng serve          # Servidor de desarrollo en localhost:4200
```

---

## Notas

- No requiere backend, base de datos ni autenticación.
- El estado se reinicia al recargar la página (comportamiento esperado para un mock local).
- Diseño responsivo: en pantallas menores a 900px el sidebar se convierte en barra de navegación superior.
>>>>>>> 05aa2f0 (Revise README installation instructions and content)
