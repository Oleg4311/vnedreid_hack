export type PartId =
  | 'hood'
  | 'front_bumper'
  | 'rear_bumper'
  | 'left_headlight'
  | 'right_headlight'
  | 'left_fender_front'
  | 'right_fender_front'
  | 'left_fender_rear'
  | 'right_fender_rear'
  | 'roof';

export interface PartStatus {
  id: PartId;
  label: string;
  status: 'Бита' | 'Не бита' | 'Не видно';
  score: number | null;
}

export interface PhotoUploaderProps {
  onAdd: (file: File) => void;
}

export interface PhotosGalleryProps {
  photos: File[];
  onRemove: (index: number) => void;
}

export interface InteractiveModelProps {
  statuses: PartStatus[];
}

export interface ResultsTableProps {
  data: PartStatus[];
  finalScore: number | null;
}

export const initialData: PartStatus[] = [
  { id: 'hood', label: 'Капот', status: 'Не видно', score: null },
  { id: 'front_bumper', label: 'Передний бампер', status: 'Не видно', score: null },
  { id: 'rear_bumper', label: 'Задний бампер', status: 'Не видно', score: null },
  { id: 'left_headlight', label: 'Левая фара', status: 'Не видно', score: null },
  { id: 'right_headlight', label: 'Правая фара', status: 'Не видно', score: null },
  { id: 'left_fender_front', label: 'Левое переднее крыло', status: 'Не видно', score: null },
  { id: 'right_fender_front', label: 'Правое переднее крыло', status: 'Не видно', score: null },
  { id: 'left_fender_rear', label: 'Левое заднее крыло', status: 'Не видно', score: null },
  { id: 'right_fender_rear', label: 'Правое заднее крыло', status: 'Не видно', score: null },
  { id: 'roof', label: 'Крыша', status: 'Не видно', score: null },
];

export const ZONES: { id: PartId; points: string }[] = [
  { id: 'hood', points: '60,80 140,80 160,130 40,130' },
  { id: 'front_bumper', points: '50,40 150,40 160,80 40,80' },
  { id: 'roof', points: '50,130 150,130 150,240 50,240' },
  { id: 'rear_bumper', points: '60,240 140,240 150,280 50,280' },
  { id: 'left_fender_front', points: '40,80 20,100 40,130' },
  { id: 'right_fender_front', points: '160,80 180,100 160,130' },
  { id: 'left_fender_rear', points: '40,130 20,170 40,200' },
  { id: 'right_fender_rear', points: '160,130 180,170 160,200' },
  { id: 'left_headlight', points: '60,60 70,60 70,70 60,70' },
  { id: 'right_headlight', points: '130,60 140,60 140,70 130,70' },
];
