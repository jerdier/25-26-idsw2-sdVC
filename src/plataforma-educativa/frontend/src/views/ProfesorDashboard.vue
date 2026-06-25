<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useAuth } from '../services/authService';
import academicService from '../services/academicService';
import attendanceService from '../services/attendanceService';
import dispensaService from '../services/dispensaService';

const { state } = useAuth();
const uid = state.user?.id ?? '';
const panel = ref<string | null>(null);
const toggle = (c: string) => { panel.value = panel.value === c ? null : c; };
const msg = ref(''); const err = ref('');
const ok = (m: string) => { msg.value = m; err.value = ''; };
const ko = (e: any) => { err.value = e.response?.data?.message ?? e.message; msg.value = ''; };

const asignaturas = ref<any[]>([]);
const sesiones = ref<any[]>([]);

const loadBase = async () => {
  if (!asignaturas.value.length) asignaturas.value = await academicService.getTeacherAsignaturas(uid);
  if (!sesiones.value.length) sesiones.value = await academicService.getTeacherSessions(uid);
};

watch(panel, async (v) => {
  if (v && v !== 'dispensas') { try { await loadBase(); } catch {} }
  if (v === 'dispensas') { try { dispensas.value = await dispensaService.getDispensasByProfesor(uid); } catch {} }
  msg.value = ''; err.value = '';
});

// Crear Sesión
const crearForm = reactive({ asignaturaId: '' });
const handleCrear = async () => {
  if (!crearForm.asignaturaId) { ko({ message: 'Selecciona una asignatura antes de crear la sesión.' }); return; }
  try {
    await academicService.crearSesionClase(crearForm.asignaturaId, new Date().toISOString());
    ok('Sesión creada.'); sesiones.value = await academicService.getTeacherSessions(uid);
    crearForm.asignaturaId = '';
  } catch (e: any) { ko(e); }
};

// Editar Sesión
const editSel = ref<any>(null);
const editForm = reactive({ aula: '', duracion: '' });
const selEditar = (s: any) => { editSel.value = s; editForm.aula = s.aula ?? ''; editForm.duracion = String(s.duracion ?? ''); };
const handleEditar = async () => {
  try {
    await academicService.editarSesionClase(editSel.value.id, { aula: editForm.aula, duracion: Number(editForm.duracion) });
    ok('Sesión actualizada.'); sesiones.value = await academicService.getTeacherSessions(uid); editSel.value = null;
  } catch (e: any) { ko(e); }
};

// Cerrar Sesión
const cerrarSel = ref<any>(null);
const handleCerrar = async () => {
  try {
    await academicService.cerrarSesionClase(cerrarSel.value.id);
    ok('Sesión cerrada.'); sesiones.value = await academicService.getTeacherSessions(uid); cerrarSel.value = null;
  } catch (e: any) { ko(e); }
};

// Registrar Asistencia
const asistSesion = ref<any>(null); const alumnos = ref<any[]>([]); const asistencia = ref<Record<string, boolean>>({});
const selAsistSesion = async (s: any) => {
  asistSesion.value = s; asistencia.value = {};
  try { alumnos.value = await academicService.getSessionAlumnos(s.id); alumnos.value.forEach((a: any) => asistencia.value[a.id] = true); }
  catch (e: any) { ko(e); }
};
const handleAsistencia = async () => {
  try {
    for (const a of alumnos.value) {
      await attendanceService.registrarTomaAsistencia({ sesionId: asistSesion.value.id, alumnoId: a.id, profesorId: uid, presente: asistencia.value[a.id] ?? false });
    }
    ok('Asistencia registrada.'); asistSesion.value = null; alumnos.value = [];
  } catch (e: any) { ko(e); }
};

// Exportar Historial
const exportSesion = ref<any>(null);
const handleExport = async () => {
  try {
    const blob = await attendanceService.exportarHistorialAsistencias(exportSesion.value.id, 'CSV');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `historial-${exportSesion.value.id}.csv`; a.click();
    ok('Descarga iniciada.');
  } catch (e: any) { ko(e); }
};

// Consultar Dispensas
const dispensas = ref<any[]>([]);
</script>

