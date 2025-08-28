import { ref } from 'vue';
import { Notify } from 'quasar';
import {
  createProjectService,
  createBhaService,
  createPerforationService,
  getProjectsService,
  getProjectByIdService,
  createProjectStaticDataService,
  editPerforationService, // <-- agregar import
  deletePerforationService, // <-- agregar import
  getProjectReportService, // <-- agregar import
  editProjectService, // <-- agregar import
  deleteProjectService, // <-- agregar import
  hasProjectChangesService,
  //resetProjectChangesService,
} from '../services/project';
import type { Project, Bha, Perforations } from '../interfaces/models';

export function useProjects() {
  const form = ref<any>({});
  const project = ref<Project | null>(null);
  const projects = ref<Project[]>([]);
  const bha = ref<Bha | null>(null);
  const perforation = ref<Perforations | null>(null);
  const pagination = ref<any>();
  const rowsPerPage = ref(5);
  const page = ref(1);
  const projectReport = ref<any>(null);
  let pollingTimeout: any = null;

  const getProjects = async (search: string, pageNum: number, rowPerPage: number) => {
    try {
      const response = await getProjectsService(search, pageNum, rowPerPage);
      if (response && response.data && response.data.results) {
        projects.value = response.data.results.map((p: any) => ({ ...p, id: p._id }));
        pagination.value = {
          page: response.data.page,
          pageSize: response.data.limit,
          total: response.data.totalResults || response.data.total,
          pageCount: response.data.totalPages,
        };
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const createProject = async (params: Partial<Project>) => {
    try {
      const response = await createProjectService(params);
      if (response && response.message) {
        Notify.create({
          type: 'positive',
          message: response.message,
        });
      }
      project.value = response.data || null;
      return response;
    } catch (error) {
      console.log('Error creating project:', error);
    }
  };

  const createBha = async (projectId: string, params: Partial<Bha>) => {
    try {
      const response = await createBhaService(projectId, params);
      if (response && response.message) {
        Notify.create({
          type: 'positive',
          message: response.message,
        });
      }
      bha.value = response.data || null;
      return response;
    } catch (error) {
      console.log('Error creating BHA:', error);
    }
  };

  const createPerforation = async (projectId: string, params: Partial<Perforations>) => {
    try {
      const response = await createPerforationService(projectId, params);
      if (response && response.message) {
        Notify.create({
          type: 'positive',
          message: response.message,
        });
      }
      perforation.value = response.data || null;
      return response;
    } catch (error) {
      console.log('Error creating perforation:', error);
    }
  };

  const createProjectStaticData = async (projectId: string, params: any) => {
    try {
      const response = await createProjectStaticDataService(projectId, params);
      if (response && response.message) {
        Notify.create({
          type: 'positive',
          message: response.message,
        });
      }
      return response;
    } catch (error) {
      console.log('Error creating static data:', error);
    }
  };

  const getProjectById = async (id: string) => {
    try {
      const response = await getProjectByIdService(id);
      project.value = response.data;
      return response.data;
    } catch (error) {
      console.error('Error fetching project by id:', error);
    }
  };

  const editPerforation = async (
    projectId: string,
    perforationId: string,
    params: Partial<Perforations>,
  ) => {
    try {
      const response = await editPerforationService(projectId, perforationId, params);
      if (response && response.message) {
        Notify.create({
          type: 'positive',
          message: response.message,
        });
      }
      perforation.value = response.data || null;
    } catch (error) {
      console.log('Error editing perforation:', error);
    }
  };

  const deletePerforation = async (projectId: string, perforationId: string) => {
    try {
      const response = await deletePerforationService(projectId, perforationId);
      if (response && response.message) {
        Notify.create({
          type: 'positive',
          message: response.message,
        });
      }
    } catch (error) {
      console.log('Error deleting perforation:', error);
    }
  };

  const getProjectReport = async (projectId: string) => {
    try {
      const response = await getProjectReportService(projectId);
      projectReport.value = response?.data || null;
      return projectReport.value;
    } catch (error) {
      console.error('Error fetching project report:', error);
    }
  };

  const editProjectFunc = async (projectId: string, params: { customer: string; well: string }) => {
    try {
      const response = await editProjectService(projectId, params);
      if (response && response.message) {
        Notify.create({
          type: 'positive',
          message: response.message,
        });
      }
      project.value = response.data || null;
      return response;
    } catch (error) {
      console.log('Error editing project:', error);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const response = await deleteProjectService(projectId);
      if (response && response.message) {
        Notify.create({
          type: 'positive',
          message: response.message,
        });
      }
    } catch (error) {
      console.log('Error deleting project:', error);
    }
  };

  const pollProjectChanges = async (projectId: string, interval = 5000) => {
    if (pollingTimeout) clearTimeout(pollingTimeout);

    const poll = async () => {
      const result = await hasProjectChangesService(projectId);
      if (result?.changed) {
        await getProjectReport(projectId);
        //await resetProjectChangesService(projectId);
      }
      // Solución: envolver en función sincrónica
      pollingTimeout = setTimeout(() => {
        void poll();
      }, interval);
    };
    await poll();
  };

  const stopProjectPolling = () => {
    if (pollingTimeout) clearTimeout(pollingTimeout);
    pollingTimeout = null;
  };

  return {
    form,
    project,
    projects,
    bha,
    perforation,
    pagination,
    rowsPerPage,
    page,
    projectReport,
    getProjects,
    getProjectById,
    createProject,
    createBha,
    createPerforation,
    createProjectStaticData,
    editPerforation,
    deletePerforation,
    getProjectReport,
    editProjectFunc,
    deleteProject,
    pollProjectChanges,
    stopProjectPolling,
  };
}
