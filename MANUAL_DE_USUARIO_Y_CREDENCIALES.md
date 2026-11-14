# PORTAL EDUCATIVO DE ARQUITECTURA DE COMPUTADORAS
## UNIVERSIDAD AZTLÁN &bull; SEXTO CUATRIMESTRE (CLAVE 636)
### SUPER ADMINISTRADOR Y PROFESOR TITULAR: ING. LUIS GARIBALDI

---

## 1. Credenciales Oficiales de Acceso

Todos los usuarios pertenecen al dominio institucional `@aztlan.edu.mx` según los lineamientos de la Universidad Aztlán:

| Nombre Completo | Correo Institucional | Rol en la Plataforma | Contraseña de Acceso | Privilegios |
| :--- | :--- | :--- | :--- | :--- |
| **Ing. Luis Garibaldi** | `luis.garibaldi@aztlan.edu.mx` | **Super Administrador y Profesor Titular** | `ProfGaribaldi#2026` | Control total, evaluación y calificación, ajuste de rúbrica, supervisión P2P, generación de actas oficiales. |
| **Mario Leyva** | `mario.leyva@aztlan.edu.mx` | **Alumno** | `MarioLeyva#2026` | Acceso a temario completo, simuladores interactivos, registro de lecturas y autoevaluación. |
| **Isaías López** | `isaias.lopez@aztlan.edu.mx` | **Alumno** | `IsaiasLopez#2026` | Acceso a temario completo, simuladores interactivos, registro de lecturas y autoevaluación. |

> **Seguridad y Privacidad:** Las credenciales de acceso NO aparecen visibles en la pantalla de inicio de sesión. Cada usuario (profesor o alumno) debe escribir su propio correo institucional `@aztlan.edu.mx` y su contraseña privada para acceder al portal. Al cerrar sesión, la plataforma se bloquea y retorna a la pantalla de autenticación.

---

## 2. Ponderación y Criterios de Evaluación Oficial (Universidad Aztlán)

La plataforma calcula en tiempo real la calificación final ponderada (0 a 100) en base a la rúbrica oficial establecida en el programa de estudios:

- **Investigación y Prácticas en Simuladores:** **20%** (Calculado a partir de los 20 laboratorios visuales e interactivos resueltos).
- **Reportes de Lectura y Comprensión:** **10%** (Registro y acreditación de la lectura de la teoría expandida de las cuatro unidades).
- **Proyectos y Ensamble de Hardware:** **20%** (Laboratorio virtual de selección de componentes, compatibilidad de Socket LGA1700/AM5, DDR4/DDR5, carriles PCIe y TDP).
- **Exámenes Parciales:** **20%** (Evaluación continua y preguntas de razonamiento de cada tema).
- **Examen Final Integrador:** **30%** (Evaluación integradora de Arquitecturas Clásicas y Paralelismo).
- **TOTAL:** **100%** (Acreditación mínima: 70/100 pts).

---

## 3. Cobertura Temática Curricular Expandida

### UNIDAD 1: Arquitecturas de Cómputo
- **1.1 Modelos de Arquitecturas de Cómputo:**
  - 1.1.1 Clásicas: Von Neumann vs Harvard (Cuello de botella de bus único vs paralelismo de buses independientes de código y datos).
  - 1.1.2 Segmentadas: Pipelining de 5 etapas (IF, ID, EX, MEM, WB), riesgos de control/datos/estructurales y circuitos de forwarding.
  - 1.1.3 De Multiprocesamiento: Sistemas SMP, arquitecturas de memoria uniforme (UMA) y no uniforme (NUMA).
