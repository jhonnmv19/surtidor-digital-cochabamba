# ⛽ Sistema Digital de Control y Gestión para Surtidor de Gasolina

Sistema multiplataforma diseñado para la gestión integral de operaciones, monitoreo e inventario de la Estación de Servicio **"El Surtidor Cochabambino"**, integrando lógica de **Sistemas Digitales**, **Supabase** como Backend/Base de Datos e integración con **Herramientas de IA**.

---

## 📌 Objetivos del Proyecto

- **Aplicar Conceptos de Sistemas Digitales:** Codificación binaria, mapas de Karnaugh, compuertas lógicas y decodificadores.
- **Implementación de Arquitectura Moderna:** Conexión en tiempo real con base de datos mediante **Supabase**.
- **Integración Tecnológica:** Consultas inteligentes asistidas por IA/APIs externas.

---

## 🚀 Módulos Funcionales & Lógica de Sistemas Digitales

| Módulo | Funcionalidad | Implementación / Relación con SD |
| :--- | :--- | :--- |
| **Surtidores** | CRUD de surtidores (número, tipo, capacidad, nivel). | Sensores de nivel codificados en **binario**: <br> `00` = Vacío <br> `01` = 25% <br> `10` = 50% <br> `11` = 100% |
| **Ventas** | Registro de transacciones (fecha, combustible, litros, total). | Procesamiento numérico y **aritmética binaria**. |
| **Alertas** | Monitoreo de niveles Bajo (LED Amarillo) y Crítico (LED Rojo). | Lógica combinacional optimizada con **Mapas de Karnaugh** y compuertas lógicas (`AND`, `OR`, `NOT`). |
| **Reportes** | Ventas diarias, inventario e ingresos. | Uso de **decodificadores** para la categorización y filtrado de tipos de combustible. |

---

## 🛠️ Tecnologías Utilizadas

- **Base de Datos & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + Realtime).
- **Integración de IA / APIs:** Búsquedas/consultas inteligentes (SerpAPI / Modelos IA / CLIP).
- **Control de Versiones:** Git & GitHub.
- **Entorno de Desarrollo:** Visual Studio Code.

---

## 🧠 Lógica Digital & Circuitos (Alertas de Nivel)

### Tabla de Verdad (Ejemplo de Sensores)

| $S_1$ | $S_0$ | Nivel | LED Rojo (Crítico) | LED Amarillo (Bajo) |
| :---: | :---: | :---: | :---: | :---: |
| 0 | 0 | Vacío (0%) | 1 | 0 |
| 0 | 1 | Bajo (25%) | 0 | 1 |
| 1 | 0 | Medio (50%) | 0 | 0 |
| 1 | 1 | Lleno (100%) | 0 | 0 |

### Simplificación con Mapas de Karnaugh
- **LED Rojo ($F_{Rojo}$):** $\bar{S_1} \cdot \bar{S_0}$
- **LED Amarillo ($F_{Amarillo}$):** $\bar{S_1} \cdot S_0$

---

## 💻 Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/TU_USUARIO/surtidor-digital-cochabamba.git](https://github.com/TU_USUARIO/surtidor-digital-cochabamba.git)
   cd surtidor-digital-cochabamba