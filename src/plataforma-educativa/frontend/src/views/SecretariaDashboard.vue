<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useAuth } from '../services/authService';
import secretariaService from '../services/secretariaService';
import dispensaService from '../services/dispensaService';
import attendanceService from '../services/attendanceService';

const { state } = useAuth();
const uid = state.user?.id ?? '';
const panel = ref<string | null>(null);
const toggle = (c: string) => { panel.value = panel.value === c ? null : c; };
const msg = ref(''); const err = ref('');
const ok = (m: string) => { msg.value = m; err.value = ''; };
const ko = (e: any) => { err.value = e.response?.data?.message ?? e.message; msg.value = ''; };

const alumnos = ref<any[]>([]);
const alumnoSel = ref<any>(null);
const matriculasSel = ref<any[]>([]);
const dispensasSel = ref<any[]>([]);

watch(panel, async (v) => {
  msg.value = ''; err.value = ''; alumnoSel.value = null; matriculasSel.value = []; dispensasSel.value = [];
  if (v === 'lista' || v === 'detalle-alumno' || v === 'detalle-matricula') {
    try { alumnos.value = await secretariaService.consultarListaAlumnos(); } catch {}
  }
});

const selAlumno = async (a: any) => {
  alumnoSel.value = a;
  if (panel.value === 'detalle-matricula') {
    try { matriculasSel.value = await secretariaService.consultarDetalleMatricula(a.id); } catch {}
  }
  if (panel.value === 'detalle-alumno') {
    try { dispensasSel.value = await dispensaService.consultarSolicitudDispensa({ alumnoId: a.id }); } catch {}
  }
};

const handleEliminarDispensa = async (id: string) => {
  try {
    await dispensaService.deleteDispensa(id);
    dispensasSel.value = dispensasSel.value.filter(d => d.id !== id);
    ok('Dispensa eliminada.');
  } catch (e: any) { ko(e); }
};

// Exportar Dispensas
const handleExportar = async () => {
  try {
    const blob = await dispensaService.exportarDispensas(undefined, 'CSV');
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'dispensas.csv'; a.click(); ok('Descarga iniciada.');
  } catch (e: any) { ko(e); }
};

// Importar Alumnos
const importAlumnosJson = ref('[\n  {"nombre":"Nuevo Alumno","email":"nuevo@cgu.es","dni":"12345678Z"}\n]');
const handleImportAlumnos = async () => {
  try {
    const alumnos = JSON.parse(importAlumnosJson.value);
    const res = await secretariaService.importarListasAlumnos({ alumnos });
    ok(`Importación: ${res.informe.creados} creados, ${res.informe.actualizados} actualizados, ${res.informe.errores} errores.`);
  } catch (e: any) { ko(e); }
};

// Importar Matrículas
const importMatJson = ref('');
const gradoIdImport = ref('grado1-id');
const handleImportMat = async () => {
  try {
    const matriculas = JSON.parse(importMatJson.value || '[]');
    const res = await secretariaService.importMatriculas({ matriculas, secretariaId: uid, gradoId: gradoIdImport.value });
    ok(`Importación: ${res.informe.creadas} creadas, ${res.informe.actualizadas} actualizadas, ${res.informe.errores} errores.`);
  } catch (e: any) { ko(e); }
};

