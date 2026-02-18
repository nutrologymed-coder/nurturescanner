
export interface UltrasoundData {
  muscleRight: number;
  muscleLeft: number;
  fatRight: number;
  fatLeft: number;
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  date: string;
  label: string;
  context: string;
  measurements: UltrasoundData;
  ultrasoundImage?: string;
}

export interface HistoryData {
  records: PatientRecord[];
}

export interface ComparisonResults {
  muscleDelta: number | null;
  fatDelta: number | null;
  prevRecord?: PatientRecord;
}
