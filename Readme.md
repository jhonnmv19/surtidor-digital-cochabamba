# ⛽ Sistema Digital de Control y Gestión para Surtidor de Gasolina
### *Estación de Servicio "El Surtidor Cochabambino"*

[![Vercel Deployment](https://img.shields.io/badge/Demo%20en%20L%C3%ADnea-Vercel-000000?style=for-the-badge&logo=vercel)](https://surtidor-digital-cochabamba.vercel.app/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa)](https://surtidor-digital-cochabamba.vercel.app/)
[![Supabase Engine](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20Realtime-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)

Un sistema industrial multiplataforma (PWA) de monitoreo en tiempo real, gestión transaccional de combustibles y control de inventarios. El proyecto combina fundamentos de **Sistemas Digitales** (lógica combinacional, mapas de Karnaugh y decodificadores) con una arquitectura moderna basada en el patrón **Modelo-Vista-Controlador (MVC)**, navegación por voz mediante la **Web Speech API**, almacenamiento en tiempo real con **Supabase (PostgreSQL)** y control de accesos auditados.

🔗 **Prototipo / Demo interactivo:** [https://uxpilot.ai/s/a59911d947824f8b6347613638a7b69e](https://uxpilot.ai/s/a59911d947824f8b6347613638a7b69e)

---

## 📸 Evidencia Visual del Proyecto

| Vista / Componente | Captura | Descripción |
| :--- | :---: | :--- |
| **Dashboard SCADA** | ![Dashboard SCADA](imagen/daboarh.png) | Monitoreo en tiempo real de niveles en tanques, estado de surtidores y alertas críticas inmediatas. |
| **Tabla de Combustibles** | ![Tabla Tipos de Combustible](imagen/captabla.png) | Registro y verificación del catálogo de combustibles (`tipo_combustible`) sincronizado con Supabase. |
| **Esquema de Base de Datos** | ![Creación de Tablas Supabase](imagen/creacion_de_tablas.png) | Creación e integración del esquema relacional y triggers mediante scripts DDL. |

---

## 📋 Tabla de Contenido
1. [Objetivos y Características Clave](#-objetivos-y-características-clave)
2. [Arquitectura & Funcionalidades](#-arquitectura--funcionalidades)
3. [Estructura del Proyecto (Patrón MVC)](#-estructura-del-proyecto-patrón-mvc)
4. [Lógica de Sistemas Digitales & Circuitos](#-lógica-de-sistemas-digitales--circuitos)
5. [Base de Datos (Supabase / PostgreSQL)](#-base-de-datos-supabase--postgresql)
6. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
7. [Instalación y Configuración](#-instalación-y-configuración)

---

## 📌 Objetivos y Características Clave

- **Autenticación y Sesiones Seguras:** Control de acceso por roles (Operador / Administrador) con pantalla de login y disparo de alertas automáticas SCADA al detectar niveles críticos durante el ingreso.
- **Navegación por Voz (Web Speech API):** Interacción *hands-free* para operarios mediante comandos de voz que permiten desplazarse rápidamente entre módulos (tanques, registro de eventos, ventas).
- **Compatibilidad PWA (Progressive Web App):** Instalación en cualquier dispositivo (Android, iOS, PC) gracias a `manifest.json` y el Service Worker `sw.js`.
- **Gestión Avanzada de Tanques y Surtidores:**
  - Control de surtidores (activación, inactivación y modo mantenimiento).
  - Monitoreo de tanques con catálogo diversificado (*Gasolina Especial, Reserva, Nocturno Especial, Premium Plus, Auxiliar, Ultra, Super 91*, etc.).
- **Registro e Historial Transaccional de Ventas:**
  - Formulario en tiempo real para despacho de combustibles por turno.
  - Filtros en historial por término de búsqueda, tipo de combustible, método de pago y rango de fechas.
  - Exportación de reportes directos a **PDF** y **Excel**.
- **Panel de Alertas SCADA:** Detección de niveles crítico, bajo y medio con opción de resolución individual o masiva.
- **Reportes Operativos y Financieros:** Análisis de recaudación total, volumen despachado, transacciones, ticket promedio, comportamiento de los últimos 7 días y análisis anual.
- **Auditoría de Accesos (`visitaModel`):** Contador de accesos persistente en tiempo real que registra cada ingreso al sistema (ya sea desplegado en Vercel o en entorno local).

---

## 🧠 Lógica de Sistemas Digitales & Circuitos

El nivel de combustible en cada tanque de la estación se digitaliza mediante un par de sensores binarios $S_1 S_0$:

### Tabla de Verdad de Sensores y Estados

| $S_1$ | $S_0$ | Nivel (%) | Estado del Tanque | LED Indicador SCADA |
| :---: | :---: | :---: | :---: | :---: |
| `0` | `0` | 0% | Crítico / Vacío | 🔴 **Rojo** |
| `0` | `1` | 25% | Nivel Bajo | 🟡 **Amarillo** |
| `1` | `0` | 50% | Nivel Medio | 🔵 **Azul** |
| `1` | `1` | 100% | Nivel Óptimo | 🟢 **Verde** |

### Ecuaciones Lógicas Simplificadas (Mapas de Karnaugh)
Para la activación automática de las alarmas en el panel SCADA mediante compuertas lógicas:
- **Alerta Crítica / LED Rojo ($F_{\text{Rojo}}$):** $\bar{S_1} \cdot \bar{S_0}$
- **Alerta Preventiva / LED Amarillo ($F_{\text{Amarillo}}$):** $\bar{S_1} \cdot S_0$

---

## 📁 Estructura del Proyecto (Patrón MVC)

El proyecto está organizado siguiendo una separación estricta de responsabilidades (**Model-View-Controller**):

```text
C:\sistem_surtidor/
├── index.html                  # Punto de entrada de la Single Page Application (SPA)
├── manifest.json               # Configuración PWA (Nombre, iconos, tema)
├── sw.js                       # Service Worker para caché offline e instalación PWA
├── package.json                # Gestión de dependencias y scripts
├── tailwind.config.js          # Configuración de estilos Tailwind CSS
├── vercel.json                 # Reglas de despliegue en Vercel
├── script.sql                  # DDL, creación de tablas, triggers y seeding en Supabase
├── README.md                   # Documentación oficial del repositorio
│
├── config/                     # Configuración de servicios externos
│   ├── scadaAlert.js           # Lógica para detección e inhibición de alertas SCADA
│   └── supabase.js             # Conexión e inicialización del cliente Supabase
│
├── controllers/                # Orquestadores de lógica de negocio y eventos
│   ├── alertaController.js     # Gestión y resolución de alertas
│   ├── authController.js       # Manejo de sesiones y validación de login
│   ├── configuracionController.js # Lógica de configuración de precios y capacidad
│   ├── mainController.js       # Enrutador principal de la aplicación
│   ├── reporteController.js    # Generación y exportación de reportes (PDF/Excel)
│   ├── surtidorController.js   # Estado y mantenimiento de surtidores
│   ├── tanqueController.js     # Monitoreo de niveles e inventarios
│   ├── usuarioController.js    # CRUD y validación de usuarios
│   ├── ventaController.js      # Registro y procesamiento de despacho
│   └── voiceController.js      # Interpretación de comandos de la Web Speech API
│
├── models/                     # Capa de datos e integración directa con Supabase
│   ├── alertaModel.js          # Consultas y actualización de alertas
│   ├── authModel.js            # Validación de usuarios en base de datos
│   ├── configuracionModel.js   # Parámetros generales del surtidor
│   ├── reporteModel.js         # Cálculos agregados operativos y financieros
│   ├── surtidorModel.js        # Operaciones de mangueras y surtidores
│   ├── tanqueModel.js          # Datos y capacidad de tanques
│   ├── usuarioModel.js         # Gestión de roles y cuentas
│   ├── ventaModel.js           # Registro de transacciones
│   └── visitaModel.js          # Registro y auditoría del contador de accesos
│
├── views/                      # Generación dinámica de la interfaz de usuario (DOM)
│   ├── alertasView.js          # Panel interactivo de alertas
│   ├── configuracionView.js    # Vista de configuración del sistema
│   ├── dashboardView.js        # Dashboard SCADA principal
│   ├── historialVentasView.js  # Vista de consultas avanzadas de ventas
│   ├── loginView.js            # Interfaz de inicio de sesión
│   ├── registroVentasView.js   # Formulario de despacho rápido
│   ├── reportesView.js         # Vista de gráficos y exportación
│   ├── surtidoresView.js       # Vista gráfica de islas de surtidores
│   ├── tanquesView.js          # Representación visual de tanques
│   ├── usuariosView.js         # Panel de administración de usuarios
│   ├── ventasView.js           # Resumen general de transacciones
│   └── componentes/            # Componentes reutilizables
│       ├── navbar.js           # Barra de navegación superior
│       └── sidebar.js          # Menú lateral dinámico
│
├── css/                        # Estilos
│   ├── input.css               # CSS fuente con directivas Tailwind
│   └── output.css              # CSS procesado para producción
│
└── imagen/                     # Capturas y recursos gráficos
    ├── captabla.png
    ├── creacion_de_tablas.png
    ├── daboarh.png
    ├── yautja1.png
    └── yautja2.png