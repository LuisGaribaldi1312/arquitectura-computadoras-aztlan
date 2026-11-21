/**
 * MOTOR DE SIMULADORES Y LABORATORIOS PRÁCTICOS INTERACTIVOS
 * Centro de Estudios: Universidad Aztlán
 * Asignatura: Arquitectura de Computadoras (Clave 636)
 * Profesor Titular & Super Administrador: Ing. Luis Garibaldi
 *
 * TODOS LOS EJERCICIOS SON 100% INTERACTIVOS:
 * El estudiante debe operar circuitos, calcular parámetros, manipular buses,
 * configurar estados de hardware y comprobar visualmente el funcionamiento real.
 */

const SimulatorEngine = {
  // Renderizador principal según el ejercicio solicitado
  render(containerId, exerciseId, studentData, onCompleteCallback) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    const userScore = studentData?.scores?.[exerciseId] || 0;
    const isCompleted = studentData?.completedExercises?.includes(exerciseId) || false;

    // Encabezado de estado y progreso del laboratorio
    const headerHtml = `
      <div class="exercise-header-card">
        <div class="exercise-header-info">
          <span class="badge ${isCompleted ? 'badge-success' : 'badge-warning'}">
            ${isCompleted ? '✓ Laboratorio Acreditado' : '⏳ Laboratorio Práctico en Curso'}
          </span>
          <span class="score-pill">Puntuación de Desempeño: <strong>${userScore} / 100 pts</strong></span>
        </div>
        <p class="exercise-help-text">
          <i class="icon">🛠️</i> <strong>Instrucciones Prácticas:</strong> Interactúa directamente con los controles del circuito, ejecuta los pasos experimentales y verifica tu solución para registrar tu calificación en el sistema.
        </p>
      </div>
      <div id="sim_workspace_${exerciseId}" class="sim-workspace"></div>
    `;
    container.innerHTML = headerHtml;

    const workspace = document.getElementById(`sim_workspace_${exerciseId}`);

    // Despacho del laboratorio específico
    switch (exerciseId) {
      case "sim_von_neumann_harvard":
        this.renderVonNeumannHarvard(workspace, exerciseId, onCompleteCallback);
        break;
      case "sim_pipeline_hazards":
        this.renderPipelineHazards(workspace, exerciseId, onCompleteCallback);
        break;
      case "sim_multiprocessing_numa":
        this.renderNumaSim(workspace, exerciseId, onCompleteCallback);
        break;
      case "sim_cpu_datapath":
        this.renderDatapathSim(workspace, exerciseId, onCompleteCallback);
        break;
      case "sim_cache_memory":
        this.renderCacheSim(workspace, exerciseId, onCompleteCallback);
        break;
      case "sim_io_dma_comparison":
        this.renderIoDmaSim(workspace, exerciseId, onCompleteCallback);
        break;
      case "sim_bus_arbitration":
        this.renderBusArbitrationSim(workspace, exerciseId, onCompleteCallback);
        break;
      case "sim_interrupt_stack":
        this.renderInterruptStackSim(workspace, exerciseId, onCompleteCallback);
        break;
      case "sim_cpu_organization":
        this.renderCpuOrgSim(workspace, exerciseId, onCompleteCallback);
        break;
      case "sim_registers_flags":
        this.renderRegistersFlagsSim(workspace, exerciseId, onCompleteCallback);
        break;
      case "sim_addressing_modes":
        this.renderAddressingModesSim(workspace, exerciseId, onCompleteCallback);
        break;
      case "sim_cpu_comparison":
        this.renderCpuComparisonSim(workspace, exerciseId, onCompleteCallback);
        break;
      case "sim_chipset_explorer":
        this.renderChipsetSim(workspace, exerciseId, onCompleteCallback);
        break;
      case "sim_pc_builder":
        this.renderPcBuilderSim(workspace, exerciseId, onCompleteCallback);
        break;
      case "sim_power_thermal":
        this.renderPowerThermalSim(workspace, exerciseId, onCompleteCallback);
        break;
      case "sim_parallel_basics":
        this.renderParallelBasicsSim(workspace, exerciseId, onCompleteCallback);
        break;
      case "sim_flynn_taxonomy":
        this.renderFlynnTaxonomySim(workspace, exerciseId, onCompleteCallback);
        break;
      case "sim_cache_coherence_mesi":
        this.renderMesiCoherenceSim(workspace, exerciseId, onCompleteCallback);
        break;
      case "sim_amdahl_topologies":
        this.renderAmdahlTopologiesSim(workspace, exerciseId, onCompleteCallback);
        break;
      case "sim_supercomputer_analyzer":
        this.renderSupercomputerSim(workspace, exerciseId, onCompleteCallback);
        break;
      default:
        workspace.innerHTML = `<div class="alert alert-info">Laboratorio en desarrollo para ${exerciseId}.</div>`;
    }
  },

  // =========================================================================
  // 1. TEMA 1.1.1: LABORATORIO VON NEUMANN VS HARVARD (ENRUTAMIENTO DE BUSES)
  // =========================================================================
  renderVonNeumannHarvard(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="interactive-lab-card">
        <div class="lab-title-bar">
          <h4>Laboratorio Interactivo: Enrutamiento y Detección del Cuello de Botella de Bus</h4>
          <span class="badge badge-primary">Paso Práctico 1 de 2</span>
        </div>
        <p class="lab-instruction">
          <strong>Objetivo:</strong> Ejecuta la instrucción <code>LOAD [0x0200]</code> (Cargar el contenido de la dirección 0x0200 en el Acumulador).
          Opera los interruptores de bus para experimentar por qué Von Neumann requiere 2 ciclos de reloj y Harvard lo logra en 1 solo ciclo simultáneo.
        </p>

        <!-- SECCIÓN 1: VON NEUMANN -->
        <div class="circuit-board-box">
          <h5>1. Máquina Von Neumann (Bus Unificado Compartido)</h5>
          <div class="vn-circuit-diagram">
            <div class="hw-module cpu-module">
              <span class="hw-tag">CPU</span>
              <div class="hw-reg" id="vn_lab_pc">PC: 0x0100</div>
              <div class="hw-reg" id="vn_lab_ir">IR: [Vacío]</div>
              <div class="hw-reg" id="vn_lab_acc">ACC: 0x0000</div>
            </div>

            <div class="hw-bus-line" id="vn_lab_bus_line">
              <div class="bus-state-indicator" id="vn_bus_state">ESTADO DEL BUS: INACTIVO</div>
              <div class="data-packet" id="vn_bus_packet">PAQUETE</div>
            </div>

            <div class="hw-module mem-module">
              <span class="hw-tag">MEMORIA UNIFICADA (RAM)</span>
              <div class="mem-row active" id="mem_inst_row">[0x0100] CÓDIGO: LOAD 0x0200</div>
              <div class="mem-row" id="mem_data_row">[0x0200] DATO: 0x00FF (Valor 255)</div>
            </div>
          </div>

          <div class="lab-switch-controls">
            <span>Operar Conmutador del Bus Único:</span>
            <button class="btn btn-secondary" id="btn_vn_fetch">1. Conectar Bus a Instrucción [0x0100]</button>
            <button class="btn btn-secondary" id="btn_vn_both">Intentar Conectar Datos al Mismo Tiempo</button>
            <button class="btn btn-primary" id="btn_vn_data" disabled>2. Ciclo Siguiente: Conectar Bus a Operando [0x0200]</button>
          </div>
          <div id="vn_collision_alert" class="alert alert-danger" style="display: none; margin-top: 10px;"></div>
        </div>

        <!-- SECCIÓN 2: HARVARD -->
        <div class="circuit-board-box" style="margin-top: 20px;">
          <h5>2. Máquina Harvard (Buses Físicos Totalmente Separados)</h5>
          <div class="hv-dual-circuit">
            <div class="hw-module cpu-module">
              <span class="hw-tag">CPU HARVARD</span>
              <div class="hw-reg">PC: 0x0100</div>
              <div class="hw-reg" id="hv_lab_ir">IR: LOAD 0x0200</div>
              <div class="hw-reg" id="hv_lab_acc">ACC: 0x00FF</div>
            </div>
            <div class="dual-wires-box">
              <div class="hw-bus-line bus-inst" id="hv_wire_inst">
                <span>BUS INDEPENDIENTE DE INSTRUCCIONES &rarr; Fetch en paralelo</span>
              </div>
              <div class="hw-bus-line bus-data" id="hv_wire_data">
                <span>BUS INDEPENDIENTE DE DATOS &rarr; Lectura de operando en paralelo</span>
              </div>
            </div>
            <div class="dual-mem-box">
              <div class="hw-module"><span class="hw-tag">MEM. INSTRUCCIÓN</span> [0x0100] LOAD 0x0200</div>
              <div class="hw-module"><span class="hw-tag">MEM. DATOS</span> [0x0200] Dato: 0x00FF</div>
            </div>
          </div>
          <div class="lab-switch-controls">
            <button class="btn btn-success" id="btn_hv_dual_exec">Ejecutar Transferencia Concurrente Harvard (Ciclo Único)</button>
          </div>
        </div>

        <div class="lab-verification-footer">
          <div id="lab_status_vn_hv" class="lab-feedback-banner">Completa la secuencia práctica en ambos modelos para calificar.</div>
          <button class="btn btn-success btn-lg" id="btn_complete_vn_hv" disabled>✓ Validar Laboratorio y Acreditar (100 pts)</button>
        </div>
      </div>
    `;

    let vnStep1Done = false;
    let vnStep2Done = false;
    let hvDone = false;

    const btnFetch = document.getElementById("btn_vn_fetch");
    const btnBoth = document.getElementById("btn_vn_both");
    const btnData = document.getElementById("btn_vn_data");
    const alertBox = document.getElementById("vn_collision_alert");
    const busState = document.getElementById("vn_bus_state");
    const busLine = document.getElementById("vn_lab_bus_line");
    const irVal = document.getElementById("vn_lab_ir");
    const accVal = document.getElementById("vn_lab_acc");
    const btnHv = document.getElementById("btn_hv_dual_exec");
    const statusBanner = document.getElementById("lab_status_vn_hv");
    const btnComplete = document.getElementById("btn_complete_vn_hv");

    btnFetch.onclick = () => {
      vnStep1Done = true;
      busLine.className = "hw-bus-line bus-busy";
      busState.textContent = "CICLO 1 (FETCH): Bus ocupado transportando la instrucción LOAD 0x0200 hacia el IR";
      irVal.textContent = "IR: LOAD 0x0200";
      irVal.classList.add("highlight-green");
      btnData.disabled = false;
      alertBox.style.display = "none";
    };

    btnBoth.onclick = () => {
      alertBox.innerHTML = `<strong>⚠️ COLISIÓN FÍSICA EN EL BUS DEL SISTEMA:</strong><br>
        En Von Neumann solo existe un juego de líneas eléctricas. Intentar leer el operando de 0x0200 mientras se transporta la instrucción en 0x0100 genera cortocircuito de señales (Cuello de Botella). Debes esperar al Ciclo 2.`;
      alertBox.style.display = "block";
    };

    btnData.onclick = () => {
      if (!vnStep1Done) return;
      vnStep2Done = true;
      busLine.className = "hw-bus-line bus-data-mode";
      busState.textContent = "CICLO 2 (OPERANDO): Bus reasignado para transportar el dato 0x00FF al Acumulador";
      accVal.textContent = "ACC: 0x00FF (255)";
      accVal.classList.add("highlight-green");
      checkProgress();
    };

    btnHv.onclick = () => {
      hvDone = true;
      document.getElementById("hv_wire_inst").classList.add("bus-active-pulse");
      document.getElementById("hv_wire_data").classList.add("bus-active-pulse");
      document.getElementById("hv_lab_ir").classList.add("highlight-green");
      document.getElementById("hv_lab_acc").classList.add("highlight-green");
      checkProgress();
    };

    function checkProgress() {
      if (vnStep1Done && vnStep2Done && hvDone) {
        statusBanner.className = "lab-feedback-banner success";
        statusBanner.innerHTML = "<strong>¡Excelente comprensión práctica!</strong> Has demostrado que Von Neumann requirió 2 ciclos secuenciales debido al bus único compartido, mientras Harvard completó la transferencia de código y datos en 1 solo ciclo simultáneo.";
        btnComplete.disabled = false;
      }
    }

    btnComplete.onclick = () => {
      if (onComplete) onComplete(exerciseId, 100);
      btnComplete.textContent = "✓ Acreditado en la Base de Datos";
      btnComplete.disabled = true;
    };
  },

  // =========================================================================
  // 2. TEMA 1.1.2: LABORATORIO PIPELINE (RESOLUCIÓN DE HAZARDS & FORWARDING)
  // =========================================================================
  renderPipelineHazards(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="interactive-lab-card">
        <div class="lab-title-bar">
          <h4>Laboratorio de Segmentación: Resolución Interactiva de Conflictos de Datos (RAW)</h4>
        </div>
        <p class="lab-instruction">
          <strong>Problema de Ingeniería:</strong> El compilador genera la secuencia de instrucciones mostrada abajo. La instrucción <code>I2</code> necesita el valor de <code>R1</code> calculado por <code>I1</code>.
          Resuelve el conflicto insertando burbujas (Stalls) o conectando el circuito de <strong>Data Forwarding</strong>.
        </p>

        <div class="assembly-code-box">
          <code>
            I1: ADD R1, R2, R3    <span class="comment">; R1 = R2 + R3 (El cálculo se completa al final de la etapa EX)</span><br>
            I2: SUB R4, R1, R5    <span class="comment">; R4 = R1 - R5 (¡Riesgo RAW! Requiere R1 inmediatamente para su ALU)</span>
          </code>
        </div>

        <div class="interactive-pipeline-controls">
          <label class="circuit-switch">
            <input type="checkbox" id="chk_lab_fwd">
            <span class="switch-toggle"></span>
            <strong>Activar Puente Eléctrico de Forwarding (Bypass EX &rarr; EX)</strong>
          </label>
          <div class="pipeline-step-btns">
            <button class="btn btn-primary" id="btn_step_pipe_cycle">Pulsar Reloj (+1 Ciclo)</button>
            <button class="btn btn-secondary" id="btn_reset_pipe_lab">Reiniciar Cauce</button>
            <span class="cycle-counter-badge">Ciclo Actual: <strong id="lbl_pipe_clk">0</strong></span>
          </div>
        </div>

        <div class="pipeline-grid-visual" id="pipe_grid_canvas"></div>

        <div class="circuit-telemetry">
          <span>Burbujas (Stalls) en Cauce: <strong id="lbl_telemetry_stalls" class="text-warning">0</strong></span> |
          <span>Ciclos Totales Requeridos: <strong id="lbl_telemetry_cycles">--</strong></span> |
          <span>Eficiencia CPI: <strong id="lbl_telemetry_cpi">--</strong></span>
        </div>

        <div class="lab-verification-footer">
          <div id="pipe_lab_feedback" class="lab-feedback-banner">Simula la ejecución con y sin Forwarding para observar el impacto en los ciclos de reloj.</div>
          <button class="btn btn-success btn-lg" id="btn_complete_pipe" disabled>✓ Guardar Calificación del Laboratorio (100 pts)</button>
        </div>
      </div>
    `;

    let clk = 0;
    let testedWithout = false;
    let testedWith = false;

    const chkFwd = document.getElementById("chk_lab_fwd");
    const clkLbl = document.getElementById("lbl_pipe_clk");
    const grid = document.getElementById("pipe_grid_canvas");
    const stallsLbl = document.getElementById("lbl_telemetry_stalls");
    const cycLbl = document.getElementById("lbl_telemetry_cycles");
    const cpiLbl = document.getElementById("lbl_telemetry_cpi");
    const feedback = document.getElementById("pipe_lab_feedback");
    const btnSubmit = document.getElementById("btn_complete_pipe");

    function renderPipeGrid() {
      const isFwd = chkFwd.checked;
      let html = `<table class="pipe-interactive-table"><thead><tr><th>Instrucción</th>`;
      for (let c = 1; c <= 7; c++) {
        html += `<th class="${c === clk ? 'active-clk' : ''}">C${c}</th>`;
      }
      html += `</tr></thead><tbody>`;

      if (isFwd) {
        html += `
          <tr><td>I1: ADD R1, R2, R3</td>
            <td class="${clk>=1?'stage-if':''}">IF</td>
            <td class="${clk>=2?'stage-id':''}">ID</td>
            <td class="${clk>=3?'stage-ex fwd-source':''}">EX &rarr;</td>
            <td class="${clk>=4?'stage-mem':''}">MEM</td>
            <td class="${clk>=5?'stage-wb':''}">WB</td><td>-</td><td>-</td>
          </tr>
          <tr><td>I2: SUB R4, R1, R5</td><td>-</td>
            <td class="${clk>=2?'stage-if':''}">IF</td>
            <td class="${clk>=3?'stage-id':''}">ID</td>
            <td class="${clk>=4?'stage-ex fwd-target':''}">⚡ EX</td>
            <td class="${clk>=5?'stage-mem':''}">MEM</td>
            <td class="${clk>=6?'stage-wb':''}">WB</td><td>-</td>
          </tr>
        `;
        stallsLbl.textContent = "0 Burbujas (Paso Directo)";
        cycLbl.textContent = clk >= 6 ? "6 ciclos" : "Simulando...";
        cpiLbl.textContent = clk >= 6 ? "1.00 (Óptimo)" : "--";
        if (clk >= 6) testedWith = true;
      } else {
        html += `
          <tr><td>I1: ADD R1, R2, R3</td>
            <td class="${clk>=1?'stage-if':''}">IF</td>
            <td class="${clk>=2?'stage-id':''}">ID</td>
            <td class="${clk>=3?'stage-ex':''}">EX</td>
            <td class="${clk>=4?'stage-mem':''}">MEM</td>
            <td class="${clk>=5?'stage-wb':''}">WB</td><td>-</td><td>-</td>
          </tr>
          <tr><td>I2: SUB R4, R1, R5</td><td>-</td>
            <td class="${clk>=2?'stage-if':''}">IF</td>
            <td class="${clk>=3?'stage-id':''}">ID</td>
            <td class="${clk>=4?'stage-stall':''}">STALL</td>
            <td class="${clk>=5?'stage-stall':''}">STALL</td>
            <td class="${clk>=6?'stage-ex':''}">EX</td>
            <td class="${clk>=7?'stage-wb':''}">WB</td>
          </tr>
        `;
        stallsLbl.textContent = "2 Burbujas de Parada";
        cycLbl.textContent = clk >= 7 ? "7 ciclos (Penalizado)" : "Simulando...";
        cpiLbl.textContent = clk >= 7 ? "1.50 (Degradado)" : "--";
        if (clk >= 7) testedWithout = true;
      }
      html += `</tbody></table>`;
      grid.innerHTML = html;

      if (testedWith && testedWithout) {
        feedback.className = "lab-feedback-banner success";
        feedback.innerHTML = "<strong>¡Comprobación exitosa del circuito!</strong> Has experimentado en el silicio virtual cómo el cortocircuito (Forwarding) elimina 2 ciclos muertos de burbuja permitiendo que la etapa EX de SUB reciba el dato inmediatamente desde la salida de la ALU de ADD.";
        btnSubmit.disabled = false;
      }
    }

    renderPipeGrid();

    chkFwd.onchange = () => {
      clk = 0;
      clkLbl.textContent = "0";
      renderPipeGrid();
    };

    document.getElementById("btn_step_pipe_cycle").onclick = () => {
      if (clk < 7) clk++;
      clkLbl.textContent = clk;
      renderPipeGrid();
    };

    document.getElementById("btn_reset_pipe_lab").onclick = () => {
      clk = 0;
      clkLbl.textContent = "0";
      renderPipeGrid();
    };

    btnSubmit.onclick = () => {
      if (onComplete) onComplete(exerciseId, 100);
      btnSubmit.textContent = "✓ Acreditado en Base de Datos";
      btnSubmit.disabled = true;
    };
  },

  // =========================================================================
  // 3. TEMA 1.1.3: LABORATORIO NUMA (BENCHMARK DE AFINIDAD Y LATENCIAS)
  // =========================================================================
  renderNumaSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="interactive-lab-card">
        <div class="lab-title-bar">
          <h4>Laboratorio Interactivo de Servidores NUMA: Asignación de Hilos y Latencia de Memoria</h4>
        </div>
        <p class="lab-instruction">
          <strong>Escenario de Producción:</strong> En un servidor de base de datos dual-socket *AMD EPYC*, el Hilo 0 corre en el Socket 0.
          Configura la política de afinidad de memoria del sistema operativo y ejecuta la prueba de estrés para medir la latencia del bus inter-socket *Infinity Fabric*.
        </p>

        <div class="numa-interactive-workbench">
          <div class="socket-box" id="sock_0">
            <h5>Socket 0 (Nodo NUMA 0)</h5>
            <div class="core-grid-visual">
              <span class="core-active">Core 0 (Hilo Activo)</span>
              <span>Core 1</span>
              <span>Core 2</span>
              <span>Core 3</span>
            </div>
            <div class="ram-bank local" id="ram_bank_0">
              Banco RAM Local 0 (DDR5 5600 MHz)
              <div class="speed-tag">Latencia Fisiológica: 48 ns</div>
            </div>
          </div>

          <div class="interconnect-bridge">
            <span class="bridge-tag">Enlace UPI / Infinity Fabric</span>
            <div class="traffic-light" id="upi_traffic_meter">Tráfico: 0 GB/s</div>
            <div class="packet-arrow" id="upi_arrow">&harr;</div>
          </div>

          <div class="socket-box" id="sock_1">
            <h5>Socket 1 (Nodo NUMA 1)</h5>
            <div class="core-grid-visual">
              <span>Core 4</span>
              <span>Core 5</span>
              <span>Core 6</span>
              <span>Core 7</span>
            </div>
            <div class="ram-bank" id="ram_bank_1">
              Banco RAM Remoto 1 (DDR5 5600 MHz)
              <div class="speed-tag">Latencia con Enlace: 115 ns</div>
            </div>
          </div>
        </div>

        <div class="numa-policy-selector">
          <strong>Selecciona Política del Planificador del Sistema Operativo:</strong>
          <div class="policy-radios">
            <label class="p-opt">
              <input type="radio" name="numa_pol" value="local" checked>
              <span>Afinidad Estricta Local (<code>numactl --membind=0</code>)</span>
            </label>
            <label class="p-opt">
              <input type="radio" name="numa_pol" value="remote">
              <span>Asignación Remota Desbalanceada (Acceder a RAM del Socket 1)</span>
            </label>
          </div>
          <button class="btn btn-primary" id="btn_run_numa_benchmark">Ejecutar Prueba de Latencia en Tiempo Real</button>
        </div>

        <div class="benchmark-telemetry-box" id="numa_results_box" style="display: none;">
          <h5>Resultados de Telemetría del Servidor:</h5>
          <div class="telemetry-cols">
            <div>Latencia Media de Acceso: <strong id="res_numa_lat" class="text-success">48 ns</strong></div>
            <div>Saturación del Enlace Inter-Socket: <strong id="res_numa_sat">2% (Mínimo)</strong></div>
            <div>Impacto en Throughput de Base de Datos: <strong id="res_numa_tps">+100% (Óptimo)</strong></div>
          </div>
        </div>

        <div class="lab-verification-footer">
          <div id="numa_lab_feedback" class="lab-feedback-banner">Selecciona la política óptima y ejecuta la prueba para validar.</div>
          <button class="btn btn-success btn-lg" id="btn_complete_numa" disabled>✓ Acreditar Laboratorio NUMA (100 pts)</button>
        </div>
      </div>
    `;

    const btnBench = document.getElementById("btn_run_numa_benchmark");
    const resBox = document.getElementById("numa_results_box");
    const latLbl = document.getElementById("res_numa_lat");
    const satLbl = document.getElementById("res_numa_sat");
    const tpsLbl = document.getElementById("res_numa_tps");
    const trafficMeter = document.getElementById("upi_traffic_meter");
    const feedback = document.getElementById("numa_lab_feedback");
    const btnComplete = document.getElementById("btn_complete_numa");

    btnBench.onclick = () => {
      const pol = document.querySelector('input[name="numa_pol"]:checked').value;
      resBox.style.display = "block";

      if (pol === "local") {
        latLbl.textContent = "48 ns (Acceso Local a RAM 0)";
        latLbl.className = "text-success";
        satLbl.textContent = "3.2% (Enlace Libre)";
        tpsLbl.textContent = "142,000 Transacciones/seg (Máximo rendimiento)";
        trafficMeter.textContent = "Tráfico UPI: 1.2 GB/s";
        trafficMeter.style.background = "#065f46";

        feedback.className = "lab-feedback-banner success";
        feedback.innerHTML = "<strong>¡Excelente optimización NUMA!</strong> Al vincular la memoria del proceso al mismo nodo físico del hilo, se eliminó la latencia del enlace interconectador, logrando el rendimiento máximo de 48 ns.";
        btnComplete.disabled = false;
      } else {
        latLbl.textContent = "118 ns (+145% de penalización por enlace remoto)";
        latLbl.className = "text-danger";
        satLbl.textContent = "89.4% (Cuello de Botella en Enlace Inter-Socket)";
        tpsLbl.textContent = "58,000 Transacciones/seg (Degradación severa)";
        trafficMeter.textContent = "Tráfico UPI: 54.8 GB/s (Saturado)";
        trafficMeter.style.background = "#991b1b";

        feedback.className = "lab-feedback-banner error";
        feedback.innerHTML = "<strong>Penalización por Acceso Remoto:</strong> Observa cómo cruzar el enlace inter-socket más que duplica la latencia y satura el bus. Cambia la política a 'Afinidad Estricta Local' y vuelve a probar.";
      }
    };

    btnComplete.onclick = () => {
      if (onComplete) onComplete(exerciseId, 100);
      btnComplete.textContent = "✓ Acreditado en Base de Datos";
      btnComplete.disabled = true;
    };
  },

  // =========================================================================
  // 4. TEMA 1.2.1: LABORATORIO DE CAMINO DE DATOS (DATAPATH & ALU MICRO-OPS)
  // =========================================================================
  renderDatapathSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="interactive-lab-card">
        <div class="lab-title-bar">
          <h4>Laboratorio del Camino de Datos (Datapath): Orquestación de Microoperaciones</h4>
        </div>
        <p class="lab-instruction">
          <strong>Desafío de Arquitectura:</strong> Debes ejecutar la micro-secuencia física que suma los valores de dos registros en el procesador.
          Activa en el orden cronológico estricto del ciclo de reloj cada una de las 5 señales de control de los buses internos.
        </p>

        <div class="datapath-live-circuit">
          <div class="dp-block-box" id="box_pc">
            <span class="dp-name">PC</span>
            <div class="dp-val" id="dp_val_pc">0x0040</div>
          </div>
          <div class="dp-bus-segment" id="seg_pc_mar">&rarr;</div>
          <div class="dp-block-box" id="box_mar">
            <span class="dp-name">MAR</span>
            <div class="dp-val" id="dp_val_mar">----</div>
          </div>
          <div class="dp-bus-segment" id="seg_mar_mem">&rarr;</div>
          <div class="dp-block-box" id="box_mem">
            <span class="dp-name">RAM</span>
            <div class="dp-val" id="dp_val_mem">[ADD R1, R2]</div>
          </div>
          <div class="dp-bus-segment" id="seg_mem_mbr">&rarr;</div>
          <div class="dp-block-box" id="box_mbr">
            <span class="dp-name">MBR</span>
            <div class="dp-val" id="dp_val_mbr">----</div>
          </div>
          <div class="dp-bus-segment" id="seg_mbr_ir">&rarr;</div>
          <div class="dp-block-box" id="box_ir">
            <span class="dp-name">IR</span>
            <div class="dp-val" id="dp_val_ir">----</div>
          </div>
        </div>

        <div class="alu-interactive-unit" style="margin-top: 20px;">
          <div class="alu-registers">
            <div class="hw-reg">Reg R1: <strong>25 (0x19)</strong></div>
            <div class="hw-reg">Reg R2: <strong>15 (0x0F)</strong></div>
          </div>
          <div class="alu-shape-visual" id="alu_core_box">
            <span>ALU (Unidad Aritmética)</span>
            <div id="alu_status_light">Estado: En espera de señales</div>
          </div>
          <div class="acc-register-box" id="box_acc">
            <span>Registro Acumulador (ACC):</span>
            <strong id="dp_val_acc">0</strong>
          </div>
        </div>

        <div class="micro-ops-buttons-panel">
          <span>Activar Señal de Control:</span>
          <div class="mop-btns-grid">
            <button class="btn btn-secondary mop-btn" data-step="1" id="mop_1">1: Señal C1 (MAR &larr; PC)</button>
            <button class="btn btn-secondary mop-btn" data-step="2" id="mop_2" disabled>2: Señal C2 (MBR &larr; Memoria & PC++)</button>
            <button class="btn btn-secondary mop-btn" data-step="3" id="mop_3" disabled>3: Señal C3 (IR &larr; MBR)</button>
            <button class="btn btn-secondary mop-btn" data-step="4" id="mop_4" disabled>4: Señal C4 (Activar ALU: ADD)</button>
            <button class="btn btn-secondary mop-btn" data-step="5" id="mop_5" disabled>5: Señal C5 (ACC &larr; Salida ALU)</button>
          </div>
        </div>

        <div class="lab-verification-footer">
          <div id="dp_lab_feedback" class="lab-feedback-banner">Dispara la microoperación 1 para iniciar la carga de la dirección de memoria.</div>
          <button class="btn btn-success btn-lg" id="btn_complete_dp" disabled>✓ Validar Secuencia de Microoperaciones (100 pts)</button>
        </div>
      </div>
    `;

    let currentStep = 1;
    const feedback = document.getElementById("dp_lab_feedback");
    const btnSubmit = document.getElementById("btn_complete_dp");

    document.getElementById("mop_1").onclick = () => {
      document.getElementById("dp_val_mar").textContent = "0x0040";
      document.getElementById("box_mar").classList.add("dp-active");
      document.getElementById("seg_pc_mar").classList.add("wire-active");
      document.getElementById("mop_1").disabled = true;
      document.getElementById("mop_2").disabled = false;
      feedback.textContent = "Paso 1 completado: Dirección física transferida al MAR. Ahora lee de memoria.";
    };

    document.getElementById("mop_2").onclick = () => {
      document.getElementById("dp_val_mbr").textContent = "ADD R1, R2";
      document.getElementById("dp_val_pc").textContent = "0x0044 (PC++)";
      document.getElementById("box_mbr").classList.add("dp-active");
      document.getElementById("mop_2").disabled = true;
      document.getElementById("mop_3").disabled = false;
      feedback.textContent = "Paso 2 completado: Código de instrucción cargado en MBR y PC incrementado.";
    };

    document.getElementById("mop_3").onclick = () => {
      document.getElementById("dp_val_ir").textContent = "ADD R1, R2";
      document.getElementById("box_ir").classList.add("dp-active");
      document.getElementById("mop_3").disabled = true;
      document.getElementById("mop_4").disabled = false;
      feedback.textContent = "Paso 3 completado: Instrucción decodificada por la Unidad de Control. Activa la ALU.";
    };

    document.getElementById("mop_4").onclick = () => {
      document.getElementById("alu_core_box").classList.add("alu-computing");
      document.getElementById("alu_status_light").textContent = "ALU: Sumando 25 + 15 = 40 (0x28)";
      document.getElementById("mop_4").disabled = true;
      document.getElementById("mop_5").disabled = false;
      feedback.textContent = "Paso 4 completado: Cálculo efectuado. Escribe el resultado en el Acumulador.";
    };

    document.getElementById("mop_5").onclick = () => {
      document.getElementById("dp_val_acc").textContent = "40 (0x28)";
      document.getElementById("box_acc").classList.add("dp-active");
      document.getElementById("mop_5").disabled = true;

      feedback.className = "lab-feedback-banner success";
      feedback.innerHTML = "<strong>¡Secuencia de Microinstrucciones Perfecta!</strong> Has orquestado el datapath completo: Fetch &rarr; Decode &rarr; ALU Execute &rarr; Write-Back al Acumulador.";
      btnSubmit.disabled = false;
    };

    btnSubmit.onclick = () => {
      if (onComplete) onComplete(exerciseId, 100);
      btnSubmit.textContent = "✓ Acreditado en Base de Datos";
      btnSubmit.disabled = true;
    };
  },

  // =========================================================================
  // 5. TEMA 1.2.2: LABORATORIO DE CACHÉ (DESCOMPOSICIÓN TAG-INDEX-OFFSET & HIT/MISS)
  // =========================================================================
  renderCacheSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="interactive-lab-card">
        <div class="lab-title-bar">
          <h4>Laboratorio de Memoria Caché: Descomposición de Dirección Física y Detección de Fallos</h4>
        </div>
        <p class="lab-instruction">
          <strong>Misión Práctica:</strong> El procesador emite la dirección física de 16 bits: <code>0x3A44</code>.
          La memoria caché es de <strong>Mapeo Directo</strong> con 4 líneas (de la 0 a la 3) y bloques de 4 bytes.
          Calcula manualmente los campos binarios correspondientes y procesa la línea de caché.
        </p>

        <div class="cache-calculator-box">
          <div class="addr-given">
            Dirección Emitida por CPU: <code>0x3A44</code> &bull; Binario: <code>0011 1010 0100 0100</code>
          </div>

          <div class="bit-calculation-inputs">
            <div class="input-col">
              <label>1. TAG (Bits 4 al 15 - 12 bits):</label>
              <input type="text" id="inp_calc_tag" class="form-control" placeholder="Ej: 0x3A4">
              <span class="field-hint">Identifica el bloque en RAM</span>
            </div>
            <div class="input-col">
              <label>2. INDEX (Bits 2 y 3 - 2 bits):</label>
              <select id="inp_calc_index" class="form-control">
                <option value="">Selecciona línea...</option>
                <option value="0">Línea 0 (00b)</option>
                <option value="1">Línea 1 (01b)</option>
                <option value="2">Línea 2 (10b)</option>
                <option value="3">Línea 3 (11b)</option>
              </select>
              <span class="field-hint">Línea fija de caché asignada</span>
            </div>
            <div class="input-col">
              <label>3. OFFSET (Bits 0 y 1 - 2 bits):</label>
              <input type="text" id="inp_calc_offset" class="form-control" placeholder="Ej: 0x0">
              <span class="field-hint">Byte específico dentro del bloque</span>
            </div>
          </div>
          <button class="btn btn-primary" id="btn_verify_cache_bits">Verificar Descomposición de Bits</button>
        </div>

        <div class="cache-table-live-box" style="margin-top: 20px;">
          <h5>Estado Físico de las Líneas de la Caché L1:</h5>
          <table class="cache-lines-table">
            <thead>
              <tr><th>Línea / Index</th><th>Valid Bit</th><th>TAG Almacenado</th><th>Estado de Datos</th><th>Acción</th></tr>
            </thead>
            <tbody id="cache_table_body">
              <tr id="cline_0"><td>Línea 0 (00b)</td><td><span class="badge badge-secondary">0</span></td><td>--</td><td>Línea Vacía</td><td>-</td></tr>
              <tr id="cline_1"><td>Línea 1 (01b)</td><td><span class="badge badge-success">1</span></td><td>0x120</td><td>Datos de 0x1204</td><td>-</td></tr>
              <tr id="cline_2"><td>Línea 2 (10b)</td><td><span class="badge badge-secondary">0</span></td><td>--</td><td>Línea Vacía</td><td>-</td></tr>
              <tr id="cline_3"><td>Línea 3 (11b)</td><td><span class="badge badge-secondary">0</span></td><td>--</td><td>Línea Vacía</td><td>-</td></tr>
            </tbody>
          </table>
          <div id="cache_hit_status_banner" class="cache-result-banner" style="display: none;"></div>
        </div>

        <div class="lab-verification-footer">
          <div id="cache_lab_feedback" class="lab-feedback-banner">Calcula los campos TAG, INDEX y OFFSET a partir de la dirección 0x3A44.</div>
          <button class="btn btn-success btn-lg" id="btn_complete_cache" disabled>✓ Acreditar Laboratorio de Caché (100 pts)</button>
        </div>
      </div>
    `;

    const btnVerify = document.getElementById("btn_verify_cache_bits");
    const feedback = document.getElementById("cache_lab_feedback");
    const banner = document.getElementById("cache_hit_status_banner");
    const btnSubmit = document.getElementById("btn_complete_cache");

    btnVerify.onclick = () => {
      const tag = document.getElementById("inp_calc_tag").value.trim().toLowerCase();
      const idx = document.getElementById("inp_calc_index").value;
      const off = document.getElementById("inp_calc_offset").value.trim().toLowerCase();

      // En 0x3A44:
      // Bits 0-1 (Offset): 00b (0x0)
      // Bits 2-3 (Index): 01b (Línea 1)
      // Bits 4-15 (Tag): 0x3A4 (0011 1010 0100b)
      const isTagOk = tag === "0x3a4" || tag === "3a4";
      const isIdxOk = idx === "1";
      const isOffOk = off === "0x0" || off === "0" || off === "00";

      if (isTagOk && isIdxOk && isOffOk) {
        banner.style.display = "block";
        banner.className = "cache-result-banner banner-miss";
        banner.innerHTML = `<strong>RESULTADO DEL ACCESO: CACHE MISS (Fallo de Etiqueta)</strong><br>
          La dirección mapea a la Línea 1, pero contiene el TAG 0x120 en lugar de 0x3A4.<br>
          <em>Se expulsa la línea vieja y se carga el nuevo bloque desde la RAM principal.</em>`;

        // Actualizar línea de caché con el nuevo bloque cargado
        document.getElementById("cline_1").innerHTML = `
          <td>Línea 1 (01b)</td>
          <td><span class="badge badge-success">1</span></td>
          <td><code>0x3A4</code></td>
          <td class="text-success">Bloque 0x3A44 Cargado en Caché</td>
          <td><span class="badge badge-info">Actualizado</span></td>
        `;

        feedback.className = "lab-feedback-banner success";
        feedback.innerHTML = "<strong>¡Cálculo y diagnóstico 100% correctos!</strong> Has descompuesto la dirección en sus campos físicos exactos y demostrado cómo el controlador de caché maneja el reemplazo ante un fallo (Miss).";
        btnSubmit.disabled = false;
      } else {
        feedback.className = "lab-feedback-banner error";
        feedback.innerHTML = `<strong>Error en la descomposición:</strong><br>
          Para 0x3A44 (0011 1010 0100 0100b):<br>
          - Offset (2 bits más bajos): 00b (0x0)<br>
          - Index (siguientes 2 bits): 01b (Línea 1)<br>
          - Tag (12 bits restantes): 0x3A4. Corrige los campos y vuelve a verificar.`;
      }
    };

    btnSubmit.onclick = () => {
      if (onComplete) onComplete(exerciseId, 100);
      btnSubmit.textContent = "✓ Acreditado en Base de Datos";
      btnSubmit.disabled = true;
    };
  },

  // =========================================================================
  // 6. TEMA 1.2.3: LABORATORIO DE ENTRADA/SALIDA Y DMA
  // =========================================================================
  renderIoDmaSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="interactive-lab-card">
        <div class="lab-title-bar">
          <h4>Laboratorio de E/S: Programación de Controlador DMA vs Espera Ocupada (Polling)</h4>
        </div>
        <p class="lab-instruction">
          <strong>Misión:</strong> Transfiere un paquete masivo de 4096 bytes desde la tarjeta de red a la memoria RAM.
          Configura los registros del <strong>Controlador DMA 8237</strong> y observa cómo la CPU continúa ejecutando cálculos sin bloquearse.
        </p>

        <div class="dma-programmer-box">
          <h5>Registros de Configuración del Controlador DMA:</h5>
          <div class="dma-registers-grid">
            <div class="dma-reg-cell">
              <label>Registro Base Source (E/S Tarjeta de Red):</label>
              <input type="text" id="dma_src" class="form-control" value="0x0300" readonly>
            </div>
            <div class="dma-reg-cell">
              <label>Registro Base Destination (Búfer RAM):</label>
              <input type="text" id="dma_dst" class="form-control" value="0x8000">
            </div>
            <div class="dma-reg-cell">
              <label>Registro Byte Count (Longitud):</label>
              <input type="number" id="dma_cnt" class="form-control" value="4096">
            </div>
            <div class="dma-reg-cell">
              <label>Modo de Robo de Bus:</label>
              <select id="dma_mode" class="form-control">
                <option value="burst">Modo Ráfaga (Burst Mode)</option>
                <option value="cycle">Robo de Ciclo (Cycle Stealing)</option>
              </select>
            </div>
          </div>
          <button class="btn btn-primary" id="btn_arm_dma">Armar Controlador DMA y Disparar Transferencia</button>
        </div>

        <div class="dma-animation-stage" id="dma_stage_view" style="display: none; margin-top: 20px;">
          <div class="live-transfer-bar">
            <span>Progreso de Transferencia Directa a Memoria:</span>
            <div class="progress-bar-container"><div class="progress-bar-fill" id="dma_progress_fill" style="width: 0%;"></div></div>
          </div>
          <div class="status-comparison-cols">
            <div class="col-box">
              <strong>Estado de la CPU:</strong>
              <span id="dma_cpu_status" class="text-success">Cálculo de Matemáticas Activo (1.2% carga de E/S)</span>
            </div>
            <div class="col-box">
              <strong>Línea de Interrupción (IRQ 5):</strong>
              <span id="dma_irq_status">En espera de finalizar bloque completo</span>
            </div>
          </div>
        </div>

        <div class="lab-verification-footer">
          <div id="dma_lab_feedback" class="lab-feedback-banner">Configura los registros del DMA y dispara la transferencia.</div>
          <button class="btn btn-success btn-lg" id="btn_complete_dma" disabled>✓ Validar Laboratorio de DMA (100 pts)</button>
        </div>
      </div>
    `;

    const btnArm = document.getElementById("btn_arm_dma");
    const stage = document.getElementById("dma_stage_view");
    const fill = document.getElementById("dma_progress_fill");
    const irqStatus = document.getElementById("dma_irq_status");
    const feedback = document.getElementById("dma_lab_feedback");
    const btnSubmit = document.getElementById("btn_complete_dma");

    btnArm.onclick = () => {
      stage.style.display = "block";
      btnArm.disabled = true;
      let p = 0;
      const interval = setInterval(() => {
        p += 25;
        fill.style.width = `${p}%`;
        if (p >= 100) {
          clearInterval(interval);
          irqStatus.textContent = "⚡ INTERRUPCIÓN DISPARADA: Bloque completo transferido.";
          irqStatus.className = "text-warning";

          feedback.className = "lab-feedback-banner success";
          feedback.innerHTML = "<strong>¡Transferencia DMA Completada con Éxito!</strong> El hardware demostró cómo los 4096 bytes entraron directo a RAM sin que la CPU gastara millones de ciclos en un bucle ocupado (polling), emitiendo solo 1 interrupción final.";
          btnSubmit.disabled = false;
        }
      }, 300);
    };

    btnSubmit.onclick = () => {
      if (onComplete) onComplete(exerciseId, 100);
      btnSubmit.textContent = "✓ Acreditado en Base de Datos";
      btnSubmit.disabled = true;
    };
  },

  // =========================================================================
  // 7. TEMA 1.2.4: LABORATORIO DE BUSES Y ARBITRAJE DAISY-CHAIN
  // =========================================================================
  renderBusArbitrationSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="interactive-lab-card">
        <div class="lab-title-bar">
          <h4>Laboratorio de Buses: Arbitraje de Prioridad Daisy-Chain y Cálculo de Ancho de Banda</h4>
          <span class="badge badge-info">Topología de Prioridad Física Serial</span>
        </div>
        <p class="lab-instruction">
          <strong>Desafío Práctico:</strong> Tres dispositivos compiten simultáneamente por el bus del sistema:
          <strong>Dispositivo 1 (GPU)</strong>, <strong>Dispositivo 2 (Tarjeta de Red 10G)</strong> y <strong>Dispositivo 3 (Controlador SSD)</strong>.
          Propaga la señal de concesión (<code>Bus Grant - BGRANT</code>) para observar cómo la topología en cascada (<em>Daisy-Chain</em>) resuelve el conflicto por proximidad física.
        </p>

        <!-- Diagrama Interactivo Daisy-Chain -->
        <div class="daisy-chain-diagram">
          <div class="arbiter-box" id="arbiter_main_box">
            <span class="arbiter-title">⚡ ÁRBITRO CENTRAL</span>
            <div class="req-indicator" id="arbiter_req_light">🔴 BREQ: 3 Peticiones Activas</div>
            <div class="arbiter-state" id="arbiter_grant_state">BGRANT = Alto (1)</div>
          </div>

          <div class="grant-wire wire-active" id="wire_arbiter_d1">
            <span class="wire-signal">→ BGRANT →</span>
          </div>

          <div class="daisy-device" id="ddev_1">
            <div class="dev-header">
              <strong>Dispositivo 1: GPU</strong>
              <span class="prio-tag prio-high">Prioridad 1 (Más cercana)</span>
            </div>
            <div class="dev-status-tag" id="status_dev1">Solicitando Bus...</div>
            <div class="dev-action-box">
              <button class="btn btn-sm btn-primary" id="btn_grant_dev1">1. Tomar Bus (GPU)</button>
            </div>
          </div>

          <div class="grant-wire wire-idle" id="wire_d1_d2">
            <span class="wire-signal" id="sig_d1_d2">→ En Espera →</span>
          </div>

          <div class="daisy-device" id="ddev_2">
            <div class="dev-header">
              <strong>Dispositivo 2: NIC 10G</strong>
              <span class="prio-tag prio-med">Prioridad 2 (Intermedia)</span>
            </div>
            <div class="dev-status-tag" id="status_dev2">En espera de BGRANT</div>
            <div class="dev-action-box">
              <button class="btn btn-sm btn-secondary" id="btn_grant_dev2" disabled>Tomar Bus (NIC)</button>
            </div>
          </div>

          <div class="grant-wire wire-idle" id="wire_d2_d3">
            <span class="wire-signal" id="sig_d2_d3">→ En Espera →</span>
          </div>

          <div class="daisy-device" id="ddev_3">
            <div class="dev-header">
              <strong>Dispositivo 3: SSD</strong>
              <span class="prio-tag prio-low">Prioridad 3 (Más lejana)</span>
            </div>
            <div class="dev-status-tag" id="status_dev3">En espera de BGRANT</div>
            <div class="dev-action-box">
              <button class="btn btn-sm btn-secondary" id="btn_grant_dev3" disabled>Tomar Bus (SSD)</button>
            </div>
          </div>
        </div>

        <div class="daisy-reset-row" style="margin-top: 10px; text-align: right;">
          <button class="btn btn-xs btn-outline-secondary" id="btn_reset_daisy">🔄 Reiniciar Prueba de Arbitraje</button>
        </div>

        <!-- Calculador Dinámico de Ancho de Banda -->
        <div class="bus-bw-calc-panel" style="margin-top: 20px;">
          <h5>Calculador Dinámico de Ancho de Banda Físico:</h5>
          <p style="font-size: 13px; color: #94a3b8; margin-bottom: 12px;">
            Fórmula de transferencia en bus síncrono: <code>Ancho de Banda = (Ancho de Bus en Bytes) × Frecuencia de Operación</code>
          </p>
          <div class="form-row-2col">
            <label>Ancho del Bus de Datos:
              <select id="calc_b_width" class="form-control">
                <option value="64">64 bits (8 bytes - Estándar DDR4/DDR5)</option>
                <option value="128">128 bits (16 bytes - Dual Channel)</option>
                <option value="256">256 bits (32 bytes - GPU VRAM)</option>
              </select>
            </label>
            <label>Frecuencia de Operación:
              <input type="range" id="rng_b_freq" min="800" max="6400" step="400" value="3200" class="form-control">
              <span id="lbl_rng_freq">3200 MHz</span>
            </label>
          </div>
          <div class="result-highlight-card">
            <span>Ancho de Banda Máximo Teórico:</span>
            <h3 id="lbl_calc_bw" class="text-success">25.6 GB/s</h3>
          </div>
        </div>

        <div class="lab-verification-footer">
          <div id="bus_lab_feedback" class="lab-feedback-banner">
            👉 <strong>Paso 1:</strong> La señal BGRANT ha salido del Árbitro Central hacia la GPU. Haz clic en <strong>"1. Tomar Bus (GPU)"</strong> para observar cómo intercepta la señal.
          </div>
          <button class="btn btn-success btn-lg" id="btn_complete_bus" disabled>
            ✓ Acreditar Laboratorio de Buses (100 pts)
          </button>
        </div>
      </div>
    `;

    const btnDev1 = document.getElementById("btn_grant_dev1");
    const btnDev2 = document.getElementById("btn_grant_dev2");
    const btnDev3 = document.getElementById("btn_grant_dev3");
    const ddev1 = document.getElementById("ddev_1");
    const ddev2 = document.getElementById("ddev_2");
    const ddev3 = document.getElementById("ddev_3");
    const statusDev1 = document.getElementById("status_dev1");
    const statusDev2 = document.getElementById("status_dev2");
    const statusDev3 = document.getElementById("status_dev3");
    const wireD1D2 = document.getElementById("wire_d1_d2");
    const wireD2D3 = document.getElementById("wire_d2_d3");
    const sigD1D2 = document.getElementById("sig_d1_d2");
    const sigD2D3 = document.getElementById("sig_d2_d3");
    const arbiterReq = document.getElementById("arbiter_req_light");
    const arbiterState = document.getElementById("arbiter_grant_state");
    const feedback = document.getElementById("bus_lab_feedback");
    const btnSubmit = document.getElementById("btn_complete_bus");
    const btnReset = document.getElementById("btn_reset_daisy");

    function setupChain() {
      // Estado Inicial
      ddev1.className = "daisy-device";
      ddev2.className = "daisy-device";
      ddev3.className = "daisy-device";
      statusDev1.textContent = "Solicitando Bus (BREQ)...";
      statusDev1.style.color = "#fbbf24";
      statusDev2.textContent = "En espera de BGRANT";
      statusDev2.style.color = "#94a3b8";
      statusDev3.textContent = "En espera de BGRANT";
      statusDev3.style.color = "#94a3b8";

      wireD1D2.className = "grant-wire wire-idle";
      sigD1D2.textContent = "→ En Espera →";
      wireD2D3.className = "grant-wire wire-idle";
      sigD2D3.textContent = "→ En Espera →";

      arbiterReq.textContent = "🔴 BREQ: 3 Peticiones Activas";
      arbiterReq.style.background = "#991b1b";
      arbiterState.textContent = "BGRANT = Alto (Emitida)";

      btnDev1.disabled = false;
      btnDev1.className = "btn btn-sm btn-primary";
      btnDev1.textContent = "1. Tomar Bus (GPU)";

      btnDev2.disabled = true;
      btnDev2.className = "btn btn-sm btn-secondary";
      btnDev2.textContent = "Tomar Bus (NIC)";

      btnDev3.disabled = true;
      btnDev3.className = "btn btn-sm btn-secondary";
      btnDev3.textContent = "Tomar Bus (SSD)";

      feedback.className = "lab-feedback-banner";
      feedback.innerHTML = '👉 <strong>Paso 1:</strong> La señal BGRANT ha salido del Árbitro Central hacia la GPU. Haz clic en <strong>"1. Tomar Bus (GPU)"</strong> para observar cómo intercepta la señal.';

      // PASO 1: GPU INTERCEPTA BGRANT
      btnDev1.onclick = () => {
        ddev1.classList.add("dev-has-bus");
        statusDev1.textContent = "🟢 GPU transmitiendo en el bus (BBUSY=1)";
        statusDev1.style.color = "#34d399";

        // Línea hacia NIC bloqueada por GPU
        wireD1D2.className = "grant-wire wire-blocked";
        sigD1D2.textContent = "⛔ BGRANT Interceptada por GPU";

        feedback.className = "lab-feedback-banner warning";
        feedback.innerHTML = "<strong>Dispositivo 1 (GPU) interceptó la señal BGRANT:</strong> Al ser el dispositivo más cercano físicamente al árbitro, toma el control del bus y bloquea el paso hacia los dispositivos 2 y 3 (inanición / starvation). Ahora haz clic en <strong>'2. Liberar Bus (GPU)'</strong> para que la señal avance al Dispositivo 2.";

        // GPU pasa al estado de poder liberar el bus (¡HABILITADO!)
        btnDev1.textContent = "2. Liberar Bus (GPU)";
        btnDev1.className = "btn btn-sm btn-warning";
        btnDev1.disabled = false;

        // PASO 2: GPU LIBERA EL BUS Y PROPAGA BGRANT HACIA NIC
        btnDev1.onclick = () => {
          ddev1.classList.remove("dev-has-bus");
          ddev1.classList.add("dev-done");
          statusDev1.textContent = "✓ GPU terminó su transferencia";
          statusDev1.style.color = "#94a3b8";
          btnDev1.textContent = "✓ Bus Liberado";
          btnDev1.className = "btn btn-sm btn-outline-secondary";
          btnDev1.disabled = true;

          arbiterReq.textContent = "🟡 BREQ: 2 Peticiones Activas";

          // Señal fluye hacia NIC
          wireD1D2.className = "grant-wire wire-active";
          sigD1D2.textContent = "→ BGRANT Propagada →";

          statusDev2.textContent = "🟡 BGRANT Recibida. Lista para transmitir.";
          statusDev2.style.color = "#fbbf24";

          btnDev2.disabled = false;
          btnDev2.className = "btn btn-sm btn-primary";
          btnDev2.textContent = "3. Tomar Bus (NIC)";

          feedback.className = "lab-feedback-banner info";
          feedback.innerHTML = "<strong>BGRANT propagada a NIC 10G:</strong> La GPU liberó el bus, permitiendo que la señal llegue a la segunda prioridad. Haz clic en <strong>'3. Tomar Bus (NIC)'</strong>.";

          // PASO 3: NIC INTERCEPTA BGRANT
          btnDev2.onclick = () => {
            ddev2.classList.add("dev-has-bus");
            statusDev2.textContent = "🟢 NIC transmitiendo paquetes (BBUSY=1)";
            statusDev2.style.color = "#34d399";

            wireD2D3.className = "grant-wire wire-blocked";
            sigD2D3.textContent = "⛔ BGRANT Interceptada por NIC";

            feedback.className = "lab-feedback-banner warning";
            feedback.innerHTML = "<strong>NIC 10G transmitiendo:</strong> La NIC retiene el bus mientras envía paquetes de red. El SSD aún debe esperar. Haz clic en <strong>'4. Liberar Bus (NIC)'</strong> para dejar pasar la señal al SSD.";

            btnDev2.textContent = "4. Liberar Bus (NIC)";
            btnDev2.className = "btn btn-sm btn-warning";
            btnDev2.disabled = false;

            // PASO 4: NIC LIBERA EL BUS Y BGRANT LLEGA A SSD
            btnDev2.onclick = () => {
              ddev2.classList.remove("dev-has-bus");
              ddev2.classList.add("dev-done");
              statusDev2.textContent = "✓ NIC terminó su transferencia";
              statusDev2.style.color = "#94a3b8";
              btnDev2.textContent = "✓ Bus Liberado";
              btnDev2.className = "btn btn-sm btn-outline-secondary";
              btnDev2.disabled = true;

              arbiterReq.textContent = "🟡 BREQ: 1 Petición Activa";

              wireD2D3.className = "grant-wire wire-active";
              sigD2D3.textContent = "→ BGRANT Propagada →";

              statusDev3.textContent = "🟡 BGRANT Recibida en SSD.";
              statusDev3.style.color = "#fbbf24";

              btnDev3.disabled = false;
              btnDev3.className = "btn btn-sm btn-primary";
              btnDev3.textContent = "5. Tomar Bus (SSD)";

              feedback.className = "lab-feedback-banner info";
              feedback.innerHTML = "<strong>BGRANT llegó al final de la cadena:</strong> La señal finalmente alcanzó al Dispositivo 3 (Controlador SSD). Haz clic en <strong>'5. Tomar Bus (SSD)'</strong>.";

              // PASO 5: SSD TOMA EL BUS Y COMPLETA EL CICLO
              btnDev3.onclick = () => {
                ddev3.classList.add("dev-has-bus");
                statusDev3.textContent = "🟢 SSD escribiendo bloques (BBUSY=1)";
                statusDev3.style.color = "#34d399";
                btnDev3.textContent = "Procesando...";
                btnDev3.disabled = true;

                setTimeout(() => {
                  ddev3.classList.remove("dev-has-bus");
                  ddev3.classList.add("dev-done");
                  statusDev3.textContent = "✓ Transferencia SSD Completada";
                  statusDev3.style.color = "#34d399";
                  btnDev3.textContent = "✓ Transmisión Finalizada";
                  btnDev3.className = "btn btn-sm btn-outline-success";

                  arbiterReq.textContent = "🟢 BREQ: 0 Peticiones (Todas Atendidas)";
                  arbiterReq.style.background = "#065f46";
                  arbiterState.textContent = "BGRANT = Inactivo (Bus Libre)";

                  feedback.className = "lab-feedback-banner success";
                  feedback.innerHTML = "<strong>🎉 ¡Arbitraje Daisy-Chain y Ancho de Banda Comprobados al 100%!</strong> Has demostrado cómo la prioridad física serial resuelve colisiones: la GPU tuvo prioridad máxima por proximidad, y los dispositivos 2 y 3 fueron atendidos ordenadamente a medida que los anteriores liberaron el bus. <strong>Haz clic en el botón verde inferior para acreditar este laboratorio con 100 pts y desbloquear el siguiente tema.</strong>";

                  btnSubmit.disabled = false;
                  btnSubmit.classList.add("pulse-success-btn");
                  btnSubmit.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 500);
              };
            };
          };
        };
      };
    }

    setupChain();
    btnReset.onclick = () => {
      setupChain();
    };

    // Calculador de Ancho de Banda
    const wSel = document.getElementById("calc_b_width");
    const fRng = document.getElementById("rng_b_freq");
    const fLbl = document.getElementById("lbl_rng_freq");
    const bwLbl = document.getElementById("lbl_calc_bw");

    function calcBw() {
      const bytes = parseInt(wSel.value) / 8;
      const freq = parseInt(fRng.value);
      fLbl.textContent = `${freq} MHz`;
      const gb = ((bytes * freq) / 1000).toFixed(1);
      bwLbl.textContent = `${gb} GB/s`;
    }

    wSel.onchange = calcBw;
    fRng.oninput = calcBw;

    btnSubmit.onclick = () => {
      if (onComplete) onComplete(exerciseId, 100);
      btnSubmit.textContent = "✓ Acreditado con 100 pts en Base de Datos";
      btnSubmit.disabled = true;
    };
  },

  // =========================================================================
  // 8. TEMA 1.2.5: LABORATORIO DE INTERRUPCIONES Y STACK FRAME
  // =========================================================================
  renderInterruptStackSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="interactive-lab-card">
        <div class="lab-title-bar">
          <h4>Laboratorio de Interrupciones: Construcción Manual del Marco de Pila (Stack Frame)</h4>
        </div>
        <p class="lab-instruction">
          <strong>Secuencia Real del Hardware:</strong> Ocurre una interrupción de hardware externa (Teclado) cuando el programa corre en <code>PC = 0x0400</code> con <code>FLAGS = 0x0246</code>.
          Realiza el salvado del contexto apilando en orden el registro de banderas y el contador de programa.
        </p>

        <div class="stack-lab-grid">
          <div class="cpu-state-col">
            <h5>Registros del CPU al Momento de Interrupción:</h5>
            <div class="hw-reg">PC: <strong>0x0400</strong> (Dirección de Retorno)</div>
            <div class="hw-reg">FLAGS (PSW): <strong>0x0246</strong></div>
            <div class="hw-reg">SP (Puntero de Pila): <strong id="lab_sp_val">0xFFFE</strong></div>
          </div>

          <div class="stack-memory-col">
            <h5>Memoria de Pila (Direcciones decrecientes hacia abajo):</h5>
            <div class="stack-interactive-slot" id="stk_slot_1">[0xFFFE] Base de Pila</div>
            <div class="stack-interactive-slot" id="stk_slot_2">[0xFFFC] Vacío</div>
            <div class="stack-interactive-slot" id="stk_slot_3">[0xFFFA] Vacío</div>
          </div>
        </div>

        <div class="stack-action-buttons">
          <button class="btn btn-secondary" id="btn_push_psw">1. Apilar PUSH PSW (0x0246)</button>
          <button class="btn btn-secondary" id="btn_push_pc" disabled>2. Apilar PUSH PC (0x0400)</button>
          <button class="btn btn-primary" id="btn_jump_isr" disabled>3. Salto a Vector de Interrupción (ISR en 0x9000)</button>
          <button class="btn btn-warning" id="btn_do_iret" disabled>4. Ejecutar IRET (Restaurar Contexto)</button>
        </div>

        <div class="lab-verification-footer">
          <div id="stk_lab_feedback" class="lab-feedback-banner">Comienza apilando el PSW en la memoria de pila.</div>
          <button class="btn btn-success btn-lg" id="btn_complete_stk" disabled>✓ Acreditar Manejo de Interrupción (100 pts)</button>
        </div>
      </div>
    `;

    const slot2 = document.getElementById("stk_slot_2");
    const slot3 = document.getElementById("stk_slot_3");
    const spVal = document.getElementById("lab_sp_val");
    const feedback = document.getElementById("stk_lab_feedback");
    const btnSubmit = document.getElementById("btn_complete_stk");

    document.getElementById("btn_push_psw").onclick = () => {
      slot2.innerHTML = "<strong>[0xFFFC] PUSH PSW: 0x0246</strong>";
      slot2.classList.add("slot-filled");
      spVal.textContent = "0xFFFC";
      document.getElementById("btn_push_psw").disabled = true;
      document.getElementById("btn_push_pc").disabled = false;
      feedback.textContent = "PSW salvado. Ahora apila el PC de retorno.";
    };

    document.getElementById("btn_push_pc").onclick = () => {
      slot3.innerHTML = "<strong>[0xFFFA] PUSH PC: 0x0400</strong>";
      slot3.classList.add("slot-filled");
      spVal.textContent = "0xFFFA";
      document.getElementById("btn_push_pc").disabled = true;
      document.getElementById("btn_jump_isr").disabled = false;
      feedback.textContent = "Contexto asegurado en la pila. Salta a la dirección del controlador (ISR).";
    };

    document.getElementById("btn_jump_isr").onclick = () => {
      document.getElementById("btn_jump_isr").disabled = true;
      document.getElementById("btn_do_iret").disabled = false;
      feedback.textContent = "Ejecutando Rutina ISR de Teclado en 0x9000. Al culminar, ejecuta la instrucción IRET.";
    };

    document.getElementById("btn_do_iret").onclick = () => {
      slot3.innerHTML = "[0xFFFA] Vacío (POP PC)";
      slot3.classList.remove("slot-filled");
      slot2.innerHTML = "[0xFFFC] Vacío (POP PSW)";
      slot2.classList.remove("slot-filled");
      spVal.textContent = "0xFFFE";
      document.getElementById("btn_do_iret").disabled = true;

      feedback.className = "lab-feedback-banner success";
      feedback.innerHTML = "<strong>¡Restauración Perfecta!</strong> El procesador desapiló el PC (0x0400) y las banderas PSW (0x0246), reanudando el programa principal en el punto exacto donde fue interrumpido.";
      btnSubmit.disabled = false;
    };

    btnSubmit.onclick = () => {
      if (onComplete) onComplete(exerciseId, 100);
      btnSubmit.textContent = "✓ Acreditado en Base de Datos";
      btnSubmit.disabled = true;
    };
  },

  // =========================================================================
  // 9. TEMA 2.1: LABORATORIO DE ORGANIZACIÓN DE CPU MULTIBUS
  // =========================================================================
  renderCpuOrgSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="interactive-lab-card">
        <div class="lab-title-bar">
          <h4>Laboratorio de Organización Interna: Comparador de Throughput en Arquitecturas Multibus</h4>
        </div>
        <p class="lab-instruction">
          <strong>Análisis de Diseño:</strong> Se requiere transferir dos operandos a la ALU y escribir el resultado: <code>R1 = R2 + R3</code>.
          Prueba la transferencia en una arquitectura interna de 1 bus frente a una de 3 buses.
        </p>

        <div class="multibus-selector-box">
          <label>Selecciona Topología Interna del Silicio:
            <select id="sel_bus_arch" class="form-control">
              <option value="1">Arquitectura de 1 Bus Interno (Multiplexado)</option>
              <option value="3">Arquitectura de 3 Buses Internos (Buses Dedicados A, B y C)</option>
            </select>
          </label>
          <button class="btn btn-primary" id="btn_sim_cpu_org">Simular Pasos de Reloj Requeridos</button>
        </div>

        <div class="org-results-timeline" id="org_results_area" style="display: none; margin-top: 20px;">
          <div id="org_steps_log"></div>
          <div class="result-highlight-card" style="margin-top: 15px;">
            <span>Ciclos de Reloj Totales:</span>
            <h3 id="lbl_org_cycles" class="text-warning">--</h3>
          </div>
        </div>

        <div class="lab-verification-footer">
          <div id="org_lab_feedback" class="lab-feedback-banner">Simula la operación en ambas arquitecturas para comparar.</div>
          <button class="btn btn-success btn-lg" id="btn_complete_org" disabled>✓ Acreditar Organización de CPU (100 pts)</button>
        </div>
      </div>
    `;

    const sel = document.getElementById("sel_bus_arch");
    const btnSim = document.getElementById("btn_sim_cpu_org");
    const area = document.getElementById("org_results_area");
    const log = document.getElementById("org_steps_log");
    const cycLbl = document.getElementById("lbl_org_cycles");
    const feedback = document.getElementById("org_lab_feedback");
    const btnSubmit = document.getElementById("btn_complete_org");

    let tested1 = false;
    let tested3 = false;

    btnSim.onclick = () => {
      area.style.display = "block";
      const arch = sel.value;

      if (arch === "1") {
        tested1 = true;
        cycLbl.textContent = "3 Ciclos de Reloj";
        cycLbl.className = "text-warning";
        log.innerHTML = `
          <div class="step-line"><strong>Ciclo 1:</strong> Bus Único transporta R2 al pestillo temporal de entrada de la ALU.</div>
          <div class="step-line"><strong>Ciclo 2:</strong> Bus Único transporta R3 a la segunda entrada de la ALU.</div>
          <div class="step-line"><strong>Ciclo 3:</strong> Bus Único transporta el resultado de la ALU de vuelta al registro R1.</div>
        `;
      } else {
        tested3 = true;
        cycLbl.textContent = "1 Ciclo Único de Reloj (Máxima Velocidad)";
        cycLbl.className = "text-success";
        log.innerHTML = `
          <div class="step-line text-success"><strong>Ciclo 1 Simultáneo:</strong>
            Bus A transporta R2, Bus B transporta R3 a la ALU en paralelo, y Bus C escribe el resultado directamente en R1.
          </div>
        `;
      }

      if (tested1 && tested3) {
        feedback.className = "lab-feedback-banner success";
        feedback.innerHTML = "<strong>¡Análisis Completado!</strong> Has verificado experimentalmente por qué los procesadores modernos de alto rendimiento utilizan 3 buses internos para lograr ejecución de ciclo único en microoperaciones.";
        btnSubmit.disabled = false;
      }
    };

    btnSubmit.onclick = () => {
      if (onComplete) onComplete(exerciseId, 100);
      btnSubmit.textContent = "✓ Acreditado en Base de Datos";
      btnSubmit.disabled = true;
    };
  },

  // =========================================================================
  // 10. TEMA 2.2: LABORATORIO DE REGISTROS Y BANDERAS (FLAGS TESTER)
  // =========================================================================
  renderRegistersFlagsSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="interactive-lab-card">
        <div class="lab-title-bar">
          <h4>Laboratorio de Silicio: Registro de Banderas EFLAGS y Decisión de Saltos</h4>
        </div>
        <p class="lab-instruction">
          <strong>Desafío Práctico:</strong> Introduce dos valores en hexadecimal, selecciona la operación de la ALU y predice qué banderas lógicas (<code>ZF, CF, SF, OF</code>) se encenderán antes de disparar el circuito.
        </p>

        <div class="flags-circuit-lab">
          <div class="reg-inputs-row">
            <div class="input-col">
              <label>Registro EAX (Hex 8 bits):</label>
              <input type="text" id="flag_in_eax" value="0x7F" class="form-control">
            </div>
            <div class="input-col">
              <label>Registro EBX (Hex 8 bits):</label>
              <input type="text" id="flag_in_ebx" value="0x01" class="form-control">
            </div>
            <div class="input-col">
              <label>Operación de la ALU:</label>
              <select id="flag_op_sel" class="form-control">
                <option value="ADD">ADD EAX, EBX (Suma)</option>
                <option value="SUB">SUB EAX, EBX (Resta)</option>
                <option value="CMP">CMP EAX, EBX (Comparación)</option>
              </select>
            </div>
          </div>

          <div class="flags-prediction-box" style="margin-top: 15px;">
            <span>Predice qué Banderas se activarán (1):</span>
            <div class="flags-checkboxes">
              <label><input type="checkbox" id="pred_zf"> <strong>ZF (Zero Flag)</strong></label>
              <label><input type="checkbox" id="pred_cf"> <strong>CF (Carry Flag)</strong></label>
              <label><input type="checkbox" id="pred_sf"> <strong>SF (Sign Flag)</strong></label>
              <label><input type="checkbox" id="pred_of"> <strong>OF (Overflow Flag)</strong></label>
            </div>
          </div>

          <button class="btn btn-primary" id="btn_calc_flags" style="margin-top: 15px;">Disparar Operación y Comprobar Silicio</button>
        </div>

        <div class="real-led-flags-panel" style="margin-top: 20px;">
          <h5>Estado Real en los Flip-Flops del Hardware:</h5>
          <div class="led-grid">
            <div class="led-item" id="led_zf"><span class="led-bulb"></span> ZF = 0</div>
            <div class="led-item" id="led_cf"><span class="led-bulb"></span> CF = 0</div>
            <div class="led-item" id="led_sf"><span class="led-bulb"></span> SF = 0</div>
            <div class="led-item" id="led_of"><span class="led-bulb"></span> OF = 0</div>
          </div>
          <div class="alu-res-display">Resultado en Registro: <strong id="lbl_real_res">--</strong></div>
        </div>

        <div class="lab-verification-footer">
          <div id="flags_lab_feedback" class="lab-feedback-banner">Introduce los valores, predice las banderas y presiona el botón.</div>
          <button class="btn btn-success btn-lg" id="btn_complete_flags" disabled>✓ Validar Laboratorio de FLAGS (100 pts)</button>
        </div>
      </div>
    `;

    const btnCalc = document.getElementById("btn_calc_flags");
    const feedback = document.getElementById("flags_lab_feedback");
    const btnSubmit = document.getElementById("btn_complete_flags");

    btnCalc.onclick = () => {
      const a = parseInt(document.getElementById("flag_in_eax").value, 16) & 0xFF;
      const b = parseInt(document.getElementById("flag_in_ebx").value, 16) & 0xFF;
      const op = document.getElementById("flag_op_sel").value;

      let res = 0;
      let cf = 0;
      let of = 0;

      if (op === "ADD") {
        res = a + b;
        cf = res > 0xFF ? 1 : 0;
        // Overflow con signo en 8 bits (-128 a 127): si dos positivos dan negativo
        const signA = (a >> 7) & 1;
        const signB = (b >> 7) & 1;
        const signR = ((res & 0xFF) >> 7) & 1;
        of = (signA === signB && signA !== signR) ? 1 : 0;
      } else {
        res = a - b;
        cf = a < b ? 1 : 0;
        const signA = (a >> 7) & 1;
        const signB = (b >> 7) & 1;
        const signR = ((res & 0xFF) >> 7) & 1;
        of = (signA !== signB && signA !== signR) ? 1 : 0;
      }

      const byteRes = res & 0xFF;
      const zf = byteRes === 0 ? 1 : 0;
      const sf = (byteRes >> 7) & 1;

      // Actualizar LEDs
      setLed("led_zf", zf, "ZF");
      setLed("led_cf", cf, "CF");
      setLed("led_sf", sf, "SF");
      setLed("led_of", of, "OF");

      document.getElementById("lbl_real_res").textContent = `0x${byteRes.toString(16).toUpperCase()} (${byteRes})`;

      // Comprobar predicción del alumno
      const predZf = document.getElementById("pred_zf").checked ? 1 : 0;
      const predCf = document.getElementById("pred_cf").checked ? 1 : 0;
      const predSf = document.getElementById("pred_sf").checked ? 1 : 0;
      const predOf = document.getElementById("pred_of").checked ? 1 : 0;

      if (predZf === zf && predCf === cf && predSf === sf && predOf === of) {
        feedback.className = "lab-feedback-banner success";
        feedback.innerHTML = "<strong>¡Predicción 100% Precisa!</strong> Has demostrado comprensión exacta del comportamiento de acarreo, desbordamiento con signo y signo de la ALU.";
        btnSubmit.disabled = false;
      } else {
        feedback.className = "lab-feedback-banner error";
        feedback.innerHTML = `<strong>Observa las banderas activadas:</strong> ZF=${zf}, CF=${cf}, SF=${sf}, OF=${of}. Ajusta tu predicción para comprender el comportamiento lógico.`;
      }
    };

    function setLed(id, val, name) {
      const el = document.getElementById(id);
      el.textContent = `${name} = ${val}`;
      if (val === 1) el.className = "led-item led-on";
      else el.className = "led-item";
    }

    btnSubmit.onclick = () => {
      if (onComplete) onComplete(exerciseId, 100);
      btnSubmit.textContent = "✓ Acreditado en Base de Datos";
      btnSubmit.disabled = true;
    };
  },

  // =========================================================================
  // 11. TEMA 2.3: LABORATORIO DE MODOS DE DIRECCIONAMIENTO & MEMORIA FÍSICA
  // =========================================================================
  renderAddressingModesSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="interactive-lab-card">
        <div class="lab-title-bar">
          <h4>Laboratorio de Modos de Direccionamiento: Búsqueda del Operando en la Memoria Física</h4>
        </div>
        <p class="lab-instruction">
          <strong>Instrucción en Ejecución:</strong> <code>MOV EAX, [RB + R_IX * 2 + 0x0008]</code> (Base + Índice Escalado + Desplazamiento).<br>
          Valores en Registros: <strong>RB = 0x0100</strong>, <strong>R_IX = 0x0004</strong>.<br>
          Calcula la <strong>Dirección Efectiva (EA)</strong> y haz clic en la celda correspondiente de la memoria RAM para extraer el dato.
        </p>

        <div class="ea-calculator-step">
          <label>1. Escribe el valor calculado de la Dirección Efectiva (EA) en Hexadecimal:</label>
          <div class="ea-input-row">
            <input type="text" id="inp_user_ea" class="form-control" placeholder="Ej: 0x0110">
            <button class="btn btn-primary" id="btn_validate_ea">Verificar Dirección Efectiva</button>
          </div>
        </div>

        <div class="ram-memory-grid-lab" style="margin-top: 20px;">
          <h5>2. Celdas de Memoria RAM (Haz clic en la dirección correcta para leer):</h5>
          <div class="ram-cells-grid" id="ram_cells_container"></div>
        </div>

        <div class="target-register-display" style="margin-top: 15px;">
          Dato Recuperado hacia EAX: <strong id="lbl_eax_loaded">----</strong>
        </div>

        <div class="lab-verification-footer">
          <div id="addr_lab_feedback" class="lab-feedback-banner">Calcula: EA = 0x0100 + (4 * 2) + 8.</div>
          <button class="btn btn-success btn-lg" id="btn_complete_addr" disabled>✓ Acreditar Modos de Direccionamiento (100 pts)</button>
        </div>
      </div>
    `;

    const ramGrid = document.getElementById("ram_cells_container");
    const feedback = document.getElementById("addr_lab_feedback");
    const eaxLbl = document.getElementById("lbl_eax_loaded");
    const btnSubmit = document.getElementById("btn_complete_addr");

    // Generar celdas de RAM
    const targetAddr = "0x0110"; // 0x0100 + 8 + 8 = 0x0110
    const addrs = ["0x0100", "0x0104", "0x0108", "0x010C", "0x0110", "0x0114", "0x0118", "0x011C"];

    let html = "";
    addrs.forEach(a => {
      const val = a === targetAddr ? "0xDEADBEEF" : `0x${Math.floor(Math.random()*9000+1000).toString(16)}`;
      html += `<div class="ram-interactive-cell" data-addr="${a}">
        <span class="cell-addr">${a}</span>
        <span class="cell-data">${val}</span>
      </div>`;
    });
    ramGrid.innerHTML = html;

    let eaValid = false;

    document.getElementById("btn_validate_ea").onclick = () => {
      const userEa = document.getElementById("inp_user_ea").value.trim().toLowerCase();
      if (userEa === targetAddr.toLowerCase() || userEa === "0110") {
        eaValid = true;
        feedback.className = "lab-feedback-banner success";
        feedback.innerHTML = "<strong>¡Dirección Efectiva Correcta!</strong> $EA = 0x0100 + (4 \\times 2) + 8 = 0x0110$. Ahora haz clic en la celda <code>0x0110</code> en la cuadrícula de memoria.";
      } else {
        feedback.className = "lab-feedback-banner error";
        feedback.textContent = "Cálculo incorrecto. Multiplica R_IX (4) por la escala (2) = 8. Suma el desplazamiento 8 (total 16 = 0x10) a la base 0x0100.";
      }
    };

    ramGrid.querySelectorAll(".ram-interactive-cell").forEach(cell => {
      cell.onclick = () => {
        if (!eaValid) {
          alert("Primero valida la Dirección Efectiva en el paso 1.");
          return;
        }
        if (cell.dataset.addr === targetAddr) {
          cell.classList.add("cell-selected-ok");
          eaxLbl.textContent = "0xDEADBEEF (Cargado en EAX)";
          feedback.className = "lab-feedback-banner success";
          feedback.innerHTML = "<strong>¡Operando Recuperado Exitosamente!</strong> Has completado la resolución de memoria con direccionamiento base e índice escalado.";
          btnSubmit.disabled = false;
        } else {
          alert(`La celda ${cell.dataset.addr} no coincide con la dirección efectiva 0x0110.`);
        }
      };
    });

    btnSubmit.onclick = () => {
      if (onComplete) onComplete(exerciseId, 100);
      btnSubmit.textContent = "✓ Acreditado en Base de Datos";
      btnSubmit.disabled = true;
    };
  },

  // =========================================================================
  // 12. TEMA 2.4: LABORATORIO DE ARQUITECTURAS REALES (PLANIFICADOR BIG.LITTLE)
  // =========================================================================
  renderCpuComparisonSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="interactive-lab-card">
        <div class="lab-title-bar">
          <h4>Laboratorio de Microarquitecturas Reales: Planificador Heterogéneo ARM big.LITTLE</h4>
        </div>
        <p class="lab-instruction">
          <strong>Misión de Ingeniería:</strong> Asigna los 4 procesos del sistema a los núcleos de alto rendimiento (P-Cores) o núcleos eficientes de bajo consumo (E-Cores) para optimizar batería y FPS sin saturar el procesador.
        </p>

        <div class="hetero-scheduler-board">
          <div class="tasks-pool-box">
            <h5>Cola de Procesos del Sistema:</h5>
            <div class="task-card-item" id="task_game">🎮 Física del Videojuego 3D (Cálculo Pesado / FPS Críticos)</div>
            <div class="task-card-item" id="task_audio">🎵 Reproducción Spotify en Segundo Plano (Flujo Continuo Ligero)</div>
            <div class="task-card-item" id="task_render">🎬 Renderizado de Video 4K (Multihilo Intensivo)</div>
            <div class="task-card-item" id="task_sync">☁️ Sincronización en la Nube (Tarea de Fondo)</div>
          </div>

          <div class="cores-target-box">
            <div class="core-slot-cluster p-cluster">
              <h5>P-Cores (Cortex-X / 3.4 GHz / 15W por núcleo)</h5>
              <div class="drop-zone" id="zone_p_cores">
                <span class="placeholder-text">Asigna aquí las tareas de máximo rendimiento</span>
              </div>
            </div>

            <div class="core-slot-cluster e-cluster">
              <h5>E-Cores (Cortex-A510 / 1.8 GHz / 1.2W por núcleo)</h5>
              <div class="drop-zone" id="zone_e_cores">
                <span class="placeholder-text">Asigna aquí las tareas de fondo y bajo consumo</span>
              </div>
            </div>
          </div>
        </div>

        <div class="scheduler-actions" style="margin-top: 15px;">
          <button class="btn btn-primary" id="btn_auto_assign_hetero">Probar Asignación Manual / Rápida</button>
          <button class="btn btn-secondary" id="btn_eval_scheduler">Evaluar Consumo Energético y Rendimiento</button>
        </div>

        <div class="scheduler-telemetry" id="sched_telemetry" style="display: none; margin-top: 15px;">
          <div class="telemetry-cols">
            <div>Consumo de Potencia: <strong id="lbl_sched_watts">--</strong></div>
            <div>Tasa de Cuadros (FPS): <strong id="lbl_sched_fps">--</strong></div>
            <div>Eficiencia Global: <strong id="lbl_sched_eff">--</strong></div>
          </div>
        </div>

        <div class="lab-verification-footer">
          <div id="sched_lab_feedback" class="lab-feedback-banner">Asigna las tareas pesadas a P-Cores y las de fondo a E-Cores.</div>
          <button class="btn btn-success btn-lg" id="btn_complete_sched" disabled>✓ Validar Planificador big.LITTLE (100 pts)</button>
        </div>
      </div>
    `;

    const zoneP = document.getElementById("zone_p_cores");
    const zoneE = document.getElementById("zone_e_cores");
    const telemetry = document.getElementById("sched_telemetry");
    const feedback = document.getElementById("sched_lab_feedback");
    const btnSubmit = document.getElementById("btn_complete_sched");

    document.getElementById("btn_auto_assign_hetero").onclick = () => {
      zoneP.innerHTML = `
        <div class="assigned-task p-task">🎮 Física del Videojuego 3D &rarr; P-Core 0</div>
        <div class="assigned-task p-task">🎬 Renderizado de Video 4K &rarr; P-Core 1</div>
      `;
      zoneE.innerHTML = `
        <div class="assigned-task e-task">🎵 Reproducción Spotify &rarr; E-Core 0</div>
        <div class="assigned-task e-task">☁️ Sincronización en la Nube &rarr; E-Core 1</div>
      `;
      feedback.textContent = "Tareas asignadas. Presiona 'Evaluar Consumo y Rendimiento'.";
    };

    document.getElementById("btn_eval_scheduler").onclick = () => {
      telemetry.style.display = "block";
      document.getElementById("lbl_sched_watts").textContent = "16.4 Watts (Equilibrado)";
      document.getElementById("lbl_sched_fps").textContent = "120 FPS Estables";
      document.getElementById("lbl_sched_eff").textContent = "98% (Ahorro del 65% de batería)";

      feedback.className = "lab-feedback-banner success";
      feedback.innerHTML = "<strong>¡Planificación Heterogénea Perfecta!</strong> Las tareas pesadas no sufrieron retrasos en P-Cores y las tareas de fondo consumieron apenas 2.4W en los E-Cores en lugar de calentar innecesariamente el silicio principal.";
      btnSubmit.disabled = false;
    };

    btnSubmit.onclick = () => {
      if (onComplete) onComplete(exerciseId, 100);
      btnSubmit.textContent = "✓ Acreditado en Base de Datos";
      btnSubmit.disabled = true;
    };
  },

  // =========================================================================
  // 13. TEMA 3.1: LABORATORIO DE CHIPSET Y ASIGNACIÓN DE CARRILES PCIE
  // =========================================================================
  renderChipsetSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="interactive-lab-card">
        <div class="lab-title-bar">
          <h4>Laboratorio de Chipset: Asignación de Carriles PCIe y Prevención de Cuellos de Botella</h4>
        </div>
        <p class="lab-instruction">
          <strong>Diseño de Placa Base:</strong> El procesador ofrece <strong>20 carriles PCIe Gen 5 directos</strong> y el Chipset PCH ofrece 16 carriles secundarios conectados por un enlace DMI 4.0 (16 GB/s).
          Asigna los carriles para una Tarjeta Gráfica RTX 4090 y dos SSDs NVMe sin saturar el enlace del chipset.
        </p>

        <div class="chipset-lane-allocator">
          <div class="lane-source-box">
            <h5>1. Carriles Directos del CPU (Total: 20 carriles Gen 5):</h5>
            <div class="form-group">
              <label>Ranura Gráfica Principal (GPU PCIe x16):</label>
              <select id="sel_lane_gpu" class="form-control">
                <option value="cpu_16" selected>Conectar a 16 carriles directos del CPU (Gen 5 x16)</option>
                <option value="pch_4">Conectar al Chipset PCH (Limitado a x4)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Ranura M.2 NVMe Primaria:</label>
              <select id="sel_lane_m2_1" class="form-control">
                <option value="cpu_4" selected>Conectar a los 4 carriles restantes del CPU (Gen 4/5 x4)</option>
                <option value="pch_4">Conectar al Chipset PCH</option>
              </select>
            </div>
          </div>

          <div class="lane-source-box" style="margin-top: 15px;">
            <h5>2. Dispositivos Auxiliares (Chipset PCH):</h5>
            <div class="form-group">
              <label>Ranura M.2 NVMe Secundaria y Tarjeta de Red 10G:</label>
              <select id="sel_lane_pch_devs" class="form-control">
                <option value="pch_ok" selected>Asignar a carriles PCIe secundarios del Chipset PCH</option>
              </select>
            </div>
          </div>

          <button class="btn btn-primary" id="btn_verify_lanes" style="margin-top: 15px;">Auditar Distribución de Carriles</button>
        </div>

        <div class="lane-telemetry-result" id="lane_result_box" style="display: none; margin-top: 15px;"></div>

        <div class="lab-verification-footer">
          <div id="chipset_lab_feedback" class="lab-feedback-banner">Verifica la asignación de carriles para asegurar ancho de banda óptimo.</div>
          <button class="btn btn-success btn-lg" id="btn_complete_chipset" disabled>✓ Acreditar Asignación de Chipset (100 pts)</button>
        </div>
      </div>
    `;

    const btnVerify = document.getElementById("btn_verify_lanes");
    const resBox = document.getElementById("lane_result_box");
    const feedback = document.getElementById("chipset_lab_feedback");
    const btnSubmit = document.getElementById("btn_complete_chipset");

    btnVerify.onclick = () => {
      resBox.style.display = "block";
      const gpu = document.getElementById("sel_lane_gpu").value;
      const m2 = document.getElementById("sel_lane_m2_1").value;

      if (gpu === "cpu_16" && m2 === "cpu_4") {
        resBox.innerHTML = `
          <div class="alert alert-success">
            <strong>✓ TOPOLOGÍA PERFECTA (20/20 carriles CPU utilizados):</strong><br>
            - GPU opera a ancho de banda completo: 64 GB/s.<br>
            - NVMe 1 directo al CPU sin latencia: 7,500 MB/s sostenidos.<br>
            - Enlace DMI 4.0 al Chipset permanece libre para periféricos secundarios.
          </div>
        `;
        feedback.className = "lab-feedback-banner success";
        feedback.innerHTML = "<strong>¡Auditoría Aprobada!</strong> Has distribuido las líneas de alta velocidad sin provocar bifucarción indeseada ni cuellos de botella.";
        btnSubmit.disabled = false;
      }
    };

    btnSubmit.onclick = () => {
      if (onComplete) onComplete(exerciseId, 100);
      btnSubmit.textContent = "✓ Acreditado en Base de Datos";
      btnSubmit.disabled = true;
    };
  },

  // =========================================================================
  // 14. TEMA 3.2: LABORATORIO DE ENSAMBLE Y COMPATIBILIDAD VIRTUAL
  // =========================================================================
  renderPcBuilderSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="interactive-lab-card">
        <div class="lab-title-bar">
          <h4>Laboratorio de Ensamble de Hardware: Verificador de Compatibilidad en Silicio</h4>
        </div>
        <p class="lab-instruction">
          <strong>Objetivo:</strong> Ensambla una estación de trabajo técnica para Renderizado 3D y CAD.
          Selecciona componentes compatibles física y eléctricamente: zócalo (Socket), estándar de RAM, disipación de calor y fuente de poder certificada.
        </p>

        <div class="pc-builder-bench-grid">
          <div class="component-select-row">
            <label>1. Procesador (CPU):</label>
            <select id="lab_pc_cpu" class="form-control">
              <option value="amd_7800" data-socket="AM5" data-ram="DDR5" data-tdp="120" selected>AMD Ryzen 7 7800X3D (AM5 &bull; 120W TDP)</option>
              <option value="intel_14700" data-socket="LGA1700" data-ram="DDR5" data-tdp="253">Intel Core i7-14700K (LGA1700 &bull; 253W TDP)</option>
            </select>
          </div>

          <div class="component-select-row">
            <label>2. Placa Base (Motherboard):</label>
            <select id="lab_pc_mobo" class="form-control">
              <option value="b650" data-socket="AM5" data-ram="DDR5" selected>ASUS TUF Gaming B650 (Socket AM5 &bull; DDR5)</option>
              <option value="z790" data-socket="LGA1700" data-ram="DDR5">MSI Z790 Tomahawk (Socket LGA1700 &bull; DDR5)</option>
            </select>
          </div>

          <div class="component-select-row">
            <label>3. Módulos de Memoria RAM:</label>
            <select id="lab_pc_ram" class="form-control">
              <option value="ddr5_32" data-type="DDR5" selected>32GB (2x16GB) DDR5 6000 MHz CL30 (Dual Channel)</option>
              <option value="ddr4_16" data-type="DDR4">16GB (2x8GB) DDR4 3200 MHz CL16 (Incompatible con AM5)</option>
            </select>
          </div>

          <div class="component-select-row">
            <label>4. Tarjeta Gráfica Dedicada (GPU):</label>
            <select id="lab_pc_gpu" class="form-control">
              <option value="rtx_4070" data-tdp="200" selected>NVIDIA RTX 4070 12GB (200W TDP)</option>
              <option value="rtx_4090" data-tdp="450">NVIDIA RTX 4090 24GB (450W TDP)</option>
            </select>
          </div>

          <div class="component-select-row">
            <label>5. Fuente de Poder (PSU):</label>
            <select id="lab_pc_psu" class="form-control">
              <option value="550">550W 80 PLUS Bronce (Insuficiente)</option>
              <option value="750" selected>750W 80 PLUS Gold (Recomendado)</option>
              <option value="1000">1000W 80 PLUS Platinum (Para RTX 4090)</option>
            </select>
          </div>
        </div>

        <div class="diagnostics-real-board" style="margin-top: 20px;">
          <h5>Diagnóstico en Tiempo Real del Banco de Pruebas:</h5>
          <div class="diag-pills-list">
            <div class="diag-status-pill ok" id="pill_socket">✓ Zócalo Compatible (AM5 &harr; AM5)</div>
            <div class="diag-status-pill ok" id="pill_ram">✓ Memoria RAM Compatible (DDR5)</div>
            <div class="diag-status-pill ok" id="pill_psu">✓ Margen Eléctrico de Seguridad (+25%)</div>
          </div>
          <div class="power-total-indicator">
            Consumo Máximo Estimado: <strong id="lbl_bench_tdp">370 W</strong> &bull; Capacidad PSU: <strong id="lbl_bench_psu">750 W</strong>
          </div>
        </div>

        <div class="lab-verification-footer">
          <div id="pc_lab_feedback" class="lab-feedback-banner">Todos los componentes seleccionados son 100% compatibles y equilibrados.</div>
          <button class="btn btn-success btn-lg" id="btn_complete_pc">✓ Validar y Acreditar Ensamble (100 pts)</button>
        </div>
      </div>
    `;

    function auditBuild() {
      const cpu = document.getElementById("lab_pc_cpu").selectedOptions[0];
      const mobo = document.getElementById("lab_pc_mobo").selectedOptions[0];
      const ram = document.getElementById("lab_pc_ram").selectedOptions[0];
      const gpu = document.getElementById("lab_pc_gpu").selectedOptions[0];
      const psuWatt = parseInt(document.getElementById("lab_pc_psu").value);

      const tdpTotal = parseInt(cpu.dataset.tdp) + parseInt(gpu.dataset.tdp) + 50;
      document.getElementById("lbl_bench_tdp").textContent = `${tdpTotal} W`;
      document.getElementById("lbl_bench_psu").textContent = `${psuWatt} W`;

      const pSocket = document.getElementById("pill_socket");
      const pRam = document.getElementById("pill_ram");
      const pPsu = document.getElementById("pill_psu");
      const feedback = document.getElementById("pc_lab_feedback");
      const btnSubmit = document.getElementById("btn_complete_pc");

      let valid = true;

      if (cpu.dataset.socket === mobo.dataset.socket) {
        pSocket.textContent = `✓ Zócalo Compatible (${cpu.dataset.socket})`;
        pSocket.className = "diag-status-pill ok";
      } else {
        pSocket.textContent = `✗ ERROR CRÍTICO: Socket ${cpu.dataset.socket} no calza en placa ${mobo.dataset.socket}`;
        pSocket.className = "diag-status-pill err";
        valid = false;
      }

      if (mobo.dataset.ram === ram.dataset.type) {
        pRam.textContent = `✓ Ranuras RAM Compatibles (${ram.dataset.type})`;
        pRam.className = "diag-status-pill ok";
      } else {
        pRam.textContent = `✗ ERROR: ${ram.dataset.type} no encaja en placa ${mobo.dataset.ram}`;
        pRam.className = "diag-status-pill err";
        valid = false;
      }

      if (psuWatt >= tdpTotal * 1.25) {
        pPsu.textContent = `✓ Margen de Potencia Adecuado (${psuWatt}W >= ${Math.round(tdpTotal*1.25)}W requeridos)`;
        pPsu.className = "diag-status-pill ok";
      } else {
        pPsu.textContent = `⚠ ALERTA DE POTENCIA: PSU insuficiente (${psuWatt}W < ${Math.round(tdpTotal*1.25)}W recomendados)`;
        pPsu.className = "diag-status-pill err";
        valid = false;
      }

      btnSubmit.disabled = !valid;
    }

    container.querySelectorAll("select").forEach(s => s.onchange = auditBuild);

    document.getElementById("btn_complete_pc").onclick = () => {
      if (onComplete) onComplete(exerciseId, 100);
      document.getElementById("btn_complete_pc").textContent = "✓ Acreditado en Base de Datos";
      document.getElementById("btn_complete_pc").disabled = true;
    };
  },

  // =========================================================================
  // 15. TEMA 3.3: LABORATORIO DE EFICIENCIA 80 PLUS Y TÉRMICA EN SERVIDORES
  // =========================================================================
  renderPowerThermalSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="interactive-lab-card">
        <div class="lab-title-bar">
          <h4>Laboratorio de Eficiencia Energética y Térmica: Cálculo de PUE y Disipación BTU/h</h4>
        </div>
        <p class="lab-instruction">
          <strong>Ingeniería de Centros de Datos:</strong> Modula la carga de trabajo de un rack de servidores de 0W a 800W y compara el calor residual emitido por una fuente 80 PLUS Bronce (82% eficiencia) frente a una 80 PLUS Titanium (94% eficiencia).
        </p>

        <div class="power-calc-interactive-box">
          <div class="slider-group">
            <label>Carga de Trabajo del Rack: <strong id="lbl_load_slider">500 W</strong></label>
            <input type="range" id="rng_rack_load" min="100" max="800" step="50" value="500" class="form-control">
          </div>

          <div class="efficiency-comparison-table" style="margin-top: 15px;">
            <table class="theory-table">
              <thead><tr><th>Certificación</th><th>Eficiencia</th><th>Consumo de Pared</th><th>Calor Disipado (Watts)</th><th>Carga Térmica (BTU/h)</th></tr></thead>
              <tbody>
                <tr id="row_bronze"><td>80 PLUS Bronce</td><td>82%</td><td id="p_brz_wall">610 W</td><td id="p_brz_heat" class="text-danger">110 W</td><td id="p_brz_btu">375 BTU/h</td></tr>
                <tr id="row_titanium" class="highlight-row"><td>80 PLUS Titanium</td><td>94%</td><td id="p_tit_wall">532 W</td><td id="p_tit_heat" class="text-success">32 W</td><td id="p_tit_btu">109 BTU/h</td></tr>
              </tbody>
            </table>
          </div>

          <div class="cooling-cfm-calculator" style="margin-top: 15px;">
            <span>Ahorro Eléctrico Anual Proyectado (por Rack 24/7): <strong id="lbl_annual_savings" class="text-success">$13,665 MXN</strong></span>
          </div>
        </div>

        <div class="lab-verification-footer">
          <div class="lab-feedback-banner success">Desplaza el control deslizante para observar la disipación térmica en tiempo real.</div>
          <button class="btn btn-success btn-lg" id="btn_complete_pwr">✓ Acreditar Laboratorio de Energía y Térmica (100 pts)</button>
        </div>
      </div>
    `;

    const rng = document.getElementById("rng_rack_load");
    const lLoad = document.getElementById("lbl_load_slider");
    const bWall = document.getElementById("p_brz_wall");
    const bHeat = document.getElementById("p_brz_heat");
    const bBtu = document.getElementById("p_brz_btu");
    const tWall = document.getElementById("p_tit_wall");
    const tHeat = document.getElementById("p_tit_heat");
    const tBtu = document.getElementById("p_tit_btu");
    const savLbl = document.getElementById("lbl_annual_savings");
    const btnSubmit = document.getElementById("btn_complete_pwr");

    rng.oninput = () => {
      const load = parseInt(rng.value);
      lLoad.textContent = `${load} W`;

      const brzW = Math.round(load / 0.82);
      const brzH = brzW - load;
      const brzB = Math.round(brzH * 3.412);

      const titW = Math.round(load / 0.94);
      const titH = titW - load;
      const titB = Math.round(titH * 3.412);

      bWall.textContent = `${brzW} W`;
      bHeat.textContent = `${brzH} W`;
      bBtu.textContent = `${brzB} BTU/h`;

      tWall.textContent = `${titW} W`;
      tHeat.textContent = `${titH} W`;
      tBtu.textContent = `${titB} BTU/h`;

      const diffWatts = brzW - titW;
      const kwhYear = (diffWatts * 24 * 365) / 1000;
      const costMxn = Math.round(kwhYear * 3.50); // Tarifa comercial
      savLbl.textContent = `$${costMxn.toLocaleString()} MXN / año`;
    };

    btnSubmit.onclick = () => {
      if (onComplete) onComplete(exerciseId, 100);
      btnSubmit.textContent = "✓ Acreditado en Base de Datos";
      btnSubmit.disabled = true;
    };
  },

  // =========================================================================
  // 16. TEMA 4.1: LABORATORIO DE GRANULARIDAD PARALELA
  // =========================================================================
  renderParallelBasicsSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="interactive-lab-card">
        <div class="lab-title-bar">
          <h4>Laboratorio de Computación Paralela: Particionamiento y Granularidad de Tareas</h4>
        </div>
        <p class="lab-instruction">
          <strong>Problema de Cómputo:</strong> Se procesa una matriz de 10,000,000 de datos en un clúster de 16 núcleos.
          Ajusta la granularidad (tamaño del bloque asignado a cada hilo) para balancear el tiempo de cálculo frente a la sobrecarga de sincronización de red.
        </p>

        <div class="granularity-interactive-slider">
          <label>Granularidad de Partición: <strong id="lbl_gran_type">Granularidad Media (Óptima)</strong></label>
          <input type="range" id="rng_granularity" min="1" max="3" step="1" value="2" class="form-control">
          <div class="slider-labels-3">
            <span>Fina (Microtareas)</span>
            <span>Media (Balanceada)</span>
            <span>Gruesa (Macrotareas)</span>
          </div>
        </div>

        <div class="granularity-visual-bars" style="margin-top: 20px;">
          <div class="split-bar-display">
            <div class="bar-portion comp" id="bar_comp" style="width: 75%;">75% Tiempo de Cálculo Útil</div>
            <div class="bar-portion comm" id="bar_comm" style="width: 25%;">25% Sobrecarga de Comunicación</div>
          </div>
          <div class="speedup-metric-highlight" style="margin-top: 15px;">
            Aceleración Real Alcanzada: <strong id="lbl_gran_speedup" class="text-success">12.4x / 16x</strong>
          </div>
        </div>

        <div class="lab-verification-footer">
          <div id="gran_lab_feedback" class="lab-feedback-banner">Ajusta el control en Granularidad Media para optimizar el speedup.</div>
          <button class="btn btn-success btn-lg" id="btn_complete_gran">✓ Acreditar Laboratorio de Granularidad (100 pts)</button>
        </div>
      </div>
    `;

    const rng = document.getElementById("rng_granularity");
    const lType = document.getElementById("lbl_gran_type");
    const bComp = document.getElementById("bar_comp");
    const bComm = document.getElementById("bar_comm");
    const spdLbl = document.getElementById("lbl_gran_speedup");
    const feedback = document.getElementById("gran_lab_feedback");
    const btnSubmit = document.getElementById("btn_complete_gran");

    rng.oninput = () => {
      const v = rng.value;
      if (v === "1") {
        lType.textContent = "Granularidad Fina (Sobrecarga Severa de Sincronización)";
        bComp.style.width = "30%";
        bComp.textContent = "30% Cálculo";
        bComm.style.width = "70%";
        bComm.textContent = "70% Overhead Mensajes";
        spdLbl.textContent = "3.2x (Muy deficiente por saturación de red)";
        spdLbl.className = "text-danger";
      } else if (v === "2") {
        lType.textContent = "Granularidad Media (Balance Óptimo)";
        bComp.style.width = "82%";
        bComp.textContent = "82% Cálculo Útil";
        bComm.style.width = "18%";
        bComm.textContent = "18% Comunicación";
        spdLbl.textContent = "13.6x / 16x (Aceleración Excelente)";
        spdLbl.className = "text-success";
      } else {
        lType.textContent = "Granularidad Gruesa (Desbalance de Carga)";
        bComp.style.width = "65%";
        bComp.textContent = "65% Cálculo";
        bComm.style.width = "35%";
        bComm.textContent = "35% Núcleos Ociosos Esperando";
        spdLbl.textContent = "7.8x (Desperdicio de paralelismo)";
        spdLbl.className = "text-warning";
      }
    };

    btnSubmit.onclick = () => {
      if (onComplete) onComplete(exerciseId, 100);
      btnSubmit.textContent = "✓ Acreditado en Base de Datos";
      btnSubmit.disabled = true;
    };
  },

  // =========================================================================
  // 17. TEMA 4.2: LABORATORIO DE LA TAXONOMÍA DE FLYNN INTERACTIVA
  // =========================================================================
  renderFlynnTaxonomySim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="interactive-lab-card">
        <div class="lab-title-bar">
          <h4>Laboratorio de la Taxonomía de Flynn: Matriz de Clasificación Interactiva</h4>
        </div>
        <p class="lab-instruction">
          <strong>Objetivo:</strong> Clasifica cada una de las 4 arquitecturas reales de cómputo en su cuadrante correcto de Flynn asociando la multiplicidad de flujos de instrucciones ($IS$) y datos ($DS$).
        </p>

        <div class="flynn-interactive-workbench">
          <div class="flynn-quadrants-grid">
            <div class="f-drop-box" id="fbox_sisd" data-target="sisd">
              <h5>SISD (1 Instrucción &bull; 1 Dato)</h5>
              <div class="f-drop-area" id="fdrop_sisd">Arrastra aquí el sistema uniprocesador secuencial clásico</div>
            </div>
            <div class="f-drop-box" id="fbox_simd" data-target="simd">
              <h5>SIMD (1 Instrucción &bull; N Datos)</h5>
              <div class="f-drop-area" id="fdrop_simd">Arrastra aquí el acelerador vectorial masivo de GPU</div>
            </div>
            <div class="f-drop-box" id="fbox_misd" data-target="misd">
              <h5>MISD (N Instrucciones &bull; 1 Dato)</h5>
              <div class="f-drop-area" id="fdrop_misd">Arrastra aquí el sistema redundante aeroespacial</div>
            </div>
            <div class="f-drop-box" id="fbox_mimd" data-target="mimd">
              <h5>MIMD (N Instrucciones &bull; M Datos)</h5>
              <div class="f-drop-area" id="fdrop_mimd">Arrastra aquí el clúster multinúcleo distribuido</div>
            </div>
          </div>

          <div class="flynn-cards-tray">
            <h5>Sistemas Físicos para Clasificar:</h5>
            <div class="tray-items">
              <button class="btn btn-secondary f-card-btn" data-type="sisd">💻 Intel 8086 Uniprocesador (Von Neumann Clásico)</button>
              <button class="btn btn-secondary f-card-btn" data-type="simd">🎮 GPU NVIDIA RTX con Tensor Cores (Cálculo Vectorial)</button>
              <button class="btn btn-secondary f-card-btn" data-type="misd">🚀 Computadora de Vuelo AP-101 del Transbordador Espacial (Tolerancia a Fallos)</button>
              <button class="btn btn-secondary f-card-btn" data-type="mimd">🌐 Supercomputadora Clúster de 10,000 Nodos (HPC / MPI)</button>
            </div>
          </div>
        </div>

        <div class="lab-verification-footer">
          <div id="flynn_lab_feedback" class="lab-feedback-banner">Haz clic en cada sistema para asignarlo a su cuadrante de Flynn.</div>
          <button class="btn btn-success btn-lg" id="btn_complete_flynn" disabled>✓ Validar Matriz de Flynn (100 pts)</button>
        </div>
      </div>
    `;

    const feedback = document.getElementById("flynn_lab_feedback");
    const btnSubmit = document.getElementById("btn_complete_flynn");
    let assignedCount = 0;

    container.querySelectorAll(".f-card-btn").forEach(btn => {
      btn.onclick = () => {
        const type = btn.dataset.type;
        const targetDrop = document.getElementById(`fdrop_${type}`);
        targetDrop.innerHTML = `<strong>✓ ${btn.textContent}</strong>`;
        targetDrop.classList.add("fdrop-filled");
        btn.disabled = true;
        assignedCount++;

        if (assignedCount === 4) {
          feedback.className = "lab-feedback-banner success";
          feedback.innerHTML = "<strong>¡Matriz de Flynn Clasificada Perfectamente!</strong> Has asociado con precisión cada sistema: SISD (mononúcleo clásico), SIMD (GPU vectorial), MISD (tolerancia a fallos) y MIMD (supercomputadoras multiprocesador).";
          btnSubmit.disabled = false;
        }
      };
    });

    btnSubmit.onclick = () => {
      if (onComplete) onComplete(exerciseId, 100);
      btnSubmit.textContent = "✓ Acreditado en Base de Datos";
      btnSubmit.disabled = true;
    };
  },

  // =========================================================================
  // 18. TEMA 4.3: LABORATORIO DE COHERENCIA DE CACHÉ (PROTOCOLO MESI)
  // =========================================================================
  renderMesiCoherenceSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="interactive-lab-card">
        <div class="lab-title-bar">
          <h4>Laboratorio de Coherencia de Caché: Máquina de Estados Finita MESI (Snooping Bus)</h4>
        </div>
        <p class="lab-instruction">
          <strong>Protocolo MESI en Silicio:</strong> Dos núcleos comparten la variable de memoria <code>Dato_A = 10</code>.
          Ejecuta la secuencia de lectura y escritura para observar las transiciones entre estados <strong>M</strong> (Modified), <strong>E</strong> (Exclusive), <strong>S</strong> (Shared) e <strong>I</strong> (Invalid).
        </p>

        <div class="mesi-live-board">
          <div class="mesi-core-col" id="mcore_0">
            <h5>Núcleo 0 (Core 0)</h5>
            <div class="mesi-state-badge badge-i" id="badge_c0">Estado: I (Invalid)</div>
            <div class="cache-line-data" id="val_c0">Línea Caché: [Vacía]</div>
            <div class="core-actions-btns">
              <button class="btn btn-sm btn-primary" id="btn_mesi_c0_rd">1. PrRd (Core 0 Lee Dato A)</button>
              <button class="btn btn-sm btn-warning" id="btn_mesi_c0_wr" disabled>3. PrWr (Core 0 Modifica Dato A = 99)</button>
            </div>
          </div>

          <div class="mesi-bus-snooper" id="snooper_bus">
            <span>BUS DE ESCUDRIÑAMIENTO (SNOOPING BUS)</span>
            <div class="snoop-signal" id="snoop_text">Transacciones de Bus: En reposo</div>
          </div>

          <div class="mesi-core-col" id="mcore_1">
            <h5>Núcleo 1 (Core 1)</h5>
            <div class="mesi-state-badge badge-i" id="badge_c1">Estado: I (Invalid)</div>
            <div class="cache-line-data" id="val_c1">Línea Caché: [Vacía]</div>
            <div class="core-actions-btns">
              <button class="btn btn-sm btn-primary" id="btn_mesi_c1_rd" disabled>2. PrRd (Core 1 Lee Dato A)</button>
            </div>
          </div>
        </div>

        <div class="shared-ram-box" style="margin-top: 15px;">
          Memoria Principal Compartida: <strong>Dato_A = 10</strong> (En RAM)
        </div>

        <div class="lab-verification-footer">
          <div id="mesi_lab_feedback" class="lab-feedback-banner">Paso 1: Pulsa 'PrRd' en Core 0 para leer la variable desde RAM.</div>
          <button class="btn btn-success btn-lg" id="btn_complete_mesi" disabled>✓ Validar Protocolo MESI (100 pts)</button>
        </div>
      </div>
    `;

    const bC0 = document.getElementById("badge_c0");
    const vC0 = document.getElementById("val_c0");
    const bC1 = document.getElementById("badge_c1");
    const vC1 = document.getElementById("val_c1");
    const snoop = document.getElementById("snoop_text");
    const feedback = document.getElementById("mesi_lab_feedback");
    const btnSubmit = document.getElementById("btn_complete_mesi");

    const btnC0Rd = document.getElementById("btn_mesi_c0_rd");
    const btnC1Rd = document.getElementById("btn_mesi_c1_rd");
    const btnC0Wr = document.getElementById("btn_mesi_c0_wr");

    btnC0Rd.onclick = () => {
      bC0.textContent = "Estado: E (Exclusive)";
      bC0.className = "mesi-state-badge badge-e";
      vC0.textContent = "Dato A: 10 (Limpio)";
      snoop.textContent = "Bus: Core 0 emitió BusRd &rarr; Ningún otro núcleo lo tenía, asignado Exclusive (E).";
      btnC0Rd.disabled = true;
      btnC1Rd.disabled = false;
      feedback.textContent = "Paso 2: Core 1 lee el mismo dato A. Observa cómo transiciona a Shared (S).";
    };

    btnC1Rd.onclick = () => {
      bC0.textContent = "Estado: S (Shared)";
      bC0.className = "mesi-state-badge badge-s";
      bC1.textContent = "Estado: S (Shared)";
      bC1.className = "mesi-state-badge badge-s";
      vC1.textContent = "Dato A: 10 (Copia Compartida)";
      snoop.textContent = "Bus: Core 0 escuchó BusRd de Core 1 &rarr; Ambos pasan a estado Shared (S).";
      btnC1Rd.disabled = true;
      btnC0Wr.disabled = false;
      feedback.textContent = "Paso 3: Ahora Core 0 escribe un nuevo valor (PrWr). Observa la invalidación.";
    };

    btnC0Wr.onclick = () => {
      bC0.textContent = "Estado: M (Modified)";
      bC0.className = "mesi-state-badge badge-m";
      vC0.textContent = "Dato A: 99 (Modificado en L1)";

      // Core 1 se invalida
      bC1.textContent = "Estado: I (Invalidado por BusRdX)";
      bC1.className = "mesi-state-badge badge-i";
      vC1.textContent = "Dato A: [Dato Obsoleto]";
      snoop.textContent = "Bus: Core 0 emitió BusRdX (Invalidate) &rarr; Copia de Core 1 invalidada automáticamente.";

      btnC0Wr.disabled = true;
      feedback.className = "lab-feedback-banner success";
      feedback.innerHTML = "<strong>¡Coherencia de Caché Demostrada!</strong> Al escribir Core 0, el protocolo MESI invalidó inmediatamente la copia de Core 1 a través del bus de escudriñamiento, previniendo datos corruptos.";
      btnSubmit.disabled = false;
    };

    btnSubmit.onclick = () => {
      if (onComplete) onComplete(exerciseId, 100);
      btnSubmit.textContent = "✓ Acreditado en Base de Datos";
      btnSubmit.disabled = true;
    };
  },

  // =========================================================================
  // 19. TEMA 4.4: LABORATORIO DE TOPOLOGÍAS DE CLÚSTER & LEY DE AMDAHL
  // =========================================================================
  renderAmdahlTopologiesSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="interactive-lab-card">
        <div class="lab-title-bar">
          <h4>Laboratorio de Clústeres: Modelado de Speedup (Amdahl vs Gustafson) y Topología de Red</h4>
        </div>
        <p class="lab-instruction">
          <strong>Análisis Teórico y Práctico:</strong> Un algoritmo de renderizado tiene una fracción paralelizable del 95% ($f = 0.95$).
          Modula la cantidad de nodos de cómputo ($N$) de 2 a 128 y selecciona la topología de red para evaluar el diámetro de comunicación en saltos.
        </p>

        <div class="amdahl-interactive-workbench">
          <div class="slider-row">
            <label>Nodos de Cómputo del Clúster ($N$): <strong id="lbl_top_n">64 nodos</strong></label>
            <input type="range" id="rng_top_n" min="2" max="128" step="2" value="64" class="form-control">
          </div>

          <div class="speedup-comparison-cards" style="margin-top: 15px;">
            <div class="speedup-metric-card">
              <span>Ley de Amdahl (Escalamiento Fuerte):</span>
              <h3 id="res_amdahl_val" class="text-primary">15.2x</h3>
              <p>Límite Teórico Máximo ($N \\to \\infty$): <strong>20.0x</strong> (Límite impuesto por el 5% secuencial)</p>
            </div>
            <div class="speedup-metric-card">
              <span>Ley de Gustafson (Escalamiento Débil):</span>
              <h3 id="res_gustafson_val" class="text-success">60.8x</h3>
              <p>Aumentando el tamaño del problema con cada nodo agregado.</p>
            </div>
          </div>

          <div class="topologies-inspect-box" style="margin-top: 20px;">
            <h5>Topología de Red Estática de Interconexión:</h5>
            <div class="top-buttons-grid">
              <button class="btn btn-secondary top-btn" data-top="ring">Anillo (Ring)</button>
              <button class="btn btn-secondary top-btn" data-top="mesh">Malla 2D (Mesh)</button>
              <button class="btn btn-secondary top-btn" data-top="torus">Toro 3D (Torus)</button>
              <button class="btn btn-primary top-btn" data-top="hypercube">Hipercubo d-dimensional</button>
            </div>
            <div class="topology-metrics-card" id="top_metrics_box" style="margin-top: 12px;">
              Diámetro Máximo de Saltos: <strong id="lbl_top_diam">6 saltos (log2 64)</strong> &bull; Grado por Nodo: <strong id="lbl_top_degree">6 enlaces</strong>
            </div>
          </div>
        </div>

        <div class="lab-verification-footer">
          <div class="lab-feedback-banner success">Calculador matemático activo. Ajusta los nodos y topologías para comprobar.</div>
          <button class="btn btn-success btn-lg" id="btn_complete_top">✓ Acreditar Laboratorio de Clústeres (100 pts)</button>
        </div>
      </div>
    `;

    const rngN = document.getElementById("rng_top_n");
    const lN = document.getElementById("lbl_top_n");
    const rAmd = document.getElementById("res_amdahl_val");
    const rGus = document.getElementById("res_gustafson_val");
    const dLbl = document.getElementById("lbl_top_diam");
    const degLbl = document.getElementById("lbl_top_degree");
    const btnSubmit = document.getElementById("btn_complete_top");

    function updateAmdahl() {
      const n = parseInt(rngN.value);
      const f = 0.95;
      lN.textContent = `${n} nodos`;

      const sAmd = 1 / ((1 - f) + (f / n));
      const sGus = n - (1 - f) * (n - 1);

      rAmd.textContent = `${sAmd.toFixed(1)}x`;
      rGus.textContent = `${sGus.toFixed(1)}x`;

      // Actualizar métricas de hipercubo
      const dim = Math.round(Math.log2(n));
      dLbl.textContent = `${dim} saltos (log2 ${n})`;
      degLbl.textContent = `${dim} enlaces directos`;
    }

    rngN.oninput = updateAmdahl;

    container.querySelectorAll(".top-btn").forEach(btn => {
      btn.onclick = () => {
        container.querySelectorAll(".top-btn").forEach(b => b.className = "btn btn-secondary top-btn");
        btn.className = "btn btn-primary top-btn";
        const top = btn.dataset.top;
        const n = parseInt(rngN.value);

        if (top === "ring") {
          dLbl.textContent = `${Math.floor(n / 2)} saltos (N / 2)`;
          degLbl.textContent = "2 enlaces (Bajo costo, alta latencia)";
        } else if (top === "mesh") {
          const side = Math.round(Math.sqrt(n));
          dLbl.textContent = `${2 * (side - 1)} saltos`;
          degLbl.textContent = "4 enlaces internos";
        } else if (top === "torus") {
          const side = Math.round(Math.sqrt(n));
          dLbl.textContent = `${side} saltos (Con enlaces circulares)`;
          degLbl.textContent = "4 enlaces";
        } else {
          const dim = Math.round(Math.log2(n));
          dLbl.textContent = `${dim} saltos (Óptimo para MPI Reduce)`;
          degLbl.textContent = `${dim} enlaces`;
        }
      };
    });

    btnSubmit.onclick = () => {
      if (onComplete) onComplete(exerciseId, 100);
      btnSubmit.textContent = "✓ Acreditado en Base de Datos";
      btnSubmit.disabled = true;
    };
  },

  // =========================================================================
  // 20. TEMA 4.5: LABORATORIO DE SUPERCÓMPUTO EXASCALE (TOP500 BENCHMARK)
  // =========================================================================
  renderSupercomputerSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="interactive-lab-card">
        <div class="lab-title-bar">
          <h4>Laboratorio de Supercómputo: Dimensionamiento de Nodos Exascale para el TOP500</h4>
        </div>
        <p class="lab-instruction">
          <strong>Desafío Final de Ingeniería:</strong> Configura un bloque de supercómputo heterogéneo (CPUs + GPUs de IA con NVLink) para alcanzar una potencia de cálculo superior a <strong>1.0 Exaflop</strong> ($10^{18}$ FLOPS) manteniendo el consumo eléctrico por debajo de 25 Megavatios.
        </p>

        <div class="supercomputer-config-panel">
          <div class="form-row-2col">
            <label>Nodos de Cómputo Heterogéneo:
              <select id="sc_nodes_count" class="form-control">
                <option value="5000">5,000 Nodos (400 Petaflops &bull; 12 MW)</option>
                <option value="9000" selected>9,408 Nodos Frontier Class (1.2 Exaflops &bull; 22.7 MW)</option>
              </select>
            </label>
            <label>Aceleradores Matriciales por Nodo:
              <select id="sc_accel_type" class="form-control">
                <option value="mi250" selected>4x AMD Instinct MI250X con Infinity Fabric</option>
                <option value="h100">4x NVIDIA H100 SXM con NVLink 900 GB/s</option>
              </select>
            </label>
          </div>

          <button class="btn btn-primary" id="btn_run_hpl_linpack" style="margin-top: 15px;">Ejecutar Benchmark LINPACK HPL (High Performance Linpack)</button>
        </div>

        <div class="linpack-results-card" id="linpack_card" style="display: none; margin-top: 20px;">
          <h5>Resultados Oficiales Certificados TOP500:</h5>
          <div class="telemetry-cols">
            <div>Rmax Alcanzado: <strong id="lbl_hpl_rmax" class="text-success">1.194 Exaflops (1.194 x 10^18 FLOPS)</strong></div>
            <div>Potencia Eléctrica: <strong id="lbl_hpl_power">22.7 Megavatios</strong></div>
            <div>Eficiencia Green500: <strong id="lbl_hpl_eff" class="text-success">52.6 GFlops/Watt</strong></div>
          </div>
        </div>

        <div class="lab-verification-footer">
          <div id="sc_lab_feedback" class="lab-feedback-banner">Ejecuta el benchmark LINPACK para certificar la supercomputadora Exascale.</div>
          <button class="btn btn-success btn-lg" id="btn_complete_sc" disabled>✓ Acreditar Laboratorio de Supercómputo (100 pts)</button>
        </div>
      </div>
    `;

    const btnHpl = document.getElementById("btn_run_hpl_linpack");
    const card = document.getElementById("linpack_card");
    const feedback = document.getElementById("sc_lab_feedback");
    const btnSubmit = document.getElementById("btn_complete_sc");

    btnHpl.onclick = () => {
      card.style.display = "block";
      feedback.className = "lab-feedback-banner success";
      feedback.innerHTML = "<strong>¡Récord Exascale Certificado!</strong> Has configurado un superordenador capaz de resolver $10^{18}$ operaciones matriciales por segundo, consolidando los conceptos de procesamiento paralelo, memoria distribuida y computación heterogénea.";
      btnSubmit.disabled = false;
    };

    btnSubmit.onclick = () => {
      if (onComplete) onComplete(exerciseId, 100);
      btnSubmit.textContent = "✓ Acreditado en Base de Datos";
      btnSubmit.disabled = true;
    };
  }
};
