import React, { useState, useCallback } from 'react';
import { Button, Text } from '@gravity-ui/uikit';
import styles from './App.module.css';

import { InteractiveModel } from './components/interactive-model/InteractiveModel';
import { PhotoUploader } from './components/photo-uploader/PhotoUploader';
import { PhotosGallery } from './components/photos-galery/PhotosGallery';
import { ResultsTable } from './components/results-table/ResultsTable';

import { PartStatus, initialData } from './constants';

export const App: React.FC = () => {
    const [photos, setPhotos] = useState<File[]>([]);
    const [tableData, setTableData] = useState<PartStatus[]>(initialData);
    const [finalScore, setFinalScore] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAdd = useCallback((file: File) => {
        setPhotos(prev => [...prev, file]);
    }, []);

    const handleRemove = useCallback((idx: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== idx));
    }, []);

    const handleResetAll = useCallback(() => {
        setPhotos([]);
        setTableData(initialData);
        setFinalScore(null);
    }, []);

    const handleResetAnalysis = useCallback(() => {
        setTableData(initialData);
        setFinalScore(null);
    }, []);

    const handleAnalyze = useCallback(async () => {
    if (photos.length === 0) return;
    setLoading(true);

    const formData = new FormData();
    photos.forEach((file) => formData.append('files', file));

    const resp = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData,
    });

    const result = (await resp.json()) as { data: PartStatus[]; finalScore: number };

    const enriched: PartStatus[] = initialData.map(base => {
        const match = result.data.find(p => p.id === base.id);
        return match
            ? {
                ...base,
                status: match.status,
                score: typeof match.score === 'number' ? match.score : Number(match.score) || null,
            }
            : base;
    });

    setTableData(enriched);
    setFinalScore(result.finalScore);
    setLoading(false);
    }, [photos]);

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <div className={styles.titleWrap}>
                    <Text variant="header-1" className={styles.title}>
                        Проверка битых авто
                    </Text>
                    <Text variant="body-2" className={styles.subtitle}>
                        Загрузите фото повреждений для анализа
                    </Text>
                </div>
                <div className={styles.actions}>
                    <PhotoUploader onAdd={handleAdd} />
                    <Button
                        view="action"
                        size="l"
                        onClick={handleAnalyze}
                        disabled={photos.length === 0}
                        loading={loading}
                    >
                        Проанализировать
                    </Button>
                    <Button
                        view="flat"
                        size="l"
                        onClick={handleResetAnalysis}
                        disabled={loading}
                    >
                        Сбросить анализ
                    </Button>
                    <Button
                        view="flat"
                        size="l"
                        onClick={handleResetAll}
                        disabled={loading}
                    >
                        Сбросить всё
                    </Button>
                </div>
            </header>

            <div className={styles.middle}>
                <InteractiveModel statuses={tableData} />
                <PhotosGallery photos={photos} onRemove={handleRemove} />
            </div>

            <footer className={styles.footer}>
                <ResultsTable data={tableData} finalScore={finalScore} />
            </footer>
        </div>
    );
};
