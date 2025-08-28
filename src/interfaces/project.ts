export interface Project {
  id: string;
  customer: string;
  well: string;
  uwi_sidetrack: string;
  equipment: string;
  section: string;
  ing_day: string; // Debe ser el _id del usuario
  ing_night: string; // Debe ser el _id del usuario
  supervisor: string; // Debe ser el _id del usuario
  start_date: string;
  start_time: number;
  entry_depth: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Bha {
  id: string;
  projectId: string;
  engine_od: string;
  engine_type: string;
  factor: number;
  trepan: string;
}

export interface Perforations {
  id: string;
  projectId: string;
  directional_profile_type: string;
  formation: string;
  bha: string;
  to_time: number;
  activity: string;
  depth_to: number;
  tf_type: string;
  tfo: string;
  rpm_surface: number;
  wob: number;
  caudal: number;
  tq_bottom: number;
  tq_out_bottom: number;
  spp_bottom: number;
  spp_out_bottom: number;
  peeg_bottom: number;
  peeg_out_bottom: number;
  peeg_rotating: number;
  mud_density: number;
  shift: string;
  md: number;
  tvd: number;
  incl: number;
  az: number;
  comments: string;
  pierced_feet_kpi: number;
  formations: string;
}

export interface EditProjectPayload {
  customer: string;
  well: string;
}