<template>
  <div class="page">
    <div class="hero card-base">
      <p class="role-label">Profesor</p>
      <h1>{{ state.user?.nombre }}</h1>
    </div>
    <p class="section-lbl">Casos de uso</p>
    <div class="grid">
      <button :class="['cu-btn', { active: panel === 'crear' }]" @click="toggle('crear')">Crear Sesión de Clase</button>
      <button :class="['cu-btn', { active: panel === 'editar' }]" @click="toggle('editar')">Editar Sesión de Clase</button>
      <button :class="['cu-btn', { active: panel === 'cerrar' }]" @click="toggle('cerrar')">Cerrar Sesión de Clase</button>
      <button :class="['cu-btn', { active: panel === 'asistencia' }]" @click="toggle('asistencia')">Registrar Toma de Asistencia</button>
      <button :class="['cu-btn', { active: panel === 'exportar' }]" @click="toggle('exportar')">Exportar Historial de Asistencias</button>
      <button :class="['cu-btn', { active: panel === 'dispensas' }]" @click="toggle('dispensas')">Consultar Solicitud de Dispensa</button>
    </div>

    <div v-if="msg" class="fb-ok">{{ msg }}</div>
    <div v-if="err" class="fb-ko">{{ err }}</div>

    <!-- Crear Sesión -->
    <div v-if="panel === 'crear'" class="panel card-base">
      <h2 class="panel-h">Crear Sesión de Clase</h2>
      <div class="frow"><label class="form-label">Asignatura</label>
        <select class="form-input" v-model="crearForm.asignaturaId">
          <option value="">— selecciona —</option>
          <option v-for="a in asignaturas" :key="a.id" :value="a.id">{{ a.nombre }}</option>
        </select>
      </div>
      <button class="btn-primary" @click="handleCrear">Crear</button>
    </div>

    <!-- Editar Sesión -->
    <div v-if="panel === 'editar'" class="panel card-base">
      <h2 class="panel-h">Editar Sesión de Clase</h2>
      <template v-if="!editSel">
        <div class="lista">
          <div v-for="s in sesiones" :key="s.id" class="list-item" @click="selEditar(s)">
            <span>{{ s.asignatura?.nombre }} — {{ new Date(s.fecha).toLocaleDateString() }}</span>
            <span class="tag">{{ s.estado }}</span>
          </div>
        </div>
        <p v-if="!sesiones.length" class="dim">Sin sesiones.</p>
      </template>
      <template v-else>
        <p class="dim">Editando sesión del {{ new Date(editSel.fecha).toLocaleString() }}</p>
        <div class="frow"><label class="form-label">Aula</label><input class="form-input" v-model="editForm.aula" /></div>
        <div class="frow"><label class="form-label">Duración (min)</label><input class="form-input" type="number" v-model="editForm.duracion" /></div>
        <div class="row-h"><button class="btn-primary" @click="handleEditar">Guardar</button><button class="btn-outline" @click="editSel = null">Cancelar</button></div>
      </template>
    </div>

    <!-- Cerrar Sesión -->
    <div v-if="panel === 'cerrar'" class="panel card-base">
      <h2 class="panel-h">Cerrar Sesión de Clase</h2>
      <template v-if="!cerrarSel">
        <div class="lista">
          <div v-for="s in sesiones.filter(x => x.estado !== 'CERRADA')" :key="s.id" class="list-item" @click="cerrarSel = s">
            <span>{{ s.asignatura?.nombre }} — {{ new Date(s.fecha).toLocaleDateString() }}</span>
          </div>
        </div>
        <p v-if="!sesiones.filter(x => x.estado !== 'CERRADA').length" class="dim">No hay sesiones abiertas.</p>
      </template>
      <template v-else>
        <p>¿Cerrar la sesión del <strong>{{ new Date(cerrarSel.fecha).toLocaleString() }}</strong>?</p>
        <div class="row-h"><button class="btn-primary" @click="handleCerrar">Confirmar cierre</button><button class="btn-outline" @click="cerrarSel = null">Cancelar</button></div>
      </template>
    </div>

    <!-- Registrar Asistencia -->
    <div v-if="panel === 'asistencia'" class="panel card-base">
      <h2 class="panel-h">Registrar Toma de Asistencia</h2>
      <template v-if="!asistSesion">
        <div class="lista">
          <div v-for="s in sesiones" :key="s.id" class="list-item" @click="selAsistSesion(s)">
            <span>{{ s.asignatura?.nombre }} — {{ new Date(s.fecha).toLocaleDateString() }}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <p class="dim">Sesión: {{ new Date(asistSesion.fecha).toLocaleString() }}</p>
        <div class="alumnos-list">
          <label v-for="a in alumnos" :key="a.id" class="alumno-row">
            <input type="checkbox" v-model="asistencia[a.id]" />
            <span>{{ a.nombre }} ({{ a.numeroRegistro }})</span>
          </label>
        </div>
        <p v-if="!alumnos.length" class="dim">Sin alumnos en esta sesión.</p>
        <div class="row-h"><button class="btn-primary" @click="handleAsistencia">Registrar</button><button class="btn-outline" @click="asistSesion = null">Cancelar</button></div>
      </template>
    </div>

    <!-- Exportar Historial -->
    <div v-if="panel === 'exportar'" class="panel card-base">
      <h2 class="panel-h">Exportar Historial de Asistencias</h2>
      <template v-if="!exportSesion">
        <div class="lista">
          <div v-for="s in sesiones" :key="s.id" class="list-item" @click="exportSesion = s">
            <span>{{ s.asignatura?.nombre }} — {{ new Date(s.fecha).toLocaleDateString() }}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <p class="dim">Sesión seleccionada: {{ new Date(exportSesion.fecha).toLocaleString() }}</p>
        <div class="row-h"><button class="btn-primary" @click="handleExport">Descargar CSV</button><button class="btn-outline" @click="exportSesion = null">Cancelar</button></div>
      </template>
    </div>

    <!-- Consultar Dispensas -->
    <div v-if="panel === 'dispensas'" class="panel card-base">
      <h2 class="panel-h">Consultar Solicitud de Dispensa</h2>
      <table v-if="dispensas.length" class="table-corp">
        <thead><tr><th>Alumno</th><th>Motivo</th><th>Estado</th><th>Fecha</th></tr></thead>
        <tbody>
          <tr v-for="d in dispensas" :key="d.id">
            <td>{{ d.alumno?.nombre }}</td><td>{{ d.motivo }}</td><td><span class="tag">{{ d.estado }}</span></td><td>{{ new Date(d.fechaSolicitud).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="dim">No hay solicitudes de dispensa para tus asignaturas.</p>
    </div>
  </div>
</template>

<style scoped>
.page { max-width: 860px; margin: 0 auto; padding: 2.5rem 2rem; display: flex; flex-direction: column; gap: 1.25rem; }
.hero { padding: 2rem 2.5rem; }
.role-label { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text-secondary); margin-bottom: 4px; }
h1 { font-size: 1.5rem; font-weight: 700; letter-spacing: -.02em; }
.section-lbl { font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--text-dim); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: .75rem; }
.cu-btn { background: var(--bg-card); border: 1px solid var(--border); color: var(--text-primary); padding: 1rem 1.4rem; font-size: .88rem; font-weight: 500; border-radius: var(--radius-md); cursor: pointer; text-align: left; transition: all .15s; box-shadow: var(--shadow-sm); font-family: inherit; }
.cu-btn:hover { background: var(--bg-main); border-color: var(--border-hover); box-shadow: var(--shadow-md); transform: translateY(-1px); }
.cu-btn.active { border-color: var(--text-primary); background: var(--bg-main); }
.panel { padding: 1.75rem 2rem; display: flex; flex-direction: column; gap: 1rem; }
.panel-h { font-size: 1rem; font-weight: 700; border-bottom: 1px solid var(--border); padding-bottom: .75rem; }
.frow { display: flex; flex-direction: column; gap: .35rem; }
.row-h { display: flex; gap: .75rem; align-items: center; }
.lista { display: flex; flex-direction: column; gap: .5rem; }
.list-item { display: flex; justify-content: space-between; align-items: center; padding: .75rem 1rem; border: 1px solid var(--border); border-radius: var(--radius-sm); cursor: pointer; transition: background .1s; }
.list-item:hover { background: var(--bg-main); }
.alumnos-list { display: flex; flex-direction: column; gap: .5rem; }
.alumno-row { display: flex; align-items: center; gap: .6rem; padding: .5rem 0; border-bottom: 1px solid var(--border); cursor: pointer; font-size: .9rem; }
.tag { font-size: .7rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--bg-input); color: var(--text-secondary); text-transform: uppercase; }
.dim { color: var(--text-secondary); font-size: .85rem; }
.fb-ok { padding: .75rem 1rem; background: var(--success-bg); color: var(--success); border-radius: var(--radius-sm); font-size: .85rem; font-weight: 600; }
.fb-ko { padding: .75rem 1rem; background: var(--error-bg); color: var(--error); border-radius: var(--radius-sm); font-size: .85rem; font-weight: 600; }
</style>