// Crear Dispensa
const crearDispForm = reactive({ alumnoId: '', motivo: '' });
const handleCrearDisp = async () => {
  try {
    await dispensaService.crearSolicitudDispensa({ alumnoId: crearDispForm.alumnoId, motivo: crearDispForm.motivo, secretariaId: uid, sesionesIds: [], asignaturasIds: [] });
    ok('Solicitud de dispensa creada.'); crearDispForm.alumnoId = ''; crearDispForm.motivo = '';
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
    <p class="section-lbl">Casos de uso</p>
    <div class="grid">
      <button :class="['cu-btn', { active: panel === 'lista' }]" @click="toggle('lista')">Consultar Lista de Alumnos</button>
      <button :class="['cu-btn', { active: panel === 'detalle-alumno' }]" @click="toggle('detalle-alumno')">Consultar Detalle de Alumno</button>
      <button :class="['cu-btn', { active: panel === 'detalle-matricula' }]" @click="toggle('detalle-matricula')">Consultar Detalle de Matrícula</button>
      <button :class="['cu-btn', { active: panel === 'exportar' }]" @click="toggle('exportar')">Exportar Dispensas</button>
      <button :class="['cu-btn', { active: panel === 'import-alumnos' }]" @click="toggle('import-alumnos')">Importar Listas de Alumnos</button>
      <button :class="['cu-btn', { active: panel === 'import-matriculas' }]" @click="toggle('import-matriculas')">Importar Matrículas</button>
      <button :class="['cu-btn', { active: panel === 'crear-dispensa' }]" @click="toggle('crear-dispensa')">Crear Solicitud de Dispensa</button>
    </div>

    <div v-if="msg" class="fb-ok">{{ msg }}</div>
    <div v-if="err" class="fb-ko">{{ err }}</div>

    <!-- Lista de Alumnos -->
    <div v-if="panel === 'lista'" class="panel card-base">
      <h2 class="panel-h">Consultar Lista de Alumnos</h2>
      <table v-if="alumnos.length" class="table-corp">
        <thead><tr><th>Nombre</th><th>Nº Registro</th><th>Email</th></tr></thead>
        <tbody>
          <tr v-for="a in alumnos" :key="a.id"><td>{{ a.nombre }}</td><td>{{ a.numeroRegistro }}</td><td>{{ a.email }}</td></tr>
        </tbody>
      </table>
      <p v-else class="dim">Sin alumnos registrados.</p>
    </div>

    <!-- Detalle Alumno -->
    <div v-if="panel === 'detalle-alumno'" class="panel card-base">
      <h2 class="panel-h">Consultar Detalle de Alumno</h2>
      <template v-if="!alumnoSel">
        <div class="lista">
          <div v-for="a in alumnos" :key="a.id" class="list-item" @click="selAlumno(a)">
            <span>{{ a.nombre }}</span><span class="dim">{{ a.numeroRegistro }}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <button class="btn-outline" style="align-self:start;font-size:.8rem" @click="alumnoSel = null">← Volver</button>
        <div class="info-grid">
          <div class="info-block"><p class="form-label">Nombre</p><p>{{ alumnoSel.nombre }}</p></div>
          <div class="info-block"><p class="form-label">Email</p><p>{{ alumnoSel.email }}</p></div>
          <div class="info-block"><p class="form-label">Nº Registro</p><p>{{ alumnoSel.numeroRegistro }}</p></div>
          <div class="info-block"><p class="form-label">DNI</p><p>{{ alumnoSel.dni ?? '—' }}</p></div>
        </div>
        <div v-if="alumnoSel.matriculas?.length">
          <p class="form-label">Matrículas</p>
          <div v-for="m in alumnoSel.matriculas" :key="m.id" class="info-block">{{ m.grado?.nombre ?? m.gradoId }}</div>
        </div>
        <div>
          <p class="form-label" style="margin-bottom:.5rem">Dispensas</p>
          <div v-if="dispensasSel.length" class="lista">
            <div v-for="d in dispensasSel" :key="d.id" class="dispensa-row">
              <div style="flex:1;min-width:0">
                <p style="font-size:.85rem;margin-bottom:2px">{{ d.motivo }}</p>
                <span :class="estadoClass(d.estado)">{{ d.estado }}</span>
              </div>
              <button class="btn-del" @click.stop="handleEliminarDispensa(d.id)">Eliminar</button>
            </div>
          </div>
          <p v-else class="dim">Sin dispensas.</p>
        </div>
      </template>
    </div>

    <!-- Detalle Matrícula -->
    <div v-if="panel === 'detalle-matricula'" class="panel card-base">
      <h2 class="panel-h">Consultar Detalle de Matrícula</h2>
      <template v-if="!alumnoSel">
        <div class="lista">
          <div v-for="a in alumnos" :key="a.id" class="list-item" @click="selAlumno(a)">
            <span>{{ a.nombre }}</span><span class="dim">{{ a.numeroRegistro }}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <button class="btn-outline" style="align-self:start;font-size:.8rem" @click="alumnoSel = null">← Volver</button>
        <p class="form-label">Matrículas de {{ alumnoSel.nombre }}</p>
        <table v-if="matriculasSel.length" class="table-corp">
          <thead><tr><th>Grado</th><th>Secretaría</th></tr></thead>
          <tbody>
            <tr v-for="m in matriculasSel" :key="m.id">
              <td>{{ m.grado?.nombre ?? m.gradoId }}</td>
              <td>{{ m.grado?.secretaria?.nombre ?? '—' }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="dim">Sin matrículas.</p>
      </template>
    </div>

    <!-- Exportar Dispensas -->
    <div v-if="panel === 'exportar'" class="panel card-base">
      <h2 class="panel-h">Exportar Dispensas</h2>
      <p class="dim">Descarga todas las solicitudes de dispensa en formato CSV.</p>
      <button class="btn-primary" style="align-self:start" @click="handleExportar">Descargar CSV</button>
    </div>

    <!-- Importar Alumnos -->
    <div v-if="panel === 'import-alumnos'" class="panel card-base">
      <h2 class="panel-h">Importar Listas de Alumnos</h2>
      <div class="frow">
        <label class="form-label">JSON de alumnos <span class="dim">[{nombre, email, dni}]</span></label>
        <textarea class="form-input" v-model="importAlumnosJson" rows="6" style="font-family:monospace;font-size:.82rem" />
      </div>
      <button class="btn-primary" style="align-self:start" @click="handleImportAlumnos">Importar</button>
    </div>

    <!-- Importar Matrículas -->
    <div v-if="panel === 'import-matriculas'" class="panel card-base">
      <h2 class="panel-h">Importar Matrículas</h2>
      <div class="frow"><label class="form-label">ID del Grado</label><input class="form-input" v-model="gradoIdImport" /></div>
      <div class="frow">
        <label class="form-label">JSON de matrículas <span class="dim">[{dni, asignaturaId}]</span></label>
        <textarea class="form-input" v-model="importMatJson" rows="5" placeholder='[{"dni":"00000001A","asignaturaId":"asignatura1-id"}]' style="font-family:monospace;font-size:.82rem" />
      </div>
      <button class="btn-primary" style="align-self:start" @click="handleImportMat">Importar</button>
    </div>

    <!-- Crear Dispensa -->
    <div v-if="panel === 'crear-dispensa'" class="panel card-base">
      <h2 class="panel-h">Crear Solicitud de Dispensa</h2>
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
  </div>
</template>

<style scoped>
.page { max-width: 900px; margin: 0 auto; padding: 2.5rem 2rem; display: flex; flex-direction: column; gap: 1.25rem; }
.hero { padding: 2rem 2.5rem; }
.role-label { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text-secondary); margin-bottom: 4px; }
h1 { font-size: 1.5rem; font-weight: 700; letter-spacing: -.02em; }
.section-lbl { font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--text-dim); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: .75rem; }
.cu-btn { background: var(--bg-card); border: 1px solid var(--border); color: var(--text-primary); padding: 1rem 1.4rem; font-size: .88rem; font-weight: 500; border-radius: var(--radius-md); cursor: pointer; text-align: left; transition: all .15s; box-shadow: var(--shadow-sm); font-family: inherit; }
.cu-btn:hover { background: var(--bg-main); border-color: var(--border-hover); box-shadow: var(--shadow-md); transform: translateY(-1px); }
.cu-btn.active { border-color: var(--text-primary); background: var(--bg-main); }
.panel { padding: 1.75rem 2rem; display: flex; flex-direction: column; gap: 1rem; }
.panel-h { font-size: 1rem; font-weight: 700; border-bottom: 1px solid var(--border); padding-bottom: .75rem; }
.frow { display: flex; flex-direction: column; gap: .35rem; }
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
textarea.form-input { resize: vertical; }
.dispensa-row { display: flex; align-items: center; gap: .75rem; padding: .6rem .75rem; border: 1px solid var(--border); border-radius: var(--radius-sm); }
.btn-del { background: var(--error-bg); border: 1px solid var(--error); color: var(--error); padding: .35rem .7rem; border-radius: var(--radius-sm); cursor: pointer; font-size: .78rem; font-weight: 600; font-family: inherit; white-space: nowrap; flex-shrink: 0; }
.btn-del:hover { background: var(--error); color: #fff; }
</style>
