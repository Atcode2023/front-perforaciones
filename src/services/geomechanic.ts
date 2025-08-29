import { api } from 'src/boot/axios';

export const listGeomechanicsService = async (
  params: { project?: string; search?: string; page?: number; limit?: number } = {},
) => {
  const { project, search, page, limit } = params;
  const response = await api.get('/geomechanics/', {
    params: { project, search, page, limit },
  });
  return response.data;
};

export const getGeomechanicService = async (id: string) => {
  const response = await api.get(`/geomechanics/${id}`);
  return response.data;
};

export const createGeomechanicService = async (payload: any) => {
  const formData = new FormData();
  Object.keys(payload).forEach((k) => {
    if (k === 'lithologies') {
      formData.append(k, JSON.stringify(payload[k]));
    } else if (payload[k] !== undefined && payload[k] !== null) {
      formData.append(k, payload[k]);
    }
  });
  if (payload.image) formData.append('image', payload.image);
  const response = await api.post('/geomechanics', formData);
  return response.data;
};

export const updateGeomechanicService = async (id: string, payload: any) => {
  const formData = new FormData();
  Object.keys(payload).forEach((k) => {
    if (k === 'lithologies') {
      formData.append(k, JSON.stringify(payload[k]));
    } else if (payload[k] !== undefined && payload[k] !== null) {
      formData.append(k, payload[k]);
    }
  });
  if (payload.image) formData.append('image', payload.image);
  const response = await api.put(`/geomechanics/${id}`, formData);
  return response.data;
};

export const deleteGeomechanicService = async (id: string) => {
  const response = await api.delete(`/geomechanics/${id}`);
  return response.data;
};
