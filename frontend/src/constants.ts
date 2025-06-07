// src/constants.ts

/** Пропсы для компонента загрузки фото */
export interface PhotoUploaderProps {
    onAdd: (file: File) => void;
}

/** Пропсы для интерактивной модели */
export interface InteractiveModelProps {
    /** Статусы всех частей машины */
    statuses: PartStatus[];
}

/** Пропсы для галереи фотографий */
export interface PhotosGalleryProps {
    photos: File[];
    onRemove: (index: number) => void;
}

/** Идентификаторы частей машины для SVG */
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

/** Статус и оценка каждой части машины */
export interface PartStatus {
    /** Код части (data-part) */
    id: PartId;
    /** Русское название части */
    label: string;
    /** Состояние: битая/не битая/не видно */
    status: 'Бита' | 'Не бита' | 'Не видно';
    /** Оценка повреждений 0–5 или null */
    score: number | null;
}

/** Пропсы для таблицы результатов анализа */
export interface ResultsTableProps {
    data: PartStatus[];
    finalScore: number | null;
}

/** Начальные данные по всем частям машины (до анализа) */
export const initialData: PartStatus[] = [
    { id: 'hood',               label: 'Кузов (задняя часть)',    status: 'Не видно', score: null },
    { id: 'front_bumper',       label: 'Передний бампер',         status: 'Не видно', score: null },
    { id: 'rear_bumper',        label: 'Задний бампер',           status: 'Не видно', score: null },
    { id: 'left_headlight',     label: 'Левая фара',              status: 'Не видно', score: null },
    { id: 'right_headlight',    label: 'Правая фара',             status: 'Не видно', score: null },
    { id: 'left_fender_front',  label: 'Левое переднее крыло',     status: 'Не видно', score: null },
    { id: 'right_fender_front', label: 'Правое переднее крыло',    status: 'Не видно', score: null },
    { id: 'left_fender_rear',   label: 'Левое заднее крыло',       status: 'Не видно', score: null },
    { id: 'right_fender_rear',  label: 'Правое заднее крыло',      status: 'Не видно', score: null },
    { id: 'roof',               label: 'Крыша',                    status: 'Не видно', score: null },
];

// Zones defined as polygons matching car shape
export const ZONES: { id: PartStatus['id']; points: string }[] = [
  { id: 'hood', points: '60,80 140,80 160,130 40,130' },
  { id: 'front_bumper', points: '50,40 150,40 160,80 40,80' },
  { id: 'roof', points: '50,130 150,130 150,240 50,240' },
  { id: 'rear_bumper', points: '60,240 140,240 150,280 50,280' },
  { id: 'left_fender_front', points: '40,80 20,100 40,130' },
  { id: 'right_fender_front', points: '160,80 180,100 160,130' },
  { id: 'left_fender_rear', points: '40,130 20,170 40,200' },
  { id: 'right_fender_rear', points: '160,130 180,170 160,200' },
];
