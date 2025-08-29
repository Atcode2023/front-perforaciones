import { ref } from 'vue';
import { Notify } from 'quasar';
import {
  listGeomechanicsService,
  getGeomechanicService,
  createGeomechanicService,
  updateGeomechanicService,
  deleteGeomechanicService,
} from 'src/services/geomechanic';

export function useGeomechanics() {
  const items = ref<any[]>([]);
  const current = ref<any>(null);
  const form = ref<any>({});
  // Estructura actual: lithologies = [{name, present}], y campos globales
  // min_mm, max_mm, avg_mm, cuttings_rate_bph, excess_deficit_bbl, inc_zarandas, mw_lpg, ecd_lpg
  const pagination = ref<{ page: number; limit: number; total: number; totalPages: number } | null>(
    null,
  );
  const rowsPerPage = ref(5);

  const list = async (search = '', page = 1, limit = rowsPerPage.value, project?: string) => {
    const payload: { project?: string; search?: string; page?: number; limit?: number } = {
      search,
      page,
      limit,
    };
    if (project) payload.project = project;
    const res = await listGeomechanicsService(payload);
    items.value = res?.data || [];
    if (res && (res.page || res.total)) {
      pagination.value = {
        page: res.page || page,
        limit: res.limit || limit,
        total: res.total || (res.data ? res.data.length : 0),
        totalPages: res.totalPages || 1,
      };
    }
  };

  const getOne = async (id: string) => {
    const res = await getGeomechanicService(id);
    current.value = res?.data || null;
  };

  const createItem = async (payload: any) => {
    const res = await createGeomechanicService(payload);
    Notify.create({ type: 'positive', message: res?.message || 'Creado' });
    await list(payload.project);
  };

  const updateItem = async (id: string, payload: any) => {
    const res = await updateGeomechanicService(id, payload);
    Notify.create({ type: 'positive', message: res?.message || 'Actualizado' });
    await list(payload.project);
  };

  const deleteItem = async (id: string) => {
    const res = await deleteGeomechanicService(id);
    Notify.create({ type: 'positive', message: res?.message || 'Eliminado' });
    await list();
  };

  return {
    items,
    current,
    form,
    pagination,
    rowsPerPage,
    list,
    getOne,
    createItem,
    updateItem,
    deleteItem,
  };
}
