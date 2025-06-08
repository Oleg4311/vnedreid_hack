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
  | 'roof'
  | 'left_door_front'
  | 'right_door_front'
  | 'left_door_rear'
  | 'right_door_rear'
  | 'left_mirror'
  | 'right_mirror';

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
  { id: 'rear_window', label: 'Заднее стекло', status: 'Не видно', score: null },
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
  { id: 'left_door_front', label: 'Левая передняя дверь', status: 'Не видно', score: null },
  { id: 'right_door_front', label: 'Правая передняя дверь', status: 'Не видно', score: null },
  { id: 'left_door_rear', label: 'Левая задняя дверь', status: 'Не видно', score: null },
  { id: 'right_door_rear', label: 'Правая задняя дверь', status: 'Не видно', score: null },
  { id: 'left_mirror', label: 'Левое зеркало', status: 'Не видно', score: null },
  { id: 'right_mirror', label: 'Правое зеркало', status: 'Не видно', score: null },
];

export const ZONES: { id: PartId; points: string }[] = [
  { id: 'front_bumper', points: '65,10 140,10 145,35 60,35' },
  { id: 'hood', points: '60,35 146,35 146,92 60,92' },
  { id: 'windshield', points: '60,92 146,92 136,128 70,128' },
  { id: 'roof', points: '70,128 136,128 136,240 70,240' },
  { id: 'rear_window', points: '70,240 136,240 140,290 65,290' },
  { id: 'rear_bumper', points: '65,290 140,290 155,310 50,310' },
  { id: 'left_fender_front', points: '60,35 45,72 60,110' },
  { id: 'right_fender_front', points: '145,35 160,72 145,110' },
  { id: 'left_fender_rear', points: '70,240 55,265 65,290' },
  { id: 'right_fender_rear', points: '136,240 151,265 140,290' },
  { id: 'left_headlight', points: '68,22 84,18 86,28 70,32' },
  { id: 'right_headlight', points: '138,22 122,18 120,28 136,32' },
  { id: 'left_door_front', points: '60,128 60,170 70,170 70,128 60,92' },
  { id: 'right_door_front', points: '136,128 136,170 146,170 146,128 146,92' },
  { id: 'left_door_rear', points: '60,170 60,240 70,240 70,170' },
  { id: 'right_door_rear', points: '136,170 136,240 146,240 146,170' },
  { id: 'left_mirror', points: '60,110 45,122 60,134' },
  { id: 'right_mirror', points: '146,110 161,122 146,134' },
];
