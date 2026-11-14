# Portal Educativo de Arquitectura de Computadoras
## Universidad Aztlán &bull; Sexto Cuatrimestre &bull; Clave: 636
### Profesor Titular & Super Administrador: Ing. Luis Garibaldi

[![GitHub Repository](https://img.shields.io/badge/GitHub-LuisGaribaldi1312%2Farquitectura--computadoras--aztlan-181717?style=flat&logo=github)](https://github.com/LuisGaribaldi1312/arquitectura-computadoras-aztlan)
[![Institución](https://img.shields.io/badge/Institución-Universidad%20Aztlán-blue?style=flat)](https://aztlan.edu.mx)
[![Modalidad](https://img.shields.io/badge/Ciclo-Sexto%20Cuatrimestre%20(Clave%20636)-amber?style=flat)](#)

Plataforma educativa web interactiva y visual diseñada para la enseñanza integral de la asignatura **Arquitectura de Computadoras**, incorporando 20 laboratorios y simuladores prácticos basados en arquitecturas de hardware y silicio real, sincronización Peer-to-Peer (P2P), base de datos en tiempo real y panel docente con acta oficial de acreditación.

---

## 🏛️ Información Institucional y Docente
* **Centro de Estudios:** Universidad Aztlán
* **Asignatura:** Arquitectura de Computadoras (Clave 636)
* **Profesor Titular y Super Administrador:** Ing. Luis Garibaldi (`luis.garibaldi@aztlan.edu.mx`)
* **Alumnos Matriculados:**
  * Mario Leyva (`mario.leyva@aztlan.edu.mx`)
  * Isaías López (`isaias.lopez@aztlan.edu.mx`)

---

## 📊 Rúbrica Oficial de Evaluación (Universidad Aztlán - 100%)
* **Investigación y Prácticas en Simuladores:** **20%**
* **Reportes de Lectura y Comprensión:** **10%**
* **Proyectos y Ensamble de Hardware:** **20%**
* **Exámenes Parciales:** **20%**
* **Examen Final Integrador:** **30%**
* **Total de Acreditación:** **100%** (Acreditación mínima: 70 pts)

---

## 🔬 Unidades Curriculares y Laboratorios Interactivos

### Unidad 1: Arquitecturas de Cómputo
* **1.1 Modelos de Arquitecturas:** Clásicas (Von Neumann vs Harvard), Segmentadas (Pipeline MIPS de 5 etapas) y Multiprocesamiento (SMP, UMA, NUMA).
* **1.2 Análisis de Componentes:** CPU (CISC vs RISC, ALU, UC, registros, buses internos), Memoria (Jerarquía, SRAM vs DRAM, Caché Tag-Index-Offset), Manejo de E/S (Polling, IRQ, DMA, Canales), Buses (PCIe, Ancho de banda) e Interrupciones (IVT/IDT, Stack frame e IRET).

### Unidad 2: Estructura y Funcionamiento de la CPU
* **2.1 Organización del Procesador:** Rutas de datos multibus.
* **2.2 Estructura de Registros:** Registros visibles al usuario vs control y registro de banderas EFLAGS (ZF, CF, SF, OF).
* **2.3 Ciclo de Instrucción:** Ciclo Fetch-Decode-Execute en notación RTL, conjunto de instrucciones ISA y Modos de Direccionamiento (Inmediato, Directo, Indirecto, Base + Desplazamiento).
* **2.4 Casos de Estudio Reales:** Intel/AMD x86-64 superescalar, ARM big.LITTLE y estándar abierto RISC-V.

### Unidad 3: Selección de Componentes para Ensamble
* **3.1 Chipset:** Evolución Northbridge/Southbridge a PCH y SoCs con IMC integrado, sockets LGA1700/AM5 y carriles PCIe.
* **3.2 Dimensionamiento por Aplicación:** Perfiles técnicos para Ofimática, Gaming, Workstations CAD con memoria ECC, Servidores de misión crítica e Inteligencia Artificial.
* **3.3 Ambientes de Servicio:** Gestión térmica (TDP, refrigeración líquida vs aire), eficiencia energética 80 PLUS (Bronce a Titanio) y racks para centros de datos.

### Unidad 4: Procesamiento Paralelo
* **4.1 Aspectos Básicos:** Muro de la potencia (Power Wall) y granularidad.
* **4.2 Taxonomía de Flynn:** Matrices de clasificación SISD, SIMD (GPUs y vectores AVX), MISD y MIMD (clústeres).
* **4.3 Memoria Compartida:** Redes dinámicas (Crossbar, Omega) y Coherencia de Caché mediante el **Protocolo MESI** (Modified, Exclusive, Shared, Invalid).
* **4.4 Memoria Distribuida y Clústeres:** Topologías estáticas (Anillo, Malla 2D, Toro 3D, Hipercubo), programación con paso de mensajes MPI y leyes de rendimiento: **Ley de Amdahl** (escalamiento fuerte) vs **Ley de Gustafson** (escalamiento débil).
* **4.5 Casos de Estudio:** Clústeres Beowulf, supercomputadoras Exascale del TOP500 (Frontier, Fugaku) y servidores con aceleradores de GPU (NVIDIA DGX H100).

---

## ⚡ Características Tecnológicas
* **Control de Acceso Basado en Roles (RBAC):** Privilegios 100% para el Super Administrador y perfiles exclusivos de aprendizaje para los estudiantes.
* **Sincronización P2P en Tiempo Real:** Replicación mediante `BroadcastChannel` local y `WebRTC DataChannel` directo entre profesor y alumnos.
* **Base de Datos Persistente:** Almacenamiento local de avances, bitácoras de auditoría y notas de evaluación.
* **Generación de Actas Oficiales:** Emisión en 1 clic del Acta de Evaluación y Acreditación de Universidad Aztlán en formato profesional imprimible.

---

Desarrollado para la **Universidad Aztlán** &bull; 2026.