- **1.2 Análisis de los Componentes:**
  - 1.2.1 CPU: Arquitecturas CISC vs RISC, tipos (MCU, DSP, GPU, NPU), ALU, Unidad de Control (cableada vs microprogramada) y buses internos.
  - 1.2.2 Memoria: Jerarquía piramidal, principio de localidad espacial y temporal, SRAM vs DRAM, mapeo de memoria caché (directo, asociativo) y políticas de reemplazo LRU/FIFO y escritura Write-Through/Write-Back.
  - 1.2.3 Manejo de Entrada/Salida: Módulos de E/S, polling (sondeo programado), E/S por interrupciones, controlador DMA (Cycle Stealing vs Burst Mode) y procesadores de canal.
  - 1.2.4 Buses: Clasificación de líneas (datos, direcciones, control), cálculo de ancho de banda y jerarquías (Bus local, PCIe x1/x4/x8/x16, DMI).
  - 1.2.5 Interrupciones: Enmascarables, no enmascarables (NMI), traps de software, vectores en IVT/IDT y salvado de contexto en la pila (Stack Frame).

### UNIDAD 2: Estructura y Funcionamiento de la CPU
- **2.1 Organización del Procesador:** Banco de registros multipuerto, datapath y generador de reloj maestro.
- **2.2 Estructura de Registros:** Registros visibles al usuario (acumuladores, punteros de pila SP/BP, índices) vs registros de control (PC, IR, MAR, MBR) y registro de banderas (EFLAGS: Zero, Carry, Sign, Overflow).
- **2.3 El Ciclo de Instrucción:** Fases Fetch-Decode-Execute en notación de transferencia entre registros (RTL), repertorio de instrucciones (ISA) y cálculo de Dirección Efectiva (EA) en modos inmediato, directo, indirecto, por registro y base+desplazamiento.
- **2.4 Casos de Estudio de CPUs Reales:** x86-64 superescalar con ejecución fuera de orden (OoO), núcleos ARM big.LITTLE y arquitectura abierta modular RISC-V.

### UNIDAD 3: Selección de Componentes para Ensamble
- **3.1 El Chipset:** Evolución de Northbridge/Southbridge a PCH y SoCs con controlador de memoria (IMC) integrado en silicio, sockets LGA vs PGA vs BGA y líneas PCIe directas.
- **3.2 Dimensionamiento por Aplicación:** Perfiles técnicos para Ofimática, Gaming de alto IPC, Workstation CAD con memoria ECC, Servidores de alta disponibilidad (99.999%) y clústeres para Inteligencia Artificial.
- **3.3 Ambientes de Servicio:** Disipación térmica (TDP, refrigeración por aire vs líquida AIO vs inmersión dieléctrica), eficiencia energética 80 PLUS (Bronce, Oro, Platino, Titanio) y racks de 19 pulgadas para centros de datos.

### UNIDAD 4: Procesamiento Paralelo
- **4.1 Aspectos Básicos:** Muro de la potencia (Power Wall), fin del escalado de Dennard, concurrencia vs paralelismo y granularidad fina vs gruesa.
- **4.2 Taxonomía de Flynn:** Matrices de clasificación SISD, SIMD (vectores y GPUs), MISD (sistemas aeroespaciales tolerantes a fallos) y MIMD (multinúcleos y clústeres).
- **4.3 Memoria Compartida:** Redes dinámicas (Bus común, Crossbar conmutado, Redes multietapa Omega) y solución al problema de coherencia de caché mediante el **Protocolo MESI** (Modified, Exclusive, Shared, Invalid) con escudriñamiento (snooping).
- **4.4 Memoria Distribuida y Clústeres:** Topologías de red estáticas (Anillo, Malla 2D, Toro 3D, Hipercubo), programación con paso de mensajes MPI (`MPI_Send`, `MPI_Recv`, `MPI_Bcast`, `MPI_Reduce`) y modelos de rendimiento: **Ley de Amdahl** (escalamiento fuerte) vs **Ley de Gustafson** (escalamiento débil).
- **4.5 Casos de Estudio:** Clústeres Beowulf históricos, supercomputadoras del TOP500 en la era Exascale (Frontier, Fugaku, Aurora) y nodos heterogéneos acelerados por GPUs (NVIDIA DGX con NVLink).

