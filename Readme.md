# ⛽ Sistema Digital de Control y Gestión para Surtidor de Gasolina
### *Estación de Servicio "El Surtidor Cochabambino"*

Un sistema multiplataforma e industrial para el monitoreo en tiempo real, control de inventario y gestión transaccional de combustibles, integrando fundamentos de **Sistemas Digitales** (lógica combinacional, codificación binaria y decodificadores), arquitectura moderna con **Supabase (PostgreSQL + Realtime)** e integración con **Herramientas de IA**.

---

## 📸 Evidencia Visual del Proyecto

| Vista / Componente | Captura de Pantalla | Descripción |
| :--- | :---: | :--- |
| **Dashboard SCADA** | ![Dashboard SCADA](imagen/daboarh.png) | Interfaz general de monitoreo en tiempo real para el control de tanques y surtidores. |
| **Tabla de Combustibles** | ![Tabla Tipos de Combustible](imagen/captabla.png) | Verificación de datos e inventarios registrados en la tabla `tipo_combustible`. |
| **Creación de Tablas** | ![Creación de Tablas Supabase](imagen/creacion_de_tablas.png) | Evidencia de la ejecución de scripts DDL y creación del esquema relacional en Supabase. |

> **Nota:** Las imágenes se encuentran almacenadas localmente en la carpeta del proyecto: `imagen/`.

---

## 📋 Tabla de Contenido
1. [Objetivos del Proyecto](#-objetivos-del-proyecto)
2. [Arquitectura & Herramientas Utilizadas](#-arquitectura--herramientas-utilizadas)
3. [Lógica de Sistemas Digitales & Circuitos](#-lógica-de-sistemas-digitales--circuitos)
4. [Estructura del Proyecto](#-estructura-del-proyecto)
5. [Base de Datos (Supabase / PostgreSQL)](#-base-de-datos-supabase--postgresql)
6. [Instalación y Configuración](#-instalación-y-configuración)

---

## 📌 Objetivos del Proyecto

- **Aplicación Práctica de Sistemas Digitales:** Implementar sensórica codificada en binario, simplificación con Mapas de Karnaugh y decodificación para la toma de decisiones en hardware/software.
- **Arquitectura de Datos en Tiempo Real:** Configuración de una base de datos relacional robusta en **Supabase** con triggers automáticos para el registro de alertas de nivel.
- **Interfaz Industrial de Alto Nivel:** Diseño responsivo de tipo SCADA/Dashboard para operarios en la estación de servicio utilizando **HTML**, **CSS**, **Tailwind CSS** y **JavaScript (JS)**.

---

## 🛠️ Arquitectura & Herramientas Utilizadas

| Herramienta / Tecnología | Uso y Descripción |
| :--- | :--- |
| **HTML5** | Estructuración semántica de la interfaz de usuario y paneles SCADA. |
| **CSS3** | Estilos personalizados para efectos visuales e indicadores industriales. |
| **Tailwind CSS** | Framework de CSS (vía CDN) para un diseño responsivo, moderno y estilizado. |
| **JavaScript (JS)** | Lógica del cliente (Vanilla ES6+), manipulación del DOM y consumo de eventos en tiempo real. |
| **Supabase** | Backend como servicio (BaaS) basado en PostgreSQL 15, autenticación y Realtime Engine. |
| **FontAwesome 6** | Iconografía industrial para representación de tanques, surtidores y estados. |
| **Git & GitHub** | Control de versiones y alojamiento del repositorio. |

---

## 🧠 Lógica de Sistemas Digitales & Circuitos

### Codificación Binaria de Sensores de Nivel
El nivel de combustible en cada tanque de la estación se digitaliza mediante un par de sensores binarios $S_1 S_0$:

| $S_1$ | $S_0$ | Nivel % | Estado del Tanque | LED Indicador |
| :---: | :---: | :---: | :---: | :---: |
| `0` | `0` | 0% | Vacío / Crítico | 🔴 **Rojo** |
| `0` | `1` | 25% | Nivel Bajo | 🟡 **Amarillo** |
| `1` | `0` | 50% | Nivel Medio | 🔵 **Azul** |
| `1` | `1` | 100% | Nivel Óptimo | 🟢 **Verde** |

### Simplificación Lógica mediante Mapas de Karnaugh
Para activar las alarmas del panel físico mediante compuertas lógicas (`AND`, `OR`, `NOT`):

- **Ecuación para LED Rojo ($F_{\text{Rojo}}$):**  
  $$\bar{S_1} \cdot \bar{S_0}$$
- **Ecuación para LED Amarillo ($F_{\text{Amarillo}}$):**  
  $$\bar{S_1} \cdot S_0$$

---

## 📁 Estructura del Proyecto

```text
sistem_surtidor/
├── imagen/
│   ├── daboarh.png               # Vista del Dashboard SCADA general
│   ├── captabla.png              # Captura de la tabla tipo_combustible cargada con datos
│   └── creacion_de_tablas.png    # Captura del proceso de creación de tablas en Supabase
├── index.html                    # Dashboard SCADA Single-File (HTML + Tailwind + JS)
├── script.sql                    # Script DDL, Seeding y Triggers de Supabase
├── .env.example                  # Plantilla de variables de entorno
└── README.md                     # Documentación principal del repositorio