<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useAuth } from '../services/authService';
import dispensaService from '../services/dispensaService';

const { state } = useAuth();
const uid = state.user?.id ?? '';
const panel = ref<string | null>(null);
const toggle = (c: string) => { panel.value = panel.value === c ? null : c; };
const msg = ref(''); const err = ref('');
const ok = (m: string) => { msg.value = m; err.value = ''; };
const ko = (e: any) => { err.value = e.response?.data?.message ?? e.message; msg.value = ''; };

const dispensas = ref<any[]>([]);

watch(panel, async (v) => {
  msg.value = ''; err.value = '';
  if (v) { try { dispensas.value = await dispensaService.consultarSolicitudDispensa({ estado: 'PENDIENTE' }); } catch {} }
});

// Consultar
// (solo muestra lista, sin acción)

// Editar / Guardar (ambos usan el mismo flujo)
const selD = ref<any>(null);
const accionForm = reactive({ estado: 'APROBADA', observaciones: '' });
const selDispensa = (d: any) => { selD.value = d; accionForm.estado = 'APROBADA'; accionForm.observaciones = ''; };

const handleGuardar = async () => {
  try {
    await dispensaService.guardarSolicitudDispensa(selD.value.id, { estado: accionForm.estado as 'APROBADA' | 'RECHAZADA', directorId: uid, observaciones: accionForm.observaciones });
    ok(`Dispensa ${accionForm.estado.toLowerCase()}.`);
    selD.value = null;
    dispensas.value = await dispensaService.consultarSolicitudDispensa({ estado: 'PENDIENTE' }).catch(() => []);
  } catch (e: any) { ko(e); }
};

const estadoClass = (e: string) => e === 'APROBADA' ? 'tag-ok' : e === 'RECHAZADA' ? 'tag-ko' : 'tag';
</script>

<template>
  <div class="page">
    <div class="hero card-base">
      <p class="role-label">Director de Grado</p>
      <h1>{{ state.user?.nombre }}</h1>
    </div>
    <p class="section-lbl">Casos de uso</p>
    <div class="grid">
      <button :class="['cu-btn', { active: panel === 'consultar' }]" @click="toggle('consultar')">Consultar Solicitud de Dispensa</button>
      <button :class="['cu-btn', { active: panel === 'editar' }]" @click="toggle('editar')">Editar Solicitud de Dispensa</button>
      <button :class="['cu-btn', { active: panel === 'guardar' }]" @click="toggle('guardar')">Guardar Solicitud de Dispensa</button>
    </div>

    <div v-if="msg" class="fb-ok">{{ msg }}</div>
    <div v-if="err" class="fb-ko">{{ err }}</div>

    <!-- Consultar -->
    <div v-if="panel === 'consultar'" class="panel card-base">
      <h2 class="panel-h">Consultar Solicitud de Dispensa</h2>
      <table v-if="dispensas.length" class="table-corp">
        <thead><tr><th>Alumno</th><th>Motivo</th><th>Estado</th><th>Fecha</th></tr></thead>
        <tbody>
          <tr v-for="d in dispensas" :key="d.id">
            <td>{{ d.alumno?.nombre }}</td>
            <td>{{ d.motivo }}</td>
            <td><span :class="estadoClass(d.estado)">{{ d.estado }}</span></td>
            <td>{{ new Date(d.fechaSolicitud).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="dim">No hay solicitudes pendientes.</p>
    </div>

    <!-- Editar -->
    <div v-if="panel === 'editar'" class="panel card-base">
      <h2 class="panel-h">Editar Solicitud de Dispensa</h2>
      <template v-if="!selD">
        <div class="lista">
          <div v-for="d in dispensas" :key="d.id" class="list-item" @click="selDispensa(d)">
            <div><p style="font-size:.9rem">{{ d.alumno?.nombre }}</p><p class="dim">{{ d.motivo.slice(0,60) }}...</p></div>
            <span :class="estadoClass(d.estado)">{{ d.estado }}</span>
          </div>
        </div>
        <p v-if="!dispensas.length" class="dim">No hay solicitudes.</p>
      </template>
      <template v-else>
        <div class="info-block"><p class="form-label">Alumno</p><p>{{ selD.alumno?.nombre }}</p></div>
        <div class="info-block"><p class="form-label">Motivo</p><p>{{ selD.motivo }}</p></div>
        <div class="frow"><label class="form-label">Observaciones</label><textarea class="form-input" v-model="accionForm.observaciones" rows="3" placeholder="Añadir observaciones..." /></div>
        <div class="row-h"><button class="btn-primary" @click="handleGuardar">Guardar cambios</button><button class="btn-outline" @click="selD = null">Cancelar</button></div>
      </template>
    </div>

    <!-- Guardar (Aprobar/Rechazar) -->
    <div v-if="panel === 'guardar'" class="panel card-base">
      <h2 class="panel-h">Guardar Solicitud de Dispensa</h2>
      <template v-if="!selD">
        <div class="lista">
          <div v-for="d in dispensas" :key="d.id" class="list-item" @click="selDispensa(d)">
            <div><p style="font-size:.9rem">{{ d.alumno?.nombre }}</p><p class="dim">{{ d.motivo.slice(0,60) }}...</p></div>
            <span :class="estadoClass(d.estado)">{{ d.estado }}</span>
          </div>
        </div>
        <p v-if="!dispensas.length" class="dim">No hay solicitudes pendientes.</p>
      </template>
      <template v-else>
        <div class="info-block"><p class="form-label">Alumno</p><p>{{ selD.alumno?.nombre }}</p></div>
        <div class="info-block"><p class="form-label">Motivo</p><p>{{ selD.motivo }}</p></div>
        <div class="frow">
          <label class="form-label">Resolución</label>
          <select class="form-input" v-model="accionForm.estado">
            <option value="APROBADA">Aprobar</option>
            <option value="RECHAZADA">Rechazar</option>
          </select>
        </div>
        <div class="frow"><label class="form-label">Observaciones</label><textarea class="form-input" v-model="accionForm.observaciones" rows="3" /></div>
        <div class="row-h"><button class="btn-primary" @click="handleGuardar">Guardar resolución</button><button class="btn-outline" @click="selD = null">Cancelar</button></div>
      </template>
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
.list-item { display: flex; justify-content: space-between; align-items: center; padding: .85rem 1rem; border: 1px solid var(--border); border-radius: var(--radius-sm); cursor: pointer; transition: background .1s; }
.list-item:hover { background: var(--bg-main); }
.info-block { background: var(--bg-main); padding: .75rem 1rem; border-radius: var(--radius-sm); }
.info-block .form-label { margin-bottom: 4px; }
.tag { font-size: .68rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--bg-input); color: var(--text-secondary); text-transform: uppercase; }
.tag-ok { font-size: .68rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--success-bg); color: var(--success); text-transform: uppercase; }
.tag-ko { font-size: .68rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--error-bg); color: var(--error); text-transform: uppercase; }
.dim { color: var(--text-secondary); font-size: .85rem; }
.fb-ok { padding: .75rem 1rem; background: var(--success-bg); color: var(--success); border-radius: var(--radius-sm); font-size: .85rem; font-weight: 600; }
.fb-ko { padding: .75rem 1rem; background: var(--error-bg); color: var(--error); border-radius: var(--radius-sm); font-size: .85rem; font-weight: 600; }
textarea.form-input { resize: vertical; min-height: 70px; }
</style>
