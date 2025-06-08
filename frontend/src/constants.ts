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
  { id: 'hood', points: '40,80 160,80 160,110 40,110' },
  { id: 'front_bumper', points: '50,40 150,40 160,80 40,80' },

  { id: 'roof', points: '40,110 160,110 160,260 40,260' },

  { id: 'rear_bumper', points: '40,260 160,260 140,300 60,300' },

  { id: 'left_fender_front', points: '40,80 25,140 40,170' },
  { id: 'right_fender_front', points: '160,80 175,140 160,170' },

  { id: 'left_fender_rear', points: '40,170 25,210 40,260' },
  { id: 'right_fender_rear', points: '160,170 175,210 160,260' },

  { id: 'left_headlight', points: '60,60 70,60 70,70 60,70' },
  { id: 'right_headlight', points: '130,60 140,60 140,70 130,70' },
];
