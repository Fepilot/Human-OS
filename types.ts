
export interface DiagnosticFormData {
  nombre: string;
  email: string;
  rol: string;
  años: string;
  crashes: string;
  procesos_colgados: string;
  malware: string;
  logros: string;
  disfrute: string;
  talentos_naturales: string;
  pasion_gratis: string;
  valores: string[];
  valores_top3: string;
  trigger: string;
  dia_critico: string;
  deseo_sin_dinero: string;
  vision_2años: string;
  miedo_mayor: string;
  claridad_que: 'si_claro' | 'vago' | 'no_idea' | '';
  busca_principal: 'nuevo_trabajo' | 'repensar_carrera' | 'idea_proyecto' | 'entenderme' | '';
  estado_emocional: 'agotado_crisis' | 'frustrado_funcional' | 'inquieto_curioso' | 'energizado_bloqueado' | '';
  experiencia_previa: string;
  expectativa_sesion: string;
}

export interface AnalysisResult {
  fitScore: number;
  fitType: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  recommendations: string[];
}
