/**
 * MOTOR DE SIMULADORES Y EJERCICIOS VISUALES INTERACTIVOS
 * Asignatura: Arquitectura de Computadoras - Universidad Aztlán
 * Desarrollado para Profesor Titular: Ing. Luis Garibaldi
 */

const SimulatorEngine = {
  // Renderizador principal según el ejercicio solicitado
  render(containerId, exerciseId, studentData, onCompleteCallback) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    const userScore = studentData?.scores?.[exerciseId] || 0;
    const isCompleted = studentData?.completedExercises?.includes(exerciseId) || false;

    // Encabezado de estado del ejercicio
    const headerHtml = `
      <div class="exercise-header-card">
        <div class="exercise-header-info">
          <span class="badge ${isCompleted ? 'badge-success' : 'badge-warning'}">
            ${isCompleted ? '✓ Ejercicio Completado' : '⏳ En Progreso'}
          </span>
          <span class="score-pill">Puntuación Obtenida: <strong>${userScore} / 100 pts</strong></span>
        </div>
        <p class="exercise-help-text">
          <i class="icon">💡</i> Interactúa con los controles visuales, experimenta con los parámetros y completa el desafío práctico para registrar tu calificación en la base de datos de la plataforma.
        </p>
      </div>
      <div id="sim_workspace_${exerciseId}" class="sim-workspace"></div>
    `;
    container.innerHTML = headerHtml;

    const workspace = document.getElementById(`sim_workspace_${exerciseId}`);

    // Despacho del simulador específico
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
        workspace.innerHTML = `<div class="alert alert-info">Simulador en desarrollo para ${exerciseId}.</div>`;
    }
  },

  // 1. SIMULADOR VON NEUMANN VS HARVARD
  renderVonNeumannHarvard(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="sim-grid-2col">
        <div class="sim-card">
          <div class="sim-card-header">
            <h4>Arquitectura Von Neumann (Bus Unificado)</h4>
            <span class="badge badge-info" id="vn_cycle_badge">Ciclo 1: FETCH</span>
          </div>
          <div class="arch-canvas" id="vn_canvas">
            <div class="arch-box cpu-box">
              <div class="box-title">CPU</div>
              <div class="reg-mini" id="vn_cpu_pc">PC: 0x0100</div>
              <div class="reg-mini" id="vn_cpu_ir">IR: NOP</div>
              <div class="reg-mini" id="vn_cpu_ac">AC: 0x0000</div>
            </div>
            <div class="bus-wire" id="vn_bus">
              <span class="bus-label" id="vn_bus_text">BUS DEL SISTEMA (Compartido)</span>
              <div class="bus-packet" id="vn_packet">DATOS/INST</div>
            </div>
            <div class="arch-box mem-box">
              <div class="box-title">MEMORIA PRINCIPAL</div>
              <div class="mem-slot" id="vn_mem_code">[0x0100] LOAD 0x0200</div>
              <div class="mem-slot" id="vn_mem_data">[0x0200] Dato: 0x00FF</div>
            </div>
          </div>
          <div class="sim-status-box" id="vn_status">
            Estado: Listo para iniciar simulación de ciclo.
          </div>
        </div>

        <div class="sim-card">
          <div class="sim-card-header">
            <h4>Arquitectura Harvard (Buses Separados)</h4>
            <span class="badge badge-success" id="hv_cycle_badge">Ciclo 1: SIMULTÁNEO</span>
          </div>
          <div class="arch-canvas" id="hv_canvas">
            <div class="arch-box cpu-box">
              <div class="box-title">CPU HARVARD</div>
              <div class="reg-mini">PC: 0x0100</div>
              <div class="reg-mini" id="hv_cpu_ir">IR: LOAD 0x0200</div>
              <div class="reg-mini" id="hv_cpu_ac">AC: 0x00FF</div>
            </div>
            <div class="harvard-buses">
              <div class="bus-wire inst-bus" id="hv_inst_bus">
                <span class="bus-label">BUS DE INSTRUCCIONES</span>
                <div class="bus-packet" id="hv_inst_packet">FETCH INST</div>
              </div>
              <div class="bus-wire data-bus" id="hv_data_bus">
                <span class="bus-label">BUS DE DATOS</span>
                <div class="bus-packet" id="hv_data_packet">READ DATA</div>
              </div>
            </div>
            <div class="harvard-mems">
              <div class="arch-box mem-box inst-mem">
                <div class="box-title">MEM. INSTRUCCIONES</div>
                <div class="mem-slot active">[0x0100] LOAD 0x0200</div>
              </div>
              <div class="arch-box mem-box data-mem">
                <div class="box-title">MEM. DATOS</div>
                <div class="mem-slot active">[0x0200] Dato: 0x00FF</div>
              </div>
            </div>
          </div>
          <div class="sim-status-box" id="hv_status">
            Estado: Instrucción y operando transferidos en el mismo ciclo.
          </div>
        </div>
      </div>

      <div class="sim-controls-panel">
        <button class="btn btn-primary" id="btn_step_vn_hv">Avanzar Ciclo de Reloj</button>
        <button class="btn btn-secondary" id="btn_reset_vn_hv">Reiniciar Simulación</button>
        <div class="sim-stats">
          <span>Ciclos Von Neumann: <strong id="cnt_vn_cycles">0</strong></span> |
          <span>Ciclos Harvard: <strong id="cnt_hv_cycles">0</strong></span> |
          <span>Aceleración Harvard: <strong id="cnt_speedup">--</strong></span>
        </div>
      </div>

      <div class="quiz-challenge-card">
        <h5>Desafío Práctico de Comprensión:</h5>
        <p>¿Por qué la arquitectura Von Neumann tardó 2 ciclos de reloj completos para ejecutar la instrucción <code>LOAD 0x0200</code> mientras Harvard lo realizó en 1 solo ciclo?</p>
        <div class="quiz-options">
          <label class="quiz-opt">
            <input type="radio" name="q_vn_hv" value="a"> A) Porque la ALU de Harvard tiene el doble de frecuencia de reloj que Von Neumann.
          </label>
          <label class="quiz-opt">
            <input type="radio" name="q_vn_hv" value="b"> B) Porque Von Neumann debe multiplexar el uso del bus único: primero trae la instrucción y en el ciclo siguiente accede al operando en memoria.
          </label>
          <label class="quiz-opt">
            <input type="radio" name="q_vn_hv" value="c"> C) Porque Harvard no utiliza memoria RAM semiconductora sino únicamente registros internos.
          </label>
        </div>
        <button class="btn btn-success" id="btn_submit_vn_hv">Validar y Calificar Ejercicio</button>
        <div id="quiz_feedback_vn_hv" class="quiz-feedback"></div>
      </div>
    `;

    let step = 0;
    const btnStep = document.getElementById("btn_step_vn_hv");
    const btnReset = document.getElementById("btn_reset_vn_hv");
    const cntVn = document.getElementById("cnt_vn_cycles");
    const cntHv = document.getElementById("cnt_hv_cycles");
    const cntSp = document.getElementById("cnt_speedup");
    const vnBadge = document.getElementById("vn_cycle_badge");
    const vnStatus = document.getElementById("vn_status");
    const vnBusText = document.getElementById("vn_bus_text");
    const vnPacket = document.getElementById("vn_packet");
    const vnAc = document.getElementById("vn_cpu_ac");
    const vnIr = document.getElementById("vn_cpu_ir");

    btnStep.addEventListener("click", () => {
      step++;
      if (step === 1) {
        cntVn.textContent = "1";
        cntHv.textContent = "1";
        cntSp.textContent = "1.0x";
        vnBadge.textContent = "Ciclo 1: BÚSQUEDA (FETCH)";
        vnBadge.className = "badge badge-warning";
        vnBusText.textContent = "BUS OCUPADO: Transfiriendo Instrucción [0x0100]";
        vnPacket.style.transform = "translateX(160px)";
        vnPacket.textContent = "CÓDIGO INSTR.";
        vnIr.textContent = "IR: LOAD 0x0200";
        vnStatus.innerHTML = "<span class='text-warning'>Cuello de botella detectado:</span> El dato de 0x0200 debe esperar al siguiente ciclo porque el bus está ocupado con la instrucción.";
      } else if (step === 2) {
        cntVn.textContent = "2";
        cntHv.textContent = "1";
        cntSp.textContent = "2.0x";
        vnBadge.textContent = "Ciclo 2: LECTURA OPERANDO";
        vnBadge.className = "badge badge-success";
        vnBusText.textContent = "BUS OCUPADO: Transfiriendo Dato [0x0200] -> AC";
        vnPacket.style.transform = "translateX(0px)";
        vnPacket.textContent = "DATO: 0x00FF";
        vnAc.textContent = "AC: 0x00FF";
        vnStatus.innerHTML = "<span class='text-success'>Ejecución completada:</span> Von Neumann requirió 2 ciclos totales. Harvard lo resolvió en 1 solo ciclo simultáneo.";
        btnStep.disabled = true;
      }
    });

    btnReset.addEventListener("click", () => {
      step = 0;
      btnStep.disabled = false;
      cntVn.textContent = "0";
      cntHv.textContent = "0";
      cntSp.textContent = "--";
      vnBadge.textContent = "Ciclo 1: FETCH";
      vnBadge.className = "badge badge-info";
      vnBusText.textContent = "BUS DEL SISTEMA (Compartido)";
      vnPacket.style.transform = "translateX(0px)";
      vnPacket.textContent = "DATOS/INST";
      vnIr.textContent = "IR: NOP";
      vnAc.textContent = "AC: 0x0000";
      vnStatus.textContent = "Estado: Listo para iniciar simulación de ciclo.";
    });

    document.getElementById("btn_submit_vn_hv").addEventListener("click", () => {
      const selected = document.querySelector('input[name="q_vn_hv"]:checked');
      const feedback = document.getElementById("quiz_feedback_vn_hv");
      if (!selected) {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Selecciona una opción de respuesta antes de calificar.";
        return;
      }
      if (selected.value === "b") {
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = "¡Excelente deducción! Respuesta 100% correcta. El cuello de botella de Von Neumann se origina exactamente por compartir el mismo bus para código y datos, forzando la secuencialidad temporal.";
        if (onComplete) onComplete(exerciseId, 100);
      } else {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Respuesta incorrecta. Analiza nuevamente el diagrama de buses: Von Neumann tiene un solo bus físico para ambos propósitos.";
      }
    });
  },

  // 2. SIMULADOR DE PIPELINE & HAZARDS
  renderPipelineHazards(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-card-header">
          <h4>Simulador de Pipeline RISC (5 Etapas: IF - ID - EX - MEM - WB)</h4>
          <div class="toggle-group">
            <label class="toggle-switch">
              <input type="checkbox" id="chk_forwarding" checked>
              <span class="slider"></span>
            </label>
            <span>Activar Unidad de Forwarding / Bypassing</span>
          </div>
        </div>

        <div class="code-preview-box">
          <strong>Secuencia Ensamblador a procesar (Dependencia RAW en R1):</strong>
          <code>
            I1: ADD R1, R2, R3    ; R1 = R2 + R3 (El resultado se calcula en EX y escribe en WB)<br>
            I2: SUB R4, R1, R5    ; R4 = R1 - R5 (¡Requiere R1 inmediatamente en la etapa ID o EX!)<br>
            I3: AND R6, R1, R7    ; R6 = R1 & R7 (Requiere R1)<br>
            I4: OR  R8, R9, R10   ; Independiente
          </code>
        </div>

        <div class="pipeline-chart" id="pipeline_diagram">
          <!-- Renderizado dinámico de la cuadrícula de ciclos -->
        </div>

        <div class="sim-controls-panel">
          <button class="btn btn-primary" id="btn_step_pipe">Avanzar Ciclo de Reloj</button>
          <button class="btn btn-secondary" id="btn_reset_pipe">Reiniciar</button>
          <div class="sim-stats">
            <span>Ciclo Actual: <strong id="pipe_curr_cycle">0</strong></span> |
            <span>Burbujas (Stalls) insertadas: <strong id="pipe_stalls">0</strong></span> |
            <span>CPI Efectivo: <strong id="pipe_cpi">--</strong></span>
          </div>
        </div>

        <div class="quiz-challenge-card">
          <h5>Desafío de Análisis de Rendimiento:</h5>
          <p>Con <strong>Forwarding desactivado</strong>, ¿cuántos ciclos de parada (burbujas / stalls) debe esperar la instrucción <code>SUB</code> para que <code>ADD</code> escriba en el banco de registros en la etapa WB?</p>
          <div class="quiz-options">
            <label class="quiz-opt">
              <input type="radio" name="q_pipe" value="0"> A) 0 ciclos (no requiere esperar).
            </label>
            <label class="quiz-opt">
              <input type="radio" name="q_pipe" value="2"> B) 2 ciclos de burbuja (esperando hasta que ADD pase por EX y MEM para llegar a WB).
            </label>
            <label class="quiz-opt">
              <input type="radio" name="q_pipe" value="5"> C) 5 ciclos completos.
            </label>
          </div>
          <button class="btn btn-success" id="btn_submit_pipe">Verificar Respuesta y Grabar Calificación</button>
          <div id="quiz_feedback_pipe" class="quiz-feedback"></div>
        </div>
      </div>
    `;

    let cycle = 0;
    const chkFwd = document.getElementById("chk_forwarding");
    const currCycEl = document.getElementById("pipe_curr_cycle");
    const stallsEl = document.getElementById("pipe_stalls");
    const cpiEl = document.getElementById("pipe_cpi");
    const diag = document.getElementById("pipeline_diagram");

    function renderGrid() {
      const isFwd = chkFwd.checked;
      let html = `<table class="pipe-table"><thead><tr><th>Instrucción</th>`;
      for (let c = 1; c <= 8; c++) {
        html += `<th class="${c === cycle ? 'active-col' : ''}">C${c}</th>`;
      }
      html += `</tr></thead><tbody>`;

      if (isFwd) {
        // Con Forwarding: flujo continuo sin burbujas
        html += `
          <tr><td>I1: ADD R1, R2, R3</td><td>IF</td><td>ID</td><td class="fwd-src">EX &rarr;</td><td>MEM</td><td>WB</td><td>-</td><td>-</td><td>-</td></tr>
          <tr><td>I2: SUB R4, R1, R5</td><td>-</td><td>IF</td><td>ID</td><td class="fwd-dest">&rarr; EX</td><td>MEM</td><td>WB</td><td>-</td><td>-</td></tr>
          <tr><td>I3: AND R6, R1, R7</td><td>-</td><td>-</td><td>IF</td><td>ID</td><td>EX</td><td>MEM</td><td>WB</td><td>-</td></tr>
          <tr><td>I4: OR  R8, R9, R10</td><td>-</td><td>-</td><td>-</td><td>IF</td><td>ID</td><td>EX</td><td>MEM</td><td>WB</td></tr>
        `;
        stallsEl.textContent = "0";
        cpiEl.textContent = cycle >= 8 ? "1.00" : "En progreso";
      } else {
        // Sin Forwarding: 2 burbujas en SUB
        html += `
          <tr><td>I1: ADD R1, R2, R3</td><td>IF</td><td>ID</td><td>EX</td><td>MEM</td><td class="reg-wb">WB</td><td>-</td><td>-</td><td>-</td></tr>
          <tr><td>I2: SUB R4, R1, R5</td><td>-</td><td>IF</td><td>ID</td><td class="stall">STALL</td><td class="stall">STALL</td><td>EX</td><td>MEM</td><td>WB</td></tr>
          <tr><td>I3: AND R6, R1, R7</td><td>-</td><td>-</td><td>-</td><td>IF</td><td>ID</td><td>EX</td><td>MEM</td><td>WB</td></tr>
          <tr><td>I4: OR  R8, R9, R10</td><td>-</td><td>-</td><td>-</td><td>-</td><td>IF</td><td>ID</td><td>EX</td><td>MEM</td></tr>
        `;
        stallsEl.textContent = "2 burbujas";
        cpiEl.textContent = cycle >= 8 ? "1.50" : "En progreso";
      }
      html += `</tbody></table>`;
      diag.innerHTML = html;
    }

    renderGrid();
    chkFwd.addEventListener("change", () => {
      cycle = 0;
      currCycEl.textContent = "0";
      renderGrid();
    });

    document.getElementById("btn_step_pipe").addEventListener("click", () => {
      if (cycle < 8) cycle++;
      currCycEl.textContent = cycle;
      renderGrid();
    });

    document.getElementById("btn_reset_pipe").addEventListener("click", () => {
      cycle = 0;
      currCycEl.textContent = "0";
      renderGrid();
    });

    document.getElementById("btn_submit_pipe").addEventListener("click", () => {
      const selected = document.querySelector('input[name="q_pipe"]:checked');
      const feedback = document.getElementById("quiz_feedback_pipe");
      if (!selected) {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Selecciona una opción para enviar tu respuesta.";
        return;
      }
      if (selected.value === "2") {
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = "¡Correcto! Exactamente 2 ciclos de penalización por parada (stalls). El valor de R1 recién se escribe en la segunda mitad del ciclo 5 (WB), por lo que sin cortocircuito la instrucción SUB debe congelar su avance en ID durante los ciclos 3 y 4.";
        if (onComplete) onComplete(exerciseId, 100);
      } else {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Incorrecto. Desmarca la casilla de Forwarding y observa la cuadrícula para contar las celdas rojas de STALL.";
      }
    });
  },

  // 3. SIMULADOR NUMA VS UMA
  renderNumaSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-card-header">
          <h4>Simulador de Acceso a Memoria: UMA (Bus Central) vs NUMA (Nodos Locales/Remotos)</h4>
        </div>
        <div class="numa-layout">
          <div class="numa-node" id="numa_node_0">
            <h5>Nodo NUMA 0 (Socket 0)</h5>
            <div class="cpu-cores">
              <span class="core-chip">Core 0</span>
              <span class="core-chip">Core 1</span>
              <span class="core-chip">Core 2</span>
              <span class="core-chip">Core 3</span>
            </div>
            <div class="local-ram" id="ram_node_0">
              RAM Local 0 (Latencia: 50 ns)
            </div>
          </div>

          <div class="numa-interconnect" id="numa_bus">
            <div class="link-label">Interconexión Inter-Socket (Ultra Path Interconnect - UPI)</div>
            <div class="link-speed">Latencia de Enlace: +60 ns</div>
            <div class="packet-transit" id="numa_packet">DATO</div>
          </div>

          <div class="numa-node" id="numa_node_1">
            <h5>Nodo NUMA 1 (Socket 1)</h5>
            <div class="cpu-cores">
              <span class="core-chip">Core 4</span>
              <span class="core-chip">Core 5</span>
              <span class="core-chip">Core 6</span>
              <span class="core-chip">Core 7</span>
            </div>
            <div class="local-ram" id="ram_node_1">
              RAM Local 1 (Latencia: 50 ns)
            </div>
          </div>
        </div>

        <div class="sim-controls-panel">
          <button class="btn btn-primary" id="btn_numa_local">Petición Local (Core 0 &rarr; RAM 0)</button>
          <button class="btn btn-warning" id="btn_numa_remote">Petición Remota (Core 0 &rarr; RAM 1)</button>
          <div class="sim-stats">
            <span>Última Latencia Medida: <strong id="numa_lat_val">-- ns</strong></span> |
            <span>Penalización Remota: <strong id="numa_penalty_val">--</strong></span>
          </div>
        </div>

        <div class="quiz-challenge-card">
          <h5>Desafío Práctico:</h5>
          <p>En un sistema NUMA, ¿por qué es crítico que el Sistema Operativo implemente afinidad de procesador (CPU Affinity) y asignación de memoria NUMA-Aware?</p>
          <div class="quiz-options">
            <label class="quiz-opt">
              <input type="radio" name="q_numa" value="a"> A) Para evitar que las peticiones tengan que cruzar el enlace inter-socket, minimizando la latencia al servir datos desde el nodo local.
            </label>
            <label class="quiz-opt">
              <input type="radio" name="q_numa" value="b"> B) Porque los sockets remotos no tienen capacidad de almacenamiento.
            </label>
            <label class="quiz-opt">
              <input type="radio" name="q_numa" value="c"> C) Para convertir automáticamente la memoria DDR4 en memoria estática SRAM.
            </label>
          </div>
          <button class="btn btn-success" id="btn_submit_numa">Validar Respuesta</button>
          <div id="quiz_feedback_numa" class="quiz-feedback"></div>
        </div>
      </div>
    `;

    const latVal = document.getElementById("numa_lat_val");
    const penVal = document.getElementById("numa_penalty_val");
    const pkt = document.getElementById("numa_packet");

    document.getElementById("btn_numa_local").addEventListener("click", () => {
      latVal.textContent = "50 ns";
      penVal.textContent = "0% (Acceso Óptimo)";
      pkt.style.display = "none";
      document.getElementById("ram_node_0").style.borderColor = "#10b981";
      document.getElementById("ram_node_1").style.borderColor = "#e2e8f0";
    });

    document.getElementById("btn_numa_remote").addEventListener("click", () => {
      latVal.textContent = "110 ns (50ns RAM + 60ns Enlace)";
      penVal.textContent = "+120% más lento";
      pkt.style.display = "block";
      document.getElementById("ram_node_0").style.borderColor = "#e2e8f0";
      document.getElementById("ram_node_1").style.borderColor = "#f59e0b";
    });

    document.getElementById("btn_submit_numa").addEventListener("click", () => {
      const selected = document.querySelector('input[name="q_numa"]:checked');
      const feedback = document.getElementById("quiz_feedback_numa");
      if (!selected) return;
      if (selected.value === "a") {
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = "¡Excelente! El planificador del sistema operativo busca colocar la memoria en el mismo socket donde corre el hilo para garantizar la latencia mínima de 50 ns frente a los 110 ns remotos.";
        if (onComplete) onComplete(exerciseId, 100);
      } else {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Opción incorrecta. Revisa el valor de latencia obtenido en el botón de petición remota.";
      }
    });
  },

  // 4. SIMULADOR DE DATAPATH & ALU
  renderDatapathSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-card-header">
          <h4>Simulador Interactivo del Datapath (Camino de Datos) y ALU</h4>
        </div>
        <div class="datapath-canvas">
          <div class="dp-block" id="dp_pc">
            <span class="dp-title">PC</span>
            <span class="dp-val" id="val_pc">0x0040</span>
          </div>
          <div class="dp-arrow">&rarr;</div>
          <div class="dp-block" id="dp_mar">
            <span class="dp-title">MAR</span>
            <span class="dp-val" id="val_mar">0x0040</span>
          </div>
          <div class="dp-arrow">&rarr;</div>
          <div class="dp-block" id="dp_mem">
            <span class="dp-title">MEMORIA</span>
            <span class="dp-val" id="val_mem">[ADD 0x0012]</span>
          </div>
          <div class="dp-arrow">&rarr;</div>
          <div class="dp-block" id="dp_mbr">
            <span class="dp-title">MBR / MDR</span>
            <span class="dp-val" id="val_mbr">0x0012</span>
          </div>
        </div>

        <div class="alu-section">
          <div class="alu-inputs">
            <div class="reg-box">Reg A: <input type="number" id="alu_in_a" value="15" class="input-mini"></div>
            <div class="reg-box">Reg B: <input type="number" id="alu_in_b" value="25" class="input-mini"></div>
          </div>
          <div class="alu-block">
            <div class="alu-v-shape">
              <span class="alu-title">ALU</span>
              <div class="alu-op" id="alu_curr_op">OPERACIÓN: SUMA (+)</div>
            </div>
          </div>
          <div class="alu-output">
            <div class="reg-box acc-highlight">Acumulador (ACC): <strong id="alu_out_acc">40</strong></div>
            <div class="flags-box">
              <span>ZF: <strong id="f_zf">0</strong></span>
              <span>CF: <strong id="f_cf">0</strong></span>
              <span>SF: <strong id="f_sf">0</strong></span>
              <span>OF: <strong id="f_of">0</strong></span>
            </div>
          </div>
        </div>

        <div class="sim-controls-panel">
          <button class="btn btn-primary" data-op="ADD">Ejecutar ADD (A + B)</button>
          <button class="btn btn-secondary" data-op="SUB">Ejecutar SUB (A - B)</button>
          <button class="btn btn-secondary" data-op="AND">Ejecutar AND (A & B)</button>
          <button class="btn btn-secondary" data-op="XOR">Ejecutar XOR (A ^ B)</button>
        </div>

        <div class="quiz-challenge-card">
          <h5>Desafío:</h5>
          <p>Si introduces A = 20 y B = 20 y ejecutas <code>SUB</code>, ¿qué valor adopta la bandera Zero Flag (ZF)?</p>
          <div class="quiz-options">
            <label class="quiz-opt"><input type="radio" name="q_dp" value="0"> A) ZF = 0</label>
            <label class="quiz-opt"><input type="radio" name="q_dp" value="1"> B) ZF = 1 (Porque el resultado es exactamente cero)</label>
          </div>
          <button class="btn btn-success" id="btn_submit_dp">Registrar Calificación</button>
          <div id="quiz_feedback_dp" class="quiz-feedback"></div>
        </div>
      </div>
    `;

    const inA = document.getElementById("alu_in_a");
    const inB = document.getElementById("alu_in_b");
    const outAcc = document.getElementById("alu_out_acc");
    const fZf = document.getElementById("f_zf");
    const fSf = document.getElementById("f_sf");
    const opText = document.getElementById("alu_curr_op");

    const buttons = container.querySelectorAll(".sim-controls-panel button");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const op = btn.dataset.op;
        const a = parseInt(inA.value) || 0;
        const b = parseInt(inB.value) || 0;
        let res = 0;
        if (op === "ADD") res = a + b;
        else if (op === "SUB") res = a - b;
        else if (op === "AND") res = a & b;
        else if (op === "XOR") res = a ^ b;

        outAcc.textContent = res;
        opText.textContent = `OPERACIÓN: ${op}`;
        fZf.textContent = res === 0 ? "1" : "0";
        fSf.textContent = res < 0 ? "1" : "0";
      });
    });

    document.getElementById("btn_submit_dp").addEventListener("click", () => {
      const selected = document.querySelector('input[name="q_dp"]:checked');
      const feedback = document.getElementById("quiz_feedback_dp");
      if (!selected) return;
      if (selected.value === "1") {
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = "¡Correcto! En toda arquitectura de computadoras estándar, la bandera ZF se activa en 1 cuando el resultado de la ALU es nulo.";
        if (onComplete) onComplete(exerciseId, 100);
      } else {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Incorrecto. Realiza la prueba ingresando A=20 y B=20 y presiona SUB para comprobar el valor de ZF.";
      }
    });
  },

  // 5. SIMULADOR DE MEMORIA CACHÉ
  renderCacheSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-card-header">
          <h4>Simulador de Memoria Caché: Mapeo y Tasa de Hit / Miss</h4>
          <div class="config-row">
            <label>Tipo de Mapeo:
              <select id="cache_mapping_type" class="select-mini">
                <option value="direct">Mapeo Directo (Direct Mapped)</option>
                <option value="2way">Asociativa por Conjuntos de 2 Vías (2-Way)</option>
              </select>
            </label>
          </div>
        </div>

        <div class="cache-address-breakdown">
          <h5>Descomposición de Dirección Física (16 bits):</h5>
          <div class="bit-fields">
            <div class="field-box tag-field">TAG (Etiqueta): <strong id="lbl_tag">0x12</strong></div>
            <div class="field-box index-field">INDEX (Conjunto): <strong id="lbl_index">0x3</strong></div>
            <div class="field-box offset-field">OFFSET (Byte): <strong id="lbl_offset">0x4</strong></div>
          </div>
        </div>

        <div class="cache-grid" id="cache_table_view">
          <!-- Renderizado dinámico de líneas de caché -->
        </div>

        <div class="sim-controls-panel">
          <input type="text" id="txt_mem_addr" value="0x1234" class="input-mini" placeholder="Ej: 0x1234">
          <button class="btn btn-primary" id="btn_access_cache">Acceder a Dirección</button>
          <button class="btn btn-secondary" id="btn_clear_cache">Vaciar Caché</button>
          <div class="sim-stats">
            <span>Aciertos (Hits): <strong id="cnt_hits" class="text-success">0</strong></span> |
            <span>Fallos (Misses): <strong id="cnt_misses" class="text-danger">0</strong></span> |
            <span>Hit Ratio: <strong id="lbl_hit_ratio">0.0%</strong></span>
          </div>
        </div>

        <div class="quiz-challenge-card">
          <h5>Desafío:</h5>
          <p>Si accedes dos veces consecutivas a la misma dirección <code>0x1234</code>, ¿qué ocurre en el segundo acceso?</p>
          <div class="quiz-options">
            <label class="quiz-opt"><input type="radio" name="q_cache" value="hit"> A) CACHE HIT (Acierto de Caché: los datos se leen inmediatamente sin ir a RAM)</label>
            <label class="quiz-opt"><input type="radio" name="q_cache" value="miss"> B) CACHE MISS (Fallo obligatorio)</label>
          </div>
          <button class="btn btn-success" id="btn_submit_cache">Verificar y Registrar</button>
          <div id="quiz_feedback_cache" class="quiz-feedback"></div>
        </div>
      </div>
    `;

    let cache = [
      { valid: 0, tag: "--", data: "--" },
      { valid: 0, tag: "--", data: "--" },
      { valid: 0, tag: "--", data: "--" },
      { valid: 0, tag: "--", data: "--" }
    ];
    let hits = 0;
    let misses = 0;

    function renderCacheView(lastResult = "") {
      const view = document.getElementById("cache_table_view");
      let html = `<table class="cache-lines-table">
        <thead><tr><th>Línea / Index</th><th>Valid Bit</th><th>TAG</th><th>Estado</th></tr></thead><tbody>`;
      cache.forEach((line, idx) => {
        html += `<tr>
          <td><strong>0x0${idx}</strong></td>
          <td><span class="badge ${line.valid ? 'badge-success' : 'badge-secondary'}">${line.valid}</span></td>
          <td><code>${line.tag}</code></td>
          <td>${line.valid ? 'Datos Cargados' : 'Línea Libre'}</td>
        </tr>`;
      });
      html += `</tbody></table>`;
      if (lastResult) {
        html += `<div class="cache-result-banner ${lastResult === 'HIT' ? 'banner-hit' : 'banner-miss'}">RESULTADO DEL ACCESO: ${lastResult}</div>`;
      }
      view.innerHTML = html;
    }

    renderCacheView();

    document.getElementById("btn_access_cache").addEventListener("click", () => {
      const addrHex = document.getElementById("txt_mem_addr").value.trim();
      const addr = parseInt(addrHex, 16) || 0;
      const tag = "0x" + ((addr >> 4) & 0xFF).toString(16).toUpperCase();
      const index = (addr >> 2) & 0x03;
      const offset = "0x" + (addr & 0x03).toString(16).toUpperCase();

      document.getElementById("lbl_tag").textContent = tag;
      document.getElementById("lbl_index").textContent = "0x" + index.toString(16).toUpperCase();
      document.getElementById("lbl_offset").textContent = offset;

      let result = "MISS";
      if (cache[index].valid === 1 && cache[index].tag === tag) {
        result = "HIT";
        hits++;
      } else {
        result = "MISS";
        misses++;
        cache[index].valid = 1;
        cache[index].tag = tag;
      }

      document.getElementById("cnt_hits").textContent = hits;
      document.getElementById("cnt_misses").textContent = misses;
      const total = hits + misses;
      const ratio = total > 0 ? ((hits / total) * 100).toFixed(1) : "0.0";
      document.getElementById("lbl_hit_ratio").textContent = `${ratio}%`;

      renderCacheView(result);
    });

    document.getElementById("btn_clear_cache").addEventListener("click", () => {
      cache = cache.map(() => ({ valid: 0, tag: "--", data: "--" }));
      hits = 0;
      misses = 0;
      document.getElementById("cnt_hits").textContent = "0";
      document.getElementById("cnt_misses").textContent = "0";
      document.getElementById("lbl_hit_ratio").textContent = "0.0%";
      renderCacheView();
    });

    document.getElementById("btn_submit_cache").addEventListener("click", () => {
      const selected = document.querySelector('input[name="q_cache"]:checked');
      const feedback = document.getElementById("quiz_feedback_cache");
      if (!selected) return;
      if (selected.value === "hit") {
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = "¡Perfecto! Al acceder por segunda vez se produce un HIT gracias al Principio de Localidad Temporal.";
        if (onComplete) onComplete(exerciseId, 100);
      } else {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Incorrecto. Intenta pulsar el botón 'Acceder a Dirección' dos veces sin cambiar el número y observa el banner.";
      }
    });
  },

  // 6. SIMULADOR E/S: POLLING vs INTERRUPCIONES vs DMA
  renderIoDmaSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-card-header">
          <h4>Simulador de Métodos de Entrada/Salida (Polling vs IRQ vs DMA)</h4>
        </div>
        <div class="io-methods-grid">
          <div class="io-col" id="col_polling">
            <h5>1. Polling (Sondeo Programado)</h5>
            <div class="cpu-meter">Uso de CPU: <strong id="pol_cpu_usage">0%</strong></div>
            <div class="io-progress-bar"><div class="io-fill" id="pol_fill"></div></div>
            <p class="io-desc">La CPU se bloquea en un bucle esperando el flag de fin de byte.</p>
          </div>
          <div class="io-col" id="col_irq">
            <h5>2. Interrupciones (IRQ)</h5>
            <div class="cpu-meter">Uso de CPU: <strong id="irq_cpu_usage">0%</strong></div>
            <div class="io-progress-bar"><div class="io-fill" id="irq_fill"></div></div>
            <p class="io-desc">La CPU procesa otras tareas y solo atiende cada interrupción de byte.</p>
          </div>
          <div class="io-col" id="col_dma">
            <h5>3. DMA (Direct Memory Access)</h5>
            <div class="cpu-meter">Uso de CPU: <strong id="dma_cpu_usage">0%</strong></div>
            <div class="io-progress-bar"><div class="io-fill" id="dma_fill"></div></div>
            <p class="io-desc">El controlador DMA transfiere el bloque completo a RAM directamente.</p>
          </div>
        </div>

        <div class="sim-controls-panel">
          <button class="btn btn-primary" id="btn_start_io_test">Iniciar Transferencia de 10 MB</button>
          <div class="sim-stats">
            <span>Método Más Eficiente: <strong class="text-success">DMA (Menor sobrecarga de CPU)</strong></span>
          </div>
        </div>

        <div class="quiz-challenge-card">
          <h5>Desafío:</h5>
          <p>¿Cuántas interrupciones genera el controlador DMA a la CPU durante la transferencia de un bloque completo de datos?</p>
          <div class="quiz-options">
            <label class="quiz-opt"><input type="radio" name="q_io" value="per_byte"> A) Una interrupción por cada byte transferido.</label>
            <label class="quiz-opt"><input type="radio" name="q_io" value="one_end"> B) Una sola interrupción al finalizar de transferir el bloque completo.</label>
            <label class="quiz-opt"><input type="radio" name="q_io" value="none"> C) Ninguna interrupción jamás.</label>
          </div>
          <button class="btn btn-success" id="btn_submit_io">Comprobar Respuesta</button>
          <div id="quiz_feedback_io" class="quiz-feedback"></div>
        </div>
      </div>
    `;

    document.getElementById("btn_start_io_test").addEventListener("click", () => {
      document.getElementById("pol_cpu_usage").textContent = "100% (Bloqueado)";
      document.getElementById("pol_fill").style.width = "100%";

      document.getElementById("irq_cpu_usage").textContent = "35% (Manejo ISR)";
      document.getElementById("irq_fill").style.width = "100%";

      document.getElementById("dma_cpu_usage").textContent = "1.5% (Solo inicio y fin)";
      document.getElementById("dma_fill").style.width = "100%";
    });

    document.getElementById("btn_submit_io").addEventListener("click", () => {
      const selected = document.querySelector('input[name="q_io"]:checked');
      const feedback = document.getElementById("quiz_feedback_io");
      if (!selected) return;
      if (selected.value === "one_end") {
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = "¡Exacto! El controlador DMA toma el control del bus y solo emite una única interrupción al CPU cuando todo el bloque ha sido transferido.";
        if (onComplete) onComplete(exerciseId, 100);
      } else {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Incorrecto. Recuerda que la ventaja del DMA es evitar interrumpir al CPU por cada byte individual.";
      }
    });
  },

  // 7. SIMULADOR DE BUS Y ARBITRAJE
  renderBusArbitrationSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-card-header">
          <h4>Calculador de Ancho de Banda y Arbitraje de Buses</h4>
        </div>
        <div class="calc-panel-flex">
          <div class="input-group-row">
            <label>Ancho del Bus de Datos:
              <select id="bus_width_sel" class="select-mini">
                <option value="32">32 bits (4 bytes)</option>
                <option value="64" selected>64 bits (8 bytes)</option>
                <option value="128">128 bits (16 bytes)</option>
              </select>
            </label>
            <label>Frecuencia de Reloj del Bus:
              <select id="bus_freq_sel" class="select-mini">
                <option value="100">100 MHz</option>
                <option value="800">800 MHz</option>
                <option value="3200" selected>3200 MHz (DDR4/DDR5)</option>
              </select>
            </label>
          </div>
          <div class="result-highlight-card">
            <span class="res-label">Ancho de Banda Máximo Teórico:</span>
            <h2 id="lbl_bus_bw" class="res-number">25,600 MB/s (25.6 GB/s)</h2>
            <p class="formula-caption">$$\\text{Ancho de Banda} = \\text{Ancho en Bytes} \\times \\text{Frecuencia}$$</p>
          </div>
        </div>

        <div class="quiz-challenge-card">
          <h5>Desafío de Cálculo de Buses:</h5>
          <p>Si un bus de direcciones posee 36 líneas de dirección físicas, ¿cuánta memoria RAM física puede direccionar teóricamente el procesador?</p>
          <div class="quiz-options">
            <label class="quiz-opt"><input type="radio" name="q_bus" value="4"> A) 4 Gigabytes ($2^{32}$)</label>
            <label class="quiz-opt"><input type="radio" name="q_bus" value="64"> B) 64 Gigabytes ($2^{36} = 68,719,476,736$ bytes)</label>
            <label class="quiz-opt"><input type="radio" name="q_bus" value="16"> C) 16 Megabytes</label>
          </div>
          <button class="btn btn-success" id="btn_submit_bus">Calificar Ejercicio</button>
          <div id="quiz_feedback_bus" class="quiz-feedback"></div>
        </div>
      </div>
    `;

    const wSel = document.getElementById("bus_width_sel");
    const fSel = document.getElementById("bus_freq_sel");
    const bwLbl = document.getElementById("lbl_bus_bw");

    function updateBw() {
      const bytes = parseInt(wSel.value) / 8;
      const freq = parseInt(fSel.value);
      const totalMb = bytes * freq;
      const totalGb = (totalMb / 1000).toFixed(1);
      bwLbl.textContent = `${totalMb.toLocaleString()} MB/s (${totalGb} GB/s)`;
    }

    wSel.addEventListener("change", updateBw);
    fSel.addEventListener("change", updateBw);

    document.getElementById("btn_submit_bus").addEventListener("click", () => {
      const selected = document.querySelector('input[name="q_bus"]:checked');
      const feedback = document.getElementById("quiz_feedback_bus");
      if (!selected) return;
      if (selected.value === "64") {
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = "¡Excelente cálculo! $2^{36} = 64\\text{ GB}$. Cada línea de dirección adicional duplica el espacio de memoria accesible.";
        if (onComplete) onComplete(exerciseId, 100);
      } else {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Incorrecto. Aplica la fórmula: $2^N$ bytes donde $N=36$.";
      }
    });
  },

  // 8. SIMULADOR DE INTERRUPCIONES & PILA
  renderInterruptStackSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-card-header">
          <h4>Simulador de Atención a Interrupción y Salvado en la Pila (Stack)</h4>
        </div>
        <div class="stack-anim-grid">
          <div class="cpu-registers-box">
            <h5>Registros del Procesador</h5>
            <div class="reg-row">PC: <strong id="stk_pc">0x0400</strong></div>
            <div class="reg-row">FLAGS / PSW: <strong id="stk_psw">0x0046</strong></div>
            <div class="reg-row">SP (Stack Pointer): <strong id="stk_sp">0xFFFE</strong></div>
          </div>
          <div class="stack-visual-box">
            <h5>Memoria de Pila (Stack Memory)</h5>
            <div class="stack-slot" id="slot_fffe">[0xFFFE] Vacío</div>
            <div class="stack-slot" id="slot_fffc">[0xFFFC] Vacío</div>
            <div class="stack-slot" id="slot_fffa">[0xFFFA] Vacío</div>
          </div>
          <div class="isr-box">
            <h5>Tabla IVT / IDT y Rutina ISR</h5>
            <div class="ivt-entry">Vector IRQ 1 (Teclado) &rarr; ISR en 0x9000</div>
            <div class="isr-code" id="isr_code_view">Estado: Ejecución normal del programa.</div>
          </div>
        </div>

        <div class="sim-controls-panel">
          <button class="btn btn-danger" id="btn_trigger_irq">Disparar Interrupción de Teclado (IRQ 1)</button>
          <button class="btn btn-primary" id="btn_execute_iret" disabled>Ejecutar IRET (Retorno de ISR)</button>
        </div>

        <div class="quiz-challenge-card">
          <h5>Desafío:</h5>
          <p>¿Qué instrucción en lenguaje ensamblador restaura automáticamente el Program Counter (PC) y el PSW desde la pila al finalizar una rutina de interrupción?</p>
          <div class="quiz-options">
            <label class="quiz-opt"><input type="radio" name="q_stk" value="ret"> A) RET</label>
            <label class="quiz-opt"><input type="radio" name="q_stk" value="iret"> B) IRET (Interrupt Return)</label>
            <label class="quiz-opt"><input type="radio" name="q_stk" value="halt"> C) HLT</label>
          </div>
          <button class="btn btn-success" id="btn_submit_stk">Validar Respuesta</button>
          <div id="quiz_feedback_stk" class="quiz-feedback"></div>
        </div>
      </div>
    `;

    const btnIrq = document.getElementById("btn_trigger_irq");
    const btnIret = document.getElementById("btn_execute_iret");
    const sPc = document.getElementById("stk_pc");
    const sPsw = document.getElementById("stk_psw");
    const sSp = document.getElementById("stk_sp");
    const slotFffe = document.getElementById("slot_fffe");
    const slotFffc = document.getElementById("slot_fffc");
    const isrView = document.getElementById("isr_code_view");

    btnIrq.addEventListener("click", () => {
      slotFffe.textContent = "[0xFFFE] PUSH PSW: 0x0046";
      slotFffe.className = "stack-slot filled";
      slotFffc.textContent = "[0xFFFC] PUSH PC: 0x0400 (Retorno)";
      slotFffc.className = "stack-slot filled";
      sSp.textContent = "0xFFFA";
      sPc.textContent = "0x9000 (ISR Teclado)";
      isrView.innerHTML = "<strong>Ejecutando ISR Teclado...</strong><br>Leyendo código de tecla presionada desde el puerto de E/S 0x60.";
      btnIrq.disabled = true;
      btnIret.disabled = false;
    });

    btnIret.addEventListener("click", () => {
      slotFffc.textContent = "[0xFFFC] Vacío (POP PC)";
      slotFffc.className = "stack-slot";
      slotFffe.textContent = "[0xFFFE] Vacío (POP PSW)";
      slotFffe.className = "stack-slot";
      sSp.textContent = "0xFFFE";
      sPc.textContent = "0x0400 (Programa Reanudado)";
      isrView.innerHTML = "<span class='text-success'>IRET ejecutado: Contexto restaurado perfectamente.</span>";
      btnIrq.disabled = false;
      btnIret.disabled = true;
    });

    document.getElementById("btn_submit_stk").addEventListener("click", () => {
      const selected = document.querySelector('input[name="q_stk"]:checked');
      const feedback = document.getElementById("quiz_feedback_stk");
      if (!selected) return;
      if (selected.value === "iret") {
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = "¡Correcto! La instrucción IRET extrae tanto el PC como las banderas PSW para retornar de forma transparente al programa interrumpido.";
        if (onComplete) onComplete(exerciseId, 100);
      } else {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Incorrecto. RET solo desapila el PC; IRET es la instrucción especializada que desapila además el registro de banderas.";
      }
    });
  },

  // 9. SIMULADOR CPU ORGANIZATION
  renderCpuOrgSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-card-header">
          <h4>Organización Interna de la CPU: Comparativa de Buses Internos</h4>
        </div>
        <p>Analiza cuántos ciclos de microoperaciones requiere la suma $R_1 = R_2 + R_3$ según la cantidad de buses internos del CPU:</p>
        <div class="theory-table-wrapper">
          <table class="theory-table">
            <thead><tr><th>Arquitectura</th><th>Pasos de Reloj para R1 = R2 + R3</th><th>Throughput Interno</th></tr></thead>
            <tbody>
              <tr><td><strong>1 Bus Interno</strong></td><td>3 ciclos (Secuencial: R2 a entrada A, R3 a entrada B, Resultado a R1)</td><td>Bajo</td></tr>
              <tr><td><strong>2 Buses Internos</strong></td><td>2 ciclos (Simultáneo: R2 y R3 a entradas ALU en paralelo)</td><td>Medio</td></tr>
              <tr><td><strong>3 Buses Internos</strong></td><td>1 ciclo (Operación completa en un solo pulso de reloj)</td><td>Máximo</td></tr>
            </tbody>
          </table>
        </div>
        <div class="quiz-challenge-card">
          <h5>Desafío:</h5>
          <p>¿Qué componente interno almacena temporalmente la dirección de memoria que se enviará al bus de direcciones?</p>
          <div class="quiz-options">
            <label class="quiz-opt"><input type="radio" name="q_org" value="mar"> A) MAR (Memory Address Register)</label>
            <label class="quiz-opt"><input type="radio" name="q_org" value="mbr"> B) MBR (Memory Buffer Register)</label>
            <label class="quiz-opt"><input type="radio" name="q_org" value="ir"> C) IR (Instruction Register)</label>
          </div>
          <button class="btn btn-success" id="btn_submit_org">Calificar</button>
          <div id="quiz_feedback_org" class="quiz-feedback"></div>
        </div>
      </div>
    `;

    document.getElementById("btn_submit_org").addEventListener("click", () => {
      const selected = document.querySelector('input[name="q_org"]:checked');
      const feedback = document.getElementById("quiz_feedback_org");
      if (!selected) return;
      if (selected.value === "mar") {
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = "¡Correcto! El MAR contiene la dirección física exacta para el bus de direcciones.";
        if (onComplete) onComplete(exerciseId, 100);
      } else {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Incorrecto. El MBR guarda los datos; el MAR guarda las direcciones.";
      }
    });
  },

  // 10. SIMULADOR REGISTROS Y FLAGS
  renderRegistersFlagsSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-card-header">
          <h4>Tablero Interactivo de Registros y Registro de FLAGS</h4>
        </div>
        <div class="flags-dashboard">
          <div class="reg-inputs-panel">
            <div class="reg-row">
              <label>Registro EAX (Hex): <input type="text" id="reg_eax" value="00000005" class="input-mini"></label>
            </div>
            <div class="reg-row">
              <label>Registro EBX (Hex): <input type="text" id="reg_ebx" value="00000005" class="input-mini"></label>
            </div>
            <button class="btn btn-primary" id="btn_do_cmp">Ejecutar Comparación: CMP EAX, EBX</button>
          </div>
          <div class="flags-status-display">
            <h5>Registro de Banderas (EFLAGS):</h5>
            <div class="flags-grid">
              <div class="flag-chip" id="flag_zf">ZF = 0</div>
              <div class="flag-chip" id="flag_cf">CF = 0</div>
              <div class="flag-chip" id="flag_sf">SF = 0</div>
              <div class="flag-chip" id="flag_of">OF = 0</div>
            </div>
            <div class="branch-decision" id="branch_decision_text">
              Salto Condicional: <code>JE / JZ (Jump if Equal)</code> NO saltaría.
            </div>
          </div>
        </div>

        <div class="quiz-challenge-card">
          <h5>Desafío:</h5>
          <p>Si la instrucción <code>CMP EAX, EBX</code> activa la bandera <code>ZF=1</code>, ¿qué relación matemática tienen los valores de EAX y EBX?</p>
          <div class="quiz-options">
            <label class="quiz-opt"><input type="radio" name="q_flags" value="eq"> A) Son exactamente iguales ($EAX = EBX$, porque CMP realiza una resta interna sin guardar el resultado).</label>
            <label class="quiz-opt"><input type="radio" name="q_flags" value="gt"> B) EAX es estrictamente mayor que EBX.</label>
          </div>
          <button class="btn btn-success" id="btn_submit_flags">Validar Respuesta</button>
          <div id="quiz_feedback_flags" class="quiz-feedback"></div>
        </div>
      </div>
    `;

    document.getElementById("btn_do_cmp").addEventListener("click", () => {
      const a = parseInt(document.getElementById("reg_eax").value, 16) || 0;
      const b = parseInt(document.getElementById("reg_ebx").value, 16) || 0;
      const zf = a === b ? 1 : 0;
      const sf = a < b ? 1 : 0;
      const cf = a < b ? 1 : 0;

      const fZf = document.getElementById("flag_zf");
      const fCf = document.getElementById("flag_cf");
      const fSf = document.getElementById("flag_sf");
      const bText = document.getElementById("branch_decision_text");

      fZf.textContent = `ZF = ${zf}`;
      fZf.className = zf ? "flag-chip active-flag" : "flag-chip";
      fCf.textContent = `CF = ${cf}`;
      fSf.textContent = `SF = ${sf}`;

      if (zf === 1) {
        bText.innerHTML = "<span class='text-success'>Salto Condicional: <code>JE / JZ (Jump if Equal)</code> SÍ saltará.</span>";
      } else {
        bText.innerHTML = "<span>Salto Condicional: <code>JE / JZ</code> NO saltará ($EAX \\neq EBX$).</span>";
      }
    });

    document.getElementById("btn_submit_flags").addEventListener("click", () => {
      const selected = document.querySelector('input[name="q_flags"]:checked');
      const feedback = document.getElementById("quiz_feedback_flags");
      if (!selected) return;
      if (selected.value === "eq") {
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = "¡Excelente! La instrucción CMP realiza internamente $A - B$. Si $A=B$, la resta da 0 y activa la bandera ZF.";
        if (onComplete) onComplete(exerciseId, 100);
      } else {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Incorrecto. Revisa el resultado obtenido al pulsar el botón de comparación con valores idénticos.";
      }
    });
  },

  // 11. SIMULADOR MODOS DE DIRECCIONAMIENTO
  renderAddressingModesSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-card-header">
          <h4>Calculador Visual de Modos de Direccionamiento y Dirección Efectiva (EA)</h4>
        </div>
        <div class="addr-modes-grid">
          <div class="addr-select-col">
            <label>Selecciona el Modo:
              <select id="sel_addr_mode" class="select-mini">
                <option value="imm">Inmediato: MOV R1, #50</option>
                <option value="dir">Directo: MOV R1, [0x0200]</option>
                <option value="ind">Indirecto: MOV R1, [[0x0200]]</option>
                <option value="reg_ind">Indirecto por Registro: MOV R1, [RB]</option>
                <option value="base_disp">Base + Desplazamiento: MOV R1, [RB + 0x0010]</option>
              </select>
            </label>
            <div class="addr-registers-box">
              <div>Registro Base (RB): <strong>0x0300</strong></div>
              <div>Desplazamiento: <strong>0x0010</strong></div>
            </div>
          </div>
          <div class="addr-calc-col">
            <div class="calc-step-box">
              <h5>Cálculo de la Dirección Efectiva (EA):</h5>
              <div id="ea_formula_view" class="formula-banner">EA = No requiere acceso a memoria RAM (el dato está en la instrucción).</div>
              <div id="ea_operand_view" class="operand-banner">Operando obtenido: <strong>50 (Constante)</strong></div>
            </div>
          </div>
        </div>

        <div class="quiz-challenge-card">
          <h5>Desafío:</h5>
          <p>¿Qué modo de direccionamiento es el más rápido de todos porque no requiere calcular direcciones ni leer la memoria RAM?</p>
          <div class="quiz-options">
            <label class="quiz-opt"><input type="radio" name="q_addr" value="imm"> A) Direccionamiento Inmediato</label>
            <label class="quiz-opt"><input type="radio" name="q_addr" value="ind"> B) Direccionamiento Indirecto</label>
          </div>
          <button class="btn btn-success" id="btn_submit_addr">Validar</button>
          <div id="quiz_feedback_addr" class="quiz-feedback"></div>
        </div>
      </div>
    `;

    const sel = document.getElementById("sel_addr_mode");
    const fView = document.getElementById("ea_formula_view");
    const oView = document.getElementById("ea_operand_view");

    sel.addEventListener("change", () => {
      const mode = sel.value;
      if (mode === "imm") {
        fView.textContent = "EA = No aplica (Dato dentro de la instrucción)";
        oView.innerHTML = "Operando obtenido: <strong>50 (Constante inmediata)</strong>";
      } else if (mode === "dir") {
        fView.textContent = "EA = 0x0200";
        oView.innerHTML = "Operando obtenido: <strong>Dato en Memoria[0x0200]</strong>";
      } else if (mode === "ind") {
        fView.textContent = "EA = Memoria[0x0200] = 0x0500 (Doble acceso a memoria)";
        oView.innerHTML = "Operando obtenido: <strong>Dato en Memoria[0x0500]</strong>";
      } else if (mode === "reg_ind") {
        fView.textContent = "EA = [RB] = 0x0300";
        oView.innerHTML = "Operando obtenido: <strong>Dato en Memoria[0x0300]</strong>";
      } else if (mode === "base_disp") {
        fView.textContent = "EA = RB + Desplazamiento = 0x0300 + 0x0010 = 0x0310";
        oView.innerHTML = "Operando obtenido: <strong>Dato en Memoria[0x0310]</strong>";
      }
    });

    document.getElementById("btn_submit_addr").addEventListener("click", () => {
      const selected = document.querySelector('input[name="q_addr"]:checked');
      const feedback = document.getElementById("quiz_feedback_addr");
      if (!selected) return;
      if (selected.value === "imm") {
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = "¡Correcto! En el direccionamiento inmediato el operando viaja dentro del opcode de la instrucción.";
        if (onComplete) onComplete(exerciseId, 100);
      } else {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Incorrecto. El indirecto es el más lento porque requiere dos accesos sucesivos a memoria.";
      }
    });
  },

  // 12. COMPARADOR DE MICROARQUITECTURAS REALES
  renderCpuComparisonSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-card-header">
          <h4>Comparador de Arquitecturas Reales: x86-64 vs ARM vs RISC-V</h4>
        </div>
        <div class="cpu-cards-grid">
          <div class="arch-compare-card">
            <h5>Intel Core / AMD x86-64</h5>
            <ul>
              <li><strong>Filosofía:</strong> CISC traducido internamente a µops</li>
              <li><strong>Longitud de Instrucción:</strong> Variable (1 a 15 bytes)</li>
              <li><strong>Consumo:</strong> 65W a 253W (Alto)</li>
              <li><strong>Fortaleza:</strong> Máximo rendimiento por núcleo, compatibilidad con software legado</li>
            </ul>
          </div>
          <div class="arch-compare-card">
            <h5>ARM (Cortex / Apple M-Series)</h5>
            <ul>
              <li><strong>Filosofía:</strong> RISC puro con núcleos big.LITTLE</li>
              <li><strong>Longitud de Instrucción:</strong> Fija (32 bits / 16 bits Thumb)</li>
              <li><strong>Consumo:</strong> 5W a 30W (Ultrabajo)</li>
              <li><strong>Fortaleza:</strong> Máxima eficiencia por Watt, dominante en smartphones y laptops</li>
            </ul>
          </div>
          <div class="arch-compare-card">
            <h5>RISC-V (Open Standard)</h5>
            <ul>
              <li><strong>Filosofía:</strong> RISC de código abierto y modular</li>
              <li><strong>Licenciamiento:</strong> Libre de regalías (Open Source)</li>
              <li><strong>Extensiones:</strong> Base RV64I + M, A, F, D, C, V</li>
              <li><strong>Fortaleza:</strong> Soberanía tecnológica, personalización en chips de IA</li>
            </ul>
          </div>
        </div>

        <div class="quiz-challenge-card">
          <h5>Desafío:</h5>
          <p>¿Qué tecnología en procesadores ARM permite alternar entre núcleos de alto rendimiento y núcleos de bajo consumo para ahorrar energía?</p>
          <div class="quiz-options">
            <label class="quiz-opt"><input type="radio" name="q_real" value="biglittle"> A) ARM big.LITTLE / DynamIQ</label>
            <label class="quiz-opt"><input type="radio" name="q_real" value="hyper"> B) Hyper-Threading</label>
          </div>
          <button class="btn btn-success" id="btn_submit_real">Calificar</button>
          <div id="quiz_feedback_real" class="quiz-feedback"></div>
        </div>
      </div>
    `;

    document.getElementById("btn_submit_real").addEventListener("click", () => {
      const selected = document.querySelector('input[name="q_real"]:checked');
      const feedback = document.getElementById("quiz_feedback_real");
      if (!selected) return;
      if (selected.value === "biglittle") {
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = "¡Correcto! big.LITTLE combina núcleos de alta potencia con núcleos eficientes en el mismo silicio.";
        if (onComplete) onComplete(exerciseId, 100);
      } else {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Incorrecto. Hyper-Threading es una tecnología de hilos simultáneos (SMT) de Intel.";
      }
    });
  },

  // 13. EXPLORADOR DE CHIPSET
  renderChipsetSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-card-header">
          <h4>Explorador de Arquitectura de Chipset y Carriles PCIe</h4>
        </div>
        <p>En las placas base actuales, el CPU provee carriles directos para la tarjeta gráfica y la unidad NVMe principal, mientras el Chipset (PCH) suministra carriles adicionales:</p>
        <div class="chipset-diagram">
          <div class="cs-cpu">
            <strong>CPU (LGA1700 / AM5)</strong><br>
            - 16 carriles PCIe 5.0 directos (GPU)<br>
            - 4 carriles PCIe 4.0 directos (M.2 NVMe 1)<br>
            - Controlador de Memoria DDR5 Dual Channel
          </div>
          <div class="cs-link">&larr; Enlace DMI 4.0 x8 (16 GB/s) &rarr;</div>
          <div class="cs-pch">
            <strong>CHIPSET / PCH</strong><br>
            - Ranuras PCIe secundarias<br>
            - Puertos SATA 6 Gb/s<br>
            - Controladores USB 3.2 / Type-C<br>
            - Ethernet 2.5G & Wi-Fi 6E
          </div>
        </div>

        <div class="quiz-challenge-card">
          <h5>Desafío:</h5>
          <p>¿Qué componente vital fue trasladado desde el antiguo Northbridge directamente al interior del silicio de la CPU moderna?</p>
          <div class="quiz-options">
            <label class="quiz-opt"><input type="radio" name="q_cs" value="imc"> A) El Controlador de Memoria Integrado (IMC) y los carriles PCIe principales.</label>
            <label class="quiz-opt"><input type="radio" name="q_cs" value="usb"> B) El controlador de puertos USB y audio.</label>
          </div>
          <button class="btn btn-success" id="btn_submit_cs">Registrar Respuesta</button>
          <div id="quiz_feedback_cs" class="quiz-feedback"></div>
        </div>
      </div>
    `;

    document.getElementById("btn_submit_cs").addEventListener("click", () => {
      const selected = document.querySelector('input[name="q_cs"]:checked');
      const feedback = document.getElementById("quiz_feedback_cs");
      if (!selected) return;
      if (selected.value === "imc") {
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = "¡Correcto! La integración del IMC dentro del procesador eliminó el bus FSB y redujo la latencia drásticamente.";
        if (onComplete) onComplete(exerciseId, 100);
      } else {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Incorrecto. Los puertos USB siguen administrados por el Chipset secundario.";
      }
    });
  },

  // 14. SIMULADOR VIRTUAL DE ENSAMBLE DE PC
  renderPcBuilderSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-card-header">
          <h4>Simulador de Ensamble y Verificador de Compatibilidad Técnica</h4>
          <span class="badge badge-info">Laboratorio Práctico de Ensamble</span>
        </div>
        <div class="pc-builder-grid">
          <div class="builder-selectors">
            <div class="b-row">
              <label>1. Procesador (CPU):
                <select id="pc_cpu" class="select-mini">
                  <option value="i7_14700k" data-socket="LGA1700" data-ram="DDR5" data-tdp="253">Intel Core i7-14700K (LGA1700, 253W)</option>
                  <option value="ryzen_7800x3d" data-socket="AM5" data-ram="DDR5" data-tdp="120" selected>AMD Ryzen 7 7800X3D (AM5, 120W)</option>
                  <option value="i5_10400" data-socket="LGA1200" data-ram="DDR4" data-tdp="65">Intel Core i5-10400 (LGA1200, 65W)</option>
                </select>
              </label>
            </div>
            <div class="b-row">
              <label>2. Placa Base (Motherboard):
                <select id="pc_mobo" class="select-mini">
                  <option value="b650_am5" data-socket="AM5" data-ram="DDR5" selected>ASUS TUF B650-PLUS (Socket AM5, DDR5)</option>
                  <option value="z790_lga1700" data-socket="LGA1700" data-ram="DDR5">MSI Z790 Gaming (Socket LGA1700, DDR5)</option>
                  <option value="b460_lga1200" data-socket="LGA1200" data-ram="DDR4">Gigabyte B460M (Socket LGA1200, DDR4)</option>
                </select>
              </label>
            </div>
            <div class="b-row">
              <label>3. Memoria RAM:
                <select id="pc_ram" class="select-mini">
                  <option value="ddr5_32" data-type="DDR5" selected>32GB (2x16GB) DDR5 6000MHz CL30</option>
                  <option value="ddr4_16" data-type="DDR4">16GB (2x8GB) DDR4 3200MHz CL16</option>
                </select>
              </label>
            </div>
            <div class="b-row">
              <label>4. Tarjeta Gráfica (GPU):
                <select id="pc_gpu" class="select-mini">
                  <option value="rtx_4070" data-tdp="200" selected>NVIDIA GeForce RTX 4070 (200W TDP)</option>
                  <option value="rtx_4090" data-tdp="450">NVIDIA GeForce RTX 4090 (450W TDP)</option>
                  <option value="igpu" data-tdp="0">Gráficos Integrados (0W)</option>
                </select>
              </label>
            </div>
            <div class="b-row">
              <label>5. Fuente de Poder (PSU):
                <select id="pc_psu" class="select-mini">
                  <option value="550">550W 80 PLUS Bronce</option>
                  <option value="750" selected>750W 80 PLUS Gold</option>
                  <option value="1000">1000W 80 PLUS Platinum</option>
                </select>
              </label>
            </div>
          </div>

          <div class="builder-diagnostics">
            <h5>Diagnóstico de Compatibilidad en Tiempo Real:</h5>
            <div class="diag-item" id="diag_socket">✓ Socket Compatible (AM5 &harr; AM5)</div>
            <div class="diag-item" id="diag_ram">✓ Estándar de RAM Compatible (DDR5 &harr; DDR5)</div>
            <div class="diag-item" id="diag_power">✓ Fuente de Poder Adecuada (Estimado: 370W / PSU: 750W)</div>
            <div class="total-tdp-box">Consumo Total Estimado del Sistema: <strong id="lbl_total_tdp">370 W</strong></div>
          </div>
        </div>

        <div class="sim-controls-panel">
          <button class="btn btn-primary" id="btn_verify_build">Validar Ensamble Completo</button>
        </div>

        <div class="quiz-challenge-card">
          <h5>Desafío:</h5>
          <p>¿Qué ocurriría si intentas montar físicamente un procesador AMD Ryzen 7 7800X3D (AM5) en una placa base con zócalo LGA1700 de Intel?</p>
          <div class="quiz-options">
            <label class="quiz-opt"><input type="radio" name="q_build" value="incomp"> A) Incompatibilidad física y eléctrica total: no encaja en el zócalo y dañaría los pines.</label>
            <label class="quiz-opt"><input type="radio" name="q_build" value="func"> B) Funciona normalmente mediante una actualización de BIOS.</label>
          </div>
          <button class="btn btn-success" id="btn_submit_build">Registrar Calificación</button>
          <div id="quiz_feedback_build" class="quiz-feedback"></div>
        </div>
      </div>
    `;

    function verifyBuild() {
      const cpuOpt = document.getElementById("pc_cpu").selectedOptions[0];
      const moboOpt = document.getElementById("pc_mobo").selectedOptions[0];
      const ramOpt = document.getElementById("pc_ram").selectedOptions[0];
      const gpuOpt = document.getElementById("pc_gpu").selectedOptions[0];
      const psuWatt = parseInt(document.getElementById("pc_psu").value);

      const cpuSocket = cpuOpt.dataset.socket;
      const moboSocket = moboOpt.dataset.socket;
      const moboRam = moboOpt.dataset.ram;
      const ramType = ramOpt.dataset.type;

      const cpuTdp = parseInt(cpuOpt.dataset.tdp) || 65;
      const gpuTdp = parseInt(gpuOpt.dataset.tdp) || 0;
      const totalTdp = cpuTdp + gpuTdp + 50; // 50W base mobo + SSD + fans

      document.getElementById("lbl_total_tdp").textContent = `${totalTdp} W`;

      // Socket check
      const dSocket = document.getElementById("diag_socket");
      if (cpuSocket === moboSocket) {
        dSocket.textContent = `✓ Socket Compatible (${cpuSocket} ↔ ${moboSocket})`;
        dSocket.className = "diag-item ok";
      } else {
        dSocket.textContent = `✗ ERROR CRÍTICO: Socket incompatible (${cpuSocket} ≠ ${moboSocket})`;
        dSocket.className = "diag-item err";
      }

      // RAM check
      const dRam = document.getElementById("diag_ram");
      if (moboRam === ramType) {
        dRam.textContent = `✓ Estándar de RAM Compatible (${ramType})`;
        dRam.className = "diag-item ok";
      } else {
        dRam.textContent = `✗ ERROR: Incompatibilidad de RAM (${ramType} no calza en placa ${moboRam})`;
        dRam.className = "diag-item err";
      }

      // Power check
      const dPower = document.getElementById("diag_power");
      const minPsu = totalTdp * 1.25;
      if (psuWatt >= minPsu) {
        dPower.textContent = `✓ Fuente Adecuada (Requerido: ${Math.round(minPsu)}W / PSU: ${psuWatt}W)`;
        dPower.className = "diag-item ok";
      } else {
        dPower.textContent = `⚠ ALERTA POTENCIA: PSU insuficiente (${psuWatt}W < ${Math.round(minPsu)}W recomendados)`;
        dPower.className = "diag-item err";
      }
    }

    container.querySelectorAll(".pc-builder-grid select").forEach(sel => {
      sel.addEventListener("change", verifyBuild);
    });

    document.getElementById("btn_verify_build").addEventListener("click", verifyBuild);

    document.getElementById("btn_submit_build").addEventListener("click", () => {
      const selected = document.querySelector('input[name="q_build"]:checked');
      const feedback = document.getElementById("quiz_feedback_build");
      if (!selected) return;
      if (selected.value === "incomp") {
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = "¡Excelente! Los sockets son física y eléctricamente propietarios de cada fabricante de procesadores.";
        if (onComplete) onComplete(exerciseId, 100);
      } else {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Incorrecto. Nunca se puede colocar un CPU en un zócalo diferente.";
      }
    });
  },

  // 15. SIMULADOR ENERGÍA Y TÉRMICA
  renderPowerThermalSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-card-header">
          <h4>Calculador de Eficiencia Energética 80 PLUS y Disipación Térmica</h4>
        </div>
        <div class="power-calc-box">
          <label>Potencia Demandada por Componentes:
            <input type="range" id="rng_load" min="100" max="800" value="400" step="50">
            <strong id="lbl_load_w">400 W</strong>
          </label>
          <label>Certificación de Fuente:
            <select id="sel_80plus" class="select-mini">
              <option value="0.80">80 PLUS Bronce (82% Eficiencia)</option>
              <option value="0.90" selected>80 PLUS Gold (90% Eficiencia)</option>
              <option value="0.94">80 PLUS Platinum (94% Eficiencia)</option>
            </select>
          </label>
          <div class="calc-results-grid">
            <div class="c-stat">Consumo de la Pared Eléctrica: <strong id="lbl_wall_w">444 W</strong></div>
            <div class="c-stat">Calor Residual Disipado: <strong id="lbl_heat_w" class="text-danger">44 W (150 BTU/h)</strong></div>
          </div>
        </div>

        <div class="quiz-challenge-card">
          <h5>Desafío:</h5>
          <p>¿Qué beneficio crítico aporta una fuente 80 PLUS Titanium frente a una genérica en un centro de datos con 10,000 servidores 24/7?</p>
          <div class="quiz-options">
            <label class="quiz-opt"><input type="radio" name="q_pwr" value="save"> A) Reduce drásticamente la factura eléctrica y el gasto de aire acondicionado al disipar mucho menos calor residual.</label>
            <label class="quiz-opt"><input type="radio" name="q_pwr" value="ghz"> B) Duplica la frecuencia en GHz de la CPU.</label>
          </div>
          <button class="btn btn-success" id="btn_submit_pwr">Validar</button>
          <div id="quiz_feedback_pwr" class="quiz-feedback"></div>
        </div>
      </div>
    `;

    const rng = document.getElementById("rng_load");
    const sel = document.getElementById("sel_80plus");

    function calcPwr() {
      const load = parseInt(rng.value);
      const eff = parseFloat(sel.value);
      document.getElementById("lbl_load_w").textContent = `${load} W`;
      const wall = Math.round(load / eff);
      const heat = wall - load;
      const btu = Math.round(heat * 3.412);
      document.getElementById("lbl_wall_w").textContent = `${wall} W`;
      document.getElementById("lbl_heat_w").textContent = `${heat} W (${btu} BTU/h)`;
    }

    rng.addEventListener("input", calcPwr);
    sel.addEventListener("change", calcPwr);

    document.getElementById("btn_submit_pwr").addEventListener("click", () => {
      const selected = document.querySelector('input[name="q_pwr"]:checked');
      const feedback = document.getElementById("quiz_feedback_pwr");
      if (!selected) return;
      if (selected.value === "save") {
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = "¡Correcto! En centros de datos la energía y el enfriamiento representan hasta el 40% del costo operativo.";
        if (onComplete) onComplete(exerciseId, 100);
      } else {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Incorrecto. La fuente no modifica los GHz del procesador.";
      }
    });
  },

  // 16. SIMULADOR ASPECTOS BÁSICOS PARALELO
  renderParallelBasicsSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-card-header">
          <h4>Granularidad y Sobrecarga de Comunicación en Computación Paralela</h4>
        </div>
        <p>A medida que dividimos una tarea en subprocesos más pequeños (granularidad fina), el tiempo de comunicación puede superar al tiempo de cálculo:</p>
        <div class="granularity-visual">
          <div class="g-bar g-coarse">Granularidad Gruesa: 85% Cálculo Útil | 15% Comunicación</div>
          <div class="g-bar g-fine">Granularidad Fina: 40% Cálculo Útil | 60% Sobrecarga de Red</div>
        </div>
        <div class="quiz-challenge-card">
          <h5>Desafío:</h5>
          <p>¿Qué término describe dos o más instrucciones ejecutándose exactamente en el mismo instante de tiempo físico en núcleos separados?</p>
          <div class="quiz-options">
            <label class="quiz-opt"><input type="radio" name="q_par" value="par"> A) Paralelismo Real de Hardware</label>
            <label class="quiz-opt"><input type="radio" name="q_par" value="con"> B) Concurrencia Simulada por tiempo compartido</label>
          </div>
          <button class="btn btn-success" id="btn_submit_par">Comprobar</button>
          <div id="quiz_feedback_par" class="quiz-feedback"></div>
        </div>
      </div>
    `;

    document.getElementById("btn_submit_par").addEventListener("click", () => {
      const selected = document.querySelector('input[name="q_par"]:checked');
      const feedback = document.getElementById("quiz_feedback_par");
      if (!selected) return;
      if (selected.value === "par") {
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = "¡Correcto! El paralelismo exige hardware con múltiples núcleos físicos ejecutando a la vez.";
        if (onComplete) onComplete(exerciseId, 100);
      } else {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Incorrecto. Concurrencia puede ocurrir en un solo núcleo mediante alternancia rápida de hilos.";
      }
    });
  },

  // 17. TAXONOMÍA DE FLYNN INTERACTIVA
  renderFlynnTaxonomySim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-card-header">
          <h4>Matriz Interactiva de la Taxonomía de Flynn</h4>
        </div>
        <div class="flynn-matrix-grid">
          <div class="flynn-quadrant" id="flynn_sisd">
            <h5>SISD (Single Inst, Single Data)</h5>
            <p>1 Instrucción &rarr; 1 Flujo de Datos</p>
            <span class="badge badge-secondary">Ej: Intel 8086 uniprocesador</span>
          </div>
          <div class="flynn-quadrant" id="flynn_simd">
            <h5>SIMD (Single Inst, Multiple Data)</h5>
            <p>1 Instrucción &rarr; N Flujos de Datos</p>
            <span class="badge badge-info">Ej: GPUs / Extensiones AVX-512</span>
          </div>
          <div class="flynn-quadrant" id="flynn_misd">
            <h5>MISD (Multiple Inst, Single Data)</h5>
            <p>N Instrucciones &rarr; 1 Flujo de Datos</p>
            <span class="badge badge-warning">Ej: Vuelo espacial redundante</span>
          </div>
          <div class="flynn-quadrant" id="flynn_mimd">
            <h5>MIMD (Multiple Inst, Multiple Data)</h5>
            <p>N Instrucciones &rarr; M Flujos de Datos</p>
            <span class="badge badge-success">Ej: Supercomputadoras y Clústeres</span>
          </div>
        </div>

        <div class="quiz-challenge-card">
          <h5>Desafío:</h5>
          <p>¿En qué cuadrante de Flynn se clasifica una tarjeta gráfica NVIDIA RTX con miles de núcleos ejecutando la misma operación de sombreado sobre diferentes píxeles?</p>
          <div class="quiz-options">
            <label class="quiz-opt"><input type="radio" name="q_flynn" value="simd"> A) SIMD (Single Instruction, Multiple Data)</label>
            <label class="quiz-opt"><input type="radio" name="q_flynn" value="sisd"> B) SISD</label>
          </div>
          <button class="btn btn-success" id="btn_submit_flynn">Validar y Calificar</button>
          <div id="quiz_feedback_flynn" class="quiz-feedback"></div>
        </div>
      </div>
    `;

    document.getElementById("btn_submit_flynn").addEventListener("click", () => {
      const selected = document.querySelector('input[name="q_flynn"]:checked');
      const feedback = document.getElementById("quiz_feedback_flynn");
      if (!selected) return;
      if (selected.value === "simd") {
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = "¡Excelente! Las GPUs aplican la misma instrucción a múltiples elementos de un arreglo o matriz (SIMD / SIMT).";
        if (onComplete) onComplete(exerciseId, 100);
      } else {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Incorrecto. Revisa la definición del cuadrante SIMD.";
      }
    });
  },

  // 18. SIMULADOR PROTOCOLO MESI
  renderMesiCoherenceSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-card-header">
          <h4>Simulador del Protocolo de Coherencia de Caché MESI</h4>
        </div>
        <p>Interactúa con 2 núcleos con caché L1 accediendo a la variable compartida <code>X</code> en memoria RAM:</p>
        <div class="mesi-cores-grid">
          <div class="core-cache-card" id="card_c0">
            <h5>Núcleo 0 (Core 0)</h5>
            <div class="cache-state-badge" id="c0_state">Estado MESI: I (Invalid)</div>
            <div class="cache-data-val" id="c0_val">Dato X: --</div>
            <div class="core-actions">
              <button class="btn btn-mini btn-primary" id="btn_c0_rd">PrRd (Leer X)</button>
              <button class="btn btn-mini btn-warning" id="btn_c0_wr">PrWr (Escribir X=99)</button>
            </div>
          </div>

          <div class="core-cache-card" id="card_c1">
            <h5>Núcleo 1 (Core 1)</h5>
            <div class="cache-state-badge" id="c1_state">Estado MESI: I (Invalid)</div>
            <div class="cache-data-val" id="c1_val">Dato X: --</div>
            <div class="core-actions">
              <button class="btn btn-mini btn-primary" id="btn_c1_rd">PrRd (Leer X)</button>
              <button class="btn btn-mini btn-warning" id="btn_c1_wr">PrWr (Escribir X=50)</button>
            </div>
          </div>
        </div>

        <div class="shared-ram-box">
          Memoria Principal Compartida: <strong>Variable X = 10</strong>
        </div>

        <div class="quiz-challenge-card">
          <h5>Desafío:</h5>
          <p>Si ambos núcleos tienen la variable X en estado <strong>Shared (S)</strong> y el Núcleo 0 escribe un nuevo valor (PrWr), ¿a qué estado pasa la copia en el Núcleo 1 tras el escudriñamiento (snooping)?</p>
          <div class="quiz-options">
            <label class="quiz-opt"><input type="radio" name="q_mesi" value="invalid"> A) Pasa a estado I (Invalid), para evitar usar datos obsoletos.</label>
            <label class="quiz-opt"><input type="radio" name="q_mesi" value="mod"> B) Pasa a estado M (Modified).</label>
          </div>
          <button class="btn btn-success" id="btn_submit_mesi">Validar Calificación</button>
          <div id="quiz_feedback_mesi" class="quiz-feedback"></div>
        </div>
      </div>
    `;

    const c0State = document.getElementById("c0_state");
    const c0Val = document.getElementById("c0_val");
    const c1State = document.getElementById("c1_state");
    const c1Val = document.getElementById("c1_val");

    document.getElementById("btn_c0_rd").addEventListener("click", () => {
      c0State.textContent = "Estado MESI: E (Exclusive)";
      c0State.className = "cache-state-badge mesi-e";
      c0Val.textContent = "Dato X: 10";
    });

    document.getElementById("btn_c0_wr").addEventListener("click", () => {
      c0State.textContent = "Estado MESI: M (Modified)";
      c0State.className = "cache-state-badge mesi-m";
      c0Val.textContent = "Dato X: 99";
      c1State.textContent = "Estado MESI: I (Invalidado por Bus)";
      c1State.className = "cache-state-badge mesi-i";
      c1Val.textContent = "Dato X: Obsoleto";
    });

    document.getElementById("btn_c1_rd").addEventListener("click", () => {
      c1State.textContent = "Estado MESI: S (Shared)";
      c1State.className = "cache-state-badge mesi-s";
      c1Val.textContent = "Dato X: 10";
      if (c0State.textContent.includes("E")) {
        c0State.textContent = "Estado MESI: S (Shared)";
        c0State.className = "cache-state-badge mesi-s";
      }
    });

    document.getElementById("btn_c1_wr").addEventListener("click", () => {
      c1State.textContent = "Estado MESI: M (Modified)";
      c1State.className = "cache-state-badge mesi-m";
      c1Val.textContent = "Dato X: 50";
      c0State.textContent = "Estado MESI: I (Invalidado por Bus)";
      c0State.className = "cache-state-badge mesi-i";
      c0Val.textContent = "Dato X: Obsoleto";
    });

    document.getElementById("btn_submit_mesi").addEventListener("click", () => {
      const selected = document.querySelector('input[name="q_mesi"]:checked');
      const feedback = document.getElementById("quiz_feedback_mesi");
      if (!selected) return;
      if (selected.value === "invalid") {
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = "¡Excelente! Al escribir en el Núcleo 0, se envía una señal de invalidación por el bus y la copia del Núcleo 1 transiciona de S a I.";
        if (onComplete) onComplete(exerciseId, 100);
      } else {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Incorrecto. El núcleo remoto debe invalidar su copia.";
      }
    });
  },

  // 19. SIMULADOR LEY DE AMDAHL Y TOPOLOGÍAS
  renderAmdahlTopologiesSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-card-header">
          <h4>Calculador de Ley de Amdahl vs Gustafson y Topologías de Clúster</h4>
        </div>
        <div class="amdahl-calc-panel">
          <div class="slider-row">
            <label>Fracción Paralelizable ($f$): <strong id="lbl_amd_f">0.90 (90%)</strong>
              <input type="range" id="rng_amd_f" min="0.5" max="0.99" step="0.01" value="0.90">
            </label>
          </div>
          <div class="slider-row">
            <label>Número de Nodos de Cómputo ($N$): <strong id="lbl_amd_n">64 nodos</strong>
              <input type="range" id="rng_amd_n" min="2" max="256" step="2" value="64">
            </label>
          </div>
          <div class="results-compare-box">
            <div class="res-card">
              <h5>Ley de Amdahl (Speedup Fuerte):</h5>
              <h3 id="lbl_res_amdahl" class="text-primary">8.77x</h3>
              <p>Límite teórico máximo con $N \\to \\infty$: <strong id="lbl_max_amdahl">10.0x</strong></p>
            </div>
            <div class="res-card">
              <h5>Ley de Gustafson (Speedup Débil):</h5>
              <h3 id="lbl_res_gustafson" class="text-success">57.7x</h3>
              <p>Escala casi linealmente al aumentar el tamaño del problema.</p>
            </div>
          </div>
        </div>

        <div class="topologies-preview-box">
          <h5>Topologías de Red en Clúster:</h5>
          <div class="top-chips">
            <span class="chip-active">Anillo (Diámetro: N/2)</span>
            <span class="chip-active">Malla 2D (Diámetro: 2(M-1))</span>
            <span class="chip-active">Hipercubo d-dimensional (Diámetro: log2 N)</span>
          </div>
        </div>

        <div class="quiz-challenge-card">
          <h5>Desafío:</h5>
          <p>Si un programa tiene una porción secuencial del 20% ($1-f = 0.20$), ¿cuál es la aceleración máxima teórica absoluta según la Ley de Amdahl aunque usemos 1 millón de procesadores?</p>
          <div class="quiz-options">
            <label class="quiz-opt"><input type="radio" name="q_amd" value="5"> A) 5x ($1 / 0.20 = 5$)</label>
            <label class="quiz-opt"><input type="radio" name="q_amd" value="1000"> B) 1000x</label>
          </div>
          <button class="btn btn-success" id="btn_submit_amd">Calificar Ejercicio</button>
          <div id="quiz_feedback_amd" class="quiz-feedback"></div>
        </div>
      </div>
    `;

    const rF = document.getElementById("rng_amd_f");
    const rN = document.getElementById("rng_amd_n");
    const lF = document.getElementById("lbl_amd_f");
    const lN = document.getElementById("lbl_amd_n");
    const rAmd = document.getElementById("lbl_res_amdahl");
    const rMax = document.getElementById("lbl_max_amdahl");
    const rGus = document.getElementById("lbl_res_gustafson");

    function calcAmdahl() {
      const f = parseFloat(rF.value);
      const n = parseInt(rN.value);
      lF.textContent = `${f.toFixed(2)} (${Math.round(f * 100)}%)`;
      lN.textContent = `${n} nodos`;

      const speedupAmd = 1 / ((1 - f) + (f / n));
      const maxAmd = 1 / (1 - f);
      const speedupGus = n - (1 - f) * (n - 1);

      rAmd.textContent = `${speedupAmd.toFixed(2)}x`;
      rMax.textContent = `${maxAmd.toFixed(1)}x`;
      rGus.textContent = `${speedupGus.toFixed(1)}x`;
    }

    rF.addEventListener("input", calcAmdahl);
    rN.addEventListener("input", calcAmdahl);

    document.getElementById("btn_submit_amd").addEventListener("click", () => {
      const selected = document.querySelector('input[name="q_amd"]:checked');
      const feedback = document.getElementById("quiz_feedback_amd");
      if (!selected) return;
      if (selected.value === "5") {
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = "¡Excelente deducción! El límite de Amdahl es $\\frac{1}{1-f} = \\frac{1}{0.20} = 5\\times$.";
        if (onComplete) onComplete(exerciseId, 100);
      } else {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Incorrecto. Aplica la fórmula del límite cuando $N \\to \\infty$.";
      }
    });
  },

  // 20. SIMULADOR SUPERCÓMPUTO
  renderSupercomputerSim(container, exerciseId, onComplete) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-card-header">
          <h4>Analizador de Supercomputadoras Exascale y Récords TOP500</h4>
        </div>
        <div class="supercomputer-table-wrapper">
          <table class="theory-table">
            <thead><tr><th>Supercomputadora</th><th>Arquitectura</th><th>Rendimiento Rmax</th><th>Consumo Eléctrico</th><th>Eficiencia</th></tr></thead>
            <tbody>
              <tr><td><strong>Frontier (EE.UU.)</strong></td><td>AMD EPYC + Aceleradores Instinct MI250X</td><td>1.2 Exaflops</td><td>22.7 Megavatios</td><td>52.8 GFlops/W</td></tr>
              <tr><td><strong>Fugaku (Japón)</strong></td><td>ARM A64FX con vectores SVE 512 bits</td><td>442 Petaflops</td><td>29.8 Megavatios</td><td>15.4 GFlops/W</td></tr>
              <tr><td><strong>Aurora (EE.UU.)</strong></td><td>Intel Xeon Max + GPU Max Ponte Vecchio</td><td>1.01 Exaflops</td><td>24.6 Megavatios</td><td>41.1 GFlops/W</td></tr>
            </tbody>
          </table>
        </div>
        <div class="quiz-challenge-card">
          <h5>Desafío Final de la Unidad 4:</h5>
          <p>¿Qué orden de magnitud representa exactamente 1 Exaflop?</p>
          <div class="quiz-options">
            <label class="quiz-opt"><input type="radio" name="q_top" value="18"> A) $10^{18}$ operaciones de coma flotante por segundo (un trillón en escala corta internacional).</label>
            <label class="quiz-opt"><input type="radio" name="q_top" value="12"> B) $10^{12}$ operaciones por segundo (Teraflop).</label>
          </div>
          <button class="btn btn-success" id="btn_submit_top">Finalizar Evaluación</button>
          <div id="quiz_feedback_top" class="quiz-feedback"></div>
        </div>
      </div>
    `;

    document.getElementById("btn_submit_top").addEventListener("click", () => {
      const selected = document.querySelector('input[name="q_top"]:checked');
      const feedback = document.getElementById("quiz_feedback_top");
      if (!selected) return;
      if (selected.value === "18") {
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = "¡Extraordinario! 1 Exaflop = $10^{18}$ FLOPS, la cúspide actual del supercómputo mundial.";
        if (onComplete) onComplete(exerciseId, 100);
      } else {
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = "Incorrecto. $10^{12}$ es un Teraflop. Un Exaflop es $10^{18}$.";
      }
    });
  }
};
