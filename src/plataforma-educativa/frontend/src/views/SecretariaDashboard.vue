<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useAuth } from '../services/authService';
import secretariaService from '../services/secretariaService';
import dispensaService from '../services/dispensaService';

const { state } = useAuth();
const uid = state.user?.id ?? '';
const panel = ref<string | null>(null);

const msg = ref(''); const err = ref('');
const ok = (m: string) => { msg.value = m; err.value = ''; };
const ko = (e: any) => { err.value = e.response?.data?.message ?? e.message; msg.value = ''; };

const alumnos = ref<any[]>([]);
const dispensas = ref<any[]>([]);

watch(panel, async (v) => {
  msg.value = ''; err.value = '';
  if (!v) return;
  if (['abrir-alumnos', 'consultar-alumno', 'consultar-matricula', 'crear-dispensa'].includes(v)) {
    try { alumnos.value = await secretariaService.consultarListaAlumnos(); } catch (e: any) { ko(e); }
  }
  if (['abrir-dispensas', 'consultar-dispensa', 'editar-dispensa'].includes(v)) {
    try { dispensas.value = await dispensaService.consultarSolicitudDispensa({}); } catch (e: any) { ko(e); }
  }
});

// CU: abrirAlumnos — con filtro
const filtroAlumnos = ref('');
const handleFiltrarAlumnos = async () => {
  try { alumnos.value = await secretariaService.consultarListaAlumnos(filtroAlumnos.value || undefined); }
  catch (e: any) { ko(e); }
};

// CU: consultarAlumno
const alumnoSel = ref<any>(null);
const alumnoDetalle = ref<any>(null);
const handleConsultarAlumno = async (a: any) => {
  alumnoSel.value = a;
  try { alumnoDetalle.value = await secretariaService.consultarAlumno(a.id); }
  catch { alumnoDetalle.value = a; }
};

// CU: abrirMatriculas — con filtro
const filtroMat = ref('');
const matriculas = ref<any[]>([]);
const handleAbrirMatriculas = async () => {
  try { matriculas.value = await secretariaService.abrirMatriculas(filtroMat.value || undefined); }
  catch (e: any) { ko(e); }
};

// CU: consultarDetalleMatricula
const alumnoMatSel = ref<any>(null);
const detalleMatriculas = ref<any[]>([]);
const handleConsultarMatricula = async (a: any) => {
  alumnoMatSel.value = a;
  try { detalleMatriculas.value = await secretariaService.consultarDetalleMatricula(a.id); }
  catch (e: any) { ko(e); }
};

// CU: cerrarCicloAcademico
const confirmarCierre = ref(false);
const handleCerrarCiclo = async () => {
  try {
    const res = await secretariaService.cerrarCicloAcademico();
    ok(`Ciclo académico cerrado. Matrículas archivadas: ${res.matriculasArchivadas ?? 0}.`);
    confirmarCierre.value = false;
  } catch (e: any) { ko(e); }
};

// CU: importarListasAlumnos
const importAlumnosJson = ref('[\n  {"nombre":"Nuevo Alumno","email":"nuevo@cgu.es","dni":"12345678Z"}\n]');
const handleImportAlumnos = async () => {
  try {
    const data = JSON.parse(importAlumnosJson.value);
    const res = await secretariaService.importarListasAlumnos({ alumnos: data });
    ok(`Importación: ${res.informe?.creados ?? 0} creados, ${res.informe?.actualizados ?? 0} actualizados, ${res.informe?.errores ?? 0} errores.`);
  } catch (e: any) { ko(e); }
};

// CU: importarMatriculas
const importMatJson = ref('');
const gradoIdImport = ref('');
const handleImportMatriculas = async () => {
  try {
    const data = JSON.parse(importMatJson.value || '[]');
    const res = await secretariaService.importarMatriculas({ matriculas: data, secretariaId: uid, gradoId: gradoIdImport.value });
    ok(`Importación: ${res.informe?.creadas ?? 0} creadas, ${res.informe?.actualizadas ?? 0} actualizadas, ${res.informe?.errores ?? 0} errores.`);
  } catch (e: any) { ko(e); }
};

