<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth } from '../services/authService';
import { academicService } from '../services/academicService';
import { dispensaService } from '../services/dispensaService';
import type { SesionDeClase, CreateDispensaDTO } from '../types';

const { state } = useAuth();
const ALUMNO_ID = state.user?.id;
const SECRETARIA_ID = 'mock-secretaria-id'; // En un sistema real se buscaría dinámicamente

const sesiones = ref<SesionDeClase[]>([]);
const motivo = ref('');
const sesionesSeleccionadas = ref<string[]>([]);
const enviando = ref(false);
const mensaje = ref({ texto: '', tipo: '' });

onMounted(async () => {
  if (!ALUMNO_ID) return;
  try {
    // CARGA REAL: Solo sesiones de las asignaturas del alumno logueado
    sesiones.value = await academicService.getSessionsForAlumno(ALUMNO_ID); 
  } catch (error) {
    console.error('Error al cargar sesiones personalizadas:', error);
  }
});

const enviarSolicitud = async () => {
  if (!ALUMNO_ID) return;
  if (sesionesSeleccionadas.value.length === 0 || !motivo.value) {
    mensaje.value = { texto: 'Por favor, selecciona sesiones y escribe un motivo.', tipo: 'error' };
    return;
  }

  enviando.value = true;
  try {
    const nuevaDispensa: CreateDispensaDTO = {
      alumnoId: ALUMNO_ID,
      secretariaId: SECRETARIA_ID,
      motivo: motivo.value,
      sesionesIds: sesionesSeleccionadas.value
    };

    await dispensaService.createDispensa(nuevaDispensa);
    
    mensaje.value = { texto: 'Solicitud enviada correctamente.', tipo: 'success' };
    motivo.value = '';
    sesionesSeleccionadas.value = [];
  } catch (error) {
    mensaje.value = { texto: 'Error al enviar la solicitud.', tipo: 'error' };
  } finally {
    enviando.value = false;
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<template>
  <div class="student-dashboard">
    <header class="header">
      <h1>Panel de {{ state.user?.nombre }}</h1>
      <p class="role-badge">ALUMNO MATRICULADO</p>
    </header>

    <main class="content">
      <section class="card">
        <h2>Solicitar Nueva Dispensa</h2>
        <p class="description">Selecciona las sesiones de tus asignaturas a las que no pudiste asistir.</p>

        <form @submit.prevent="enviarSolicitud" class="dispensa-form">
          <div class="form-group">
            <label>1. Sesiones disponibles de tus asignaturas:</label>
            <div class="sesiones-list">
              <div v-for="sesion in sesiones" :key="sesion.id" class="sesion-item">
                <input 
                  type="checkbox" 
                  :id="sesion.id" 
                  :value="sesion.id" 
                  v-model="sesionesSeleccionadas"
                >
                <label :for="sesion.id">
                  <span class="subject-tag">{{ sesion.asignatura?.nombre }}</span>
                  <span class="session-date">{{ formatDate(sesion.fecha) }}</span>
                </label>
              </div>
              <p v-if="sesiones.length === 0" class="empty-state">No tienes sesiones de clase registradas aún.</p>
            </div>
          </div>

          <div class="form-group">
            <label for="motivo">2. Justificación / Motivo:</label>
            <textarea 
              id="motivo" 
              v-model="motivo" 
              placeholder="Describa el motivo de la falta..."
              rows="4"
            ></textarea>
          </div>

          <div v-if="mensaje.texto" :class="['alert', mensaje.tipo]">
            {{ mensaje.texto }}
          </div>

          <button type="submit" :disabled="enviando" class="btn-primary">
            {{ enviando ? 'Procesando...' : 'Enviar Solicitud Oficial' }}
          </button>
        </form>
      </section>
    </main>
  </div>
</template>

<style scoped>
.student-dashboard { max-width: 900px; margin: 0 auto; padding: 20px; }
.header { margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 15px; }
.header h1 { margin: 0; color: #1a2a6c; font-size: 1.8rem; }
.role-badge { background: #2ecc71; color: white; padding: 2px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; }

.content { display: grid; gap: 20px; }
.card { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eee; }
.description { color: #7f8c8d; margin-bottom: 25px; }

.form-group { margin-bottom: 25px; }
.form-group label { display: block; font-weight: bold; margin-bottom: 12px; color: #34495e; }

.sesiones-list { max-height: 250px; overflow-y: auto; border: 1px solid #dcdde1; border-radius: 8px; background: #f8f9fa; }
.sesion-item { display: flex; align-items: center; gap: 15px; padding: 12px 15px; border-bottom: 1px solid #eee; transition: background 0.2s; }
.sesion-item:hover { background: #fff; }
.sesion-item:last-child { border-bottom: none; }

.subject-tag { background: #e1f5fe; color: #0288d1; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; }
.session-date { font-size: 0.9rem; color: #2c3e50; }

textarea { width: 100%; padding: 15px; border: 1px solid #dcdde1; border-radius: 8px; font-family: inherit; font-size: 1rem; box-sizing: border-box; }
textarea:focus { border-color: #1a2a6c; outline: none; }

.btn-primary { width: 100%; background-color: #1a2a6c; color: white; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: bold; transition: transform 0.2s; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(26, 42, 108, 0.3); }
.btn-primary:disabled { background-color: #bdc3c7; cursor: not-allowed; transform: none; }

.alert { padding: 12px; border-radius: 6px; margin-bottom: 20px; font-weight: bold; }
.alert.success { background-color: #d4edda; color: #155724; border-left: 5px solid #28a745; }
.alert.error { background-color: #f8d7da; color: #721c24; border-left: 5px solid #dc3545; }

.empty-state { text-align: center; color: #95a5a6; padding: 30px; font-style: italic; }
</style>
