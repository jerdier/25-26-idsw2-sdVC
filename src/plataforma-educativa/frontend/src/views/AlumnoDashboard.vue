<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useAuth } from '../services/authService';
import dispensaService from '../services/dispensaService';
import secretariaService from '../services/secretariaService';
import academicService from '../services/academicService';

const { state } = useAuth();
const uid = state.user?.id ?? '';
const panel = ref<string | null>(null);
const toggle = (c: string) => { panel.value = panel.value === c ? null : c; };
const msg = ref(''); const err = ref('');
const ok = (m: string) => { msg.value = m; err.value = ''; };
const ko = (e: any) => { err.value = e.response?.data?.message ?? e.message; msg.value = ''; };

const dispensas = ref<any[]>([]);
const asignaturas = ref<any[]>([]);
let secretariaId = '';

const loadData = async () => {
  try {
    const matriculas = await secretariaService.consultarDetalleMatricula(uid);
    if (matriculas.length) secretariaId = matriculas[0].secretariaId;
    const sesiones = await academicService.getSessionsForAlumno(uid);
    const asigMap: Record<string, any> = {};
    sesiones.forEach((s: any) => { if (s.asignatura) asigMap[s.asignatura.id] = s.asignatura; });
    asignaturas.value = Object.values(asigMap);
  } catch {}
};

watch(panel, async (v) => {
  msg.value = ''; err.value = '';
  if (v) {
    await loadData();
    dispensas.value = await dispensaService.consultarSolicitudDispensa({ alumnoId: uid }).catch(() => []);
  }
});

// Crear Dispensa
const crearForm = reactive({ motivo: '', asignaturasIds: [] as string[] });
const handleCrear = async () => {
  try {
    await dispensaService.crearSolicitudDispensa({
      alumnoId: uid, motivo: crearForm.motivo, secretariaId,
      sesionesIds: [], asignaturasIds: crearForm.asignaturasIds
    });
    ok('Solicitud de dispensa creada.'); crearForm.motivo = ''; crearForm.asignaturasIds = [];
    dispensas.value = await dispensaService.consultarSolicitudDispensa({ alumnoId: uid }).catch(() => []);
  } catch (e: any) { ko(e); }
};

// Editar Dispensa
const editSel = ref<any>(null);
const editForm = reactive({ motivo: '' });
const selEditar = (d: any) => { editSel.value = d; editForm.motivo = d.motivo; };
const handleEditar = async () => {
  try {
    await dispensaService.editarSolicitudDispensa(editSel.value.id, { motivo: editForm.motivo });
    ok('Dispensa actualizada.'); editSel.value = null;
    dispensas.value = await dispensaService.consultarSolicitudDispensa({ alumnoId: uid }).catch(() => []);
  } catch (e: any) { ko(e); }
};

const estadoClass = (e: string) => e === 'APROBADA' ? 'tag-ok' : e === 'RECHAZADA' ? 'tag-ko' : 'tag';
</script>

<template>
  <div class="page">
    <div class="hero card-base">
      <p class="role-label">Alumno</p>
      <h1>{{ state.user?.nombre }}</h1>
    </div>
    <p class="section-lbl">Casos de uso</p>
    <div class="grid">
      <button :class="['cu-btn', { active: panel === 'crear' }]" @click="toggle('crear')">Crear Solicitud de Dispensa</button>
      <button :class="['cu-btn', { active: panel === 'editar' }]" @click="toggle('editar')">Editar Solicitud de Dispensa</button>
    </div>

    <div v-if="msg" class="fb-ok">{{ msg }}</div>
    <div v-if="err" class="fb-ko">{{ err }}</div>

    <!-- Crear Dispensa -->
    <div v-if="panel === 'crear'" class="panel card-base">
      <h2 class="panel-h">Crear Solicitud de Dispensa</h2>
      <div class="frow"><label class="form-label">Motivo</label><textarea class="form-input" v-model="crearForm.motivo" rows="3" placeholder="Describe el motivo de la dispensa..." /></div>
      <div v-if="asignaturas.length" class="frow">
        <label class="form-label">Asignaturas afectadas</label>
        <div class="check-list">
          <label v-for="a in asignaturas" :key="a.id" class="check-row">
            <input type="checkbox" :value="a.id" v-model="crearForm.asignaturasIds" />
            <span>{{ a.nombre }}</span>
          </label>
        </div>
      </div>
      <button class="btn-primary" @click="handleCrear">Enviar solicitud</button>
    </div>

    <!-- Editar Dispensa -->
    <div v-if="panel === 'editar'" class="panel card-base">
      <h2 class="panel-h">Editar Solicitud de Dispensa</h2>
      <template v-if="!editSel">
        <div class="lista">
          <div v-for="d in dispensas.filter(x => x.estado === 'PENDIENTE')" :key="d.id" class="list-item" @click="selEditar(d)">
            <span>{{ d.motivo.slice(0, 50) }}{{ d.motivo.length > 50 ? '…' : '' }}</span>
            <span :class="estadoClass(d.estado)">{{ d.estado }}</span>
          </div>
        </div>
        <p v-if="!dispensas.filter(x => x.estado === 'PENDIENTE').length" class="dim">No hay solicitudes pendientes de editar.</p>
      </template>
      <template v-else>
        <div class="frow"><label class="form-label">Motivo</label><textarea class="form-input" v-model="editForm.motivo" rows="3" /></div>
        <div class="row-h"><button class="btn-primary" @click="handleEditar">Guardar</button><button class="btn-outline" @click="editSel = null">Cancelar</button></div>
      </template>
      <div v-if="dispensas.length" class="historial">
        <p class="form-label" style="margin-top:.5rem">Todas mis solicitudes</p>
        <div v-for="d in dispensas" :key="d.id" class="list-item" style="cursor:default">
          <span class="dim">{{ new Date(d.fechaSolicitud).toLocaleDateString() }} — {{ d.motivo.slice(0,40) }}...</span>
          <span :class="estadoClass(d.estado)">{{ d.estado }}</span>
        </div>
      </div>
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
.check-list { display: flex; flex-direction: column; gap: .4rem; }
.check-row { display: flex; align-items: center; gap: .6rem; font-size: .9rem; cursor: pointer; }
.historial { display: flex; flex-direction: column; gap: .4rem; border-top: 1px solid var(--border); padding-top: .75rem; margin-top: .25rem; }
.tag { font-size: .68rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--bg-input); color: var(--text-secondary); text-transform: uppercase; }
.tag-ok { font-size: .68rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--success-bg); color: var(--success); text-transform: uppercase; }
.tag-ko { font-size: .68rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--error-bg); color: var(--error); text-transform: uppercase; }
.dim { color: var(--text-secondary); font-size: .85rem; }
.fb-ok { padding: .75rem 1rem; background: var(--success-bg); color: var(--success); border-radius: var(--radius-sm); font-size: .85rem; font-weight: 600; }
.fb-ko { padding: .75rem 1rem; background: var(--error-bg); color: var(--error); border-radius: var(--radius-sm); font-size: .85rem; font-weight: 600; }
textarea.form-input { resize: vertical; min-height: 70px; }
</style>