// CU: crearSolicitudDispensa
const crearDispForm = reactive({ alumnoId: '', motivo: '' });
const handleCrearDisp = async () => {
  try {
    await dispensaService.crearSolicitudDispensa({ alumnoId: crearDispForm.alumnoId, motivo: crearDispForm.motivo, secretariaId: uid, sesionesIds: [], asignaturasIds: [] });
    ok('Solicitud de dispensa creada.'); crearDispForm.alumnoId = ''; crearDispForm.motivo = '';
  } catch (e: any) { ko(e); }
};

// CU: consultarSolicitudDispensa
const dispensaSel = ref<any>(null);
const handleConsultarDisp = async (d: any) => {
  try { dispensaSel.value = await dispensaService.getDispensa(d.id); }
  catch { dispensaSel.value = d; }
};

// CU: editarSolicitudDispensa
const editDispSel = ref<any>(null);
const editDispForm = reactive({ motivo: '' });
const selEditarDisp = (d: any) => { editDispSel.value = d; editDispForm.motivo = d.motivo; };
const handleEditarDisp = async () => {
  try {
    await dispensaService.editarSolicitudDispensa(editDispSel.value.id, { motivo: editDispForm.motivo });
    ok('Dispensa actualizada.'); editDispSel.value = null;
    dispensas.value = await dispensaService.consultarSolicitudDispensa({}).catch(() => []);
  } catch (e: any) { ko(e); }
};

const estadoClass = (e: string) => e === 'APROBADA' ? 'tag-ok' : e === 'RECHAZADA' ? 'tag-ko' : 'tag';
</script>