---

## 4. Laboratorio de 20 Simuladores Prácticos Interactivos

1. `sim_von_neumann_harvard`: Flujo comparativo paso a paso de buses y detección del cuello de botella de Von Neumann.
2. `sim_pipeline_hazards`: Cauce de 5 etapas MIPS, detección de riesgos RAW y activación de Data Forwarding / Stalls.
3. `sim_multiprocessing_numa`: Medición interactiva de latencia en memoria local vs remota en enlaces UPI.
4. `sim_cpu_datapath`: Datapath interactivo con ALU, transferencias entre PC, MAR, MBR, IR y registro Acumulador.
5. `sim_cache_memory`: Simulador de caché directo y 2-way con descomposición Tag-Index-Offset y contador de Hit/Miss.
6. `sim_io_dma_comparison`: Gráfica comparativa de uso de CPU y tiempo de transferencia entre Polling, IRQ y DMA.
7. `sim_bus_arbitration`: Calculador de ancho de banda y arbitraje de prioridad Daisy-Chain.
8. `sim_interrupt_stack`: Depurador visual de salvado de PC/PSW en pila y retorno con IRET.
9. `sim_cpu_organization`: Comparador de 1, 2 y 3 buses internos del CPU.
10. `sim_registers_flags`: Tablero interactivo de operaciones aritmético-lógicas y actualización en tiempo real de FLAGS.
11. `sim_addressing_modes`: Calculador de Dirección Efectiva (EA) y recuperación de datos en memoria física.
12. `sim_cpu_comparison`: Comparador de microarquitecturas x86 vs ARM vs RISC-V.
13. `sim_chipset_explorer`: Mapeo de carriles PCIe entre CPU, Chipset PCH, M.2 NVMe y GPU.
14. `sim_pc_builder`: Simulador virtual de ensamble con validación técnica de compatibilidad (Socket, RAM, TDP, PSU).
15. `sim_power_thermal`: Calculador de curva de eficiencia 80 PLUS, disipación en Watts y BTU/h.
16. `sim_parallel_basics`: Simulador de sobrecarga de comunicación según granularidad de tareas.
17. `sim_flynn_taxonomy`: Matriz interactiva de clasificación de arquitecturas en la Taxonomía de Flynn.
18. `sim_cache_coherence_mesi`: Máquina de estados interactiva del protocolo MESI con 4 núcleos y memoria compartida.
19. `sim_amdahl_topologies`: Calculador gráfico de curvas de aceleración (Amdahl vs Gustafson) y explorador de topologías.
20. `sim_supercomputer_analyzer`: Analizador de fichas técnicas y eficiencia energética de supercomputadoras TOP500.

---

## 5. Arquitectura del Motor P2P y Base de Datos

- **Motor BroadcastChannel:** Replicación en tiempo real y sin configuración entre pestañas y ventanas del navegador en el mismo equipo (latencia: < 1 ms).
- **Motor WebRTC DataChannel:** Enlace P2P directo entre la computadora del profesor y las laptops de los alumnos en red local o Internet, permitiendo sincronización en vivo mediante intercambio de códigos de sesión o QR.
- **Base de Datos Persistente:** Almacena usuarios, lecturas completadas, puntuaciones de ejercicios, bitácora de auditoría y retroalimentación docente.
- **Exportación e Importación:** Generación de respaldos JSON con 1 solo clic para resguardar las notas o trabajar fuera de línea.
- **Acta Oficial Imprimible:** Generador automático de Acta de Evaluación y Acreditación de Universidad Aztlán en formato profesional con firma del docente.

---

## 6. Instrucciones de Inicio

1. Ejecuta el archivo `INICIAR_PORTAL.bat` ubicado en esta carpeta.
2. El portal abrirá automáticamente en tu navegador web en `http://localhost:8080`.
3. Para conectar a los alumnos en red local, comparte la dirección IP mostrada en la consola del servidor (ej. `http://192.168.x.x:8080`).
