/**
 * TEMARIO OFICIAL Y CONTENIDO EDUCATIVO EXPANDIDO
 * Centro de Estudios: Universidad Aztlán
 * Asignatura: Arquitectura de Computadoras (Clave 636, Sexto Cuatrimestre)
 * Profesor Titular & Super Administrador: Ing. Luis Garibaldi
 */

const CURRICULUM_DATA = [
  // ==========================================
  // UNIDAD 1: ARQUITECTURAS DE CÓMPUTO
  // ==========================================
  {
    id: "u1_1_1",
    unit: 1,
    unitTitle: "Unidad 1: Arquitecturas de Cómputo",
    code: "1.1.1",
    title: "Modelos Clásicos: Von Neumann vs. Harvard",
    badge: "Fundamentos de Arquitectura",
    readTime: "12 min",
    weight: 5,
    summary: "Estudio comparativo fundamental entre la arquitectura de programa almacenado (Von Neumann) con bus unificado y la arquitectura Harvard con buses y memorias separadas para código y datos.",
    theory: `
      <h3>1.1.1 Modelos Clásicos de Arquitectura de Cómputo</h3>
      <p>La computación moderna se asienta sobre dos pilares conceptuales definidos a mediados del siglo XX: la <strong>Arquitectura Von Neumann</strong> y la <strong>Arquitectura Harvard</strong>. Ambos modelos establecen cómo interactúan los componentes fundamentales: la Unidad Central de Procesamiento (CPU), la memoria y los subsistemas de Entrada/Salida.</p>
      
      <div class="theory-callout primary">
        <h4>Principio del Programa Almacenado (Von Neumann - 1945)</h4>
        <p>Propuesto por John von Neumann, introduce la idea revolucionaria de que <em>las instrucciones de un programa y los datos que procesa residen en el mismo espacio de memoria física</em> y comparten el mismo bus del sistema. Esto permite tratar al código como datos (posibilitando compiladores, cargadores y sistemas operativos dinámicos).</p>
      </div>

      <h4>Anatomía y Cuello de Botella de Von Neumann</h4>
      <p>En el modelo Von Neumann, la CPU consta de:</p>
      <ul>
        <li><strong>Unidad de Control (UC):</strong> Decodifica instrucciones y coordina señales de control.</li>
        <li><strong>Unidad Aritmético-Lógica (ALU):</strong> Realiza cálculos matemáticos y comparaciones booleanas.</li>
        <li><strong>Conjunto de Registros:</strong> Almacenamiento ultrarrápido temporal (PC, MAR, MBR, AC, IR).</li>
        <li><strong>Bus Único del Sistema:</strong> Compartido para transferir tanto código de instrucción como operandos de datos.</li>
      </ul>
      <p><strong>El Cuello de Botella de Von Neumann (Von Neumann Bottleneck):</strong> Dado que existe un único bus físico, la CPU no puede leer una instrucción y leer/escribir un dato de memoria simultáneamente. La velocidad del sistema se ve seriamente limitada por el ancho de banda y la latencia del bus de memoria en comparación con la velocidad de ejecución interna de la CPU.</p>

      <h4>Arquitectura Harvard: Separación de Flujos</h4>
      <p>Desarrollada originalmente para la computadora Harvard Mark I, este modelo implementa <strong>dos espacios de memoria físicamente independientes</strong>:</p>
      <ul>
        <li><strong>Memoria de Instrucciones</strong> con su propio bus de direcciones y datos de código.</li>
        <li><strong>Memoria de Datos</strong> con su respectivo bus independiente de direcciones y datos de operandos.</li>
      </ul>
      <p><strong>Ventaja operativa:</strong> Permite el acceso simultáneo en el mismo ciclo de reloj a la instrucción siguiente (Fetch) y al dato requerido por la instrucción en ejecución (Data Memory Access). Es la base del alto rendimiento en <em>Procesadores de Señales Digitales (DSP)</em> y microcontroladores <em>Microchip PIC / AVR (Arduino)</em>.</p>

      <div class="theory-table-wrapper">
        <table class="theory-table">
          <thead>
            <tr>
              <th>Característica</th>
              <th>Arquitectura Von Neumann</th>
              <th>Arquitectura Harvard</th>
              <th>Harvard Modificada (Moderna)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Espacio de Memoria</strong></td>
              <td>Unificado (Código y Datos)</td>
              <td>Separado físicamente</td>
              <td>Unificado en RAM principal, separado en Caché L1</td>
            </tr>
            <tr>
              <td><strong>Buses Físicos</strong></td>
              <td>Bus común compartido</td>
              <td>Buses independientes (Inst + Data)</td>
              <td>Buses separados a nivel L1 (L1i / L1d)</td>
            </tr>
            <tr>
              <td><strong>Acceso Simultáneo</strong></td>
              <td>No (secuencial o multiplexado)</td>
              <td>Sí (Instrucción y dato al mismo tiempo)</td>
              <td>Sí en núcleos internos (L1i y L1d)</td>
            </tr>
            <tr>
              <td><strong>Costo y Complejidad</strong></td>
              <td>Menor costo, diseño simple</td>
              <td>Mayor costo en pines y cableado</td>
              <td>Equilibrio óptimo en microprocesadores</td>
            </tr>
            <tr>
              <td><strong>Ejemplos Reales</strong></td>
              <td>Sistemas antiguos, arquitectura x86 base</td>
              <td>DSP Texas Instruments TMS320, PIC16F</td>
              <td>Intel Core i7/i9, AMD Ryzen, ARM Cortex-A</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    exerciseType: "simulator",
    exerciseId: "sim_von_neumann_harvard",
    exerciseTitle: "Laboratorio Interactivo: Simulador de Flujo Von Neumann vs Harvard",
    exerciseInstructions: "Ejecuta los ciclos de reloj y observa el flujo de buses. Identifica en qué ciclo ocurre el cuello de botella en Von Neumann y cómo Harvard logra paralelismo en el ciclo Fetch/Operando.",
    exercisePoints: 100
  },
  {
    id: "u1_1_2",
    unit: 1,
    unitTitle: "Unidad 1: Arquitecturas de Cómputo",
    code: "1.1.2",
    title: "Arquitecturas Segmentadas (Pipelining)",
    badge: "Rendimiento y Pipelining",
    readTime: "14 min",
    weight: 5,
    summary: "Descomposición de la ejecución de instrucciones en etapas secuenciales independientes para lograr un throughput de una instrucción por ciclo en condiciones ideales.",
    theory: `
      <h3>1.1.2 Arquitecturas Segmentadas (Instruction Pipelining)</h3>
      <p>La segmentación es una técnica de diseño en la que el hardware procesa múltiples instrucciones concurrentemente, solapando sus fases de ejecución de manera análoga a una línea de ensamblaje industrial.</p>

      <h4>Las 5 Etapas Clásicas del Pipeline RISC (MIPS/DLX)</h4>
      <ol>
        <li><strong>IF (Instruction Fetch):</strong> El PC apunta a la instrucción en memoria; se trae al Registro de Instrucción (IR) y se incrementa el PC (PC = PC + 4).</li>
        <li><strong>ID (Instruction Decode / Register Fetch):</strong> La Unidad de Control decodifica el código de operación (OpCode) y lee los registros fuente del Register File.</li>
        <li><strong>EX (Execute / Address Calculation):</strong> La ALU efectúa la operación aritmética, lógica o calcula la dirección efectiva de memoria para saltos y cargas.</li>
        <li><strong>MEM (Memory Access):</strong> Si la instrucción es de acceso a memoria (LOAD o STORE), se lee o escribe en la memoria de datos; de lo contrario, la etapa queda inactiva.</li>
        <li><strong>WB (Write Back):</strong> Se escribe el resultado final de la operación en el registro destino del banco de registros.</li>
      </ol>

      <div class="theory-callout warning">
        <h4>Riesgos o Conflictos en el Pipeline (Pipeline Hazards)</h4>
        <p>Un conflicto ocurre cuando una instrucción subsecuente no puede ejecutarse en el siguiente ciclo de reloj debido a dependencias:</p>
        <ul>
          <li><strong>Riesgos Estructurales (Structural Hazards):</strong> Dos instrucciones intentan usar el mismo recurso físico al mismo tiempo (ej. un solo puerto de memoria para Fetch y MEM).</li>
          <li><strong>Riesgos de Datos (Data Hazards - RAW, WAR, WAW):</strong> Una instrucción requiere el resultado de una instrucción previa que aún no ha llegado a la etapa WB (Read After Write). Se resuelven mediante <em>Burbujas (Stalls / NOP)</em> o técnicas de <em>Adelantamiento / Cortocircuito (Data Forwarding / Bypassing)</em>.</li>
          <li><strong>Riesgos de Control (Branch Hazards):</strong> Surgen de instrucciones de bifurcación condicional (JUMP/BRANCH), donde el flujo del PC no se conoce hasta la etapa EX o MEM. Se mitigan con <em>Branch Prediction</em> estático y dinámico.</li>
        </ul>
      </div>

      <h4>Fórmula de Rendimiento y Aceleración (Speedup)</h4>
      <p>Para $n$ instrucciones ejecutadas en un cauce de $k$ etapas:</p>
      <div class="math-block">
        $$\\text{Ciclos con Pipeline} = k + (n - 1)$$
        $$\\text{Speedup Ideal} = \\frac{n \\times k}{k + (n - 1)} \\xrightarrow{n \\to \\infty} k$$
      </div>
      <p>Un cauce ideal de 5 etapas puede acelerar la ejecución teóricamente hasta <strong>5 veces</strong> comparado con una máquina no segmentada.</p>
    `,
    exerciseType: "simulator",
    exerciseId: "sim_pipeline_hazards",
    exerciseTitle: "Laboratorio de Pipeline: Detección de Riesgos y Forwarding",
    exerciseInstructions: "Analiza la secuencia de código ensamblador con dependencias RAW. Activa o desactiva el circuito de Data Forwarding y calcula cuántos ciclos de penalización por burbuja (stall) se generan.",
    exercisePoints: 100
  },
  {
    id: "u1_1_3",
    unit: 1,
    unitTitle: "Unidad 1: Arquitecturas de Cómputo",
    code: "1.1.3",
    title: "Arquitecturas de Multiprocesamiento (SMP, UMA, NUMA)",
    badge: "Sistemas Multiprocesador",
    readTime: "11 min",
    weight: 5,
    summary: "Sistemas con múltiples unidades de procesamiento que cooperan mediante memoria compartida simétrica o distribuida, analizando latencias y coherencia.",
    theory: `
      <h3>1.1.3 Arquitecturas de Multiprocesamiento</h3>
      <p>Al alcanzarse los límites térmicos del escalamiento de frecuencia en un solo núcleo (el fenómeno conocido como <em>Power Wall</em>), la industria migró hacia arquitecturas con múltiples procesadores y núcleos en un único zócalo o placa base.</p>

      <h4>Clasificación por Organización de Memoria</h4>
      <ul>
        <li><strong>SMP (Symmetric Multiprocessing):</strong> Todos los procesadores comparten de forma idéntica una memoria común y los recursos de E/S. El sistema operativo trata a todos los procesadores por igual.</li>
        <li><strong>UMA (Uniform Memory Access):</strong> El tiempo de acceso a cualquier posición de memoria física es exactamente el mismo para cualquier procesador del sistema. Se utiliza típicamente en chips multinúcleo comerciales con bus o crossbar centralizado.</li>
        <li><strong>NUMA (Non-Uniform Memory Access):</strong> Cada procesador o socket posee su propio banco de memoria física local, y se conecta a los bancos de los demás procesadores a través de enlaces punto a punto de altísima velocidad (Intel Ultra Path Interconnect - UPI o AMD Infinity Fabric). El acceso a la <em>memoria local</em> es ultrarrápido (baja latencia), mientras que el acceso a la <em>memoria remota</em> incurre en una penalización de tiempo.</li>
      </ul>

      <div class="theory-callout success">
        <h4>Impacto en Sistemas Operativos y Aplicaciones</h4>
        <p>Los planificadores de hilos (Thread Schedulers) en Linux y Windows Server son <em>NUMA-Aware</em>: intentan colocar la memoria de un proceso en el nodo NUMA donde se ejecutan sus hilos para evitar tráfico en los enlaces inter-socket.</p>
      </div>
    `,
    exerciseType: "simulator",
    exerciseId: "sim_multiprocessing_numa",
    exerciseTitle: "Simulador de Topologías Multiprocesador: UMA vs NUMA",
    exerciseInstructions: "Configura el número de sockets y bancos de memoria. Mide los tiempos de acceso a memoria local frente a memoria remota y calcula el ratio de penalización NUMA.",
    exercisePoints: 100
  },
  {
    id: "u1_2_1",
    unit: 1,
    unitTitle: "Unidad 1: Arquitecturas de Cómputo",
    code: "1.2.1",
    title: "Análisis del CPU: Arquitecturas, Tipos, Características y Funcionamiento",
    badge: "Anatomía del Procesador",
    readTime: "16 min",
    weight: 6,
    summary: "Desglose exhaustivo de la Unidad Central de Procesamiento: filosofías CISC vs RISC, Unidad de Control (cableada vs microprogramada), ALU, registros y datapath.",
    theory: `
      <h3>1.2.1 La Unidad Central de Procesamiento (CPU)</h3>
      <p>La CPU es el cerebro operativo del computador responsable de interpretar y ejecutar el repertorio de instrucciones de un programa.</p>

      <h4>1.2.1.1 Arquitecturas: CISC vs RISC</h4>
      <div class="theory-table-wrapper">
        <table class="theory-table">
          <thead>
            <tr>
              <th>Criterio</th>
              <th>CISC (Complex Instruction Set Computer)</th>
              <th>RISC (Reduced Instruction Set Computer)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Filosofía</strong></td>
              <td>Enfocado en instrucciones ricas y complejas directas en hardware</td>
              <td>Instrucciones simples de longitud fija y ciclo único</td>
            </tr>
            <tr>
              <td><strong>Instrucciones Memoria</strong></td>
              <td>Operaciones complejas directas a memoria (ej. ADD [EBX], EAX)</td>
              <td>Arquitectura Load/Store estricta (solo LOAD y STORE tocan RAM)</td>
            </tr>
            <tr>
              <td><strong>Registros</strong></td>
              <td>Pocos registros de propósito específico</td>
              <td>Gran banco de registros generales (32 a 64 registros)</td>
            </tr>
            <tr>
              <td><strong>Formato de Instrucción</strong></td>
              <td>Longitud variable (1 a 15 bytes en x86)</td>
              <td>Longitud fija (32 bits en ARM/MIPS/RISC-V)</td>
            </tr>
            <tr>
              <td><strong>Ejemplos</strong></td>
              <td>Intel x86/x64, AMD64</td>
              <td>ARM Cortex, RISC-V, Apple Silicon M1/M2/M3, MIPS</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>1.2.1.2 Tipos de Procesadores</h4>
      <ul>
        <li><strong>Microprocesadores de propósito general:</strong> Maximizan el rendimiento en monohilo y multihilo en cargas variables (Intel Core, AMD Ryzen).</li>
        <li><strong>Microcontroladores (MCU):</strong> Integran CPU, RAM, Flash, temporizadores y E/S en un solo chip de bajo costo y bajo consumo (STM32, ESP32, PIC).</li>
        <li><strong>Procesadores Digitales de Señales (DSP):</strong> Optimizados para operaciones matemáticas vectoriales de punto fijo/flotante en tiempo real (audio, radar, telecomunicaciones).</li>
        <li><strong>Unidades de Procesamiento Gráfico (GPU) y Aceleradores de IA (NPU/TPU):</strong> Arquitecturas masivamente paralelas orientadas a cálculo tensorial y matrices.</li>
      </ul>

      <h4>1.2.1.4 Funcionamiento Interno: ALU, Unidad de Control y Registros</h4>
      <p>El datapath interno vincula tres elementos clave:</p>
      <ul>
        <li><strong>ALU (Arithmetic Logic Unit):</strong> Bloque combinacional que realiza sumas, restas, desplazamientos lógicos/aritméticos y operaciones lógicas (AND, OR, XOR, NOT). Genera señales de condición hacia el registro de estados.</li>
        <li><strong>Unidad de Control (UC):</strong>
          <ul>
            <li><em>Cableada (Hardwired):</em> Diseñada con compuertas lógicas y máquinas de estado finito (FSM). Altísima velocidad, pero inflexible a modificaciones. Típica de RISC.</li>
            <li><em>Microprogramada:</em> Emplea una pequeña memoria de control interna (ROM) donde cada instrucción máquina se traduce en una secuencia de <em>microinstrucciones</em>. Flexible y actualizable (microcódigo en x86).</li>
          </ul>
        </li>
        <li><strong>Buses Internos:</strong> Canales internos de interconexión que comunican los registros de la CPU con las entradas de la ALU y los buses del sistema exterior.</li>
      </ul>
    `,
    exerciseType: "simulator",
    exerciseId: "sim_cpu_datapath",
    exerciseTitle: "Simulador del Camino de Datos (Datapath) y ALU",
    exerciseInstructions: "Dispara las microoperaciones paso a paso: transfiere valores entre registros, activa las operaciones de la ALU (ADD, SUB, AND, XOR) y observa las banderas generadas.",
    exercisePoints: 100
  },
  {
    id: "u1_2_2",
    unit: 1,
    unitTitle: "Unidad 1: Arquitecturas de Cómputo",
    code: "1.2.2",
    title: "Subsistema de Memoria: Jerarquía, RAM Semiconductora y Caché",
    badge: "Jerarquía de Memoria",
    readTime: "15 min",
    weight: 6,
    summary: "Principios de localidad espacial y temporal, tecnologías SRAM vs DRAM, mapeo de memoria caché (directo, asociativo) y políticas de reemplazo y escritura.",
    theory: `
      <h3>1.2.2 El Subsistema de Memoria</h3>
      <p>Ninguna tecnología de memoria existente puede ser simultáneamente infinitamente rápida, infinitamente grande y económica. Por ello, la arquitectura de computadoras implementa una <strong>Jerarquía de Memoria Piramidal</strong>.</p>

      <h4>Jerarquía de Memoria y Principio de Localidad</h4>
      <p>La jerarquía funciona gracias a dos propiedades estadísticas del código ejecutable:</p>
      <ul>
        <li><strong>Localidad Temporal:</strong> Si una dirección de memoria es referenciada en un instante dado, es muy probable que sea referenciada nuevamente en el futuro cercano (ej. variables dentro de bucles).</li>
        <li><strong>Localidad Espacial:</strong> Si una dirección de memoria es referenciada, es altamente probable que las direcciones contiguas sean referenciadas próximamente (ej. recorrido de arreglos, instrucciones consecutivas).</li>
      </ul>

      <div class="theory-callout primary">
        <h4>Estructura de la Pirámide (de menor a mayor latencia)</h4>
        <ol>
          <li><strong>Registros del CPU:</strong> Capacidad: ~1-2 KB | Tiempo: &lt; 1 ns (0.5 ciclos).</li>
          <li><strong>Caché L1 (L1i / L1d):</strong> Capacidad: 32-128 KB por núcleo | Tiempo: ~1-2 ns (3-4 ciclos).</li>
          <li><strong>Caché L2:</strong> Capacidad: 512 KB - 2 MB por núcleo | Tiempo: ~3-5 ns (10-14 ciclos).</li>
          <li><strong>Caché L3 (Compartida):</strong> Capacidad: 16-128 MB | Tiempo: ~10-20 ns (40-60 ciclos).</li>
          <li><strong>Memoria Principal (DRAM / DDR4 / DDR5):</strong> Capacidad: 8-128 GB | Tiempo: ~50-80 ns.</li>
          <li><strong>Almacenamiento Secundario (SSD NVMe / SATA):</strong> Capacidad: 512 GB - 8 TB | Tiempo: ~10-50 µs.</li>
          <li><strong>Almacenamiento Terciario / Red:</strong> Capacidad: TB/PB | Tiempo: &gt; 1-10 ms.</li>
        </ol>
      </div>

      <h4>Tecnologías de Memoria Semiconductora: SRAM vs DRAM</h4>
      <ul>
        <li><strong>SRAM (Static RAM):</strong> Basada en flip-flops de 6 transistores (6T) por bit. No requiere refresco periódico, es extremadamente rápida, pero consume más energía por celda y tiene baja densidad de integración. Utilizada para cachés L1, L2 y L3.</li>
        <li><strong>DRAM (Dynamic RAM):</strong> Basada en un transistor y un diminuto condensador (1T-1C) por bit. La carga del condensador se disipa con el tiempo, por lo que <em>requiere ciclos de refresco periódicos</em> (cada 64 ms). Es compacta, económica y de altísima densidad. Utilizada para la memoria principal (módulos DIMM DDR4/DDR5).</li>
      </ul>

      <h4>Mapeo de Memoria Caché</h4>
      <p>Una dirección física de memoria se divide en tres campos: <strong>Tag (Etiqueta)</strong>, <strong>Index (Conjunto/Línea)</strong> y <strong>Offset (Desplazamiento)</strong>.</p>
      <ul>
        <li><strong>Mapeo Directo (Direct Mapped):</strong> Cada bloque de RAM tiene exactamente una sola línea de caché posible: $\\text{Línea} = (\\text{Bloque RAM}) \\pmod{\\text{Total Líneas Caché}}$. Rápido de comprobar, pero vulnerable a conflictos si dos direcciones compiten por la misma línea.</li>
        <li><strong>Asociativa por Conjuntos (Set Associative):</strong> La caché se divide en conjuntos de $N$ vías (ej. 4-way, 8-way). El bloque puede residir en cualquiera de las $N$ líneas del conjunto asignado. Excelente balance entre velocidad y reducción de fallos.</li>
        <li><strong>Totalmente Asociativa (Fully Associative):</strong> Un bloque puede situarse en cualquier línea de la caché. Elimina fallos de conflicto, pero requiere circuitería comparadora de etiquetas en paralelo para todas las líneas.</li>
      </ul>

      <h4>Políticas de Reemplazo y Escritura</h4>
      <ul>
        <li><strong>Reemplazo:</strong> LRU (Least Recently Used), FIFO (First-In, First-Out), LFU (Least Frequently Used), Pseudo-LRU.</li>
        <li><strong>Escritura:</strong>
          <ul>
            <li><em>Write-Through:</em> La escritura actualiza simultáneamente la caché y la memoria principal. Consistente pero más lenta.</li>
            <li><em>Write-Back:</em> La escritura solo modifica la línea de caché y marca un bit de modificación (<strong>Dirty Bit</strong>). La RAM solo se actualiza cuando la línea modificada es expulsada por el algoritmo de reemplazo.</li>
          </ul>
        </li>
      </ul>
    `,
    exerciseType: "simulator",
    exerciseId: "sim_cache_memory",
    exerciseTitle: "Simulador de Memoria Caché: Descomposición Tag-Index-Offset y Hit/Miss",
    exerciseInstructions: "Ingresa direcciones de memoria en hexadecimal. Configura el esquema de mapeo (Directo vs 2-way vs 4-way) y observa en tiempo real los aciertos (Hits), fallos (Misses) y la tasa de aciertos.",
    exercisePoints: 100
  },
  {
    id: "u1_2_3",
    unit: 1,
    unitTitle: "Unidad 1: Arquitecturas de Cómputo",
    code: "1.2.3",
    title: "Manejo de Entrada/Salida: Módulos, Polling, Interrupciones, DMA y Canales",
    badge: "Subsistema de E/S",
    readTime: "13 min",
    weight: 5,
    summary: "Técnicas de sincronización y transferencia de datos entre la CPU y los periféricos: E/S programada, por interrupción, Acceso Directo a Memoria (DMA) y canales especializados.",
    theory: `
      <h3>1.2.3 Manejo de la Entrada/Salida (E/S)</h3>
      <p>Los dispositivos periféricos operan a velocidades órdenes de magnitud inferiores a la CPU (un disco duro o tarjeta de red frente al reloj de gigahertz del procesador). Se requieren interfaces y protocolos especializados para evitar el desperdicio de ciclos de cálculo.</p>

      <h4>1.2.3.2 Entrada/Salida Programada (Polling / Sondeo)</h4>
      <p>La CPU asume el control directo de la transferencia. En un bucle cerrado, el procesador lee continuamente el registro de estado del módulo de E/S hasta que el bit de dato listo (Ready Bit) se activa.</p>
      <p><strong>Desventaja crítica:</strong> Desperdicio masivo de potencia de cómputo (espera ocupada - busy-waiting), manteniendo la CPU al 100% de uso sin realizar trabajo útil.</p>

      <h4>1.2.3.3 Entrada/Salida por Interrupciones</h4>
      <p>La CPU emite el comando de lectura/escritura al periférico y continúa ejecutando otros programas productivos. Cuando el periférico termina la operación o tiene datos listos, activa una línea física de interrupción (INT/IRQ). La CPU suspende temporalmente su flujo, atiende el periférico y reanuda el programa previo.</p>

      <h4>1.2.3.4 Acceso Directo a Memoria (DMA - Direct Memory Access)</h4>
      <p>Para transferencias masivas de datos (tarjetas de red Gigabit, SSDs NVMe, tarjetas de video), la CPU delega la transferencia completa a un controlador especializado: el <strong>Controlador DMA</strong>.</p>
      <ol>
        <li>La CPU programa el DMA indicando: dirección base de origen, dirección base de destino, tamaño del bloque en bytes y tipo de operación (lectura/escritura).</li>
        <li>La CPU se desentiende y ejecuta otras tareas.</li>
        <li>El controlador DMA toma el control de los buses del sistema y transfiere los datos directamente entre el periférico y la memoria RAM.</li>
        <li><strong>Técnicas de uso del bus:</strong>
          <ul>
            <li><em>Robo de Ciclo (Cycle Stealing):</em> El DMA toma el bus durante un ciclo de reloj cuando la CPU no lo utiliza.</li>
            <li><em>Modo Ráfaga (Burst Mode):</em> El DMA retiene el bus durante la transferencia ininterrumpida de todo el bloque de datos.</li>
          </ul>
        </li>
        <li>Al finalizar el bloque completo, el DMA genera <strong>una única interrupción</strong> a la CPU para notificar la culminación exitosa.</li>
      </ol>

      <h4>1.2.3.5 Canales y Procesadores de E/S</h4>
      <p>En mainframes y grandes servidores empresariales, los canales de E/S son microprocesadores dedicados e independientes que ejecutan sus propios programas de canal (Channel Programs), liberando a las CPUs principales del 100% de la carga de E/S.</p>
    `,
    exerciseType: "simulator",
    exerciseId: "sim_io_dma_comparison",
    exerciseTitle: "Simulador Comparativo de E/S: Polling vs Interrupciones vs DMA",
    exerciseInstructions: "Lanza transferencias de paquetes de datos mediante Polling, Interrupciones y DMA. Compara gráficamente el tiempo de uso de la CPU y la velocidad de transferencia efectiva lograda.",
    exercisePoints: 100
  },
  {
    id: "u1_2_4",
    unit: 1,
    unitTitle: "Unidad 1: Arquitecturas de Cómputo",
    code: "1.2.4",
    title: "Buses: Tipos, Estructura, Jerarquías y Ancho de Banda",
    badge: "Interconexión y Buses",
    readTime: "11 min",
    weight: 5,
    summary: "Líneas de comunicación compartidas para datos, direcciones y control. Jerarquía de buses desde el bus del sistema hasta buses locales y de expansión como PCIe.",
    theory: `
      <h3>1.2.4 El Sistema de Buses</h3>
      <p>Un bus es una vía de comunicación compartida que conecta dos o más dispositivos. La característica clave de un bus es que es un <em>medio de difusión compartido</em>: si dos dispositivos transmiten simultáneamente, sus señales colisionan, requiriendo mecanismos de arbitraje.</p>

      <h4>Clasificación Funcional de Líneas del Bus</h4>
      <ul>
        <li><strong>Bus de Datos:</strong> Líneas bidireccionales por donde viajan las instrucciones y datos. El ancho del bus de datos (16, 32, 64, 128 bits) determina cuánta información se transfiere por ciclo de reloj.</li>
        <li><strong>Bus de Direcciones:</strong> Líneas unidireccionales emitidas por el maestro (generalmente CPU o DMA) para seleccionar el origen o destino de los datos. El ancho del bus determina el <strong>espacio máximo de memoria direccionable</strong>:
          <div class="math-block">$$\\text{Espacio Máximo} = 2^N \\text{ posiciones (donde } N \\text{ es el número de líneas de dirección)}$$</div>
          Ejemplo: Con 32 líneas de dirección: $2^{32} = 4\\text{ GB}$. Con 64 líneas (típicamente 48-52 físicas): petabytes de direccionamiento.
        </li>
        <li><strong>Bus de Control:</strong> Transmite señales de temporización y órdenes operativas: Memory Read/Write, I/O Read/Write, Transfer ACK, Bus Request/Grant, Clock, Reset.</li>
      </ul>

      <h4>Jerarquías de Buses en una Computadora Moderna</h4>
      <p>Conectar todos los periféricos lentos al bus rápido del procesador degradaría el rendimiento general. Por ello se emplea una estructura jerárquica:</p>
      <ul>
        <li><strong>Bus Local / del Procesador:</strong> Conecta la CPU con la memoria caché y el controlador de memoria integrado. Frecuencia en GHz.</li>
        <li><strong>Bus del Sistema / Enlaces Punto a Punto:</strong> Enlaces PCIe (Peripheral Component Interconnect Express) organizados en carriles seriales punto a punto dúplex completo (x1, x4, x8, x16) con codificaciones 128b/130b alcanzando decenas de GB/s por ranura.</li>
        <li><strong>Buses de Expansión y Periféricos:</strong> USB (Universal Serial Bus), SATA, Thunderbolt para dispositivos externos.</li>
      </ul>
    `,
    exerciseType: "simulator",
    exerciseId: "sim_bus_arbitration",
    exerciseTitle: "Visualizador de Transmisión en Bus & Arbitraje Daisy-Chain",
    exerciseInstructions: "Calcula el ancho de banda teórico según el ancho de líneas y frecuencia de reloj ($BW = \\text{Ancho} \\times f$). Simula peticiones concurrentes de múltiples dispositivos y observa el protocolo de arbitraje.",
    exercisePoints: 100
  },
  {
    id: "u1_2_5",
    unit: 1,
    unitTitle: "Unidad 1: Arquitecturas de Cómputo",
    code: "1.2.5",
    title: "Manejo de Interrupciones y Vector de Interrupción",
    badge: "Control de Flujo Asíncrono",
    readTime: "11 min",
    weight: 5,
    summary: "Clasificación de interrupciones de hardware y software, salvado de contexto en la pila (Stack Frame) y ejecución de la Rutina de Servicio de Interrupción (ISR).",
    theory: `
      <h3>1.2.5 Interrupciones en el Sistema de Cómputo</h3>
      <p>Una interrupción es un mecanismo hardware que altera el flujo normal de ejecución de la CPU para responder a eventos asíncronos que demandan atención inmediata.</p>

      <h4>Taxonomía de Interrupciones</h4>
      <ul>
        <li><strong>Interrupciones de Hardware Externas:</strong>
          <ul>
            <li><em>Enmascarables (INTR):</em> Pueden ser ignoradas o aplazadas por software mediante el borrado del bit de habilitación de interrupciones (instrucción CLI en x86). Usadas por periféricos estándar (teclado, ratón).</li>
            <li><em>No Enmascarables (NMI):</em> No pueden ser deshabilitadas. Reservadas para eventos críticos de hardware (errores de paridad de memoria, fallo de alimentación eléctrica).</li>
          </ul>
        </li>
        <li><strong>Excepciones / Traps Internas:</strong> Síncronas con la instrucción en curso, causadas por errores de ejecución (división por cero, violación de segmento de memoria, fallo de página, instrucción indefinida).</li>
        <li><strong>Interrupciones de Software:</strong> Generadas explícitamente mediante instrucciones de código (ej. INT 0x80 o SYSCALL) para invocar servicios del núcleo del Sistema Operativo.</li>
      </ul>

      <h4>Secuencia de Atención a una Interrupción</h4>
      <ol>
        <li>El dispositivo emite la señal física al controlador de interrupciones (APIC).</li>
        <li>Al culminar el ciclo de la instrucción actual, la CPU verifica la línea de interrupción.</li>
        <li>La CPU envía una señal de reconocimiento (INTA - Interrupt Acknowledge).</li>
        <li><strong>Salvado de Contexto:</strong> El hardware almacena automáticamente el Contador de Programa (PC) y el Registro de Estado (FLAGS/PSW) en la <em>Pila del Sistema (Stack)</em>.</li>
        <li>La CPU obtiene el <strong>Vector de Interrupción</strong> (número identificador) y consulta la <em>Tabla de Vectores de Interrupción (IVT / IDT)</em> para cargar la dirección de la <strong>Rutina de Servicio de Interrupción (ISR)</strong> en el PC.</li>
        <li>Se ejecuta el código de la ISR. Al finalizar, la instrucción de retorno (IRET) restaura el contexto previo desde la pila y el programa original continúa sin alteración perceptible.</li>
      </ol>
    `,
    exerciseType: "simulator",
    exerciseId: "sim_interrupt_stack",
    exerciseTitle: "Depurador Visual de Atención de Interrupción & Stack Frame",
    exerciseInstructions: "Dispara una interrupción de hardware externa. Observa cómo el hardware apila el PC y el PSW en la memoria de pila (Stack), salta a la dirección del vector en la IDT y se restaura el contexto con IRET.",
    exercisePoints: 100
  },

  // ==========================================
  // UNIDAD 2: ESTRUCTURA Y FUNCIONAMIENTO DE LA CPU
  // ==========================================
  {
    id: "u2_1",
    unit: 2,
    unitTitle: "Unidad 2: Estructura y Funcionamiento de la CPU",
    code: "2.1",
    title: "Organización Interna del Procesador",
    badge: "Organización CPU",
    readTime: "12 min",
    weight: 5,
    summary: "Estructura interna de interconexión del procesador: registros de trabajo, unidades funcionales aritméticas, generador de reloj y rutas de señales de control.",
    theory: `
      <h3>2.1 Organización del Procesador</h3>
      <p>La organización de un procesador describe cómo se interconectan lógicamente sus componentes físicos para materializar la arquitectura visible al programador.</p>

      <h4>Elementos Clave de la Organización</h4>
      <ul>
        <li><strong>Banco de Registros (Register File):</strong> Arreglo de celdas de memoria multipuerto de acceso ultrarrápido dentro del propio silicio. Permite múltiples lecturas y escrituras simultáneas por ciclo.</li>
        <li><strong>Unidad Aritmético-Lógica (ALU) y FPU:</strong> La ALU procesa enteros y operaciones booleanas; la FPU (Floating Point Unit) maneja números en coma flotante bajo el estándar IEEE 754.</li>
        <li><strong>Rutas de Datos Internas (Buses Internos):</strong> Pueden estructurarse como <em>bus único</em> (más simple, pero requiere múltiples pasos de reloj para mover operandos), <em>doble bus</em> o <em>triple bus</em> (permite leer dos operandos fuente y escribir el resultado en un solo paso de ciclo).</li>
        <li><strong>Generador de Reloj y Temporización:</strong> Proporciona la señal periódica que sincroniza todas las transiciones de estado de los biestables (latches y flip-flops).</li>
      </ul>
    `,
    exerciseType: "simulator",
    exerciseId: "sim_cpu_organization",
    exerciseTitle: "Explorador de Arquitectura Interna de CPU Multibus",
    exerciseInstructions: "Inspecciona la transferencia de operandos en una arquitectura interna de 1, 2 y 3 buses internos. Compara cuántos pulsos de reloj requiere una operación de suma R1 = R2 + R3.",
    exercisePoints: 100
  },
  {
    id: "u2_2",
    unit: 2,
    unitTitle: "Unidad 2: Estructura y Funcionamiento de la CPU",
    code: "2.2",
    title: "Estructura de Registros: Visibles al Usuario vs. Control y Estado",
    badge: "Registros y FLAGS",
    readTime: "14 min",
    weight: 6,
    summary: "Diferenciación entre registros de propósito general accesibles por ensamblador y registros internos de control del sistema (PC, IR, MAR, MBR y registro de banderas).",
    theory: `
      <h3>2.2 Estructura de Registros de la CPU</h3>
      <p>Los registros residen en la cúspide de la jerarquía de memoria. Se clasifican fundamentalmente en dos categorías operativas:</p>

      <h4>2.2.1 Registros Visibles para el Usuario</h4>
      <p>Pueden ser referenciados directamente por el programador de lenguaje ensamblador o el compilador para optimizar el acceso a variables:</p>
      <ul>
        <li><strong>Registros de Datos / Propósito General:</strong> En arquitecturas x86 (AX, BX, CX, DX) y en RISC (R0 a R31 en ARM/RISC-V). Almacenan operandos de cálculo inmediato.</li>
        <li><strong>Registros de Dirección:</strong>
          <ul>
            <li><em>Punteros de Pila (SP - Stack Pointer):</em> Apunta al tope actual de la pila en memoria.</li>
            <li><em>Punteros Base (BP / Frame Pointer):</em> Referencia el marco de activación de funciones locales.</li>
            <li><em>Registros de Índice (SI, DI):</em> Utilizados para direccionamiento indexado y copia de bloques.</li>
          </ul>
        </li>
      </ul>

      <h4>2.2.2 Registros de Control y de Estados</h4>
      <p>Utilizados exclusivamente por la Unidad de Control para gobernar el funcionamiento del procesador y por el Sistema Operativo en modo privilegiado:</p>
      <ul>
        <li><strong>Program Counter (PC):</strong> Contiene la dirección de memoria de la próxima instrucción a ser leída.</li>
        <li><strong>Instruction Register (IR):</strong> Contiene el código binario de la instrucción leída actualmente en proceso de decodificación.</li>
        <li><strong>Memory Address Register (MAR):</strong> Contiene la dirección física que se presentará en el bus de direcciones para lectura o escritura de memoria.</li>
        <li><strong>Memory Buffer Register (MBR / MDR):</strong> Contiene el dato leído desde memoria o el dato listo para ser escrito en memoria.</li>
        <li><strong>Program Status Word (PSW / FLAGS):</strong> Registro de condición que contiene banderas de 1 bit actualizadas por la ALU:
          <ul>
            <li><strong>ZF (Zero Flag):</strong> Se activa (1) si el resultado de la última operación fue exactamente cero.</li>
            <li><strong>CF (Carry Flag):</strong> Se activa si una operación aritmética sin signo generó un acarreo fuera del bit más significativo.</li>
            <li><strong>SF (Sign Flag):</strong> Refleja el bit más significativo (1 si el resultado es negativo en complemento a dos).</li>
            <li><strong>OF (Overflow Flag):</strong> Se activa si una operación aritmética con signo desborda el rango representable.</li>
            <li><strong>PF (Parity Flag):</strong> Indica paridad par en el byte de menor peso.</li>
          </ul>
        </li>
      </ul>
    `,
    exerciseType: "simulator",
    exerciseId: "sim_registers_flags",
    exerciseTitle: "Tablero Interactivo de Registros y Registro de Banderas (FLAGS)",
    exerciseInstructions: "Ingresa operaciones aritméticas en hexadecimal y binario (ADD, SUB, AND, CMP). Observa la actualización en vivo de los bits ZF, CF, SF, OF y comprende cómo las instrucciones condicionales (JZ, JNC, JG) leen estas banderas.",
    exercisePoints: 100
  },
  {
    id: "u2_3",
    unit: 2,
    unitTitle: "Unidad 2: Estructura y Funcionamiento de la CPU",
    code: "2.3",
    title: "El Ciclo de Instrucción: Fetch-Decode-Execute, ISA y Modos de Direccionamiento",
    badge: "Ciclo de Instrucción",
    readTime: "17 min",
    weight: 7,
    summary: "Desglose formal del ciclo de instrucción paso a paso mediante lenguaje de transferencia de registros (RTL), repertorio de instrucciones (ISA) y modos de direccionamiento.",
    theory: `
      <h3>2.3 El Ciclo de Instrucción</h3>
      <p>El ciclo de instrucción es el proceso cíclico continuo mediante el cual la CPU extrae una instrucción de la memoria, la interpreta y realiza las operaciones especificadas.</p>

      <h4>2.3.1 Fases del Ciclo en Notación RTL (Register Transfer Language)</h4>
      <div class="theory-callout primary">
        <ol>
          <li><strong>Fase de Búsqueda (Fetch):</strong>
            <pre><code>t1: MAR &larr; PC
t2: MBR &larr; Memoria[MAR], PC &larr; PC + 4
t3: IR &larr; MBR</code></pre>
          </li>
          <li><strong>Fase de Decodificación (Decode):</strong>
            <pre><code>t4: La Unidad de Control decodifica el OpCode del IR
    y lee los registros fuentes en el Register File.</code></pre>
          </li>
          <li><strong>Fase de Ejecución (Execute):</strong>
            <pre><code>t5: La ALU opera sobre los operandos (ej. ALU_Out &larr; RegA + RegB)</code></pre>
          </li>
          <li><strong>Fase de Acceso a Memoria / Escritura (Memory / Write-Back):</strong>
            <pre><code>t6: Registro Destino &larr; ALU_Out</code></pre>
          </li>
        </ol>
      </div>

      <h4>2.3.3 Conjunto de Instrucciones (ISA - Instruction Set Architecture)</h4>
      <p>La ISA es la interfaz fundamental entre el software y el silicio. Especifica:</p>
      <ul>
        <li><strong>Instrucciones de Transferencia de Datos:</strong> MOV, LOAD, STORE, PUSH, POP.</li>
        <li><strong>Instrucciones Aritméticas y Lógicas:</strong> ADD, SUB, MUL, DIV, AND, OR, XOR, SHL, SHR.</li>
        <li><strong>Instrucciones de Control de Flujo:</strong> JMP, BEQ, BNE, CALL, RET, INT.</li>
      </ul>

      <h4>2.3.4 Modos de Direccionamiento y Dirección Efectiva (EA)</h4>
      <p>Determinan cómo se calcula la dirección del operando requerido en la instrucción:</p>
      <div class="theory-table-wrapper">
        <table class="theory-table">
          <thead>
            <tr>
              <th>Modo</th>
              <th>Sintaxis Típica</th>
              <th>Cálculo de Dirección Efectiva (EA)</th>
              <th>Ventajas y Desventajas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Inmediato</strong></td>
              <td><code>MOV R1, #45</code></td>
              <td>El dato está en el campo de la propia instrucción</td>
              <td>No requiere acceso a memoria; rango numérico limitado</td>
            </tr>
            <tr>
              <td><strong>Directo / Absoluto</strong></td>
              <td><code>MOV R1, [1000H]</code></td>
              <td>$EA = \\text{Dirección dada en instrucción}$</td>
              <td>Simple; espacio de direccionamiento restringido</td>
            </tr>
            <tr>
              <td><strong>Indirecto</strong></td>
              <td><code>MOV R1, [[1000H]]</code></td>
              <td>$EA = \\text{Memoria}[\\text{Dirección}]$</td>
              <td>Permite punteros; requiere 2 accesos a memoria (lento)</td>
            </tr>
            <tr>
              <td><strong>Por Registro</strong></td>
              <td><code>MOV R1, R2</code></td>
              <td>Operando reside en el registro R2</td>
              <td>Ultrarrápido; número limitado de registros</td>
            </tr>
            <tr>
              <td><strong>Indirecto por Registro</strong></td>
              <td><code>MOV R1, [R2]</code></td>
              <td>$EA = [R2]$</td>
              <td>Base para manipular estructuras dinámicas en memoria</td>
            </tr>
            <tr>
              <td><strong>Indexado / Base + Desplazamiento</strong></td>
              <td><code>MOV R1, [RB + R_Index * Escala + Disp]</code></td>
              <td>$EA = RB + R_{ix} \\times S + Disp$</td>
              <td>Ideal para matrices, registros en pilas y objetos</td>
            </tr>
            <tr>
              <td><strong>Relativo al PC</strong></td>
              <td><code>BEQ +12</code></td>
              <td>$EA = PC + Desplazamiento$</td>
              <td>Código independiente de posición (PIC) para saltos</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    exerciseType: "simulator",
    exerciseId: "sim_addressing_modes",
    exerciseTitle: "Calculador y Visualizador de Modos de Direccionamiento",
    exerciseInstructions: "Selecciona diferentes modos de direccionamiento (Inmediato, Directo, Indirecto, Registro, Base+Índice). Observa paso a paso cómo se calcula la Dirección Efectiva (EA) y se recupera el valor de la memoria física.",
    exercisePoints: 100
  },
  {
    id: "u2_4",
    unit: 2,
    unitTitle: "Unidad 2: Estructura y Funcionamiento de la CPU",
    code: "2.4",
    title: "Casos de Estudio de CPUs Reales: x86-64, ARM y RISC-V",
    badge: "CPUs Comerciales",
    readTime: "15 min",
    weight: 6,
    summary: "Comparativa técnica profunda entre microarquitecturas dominantes de la industria: Intel/AMD x86-64 superescalar, ARM big.LITTLE y el estándar abierto RISC-V.",
    theory: `
      <h3>2.4 Casos de Estudio de CPUs Reales</h3>
      <p>El diseño de microprocesadores comerciales refleja compromisos de ingeniería entre rendimiento puro, consumo energético, compatibilidad histórica con software heredado y costos de licenciamiento.</p>

      <h4>1. Familia Intel / AMD x86-64 (Arquitectura CISC Híbrida)</h4>
      <ul>
        <li><strong>Herencia y Compatibilidad:</strong> Soporta software compilado desde la era del procesador 8086 de 16 bits.</li>
        <li><strong>Núcleo Superescalar y Decodificación Interna:</strong> Aunque la ISA externa es CISC con instrucciones de tamaño variable, internamente decodifica las instrucciones complejas en secuencias de <strong>micro-operaciones (µops)</strong> similares a RISC.</li>
        <li><strong>Ejecución Fuera de Orden (Out-of-Order Execution - OoO):</strong> Las µops se envían a estaciones de reserva y se ejecutan tan pronto sus operandos están listos, reordenando los resultados al final mediante el <em>Reorder Buffer (ROB)</em>.</li>
      </ul>

      <h4>2. Arquitectura ARM (Advanced RISC Machines)</h4>
      <ul>
        <li><strong>Dominio en Móviles y Edge:</strong> Diseñada con foco prioritario en eficiencia energética (rendimiento por vatio). Presente en miles de millones de smartphones y en Apple Silicon (M1, M2, M3).</li>
        <li><strong>Filosofía RISC Pura:</strong> Instrucciones regulares de 32 bits, arquitectura Load/Store, ejecución condicional y registro de desplazamiento en barril (Barrel Shifter) integrado en la ruta de datos.</li>
        <li><strong>Tecnología big.LITTLE / DynamIQ:</strong> Combina núcleos de alto rendimiento y alto consumo (núcleos "Cortex-X" o "Performance") con núcleos de bajísimo consumo (núcleos "Efficiency") en el mismo silicio para optimizar la batería.</li>
      </ul>

      <h4>3. Estándar Abierto RISC-V</h4>
      <ul>
        <li><strong>Arquitectura Abierta Libre de Regalías:</strong> Creada en la Universidad de California en Berkeley. Cualquier entidad puede implementar procesadores sin pagar licencias a ARM o Intel.</li>
        <li><strong>Modularidad Extensible:</strong> Núcleo base entero fijo y ultracompacto (RV32I o RV64I) con extensiones estandarizadas opcionales: <strong>M</strong> (Multiplicación/División), <strong>A</strong> (Atómicas), <strong>F</strong> (Flotante simple), <strong>D</strong> (Flotante doble), <strong>C</strong> (Comprimidas de 16 bits), <strong>V</strong> (Vectoriales para IA).</li>
      </ul>
    `,
    exerciseType: "simulator",
    exerciseId: "sim_cpu_comparison",
    exerciseTitle: "Comparador de Microarquitecturas: x86-64 vs ARM vs RISC-V",
    exerciseInstructions: "Compara el repertorio de instrucciones, consumo en Watts, IPC típico y diseño de silicio entre un procesador de escritorio x86, un chip ARM para servidores y un SoC RISC-V embebido.",
    exercisePoints: 100
  },

  // ==========================================
  // UNIDAD 3: SELECCIÓN DE COMPONENTES PARA ENSAMBLE
  // ==========================================
  {
    id: "u3_1",
    unit: 3,
    unitTitle: "Unidad 3: Selección de Componentes para Ensamble",
    code: "3.1",
    title: "El Chipset: Northbridge/Southbridge, PCH, SoCs y Compatibilidad de Sockets",
    badge: "Plataforma y Chipset",
    readTime: "13 min",
    weight: 5,
    summary: "Evolución de la arquitectura del chipset desde la estructura clásica de puente norte y sur hasta concentradores de plataforma PCH, controladores de memoria integrados y SoCs.",
    theory: `
      <h3>3.1 El Chipset y la Placa Base</h3>
      <p>El <strong>Chipset</strong> es el conjunto de circuitos integrados auxiliares que orquesta las comunicaciones entre el procesador y todos los demás subsistemas del computador.</p>

      <h4>Evolución Histórica: De Northbridge/Southbridge a PCH y SoC</h4>
      <ul>
        <li><strong>Arquitectura Clásica de Doble Chip (Años 90 - 2008):</strong>
          <ul>
            <li><em>Northbridge (Puente Norte):</em> Conectado directamente a la CPU vía el bus Front Side Bus (FSB). Controlaba los componentes de alta velocidad: controlador de memoria RAM y ranura gráfica AGP/PCIe x16.</li>
            <li><em>Southbridge (Puente Sur):</em> Conectado al Northbridge. Controlaba los periféricos más lentos: buses PCI, puertos SATA/IDE, puertos USB, audio y BIOS.</li>
          </ul>
        </li>
        <li><strong>Integración en el Silicio de la CPU (Era Moderna):</strong>
          <p>Para eliminar los cuellos de botella del bus externo FSB, los fabricantes integraron el <strong>Controlador de Memoria (IMC)</strong> y las <strong>líneas PCIe primarias (16 a 24 carriles directos)</strong> dentro del encapsulado del propio microprocesador.</p>
        </li>
        <li><strong>Platform Controller Hub (PCH) / Chipset Actual:</strong> El chipset en la placa base ahora solo gestiona puertos de expansión adicionales (PCIe secundarios, SATA, puertos USB, Wi-Fi, Ethernet), conectado a la CPU mediante enlaces dedicados de alta velocidad como DMI (Direct Media Interface de Intel) o carriles PCIe dedicados en AMD.</li>
      </ul>

      <h4>Sockets y Compatibilidad de Plataforma</h4>
      <ul>
        <li><strong>LGA (Land Grid Array):</strong> Los pines residen en el zócalo de la placa base; el CPU tiene almohadillas planas de contacto (Intel LGA1700, LGA1851, AMD AM5).</li>
        <li><strong>PGA (Pin Grid Array):</strong> Los pines se encuentran en el CPU e insertan en orificios del zócalo (AMD AM4 tradicional).</li>
        <li><strong>BGA (Ball Grid Array):</strong> Soldado permanentemente con esferas de estaño; utilizado en portátiles, consolas y dispositivos embebidos.</li>
      </ul>
    `,
    exerciseType: "simulator",
    exerciseId: "sim_chipset_explorer",
    exerciseTitle: "Explorador de Flujo de Datos CPU - Chipset - Dispositivos",
    exerciseInstructions: "Mapea las conexiones entre el CPU, el Chipset (PCH), la memoria RAM, la GPU PCIe x16 y las unidades M.2 NVMe para identificar posibles cuellos de botella de carriles.",
    exercisePoints: 100
  },
  {
    id: "u3_2",
    unit: 3,
    unitTitle: "Unidad 3: Selección de Componentes para Ensamble",
    code: "3.2",
    title: "Dimensionamiento por Aplicación: Ofimática, Gaming, Workstation, Servidores e IA",
    badge: "Dimensionamiento Técnico",
    readTime: "15 min",
    weight: 6,
    summary: "Criterios técnicos para la selección equilibrada de componentes según el perfil de uso, evitando cuellos de botella y maximizando el retorno de inversión.",
    theory: `
      <h3>3.2 Dimensionamiento de Hardware según la Aplicación</h3>
      <p>Un error común en ingeniería de sistemas es sobrestimar componentes aislados sin considerar el equilibrio global del sistema, generando <strong>cuellos de botella (Bottlenecks)</strong> que desperdician presupuesto.</p>

      <h4>Perfiles de Aplicación y Requerimientos de Hardware</h4>
      <div class="theory-table-wrapper">
        <table class="theory-table">
          <thead>
            <tr>
              <th>Perfil de Uso</th>
              <th>CPU Recomendada</th>
              <th>Memoria RAM</th>
              <th>Almacenamiento</th>
              <th>GPU</th>
              <th>Prioridad de Diseño</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Ofimática / Administrativo</strong></td>
              <td>4 núcleos / 8 hilos con gráficos integrados (i3 / Ryzen 3)</td>
              <td>8 - 16 GB DDR4/DDR5 en Dual Channel</td>
              <td>SSD NVMe M.2 512 GB</td>
              <td>Integrada (iGPU)</td>
              <td>Bajo costo, bajo consumo, confiabilidad y silencio</td>
            </tr>
            <tr>
              <td><strong>Gaming y Esports</strong></td>
              <td>6 a 8 núcleos de alto IPC mononúcleo (Ryzen 7 7800X3D / Core i7)</td>
              <td>32 GB DDR5 de baja latencia (CL30-CL32)</td>
              <td>SSD NVMe Gen4 1-2 TB (Lecturas &gt; 5000 MB/s)</td>
              <td>Dedicada gama media-alta (RTX 4070 / RX 7800 XT)</td>
              <td>Máxima tasa de FPS sostenida, alto rendimiento single-thread</td>
            </tr>
            <tr>
              <td><strong>Estación de Trabajo (CAD / Render 3D)</strong></td>
              <td>12 a 32 núcleos (Ryzen 9, Threadripper, Intel Xeon)</td>
              <td>64 - 128 GB DDR5 ECC (detección y corrección de errores)</td>
              <td>Arreglos NVMe en RAID + almacenamiento masivo</td>
              <td>Profesional (NVIDIA RTX A4000/A6000 con drivers Studio)</td>
              <td>Estabilidad 100%, renderizado multihilo masivo, memoria ECC</td>
            </tr>
            <tr>
              <td><strong>Servidor de Base de Datos / Virtualización</strong></td>
              <td>Doble Socket AMD EPYC / Intel Xeon (64+ núcleos totales)</td>
              <td>256 GB a 1 TB+ Registered ECC en 8 u 12 canales</td>
              <td>SSDs NVMe Enterprise U.2/U.3 en RAID 10 Hot-Swap</td>
              <td>Básica integrada para administración remota (IPMI/iDRAC)</td>
              <td>Disponibilidad 99.999% (cinco nueves), redundancia de fuentes y ventilación</td>
            </tr>
            <tr>
              <td><strong>Entrenamiento de Inteligencia Artificial (LLMs)</strong></td>
              <td>CPU de alto ancho de banda PCIe (AMD EPYC / Threadripper Pro)</td>
              <td>128 - 512 GB DDR5</td>
              <td>Almacenamiento NVMe Gen5 para ingesta de datasets</td>
              <td>Múltiples GPUs con Tensor Cores y gran VRAM (NVIDIA A100 / H100 / RTX 4090)</td>
              <td>Ancho de banda de VRAM masivo, interconexión NVLink, refrigeración extrema</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    exerciseType: "simulator",
    exerciseId: "sim_pc_builder",
    exerciseTitle: "Simulador Virtual de Ensamble y Verificador de Compatibilidad",
    exerciseInstructions: "Selecciona componentes para un escenario específico (Ofimática, Gaming, Workstation, Servidor). El simulador validará la compatibilidad de Socket, estándar de RAM, cuello de botella de PCIe y consumo de la fuente de poder.",
    exercisePoints: 100
  },
  {
    id: "u3_3",
    unit: 3,
    unitTitle: "Unidad 3: Selección de Componentes para Ensamble",
    code: "3.3",
    title: "Ambientes de Servicio: Calidad de Energía, Térmica y Centros de Datos",
    badge: "Energía y Entorno",
    readTime: "12 min",
    weight: 5,
    summary: "Condicionamiento ambiental para hardware: cálculo de TDP, refrigeración líquida vs aire, certificación de fuentes de poder 80 Plus, protección eléctrica UPS y racks.",
    theory: `
      <h3>3.3 Ambientes de Servicio y Confiabilidad Física</h3>
      <p>El hardware computacional más avanzado fallará prematuramente si el ambiente físico de operación (energía, temperatura, humedad y polvo) no cumple con los rangos operativos requeridos.</p>

      <h4>1. Gestión de Energía y Certificación 80 PLUS</h4>
      <p>La fuente de poder (PSU - Power Supply Unit) convierte la corriente alterna (AC de 120V/220V) en líneas estables de corriente continua (DC de +12V, +5V, +3.3V). La certificación <strong>80 PLUS</strong> garantiza la eficiencia mínima energética al 20%, 50% y 100% de carga:</p>
      <ul>
        <li><strong>80 PLUS Estándar / Bronce:</strong> 80% a 85% de eficiencia.</li>
        <li><strong>80 PLUS Oro:</strong> 87% a 90% de eficiencia (el estándar recomendado para workstations).</li>
        <li><strong>80 PLUS Platino / Titanio:</strong> 90% a 94%+ de eficiencia (imprescindible en servidores 24/7).</li>
      </ul>
      <p><strong>Cálculo de Consumo:</strong> Se recomienda que la potencia nominal de la PSU exceda en al menos un <strong>25% a 30%</strong> el consumo máximo estimado (TDP total de CPU + GPU + periféricos) para operar en la curva óptima de eficiencia y soportar picos transitorios de potencia.</p>

      <h4>2. Disipación Térmica: TDP y Soluciones de Enfriamiento</h4>
      <p>El <strong>Thermal Design Power (TDP)</strong> es la cantidad máxima de calor en vatios que el sistema de disipación debe disipar en condiciones de carga de trabajo máxima.</p>
      <ul>
        <li><em>Disipación por Aire:</em> Bloque de aletas de aluminio con tuberías de calor de cobre (Heatpipes) con cambio de fase de fluido interno. Altamente confiable, sin riesgo de fugas.</li>
        <li><em>Refrigeración Líquida AIO (All-in-One):</em> Bomba de agua, mangueras herméticas y radiador de 240/360mm. Mayor capacidad de absorción térmica ante picos súbitos de TDP.</li>
        <li><em>Enfriamiento por Inmersión:</em> Sumergimiento de servidores completos en fluidos dieléctricos no conductores en centros de datos modernos de supercómputo.</li>
      </ul>

      <h4>3. Factores de Forma para Centros de Datos (Racks de Servidores)</h4>
      <p>En entornos empresariales se utiliza el estándar de rack de 19 pulgadas, cuya altura se mide en <strong>Unidades de Rack (U)</strong>, donde $1U = 1.75\\text{ pulgadas } (44.45\\text{ mm})$. Se exige ventilación frontal-trasera (pasillo frío / pasillo caliente), fuentes redundantes intercambiables en caliente (Hot-Swap) y sistemas de alimentación ininterrumpida (UPS Online de doble conversión).</p>
    `,
    exerciseType: "simulator",
    exerciseId: "sim_power_thermal",
    exerciseTitle: "Calculador Térmico y de Potencia Eléctrica para Infraestructura",
    exerciseInstructions: "Ingresa el TDP del procesador, consumo de la tarjeta gráfica y periféricos. Determina la capacidad recomendada de la fuente de poder con certificación 80 Plus y el tipo de disipador requerido.",
    exercisePoints: 100
  },

  // ==========================================
  // UNIDAD 4: PROCESAMIENTO PARALELO
  // ==========================================
  {
    id: "u4_1",
    unit: 4,
    unitTitle: "Unidad 4: Procesamiento Paralelo",
    code: "4.1",
    title: "Aspectos Básicos de la Computación Paralela",
    badge: "Fundamentos de Paralelismo",
    readTime: "11 min",
    weight: 5,
    summary: "Motivaciones del procesamiento concurrente y paralelo: superación del muro de la potencia, Ley de Moore, granularidad de tareas y comunicación inter-proceso.",
    theory: `
      <h3>4.1 Aspectos Básicos de la Computación Paralela</h3>
      <p>Durante décadas, el rendimiento de las computadoras se incrementó automáticamente gracias al escalado de frecuencia de reloj (hasta alcanzar los 3 a 5 GHz a principios de los 2000). Al alcanzarse el <strong>Power Wall (Límite Térmico)</strong>, la única vía física para aumentar el poder de cálculo sin fundir el silicio fue dividir las tareas entre múltiples elementos de procesamiento simultáneos.</p>

      <h4>Conceptos Esenciales</h4>
      <ul>
        <li><strong>Concurrencia vs. Paralelismo:</strong>
          <ul>
            <li><em>Concurrencia:</em> Capacidad de gestionar múltiples tareas intercalando su ejecución en el tiempo (apariencia de simultaneidad, ej. un solo núcleo con multitarea de sistema operativo).</li>
            <li><em>Paralelismo:</em> Ejecución físicamente simultánea de dos o más instrucciones en el mismo instante de tiempo en múltiples unidades de cómputo reales.</li>
          </ul>
        </li>
        <li><strong>Granularidad:</strong> Razón entre la cantidad de cálculo realizado y la cantidad de comunicación requerida:
          <ul>
            <li><em>Granularidad Fina:</em> Pequeñas cantidades de cálculo entre sincronizaciones frecuentes (típico de GPUs y operaciones vectoriales).</li>
            <li><em>Granularidad Gruesa:</em> Largos períodos de cálculo independiente con sincronización esporádica (típico de clústeres distribuidos y procesamiento por lotes).</li>
          </ul>
        </li>
      </ul>
    `,
    exerciseType: "simulator",
    exerciseId: "sim_parallel_basics",
    exerciseTitle: "Laboratorio de Granularidad y Concurrencia vs Paralelismo",
    exerciseInstructions: "Ajusta la granularidad de una tarea de procesamiento. Observa el impacto de la sobrecarga de comunicación frente al tiempo de cómputo neto.",
    exercisePoints: 100
  },
  {
    id: "u4_2",
    unit: 4,
    unitTitle: "Unidad 4: Procesamiento Paralelo",
    code: "4.2",
    title: "Taxonomía de Flynn: SISD, SIMD, MISD y MIMD",
    badge: "Taxonomía de Flynn",
    readTime: "14 min",
    weight: 6,
    summary: "Clasificación canónica de arquitecturas computacionales propuesta por Michael J. Flynn en 1966, basada en la multiplicidad de flujos de instrucciones y flujos de datos.",
    theory: `
      <h3>4.2 Taxonomía de las Arquitecturas Paralelas (Flynn)</h3>
      <p>Michael J. Flynn propuso clasificar todas las computadoras en función de dos dimensiones ortogonales: el número de <strong>Flujos de Instrucciones (Instruction Streams)</strong> y el número de <strong>Flujos de Datos (Data Streams)</strong> activos simultáneamente.</p>

      <div class="theory-table-wrapper">
        <table class="theory-table">
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Flujo de Instrucciones</th>
              <th>Flujo de Datos</th>
              <th>Descripción y Ejemplos</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>SISD</strong><br>(Single Instruction, Single Data)</td>
              <td>Uno solo</td>
              <td>Uno solo</td>
              <td>La computadora secuencial clásica de Von Neumann uniprocesador. No hay paralelismo a nivel de datos ni de instrucciones concurrentes. Ejemplo: PCs antiguas (Intel 8086, Pentium I mononúcleo).</td>
            </tr>
            <tr>
              <td><strong>SIMD</strong><br>(Single Instruction, Multiple Data)</td>
              <td>Uno solo</td>
              <td>Múltiples</td>
              <td>Una única Unidad de Control emite una misma instrucción que se aplica simultáneamente a múltiples elementos de datos diferentes. Base de las <strong>instrucciones vectoriales</strong> (Intel AVX-512, ARM Neon) y de las <strong>GPUs modernas</strong> (arquitectura SIMT).</td>
            </tr>
            <tr>
              <td><strong>MISD</strong><br>(Multiple Instruction, Single Data)</td>
              <td>Múltiples</td>
              <td>Uno solo</td>
              <td>Múltiples instrucciones operan concurrentemente sobre el mismo y único flujo de datos. Muy poco común; utilizada en sistemas de <strong>alta tolerancia a fallos y redundancia crítica</strong> (ej. computadoras de vuelo del Transbordador Espacial y naves espaciales comerciales).</td>
            </tr>
            <tr>
              <td><strong>MIMD</strong><br>(Multiple Instruction, Multiple Data)</td>
              <td>Múltiples</td>
              <td>Múltiples</td>
              <td>Múltiples procesadores autónomos ejecutan diferentes programas sobre flujos de datos completamente diferentes. Es la categoría que engloba a todos los <strong>procesadores multinúcleo actuales, supercomputadoras y clústeres de servidores</strong>.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    exerciseType: "simulator",
    exerciseId: "sim_flynn_taxonomy",
    exerciseTitle: "Matriz Interactiva de Clasificación según la Taxonomía de Flynn",
    exerciseInstructions: "Arrastra y clasifica diferentes sistemas y arquitecturas de la vida real (GPU NVIDIA, Intel Core i9, Pentium 4, Computadora de vuelo redundante) dentro del cuadrante correcto de Flynn y ejecuta la simulación de flujos.",
    exercisePoints: 100
  },
  {
    id: "u4_3",
    unit: 4,
    unitTitle: "Unidad 4: Procesamiento Paralelo",
    code: "4.3",
    title: "Sistemas de Memoria Compartida: Multiprocesadores y Coherencia de Caché (Protocolo MESI)",
    badge: "Memoria Compartida y MESI",
    readTime: "16 min",
    weight: 7,
    summary: "Redes de interconexión dinámicas (medio compartido y conmutadas Crossbar/Omega) y solución al problema crítico de la coherencia de caché mediante el protocolo de estados MESI.",
    theory: `
      <h3>4.3 Sistemas de Memoria Compartida (Multiprocesadores)</h3>
      <p>En un sistema de memoria compartida, todos los procesadores o núcleos tienen acceso a un espacio de direcciones de memoria global y único. La comunicación entre procesos se realiza de forma natural escribiendo y leyendo en las mismas variables compartidas.</p>

      <h4>Redes de Interconexión Dinámicas o Indirectas</h4>
      <ul>
        <li><strong>Redes de Medio Compartido (Bus Común):</strong> Varios procesadores se conectan a un solo bus de memoria. Es económica y simple, pero el bus se satura rápidamente al aumentar el número de núcleos (limitado a 4-8 procesadores).</li>
        <li><strong>Redes Conmutadas (Crossbar / Barras Cruzadas):</strong> Una matriz de conmutación conecta cada procesador directamente con cada módulo de memoria. Permite múltiples transferencias simultáneas sin conflicto, pero el costo de hardware crece de forma cuadrática: $\\mathcal{O}(N^2)$.</li>
        <li><strong>Redes Multietapa (Omega, Butterfly, Clos):</strong> Conmutadores en cascada de tamaño $2 \\times 2$. Escalan con costo $\\mathcal{O}(N \\log N)$, ofreciendo una solución de compromiso entre costo y ancho de banda.</li>
      </ul>

      <h4>El Problema de la Coherencia de Caché</h4>
      <p>Si el Procesador A y el Procesador B leen la misma variable $X=10$ desde la memoria compartida, ambos almacenan una copia local en sus respectivas memorias caché L1. Si luego el Procesador A modifica localmente su copia a $X=20$, el Procesador B tiene ahora un dato <em>obsoleto (stale data)</em>. Sin un protocolo de coherencia, el sistema computará resultados erróneos.</p>

      <div class="theory-callout primary">
        <h4>El Protocolo MESI (Illinois)</h4>
        <p>Cada línea de caché almacena 2 bits adicionales que indican su estado en una máquina de estados finitos:</p>
        <ul>
          <li><strong>M - Modified (Modificada):</strong> La línea solo existe en esta caché local y ha sido modificada respecto a la memoria RAM. La caché local tiene la única versión válida y es responsable de escribirla en RAM al ser expulsada.</li>
          <li><strong>E - Exclusive (Exclusiva):</strong> La línea solo existe en esta caché local, pero es idéntica al valor en la memoria RAM (no ha sido modificada).</li>
          <li><strong>S - Shared (Compartida):</strong> La línea existe en esta caché y posiblemente en las cachés de otros procesadores; coincide con la memoria RAM. Es de solo lectura.</li>
          <li><strong>I - Invalid (Inválida):</strong> La línea no contiene datos válidos; cualquier intento de lectura provocará un fallo de caché (Miss).</li>
        </ul>
        <p><strong>Mecanismo de Escudriñamiento (Snooping):</strong> Todos los controladores de caché monitorean constantemente el bus común ("escuchan las transacciones"). Si un núcleo detecta que otro núcleo va a escribir en una dirección que él tiene en estado <em>Shared</em>, invalida inmediatamente su propia copia local ($S \\to I$).</p>
      </div>
    `,
    exerciseType: "simulator",
    exerciseId: "sim_cache_coherence_mesi",
    exerciseTitle: "Simulador Interactivo del Protocolo de Coherencia de Caché MESI",
    exerciseInstructions: "Interactúa con 4 núcleos de CPU con sus respectivas cachés L1 conectadas a una memoria compartida. Dispara operaciones de lectura de procesador (PrRd), escritura (PrWr), lecturas de bus (BusRd) y observa las transiciones de estado M-E-S-I en vivo.",
    exercisePoints: 100
  },
  {
    id: "u4_4",
    unit: 4,
    unitTitle: "Unidad 4: Procesamiento Paralelo",
    code: "4.4",
    title: "Sistemas de Memoria Distribuida: Clústeres, Topologías, MPI y Ley de Amdahl",
    badge: "Clústeres y Rendimiento",
    readTime: "17 min",
    weight: 7,
    summary: "Computadores independientes interconectados por redes de alta velocidad, topologías estáticas (malla, toro, hipercubo), paso de mensajes con MPI y modelado de aceleración teórica.",
    theory: `
      <h3>4.4 Sistemas de Memoria Distribuida (Multicomputadores / Clústeres)</h3>
      <p>Cuando se requiere escalar a miles o millones de núcleos de procesamiento, la memoria compartida se vuelve física y tecnológicamente inviable por saturación de coherencia. La solución es la <strong>Memoria Distribuida</strong>: cada nodo es una computadora completa e independiente (con su propia CPU, memoria RAM y sistema operativo), comunicándose con los demás exclusivamente mediante el intercambio explícito de mensajes por una red de alta velocidad.</p>

      <h4>4.4.1 Redes de Interconexión Estáticas y Topologías</h4>
      <ul>
        <li><strong>Anillo (Ring):</strong> Cada nodo se conecta a 2 vecinos. Simple, pero el diámetro (distancia máxima entre nodos) es $\\lfloor N/2 \\rfloor$.</li>
        <li><strong>Malla 2D (Mesh):</strong> Nodos organizados en una cuadrícula $M \\times N$. Cada nodo interno tiene 4 enlaces. Diámetro: $(M-1) + (N-1)$.</li>
        <li><strong>Toro 2D/3D (Torus):</strong> Malla con enlaces circulares que unen los extremos. Reduce el diámetro a la mitad respecto a la malla convencional.</li>
        <li><strong>Hipercubo de dimensión $d$:</strong> Conecta $N = 2^d$ nodos. Cada nodo tiene $d$ enlaces directos. El diámetro es exactamente $d = \\log_2 N$. Excepcional para comunicaciones globales rápidas.</li>
      </ul>

      <h4>4.4.3 Programación de Clústeres: Paso de Mensajes con MPI</h4>
      <p>El estándar de facto en supercómputo es <strong>MPI (Message Passing Interface)</strong>. Las operaciones fundamentales incluyen:</p>
      <ul>
        <li><code>MPI_Send</code> y <code>MPI_Recv</code>: Comunicación punto a punto bloqueante o no bloqueante.</li>
        <li><code>MPI_Bcast</code> (Broadcast): Un nodo maestro difunde un dato a todos los demás nodos del clúster.</li>
        <li><code>MPI_Reduce</code>: Combina los resultados parciales de todos los nodos mediante una operación matemática (suma, máximo, producto) y entrega el resultado consolidado al maestro.</li>
      </ul>

      <h4>4.4.4 Consideraciones de Rendimiento: Ley de Amdahl vs. Ley de Gustafson</h4>
      <div class="theory-callout warning">
        <h4>Ley de Amdahl (Escalamiento Fuerte - Tamaño de problema fijo)</h4>
        <p>Establece el límite teórico máximo de aceleración (Speedup $S$) de un programa al usar $N$ procesadores, donde $f$ es la fracción del código estrictamente paralelizable ($0 \\le f \\le 1$):</p>
        <div class="math-block">
          $$S(N) = \\frac{1}{(1 - f) + \\frac{f}{N}} \\xrightarrow{N \\to \\infty} \\frac{1}{1 - f}$$
        </div>
        <p><strong>Conclusión contundente:</strong> Si solo el 90% de un programa es paralelizable ($f=0.90$), el 10% restante es estrictamente secuencial ($1-f=0.10$). Por más que se utilicen 10,000 procesadores, la aceleración jamás podrá superar $1 / 0.10 = \mathbf{10\\times}$. La fracción secuencial domina el límite final.</p>
      </div>

      <div class="theory-callout success">
        <h4>Ley de Gustafson-Barsis (Escalamiento Débil - Tamaño de problema escalable)</h4>
        <p>En problemas reales de ingeniería y ciencia (simulación de clima, astrofísica), al disponer de más procesadores los científicos aumentan la resolución del problema en lugar de resolver el mismo problema diminuto en menos tiempo:</p>
        <div class="math-block">
          $$S(N) = N - (1 - f)(N - 1)$$
        </div>
        <p>Bajo la Ley de Gustafson, el speedup puede crecer de forma prácticamente lineal con el número de nodos si el volumen de datos aumenta proporcionalmente.</p>
      </div>
    `,
    exerciseType: "simulator",
    exerciseId: "sim_amdahl_topologies",
    exerciseTitle: "Calculador Gráfico de Amdahl vs Gustafson y Explorador de Topologías",
    exerciseInstructions: "Ajusta la fracción paralelizable ($f$) y el número de nodos de cómputo ($N$). Compara gráficamente las curvas de Speedup de Amdahl frente a Gustafson e inspecciona visualmente las topologías de red (Anillo, Malla, Toro e Hipercubo).",
    exercisePoints: 100
  },
  {
    id: "u4_5",
    unit: 4,
    unitTitle: "Unidad 4: Procesamiento Paralelo",
    code: "4.5",
    title: "Casos de Estudio de Supercómputo: Beowulf, TOP500 y Computación Heterogénea con GPUs",
    badge: "Supercómputo Moderno",
    readTime: "15 min",
    weight: 6,
    summary: "Evolución histórica desde los primeros clústeres Beowulf de hardware comercial hasta las supercomputadoras Exascale modernas (Frontier, Fugaku) y clústeres de GPUs para IA.",
    theory: `
      <h3>4.5 Casos de Estudio en Supercómputo y Computación Paralela</h3>
      <p>El procesamiento paralelo ha evolucionado desde experimentos de laboratorio con hardware estándar hasta centros de datos multimillonarios que lideran la carrera tecnológica mundial.</p>

      <h4>1. El Clúster Beowulf (1994 - NASA)</h4>
      <p>Desarrollado por Thomas Sterling y Donald Becker en la NASA, demostró que era posible construir una supercomputadora de clase mundial interconectando computadoras personales estándar comerciales (COTS - Commercial Off-The-Shelf) ejecutando Linux y bibliotecas de paso de mensajes libres. Democratizó el acceso al cómputo de alto rendimiento en universidades y centros de investigación.</p>

      <h4>2. La Era Exascale: Supercomputadoras del TOP500</h4>
      <ul>
        <li><strong>Frontier (Oak Ridge National Laboratory, EE.UU.):</strong> Primera supercomputadora en superar oficialmente la barrera del <strong>Exaflop</strong> ($10^{18}$ operaciones de punto flotante por segundo) en LINPACK. Emplea procesadores AMD EPYC combinados con aceleradores AMD Instinct MI250X conectados mediante red Slingshot de Hewlett Packard Enterprise.</li>
        <li><strong>Fugaku (RIKEN, Japón):</strong> Basada en microprocesadores monoliticos ARM A64FX con extensiones vectoriales SVE de 512 bits y red propia Tofu Interconnect D, logrando liderazgo mundial en eficiencia energética y aplicaciones científicas reales.</li>
      </ul>

      <h4>3. Computación Heterogénea y Servidores de IA</h4>
      <p>El supercómputo actual es predominantemente <strong>heterogéneo</strong>: combina CPUs de propósito general (para orquestación, compilación y tareas del sistema operativo) con decenas de miles de <strong>GPUs o TPUs masivamente paralelas</strong> para el cálculo matricial pesado:</p>
      <ul>
        <li><strong>NVIDIA SuperPOD / DGX H100:</strong> Servidores con 8 GPUs H100 interconectadas mediante conmutadores <em>NVLink</em> de 900 GB/s por GPU, comunicándose entre nodos mediante tarjetas de red InfiniBand Quantum-2 a 400 Gbps.</li>
        <li><strong>Modelos de Programación:</strong> CUDA, HIP, OpenACC y frameworks de aprendizaje profundo (PyTorch, TensorFlow) que ocultan la complejidad de la sincronización paralela y el particionamiento de tensores.</li>
      </ul>
    `,
    exerciseType: "simulator",
    exerciseId: "sim_supercomputer_analyzer",
    exerciseTitle: "Analizador de Supercomputadoras Exascale y Récords TOP500",
    exerciseInstructions: "Explora la ficha técnica, número de núcleos, consumo energético en Megavatios y eficiencia FLOPS/Watt de las principales supercomputadoras del mundo.",
    exercisePoints: 100
  }
];

// Estadísticas iniciales del curso
const COURSE_METADATA = {
  institution: "Universidad Aztlán",
  course: "Arquitectura de Computadoras",
  code: "636",
  cycle: "Sexto Cuatrimestre",
  totalUnits: 4,
  totalTopics: CURRICULUM_DATA.length,
  evaluationRubric: {
    investigacion: { label: "Investigación y Prácticas", percent: 20 },
    reportes: { label: "Reportes de Lectura y Teoría", percent: 10 },
    proyectos: { label: "Proyectos y Ensamble", percent: 20 },
    examenesParciales: { label: "Exámenes Parciales", percent: 20 },
    examenFinal: { label: "Examen Final Integrador", percent: 30 }
  }
};