<template>
  <div class="page">
    <div class="hero card-base">
      <p class="role-label">Secretaría Académica</p>
      <h1>{{ state.user?.nombre }}</h1>
    </div>

    <!-- SISTEMA_DISPONIBLE (Main Menu) -->
    <template v-if="!panel">
      <p class="section-lbl">SISTEMA_DISPONIBLE</p>
      <div class="grid">
        <button class="cu-btn" @click="panel = 'abrir-alumnos'">abrirAlumnos</button>
        <button class="cu-btn" @click="panel = 'abrir-matriculas'">abrirMatriculas</button>
        <button class="cu-btn" @click="panel = 'abrir-dispensas'">abrirDispensas</button>
      </div>
    </template>

    <div v-if="msg" class="fb-ok">{{ msg }}</div>
    <div v-if="err" class="fb-ko">{{ err }}</div>

    <!-- CU: abrirAlumnos -->
    <div v-if="panel === 'abrir-alumnos'" class="panel card-base">
      <div class="detail-header">
        <button class="back-btn" @click="panel = null">← completarGestionAlumnos</button>
        <button class="btn-primary" @click="panel = 'import-alumnos'">importarAlumnos</button>
      </div>
      <h2 class="panel-h">ALUMNOS_ABIERTO</h2>
      <div class="row-h">
        <input class="form-input" v-model="filtroAlumnos" placeholder="Filtrar por nombre o email…" @keyup.enter="handleFiltrarAlumnos" />
        <button class="btn-primary" @click="handleFiltrarAlumnos">Filtrar</button>
      </div>
      <table v-if="alumnos.length" class="table-corp">
        <thead><tr><th>Nombre</th><th>Nº Registro</th><th>Email</th><th>Acción</th></tr></thead>
        <tbody>
          <tr v-for="a in alumnos" :key="a.id">
            <td>{{ a.nombre }}</td><td>{{ a.numeroRegistro }}</td><td>{{ a.email }}</td>
            <td><button class="btn-outline btn-sm" @click="handleConsultarAlumno(a); panel = 'consultar-alumno'">consultarAlumno</button></td>
          </tr>
        </tbody>
      </table>
      <p v-else class="dim">Sin alumnos registrados.</p>
    </div>

    <!-- CU: importarListasAlumnos -->
    <div v-if="panel === 'import-alumnos'" class="panel card-base">
      <div class="detail-header"><button class="back-btn" @click="panel = 'abrir-alumnos'">← abrirAlumnos</button></div>
      <h2 class="panel-h">importarAlumnos</h2>
      <div class="frow">
        <label class="form-label">JSON de alumnos <span class="dim">[{nombre, email, dni}]</span></label>
        <textarea class="form-input mono" v-model="importAlumnosJson" rows="6" />
      </div>
      <button class="btn-primary" style="align-self:start" @click="handleImportAlumnos">Importar</button>
    </div>

    <!-- CU: consultarAlumno -->
    <div v-if="panel === 'consultar-alumno'" class="panel card-base">
      <div class="detail-header"><button class="back-btn" @click="panel = 'abrir-alumnos'">← abrirAlumnos</button></div>
      <h2 class="panel-h">ALUMNO_DETALLE_ABIERTO</h2>
      <div class="info-grid">
        <div class="info-block"><p class="form-label">Nombre</p><p>{{ alumnoDetalle?.nombre ?? alumnoSel?.nombre }}</p></div>
        <div class="info-block"><p class="form-label">Email</p><p>{{ alumnoDetalle?.email ?? alumnoSel?.email }}</p></div>
        <div class="info-block"><p class="form-label">Nº Registro</p><p>{{ alumnoDetalle?.numeroRegistro ?? alumnoSel?.numeroRegistro }}</p></div>
        <div class="info-block"><p class="form-label">DNI</p><p>{{ alumnoDetalle?.dni ?? '—' }}</p></div>
      </div>
    </div>

    <!-- CU: abrirMatriculas -->
    <div v-if="panel === 'abrir-matriculas'" class="panel card-base">
      <div class="detail-header">
        <button class="back-btn" @click="panel = null">← completarGestionMatriculas</button>
        <div class="row-h">
          <button class="btn-outline" @click="panel = 'cerrar-ciclo'">cerrarCicloAcademico</button>
          <button class="btn-primary" @click="panel = 'import-matriculas'">importarMatriculas</button>
        </div>
      </div>
      <h2 class="panel-h">MATRICULAS_ABIERTO</h2>
      <div class="row-h">
        <input class="form-input" v-model="filtroMat" placeholder="Filtrar…" @keyup.enter="handleAbrirMatriculas" />
        <button class="btn-primary" @click="handleAbrirMatriculas">Buscar</button>
      </div>
      <table v-if="matriculas.length" class="table-corp">
        <thead><tr><th>Alumno</th><th>Grado</th><th>Acción</th></tr></thead>
        <tbody>
          <tr v-for="m in matriculas" :key="m.id">
            <td>{{ m.alumno?.nombre ?? '—' }}</td>
            <td>{{ m.grado?.nombre ?? m.gradoId ?? '—' }}</td>
            <td><button class="btn-outline btn-sm" @click="handleConsultarMatricula(m.alumno); panel = 'consultar-matricula'">consultarDetalleMatricula</button></td>
          </tr>
        </tbody>
      </table>
      <p v-else class="dim">Pulsa Buscar para cargar matrículas.</p>
    </div>

    <!-- CU: importarMatriculas -->
    <div v-if="panel === 'import-matriculas'" class="panel card-base">
      <div class="detail-header"><button class="back-btn" @click="panel = 'abrir-matriculas'">← abrirMatriculas</button></div>
      <h2 class="panel-h">importarMatriculas</h2>
      <div class="frow"><label class="form-label">ID del Grado</label><input class="form-input" v-model="gradoIdImport" placeholder="ID del grado" /></div>
      <div class="frow">
        <label class="form-label">JSON de matrículas <span class="dim">[{dni, asignaturaId}]</span></label>
        <textarea class="form-input mono" v-model="importMatJson" rows="5" placeholder='[{"dni":"00000001A","asignaturaId":"asignatura1-id"}]' />
      </div>
      <button class="btn-primary" style="align-self:start" @click="handleImportMatriculas">Importar</button>
    </div>

    <!-- CU: consultarDetalleMatricula -->
    <div v-if="panel === 'consultar-matricula'" class="panel card-base">
      <div class="detail-header"><button class="back-btn" @click="panel = 'abrir-matriculas'">← abrirMatriculas</button></div>
      <h2 class="panel-h">MATRICULA_DETALLE_ABIERTA</h2>
      <p class="form-label">Matrículas de {{ alumnoMatSel?.nombre }}</p>
      <table v-if="detalleMatriculas.length" class="table-corp">
        <thead><tr><th>Grado</th><th>Secretaría</th></tr></thead>
        <tbody>
          <tr v-for="m in detalleMatriculas" :key="m.id">
            <td>{{ m.grado?.nombre ?? m.gradoId }}</td>
            <td>{{ m.grado?.secretaria?.nombre ?? '—' }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="dim">Sin matrículas.</p>
    </div>

    <!-- CU: cerrarCicloAcademico -->
    <div v-if="panel === 'cerrar-ciclo'" class="panel card-base">
      <div class="detail-header"><button class="back-btn" @click="panel = 'abrir-matriculas'">← abrirMatriculas</button></div>
      <h2 class="panel-h">cerrarCicloAcademico</h2>
      <p class="dim">Esta acción archivará todas las matrículas del ciclo actual.</p>
      <template v-if="!confirmarCierre">
        <button class="btn-primary" style="align-self:start" @click="confirmarCierre = true">Iniciar cierre</button>
      </template>
      <template v-else>
        <p><strong>¿Confirmas el cierre del ciclo académico?</strong> Esta acción no se puede deshacer.</p>
        <div class="row-h">
          <button class="btn-del" @click="handleCerrarCiclo">Confirmar cierre</button>
          <button class="btn-outline" @click="confirmarCierre = false">Cancelar</button>
        </div>
      </template>
    </div>

    <!-- CU: abrirDispensas -->
    <div v-if="panel === 'abrir-dispensas'" class="panel card-base">
      <div class="detail-header">
        <button class="back-btn" @click="panel = null">← completarGestionDispensas</button>
        <button class="btn-primary" @click="panel = 'crear-dispensa'">crearSolicitudDispensa</button>
      </div>
      <h2 class="panel-h">DISPENSAS_ABIERTO</h2>
      <table v-if="dispensas.length" class="table-corp">
        <thead><tr><th>Alumno</th><th>Motivo</th><th>Estado</th><th>Fecha</th><th>Acción</th></tr></thead>
        <tbody>
          <tr v-for="d in dispensas" :key="d.id">
            <td>{{ d.alumno?.nombre ?? '—' }}</td>
            <td>{{ d.motivo.slice(0, 50) }}{{ d.motivo.length > 50 ? '…' : '' }}</td>
            <td><span :class="estadoClass(d.estado)">{{ d.estado }}</span></td>
            <td>{{ new Date(d.fechaSolicitud).toLocaleDateString() }}</td>
            <td>
              <div class="row-h">
                <button class="btn-outline btn-sm" @click="handleConsultarDisp(d); panel = 'consultar-dispensa'">consultarSolicitudDispensa</button>
                <button v-if="d.estado === 'PENDIENTE'" class="btn-primary btn-sm" @click="selEditarDisp(d); panel = 'editar-dispensa'">editarSolicitudDispensa</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="dim">No hay solicitudes de dispensa.</p>
    </div>

    <!-- CU: crearSolicitudDispensa -->
    <div v-if="panel === 'crear-dispensa'" class="panel card-base">
      <div class="detail-header"><button class="back-btn" @click="panel = 'abrir-dispensas'">← abrirDispensas</button></div>
      <h2 class="panel-h">crearSolicitudDispensa</h2>
      <div class="frow">
        <label class="form-label">Alumno</label>
        <select class="form-input" v-model="crearDispForm.alumnoId">
          <option value="">— selecciona alumno —</option>
          <option v-for="a in alumnos" :key="a.id" :value="a.id">{{ a.nombre }} ({{ a.numeroRegistro }})</option>
        </select>
      </div>
      <div class="frow"><label class="form-label">Motivo</label><textarea class="form-input" v-model="crearDispForm.motivo" rows="3" /></div>
      <button class="btn-primary" style="align-self:start" @click="handleCrearDisp">Crear</button>
    </div>

    <!-- CU: consultarSolicitudDispensa -->
    <div v-if="panel === 'consultar-dispensa'" class="panel card-base">
      <div class="detail-header"><button class="back-btn" @click="panel = 'abrir-dispensas'">← abrirDispensas</button></div>
      <h2 class="panel-h">SOLICITUD_DISPENSA_ABIERTA (Consultar)</h2>
      <div class="info-grid">
        <div class="info-block"><p class="form-label">Estado</p><span :class="estadoClass(dispensaSel?.estado)">{{ dispensaSel?.estado }}</span></div>
        <div class="info-block"><p class="form-label">Fecha</p><p>{{ dispensaSel ? new Date(dispensaSel.fechaSolicitud).toLocaleDateString() : '' }}</p></div>
        <div class="info-block"><p class="form-label">Alumno</p><p>{{ dispensaSel?.alumno?.nombre ?? '—' }}</p></div>
      </div>
      <div class="info-block"><p class="form-label">Motivo</p><p>{{ dispensaSel?.motivo }}</p></div>
      <div class="info-block" v-if="dispensaSel?.observaciones"><p class="form-label">Observaciones</p><p>{{ dispensaSel.observaciones }}</p></div>
    </div>

    <!-- CU: editarSolicitudDispensa -->
    <div v-if="panel === 'editar-dispensa'" class="panel card-base">
      <div class="detail-header"><button class="back-btn" @click="panel = 'abrir-dispensas'">← abrirDispensas</button></div>
      <h2 class="panel-h">SOLICITUD_DISPENSA_ABIERTA (Editar)</h2>
      <div class="info-block"><p class="form-label">Alumno</p><p>{{ editDispSel?.alumno?.nombre ?? '—' }}</p></div>
      <div class="frow"><label class="form-label">Motivo</label><textarea class="form-input" v-model="editDispForm.motivo" rows="3" /></div>
      <div class="row-h"><button class="btn-primary" @click="handleEditarDisp">Guardar</button></div>
    </div>
  </div>
</template>

<style scoped>
.page { max-width: 960px; margin: 0 auto; padding: 2.5rem 2rem; display: flex; flex-direction: column; gap: 1.25rem; }
.hero { padding: 2rem 2.5rem; }
.role-label { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text-secondary); margin-bottom: 4px; }
h1 { font-size: 1.5rem; font-weight: 700; letter-spacing: -.02em; }
.section-lbl { font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--text-dim); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: .75rem; }
.cu-btn { background: var(--bg-card); border: 1px solid var(--border); color: var(--text-primary); padding: 1rem 1.4rem; font-size: .88rem; font-weight: 500; border-radius: var(--radius-md); cursor: pointer; text-align: left; transition: all .15s; box-shadow: var(--shadow-sm); font-family: inherit; }
.cu-btn:hover { background: var(--bg-main); border-color: var(--border-hover); box-shadow: var(--shadow-md); transform: translateY(-1px); }
.cu-btn.active { border-color: var(--text-primary); background: var(--bg-main); }
.panel { padding: 1.75rem 2rem; display: flex; flex-direction: column; gap: 1rem; }
.detail-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
.back-btn { background: none; border: none; color: var(--text-secondary); font-size: .85rem; cursor: pointer; font-family: inherit; padding: 0; }
.back-btn:hover { color: var(--text-primary); }
.panel-h { font-size: 1rem; font-weight: 700; border-bottom: 1px solid var(--border); padding-bottom: .75rem; }
.frow { display: flex; flex-direction: column; gap: .35rem; }
.row-h { display: flex; gap: .75rem; align-items: center; }
.lista { display: flex; flex-direction: column; gap: .5rem; }
.list-item { display: flex; justify-content: space-between; align-items: center; padding: .75rem 1rem; border: 1px solid var(--border); border-radius: var(--radius-sm); cursor: pointer; transition: background .1s; }
.list-item:hover { background: var(--bg-main); }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; }
.info-block { background: var(--bg-main); padding: .75rem 1rem; border-radius: var(--radius-sm); }
.info-block .form-label { margin-bottom: 4px; }
.tag { font-size: .68rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--bg-input); color: var(--text-secondary); text-transform: uppercase; }
.tag-ok { font-size: .68rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--success-bg); color: var(--success); text-transform: uppercase; }
.tag-ko { font-size: .68rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--error-bg); color: var(--error); text-transform: uppercase; }
.dim { color: var(--text-secondary); font-size: .85rem; }
.fb-ok { padding: .75rem 1rem; background: var(--success-bg); color: var(--success); border-radius: var(--radius-sm); font-size: .85rem; font-weight: 600; }
.fb-ko { padding: .75rem 1rem; background: var(--error-bg); color: var(--error); border-radius: var(--radius-sm); font-size: .85rem; font-weight: 600; }
textarea.form-input { resize: vertical; min-height: 70px; }
.mono { font-family: monospace; font-size: .82rem; }
.btn-del { background: var(--error-bg); border: 1px solid var(--error); color: var(--error); padding: .5rem 1rem; border-radius: var(--radius-sm); cursor: pointer; font-size: .82rem; font-weight: 600; font-family: inherit; }
.btn-del:hover { background: var(--error); color: #fff; }
</style>
