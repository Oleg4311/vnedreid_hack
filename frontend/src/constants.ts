export type PartId =
  | 'hood'
  | 'front_bumper'
  | 'windshield'
  | 'rear_window'
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
  { id: 'windshield', label: 'Лобовое стекло', status: 'Не видно', score: null },
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
  { id: 'rear_window', label: 'Заднее стекло', status: 'Не видно', score: null },
];

export const ZONES: { id: PartId; points: string }[] = [
  // Передний бампер
  { id: 'front_bumper', points: '65,10 140,10 145,35 60,35' },

  // Капот
  { id: 'hood', points: '60,35 146,35 146,92 60,92' },

  // Лобовое стекло
  { id: 'windshield', points: '60,92 146,92 136,128 70,128' },

  // Крыша
  { id: 'roof', points: '70,128 136,128 136,240 70,240' },

  // Заднее стекло
  { id: 'rear_window', points: '70,240 136,240 140,290 65,290' },

  // Задний бампер
  { id: 'rear_bumper', points: '65,290 140,290 155,310 50,310' },

  // Левое переднее крыло
  { id: 'left_fender_front', points: '60,35 45,72 60,110' },

  // Правое переднее крыло
  { id: 'right_fender_front', points: '145,35 160,72 145,110' },

  // Левое заднее крыло (приклеено к крыше и бамперу)
  { id: 'left_fender_rear', points: '70,240 55,265 65,290' },

  // Правое заднее крыло (зеркально)
  { id: 'right_fender_rear', points: '136,240 151,265 140,290' },

  // Левая фара (скошенная)
  { id: 'left_headlight', points: '68,22 84,18 86,28 70,32' },

  // Правая фара (зеркально сдвинутая)
  { id: 'right_headlight', points: '138,22 122,18 120,28 136,32' },
];





