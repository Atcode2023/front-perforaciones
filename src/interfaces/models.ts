// Interfaces centralizadas para el frontend

export interface User {
  _id?: string;
  username: string;
  password: string;
  role: 'ADMIN' | 'USER';
  created_at: string; // ISO date string
  deleted_at: string | null;
}

export interface Pagination {
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
}

export interface Bha {
  _id?: any;
  engine_od: string;
  engine_type: string;
  factor: number;
  trepan: string;
}

export interface Perforations {
  _id?: any;
  directional_profile_type: string;
  formation: string;
  bha: any; // Puede ser ObjectId o Bha
  created_at: Date;
  from_time: number;
  to_time: number;
  time: number;
  activity: string;
  circulates_out_of_background: number;
  depth_from: number;
  depth_to: number;
  drilled_meters: number;
  effective_rop: number;
  tf_type: string;
  tfo: any; // Puede ser ObjectId o string
  rpm_surface: number;
  total_rpm: number;
  wob: number;
  caudal: number;
  tq_bottom: number;
  tq_out_bottom: number;
  spp_bottom: number;
  spp_out_bottom: number;
  differential_pressure: number;
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
  rop_kpi: number;
  rop_efe_kpi: number;
  rop_trips: number;
  rop_avg: number;
  pierced_feet_kpi: number;
  formations: string;
}

export interface RopEfecKpi {
  _id?: any;
  depth: number;
  rop: number;
}

export interface RopAvgKpi {
  _id?: any;
  depth: number;
  rop: number;
}

export interface TripRopKpi {
  _id?: any;
  depth: number;
  rop: number;
}

export interface ConexKpi {
  _id?: any;
  depth: number;
  rop: number;
}

export interface ReviewKpi {
  _id?: any;
  time: number;
}

export interface SurveyKpi {
  _id?: any;
  time: number;
}

export interface TotalRcs {
  _id?: any;
  time: number;
}

export interface ProjectStaticData {
  rop_efec_kpi: RopEfecKpi[];
  rop_avg_kpi: RopAvgKpi[];
  trip_rop_kpi: TripRopKpi[];
  conex_kpi: ConexKpi[];
  review_kpi: ReviewKpi[];
  survey_kpi: SurveyKpi[];
  total_rcs: TotalRcs[];
}

export interface Project {
  _id?: any;
  customer: string;
  well: string;
  uwi_sidetrack: string;
  equipment: string;
  section: string;
  ing_day: any;
  ing_night: any;
  start_date: Date;
  start_time: number;
  entry_depth: number;
  departure_date: Date;
  exit_depth: number;
  progress: number;
  bhas: Bha[];
  perforations: Perforations[];
  project_static_data?: ProjectStaticData;
  created_at?: Date;
  deleted_at?: Date | null;
  kpi?: any; // Puede ser un objeto o una referencia a otro modelo
}
