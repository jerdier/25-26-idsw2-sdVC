<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { academicService } from '../services/academicService';
import { dispensaService } from '../services/dispensaService';
import { SesionDeClase, CreateDispensaDTO } from '../types';

// IDs de prueba (Normalmente vendrían de un sistema de Auth)
const MOCK_ALUMNO_ID = 'mock-alumno-id'; 
const MOCK_SECRETARIA_ID = 'mock-secretaria-id';

const sesiones = ref<SesionDeClase[]>([]);
const motivo = ref('');
const sesionesSeleccionadas = ref<string[]>([]);
const enviando = ref(false);
const mensaje = ref({ texto: '', tipo: '' });

onMounted(async () => {
  try {
    // Por ahora cargamos sesiones de ejemplo para que el alumno elija
    // En el futuro, esto filtraría sesiones donde el alumno tiene faltas
    sesiones.value = await academicService.getSesionesByAsignatura('any'); 
  } catch (error) {
    console.error('Error al cargar sesiones:', error);
  }
});

const enviarSolicitud = async () => {
  if (sesionesSeleccionadas.value.length === 0 || !motivo.value) {
    mensaje.value = { texto: 'Por favor, selecciona sesiones y escribe un motivo.', tipo: 'error' };
    return;
  }

  enviando.value = true;
  try {
    const nuevaDispensa: CreateDispensaDTO = {
      alumnoId: MOCK_ALUMNO_ID,
      secretariaId: MOCK_SECRETARIA_ID,
      motivo: motivo.value,
      sesionesIds: sesionesSeleccionadas.value
    };

    await dispensaService.createDispensa(nuevaDispensa);
    
    mensaje.value = { texto: 'Solicitud enviada correctamente.', tipo: 'success' };
    // Limpiar formulario
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
      <h1>Panel del Alumno</h1>
      <p>Gestión de asistencia y trámites académicos</p>
    </header>

    <main class="content">
      <section class="card">
        <h2>Solicitar Nueva Dispensa</h2>
        <p class="description">Selecciona las sesiones de clase a las que no pudiste asistir y justifica el motivo.</p>

        <form @submit.prevent="enviarSolicitud" class="dispensa-form">
          <div class="form-group">
            <label>1. Selecciona las sesiones:</label>
            <div class="sesiones-list">
              <div v-for="sesion in sesiones" :key="sesion.id" class="sesion-item">
                <input 
                  type="checkbox" 
                  :id="sesion.id" 
                  :value="sesion.id" 
                  v-model="sesionesSeleccionadas"
                >
                <label :for="sesion.id">
                  <strong>{{ sesion.asignatura?.nombre || 'Clase' }}</strong> - {{ formatDate(sesion.fecha) }}
                </label>
              </div>
              <p v-if="sesiones.length === 0" class="empty-state">No hay sesiones disponibles para seleccionar.</p>
            </div>
          </div>

          <div class="form-group">
            <label for="motivo">2. Motivo de la falta:</label>
            <textarea 
              id="motivo" 
              v-model="motivo" 
              placeholder="Ej: Cita médica, problema familiar, etc."
              rows="4"
            ></textarea>
          </div>

          <div v-if="mensaje.texto" :class="['alert', mensaje.tipo]">
            {{ mensaje.texto }}
          </div>

          <button type="submit" :disabled="enviando" class="btn-primary">
            {{ enviando ? 'Enviando...' : 'Enviar Solicitud de Dispensa' }}
          </button>
        </form>
      </section>

      <section class="card">
        <h2>Mis Solicitudes</h2>
        <div class="empty-state">
          <p>Próximamente: Aquí verás el historial y estado de tus dispensas.</p>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.student-dashboard {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.header {
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.header h1 {
  margin: 0;
  color: #2c3e50;
}

.content {
  display: grid;
  gap: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border: 1px solid #eee;
}

.description {
  color: #666;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 10px;
}

.sesiones-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  background: #f9f9f9;
}

.sesion-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.sesion-item:last-child {
  border-bottom: none;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
}

.btn-primary {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-primary:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.alert {
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.alert.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 20px;
}
</style>
