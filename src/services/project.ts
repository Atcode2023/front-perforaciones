export const getProjectByIdService = async (id: string) => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error fetching project by id:', error);
  }
};
export const getProjectsService = async (search: string, page: number, rowPerPage: number) => {
  try {
    const response = await api.get('/projects', {
      params: { search, page, limit: rowPerPage },
    });
    return response.data;
  } catch (error) {
    console.log('Error fetching projects:', error);
  }
};
import { api } from 'src/boot/axios';

export const createProjectService = async (params: any) => {
  try {
    const response = await api.post('/projects', params);
    return response.data;
  } catch (error) {
    console.log('Error creating project:', error);
  }
};

export const createBhaService = async (projectId: string, params: any) => {
  try {
    const response = await api.post(`/projects/${projectId}/bha`, params);
    return response.data;
  } catch (error) {
    console.log('Error creating BHA:', error);
  }
};

export const createPerforationService = async (projectId: string, params: any) => {
  try {
    const response = await api.post(`/projects/${projectId}/perforation`, params);
    return response.data;
  } catch (error) {
    console.log('Error creating perforation:', error);
  }
};

export const createProjectStaticDataService = async (projectId: string, params: any) => {
  try {
    const response = await api.post(`/projects/${projectId}/static-data`, params);
    return response.data;
  } catch (error) {
    console.log('Error creating static data:', error);
  }
};

export const editPerforationService = async (
  projectId: string,
  perforationId: string,
  params: any,
) => {
  try {
    const response = await api.put(`/projects/${projectId}/perforation/${perforationId}`, params);
    return response.data;
  } catch (error) {
    console.log('Error editing perforation:', error);
  }
};

export const deletePerforationService = async (projectId: string, perforationId: string) => {
  try {
    const response = await api.delete(`/projects/${projectId}/perforation/${perforationId}`);
    return response.data;
  } catch (error) {
    console.log('Error deleting perforation:', error);
  }
};

export const getProjectReportService = async (projectId: string) => {
  try {
    const response = await api.get(`/projects/${projectId}/report`);
    return response.data;
  } catch (error) {
    console.log('Error fetching project report:', error);
  }
};

export const editProjectService = async (
  projectId: string,
  params: { customer: string; well: string },
) => {
  try {
    const response = await api.put(`/projects/${projectId}`, params);
    return response.data;
  } catch (error) {
    console.log('Error editing project:', error);
  }
};

export const deleteProjectService = async (projectId: string) => {
  try {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.log('Error deleting project:', error);
  }
};

export const hasProjectChangesService = async (projectId: string) => {
  try {
    const response = await api.get(`/projects/${projectId}/has-changes`);
    return response.data;
  } catch (error) {
    console.log('Error checking project changes:', error);
  }
};

export const resetProjectChangesService = async (projectId: string) => {
  try {
    const response = await api.post(`/projects/${projectId}/reset-changes`);
    return response.data;
  } catch (error) {
    console.log('Error resetting project changes:', error);
  }
};
