import React from 'react';
import { Card } from '@gravity-ui/uikit';
import styles from './PhotosGallery.module.css';
import { PhotosGalleryProps } from '../../constants';

export const PhotosGallery: React.FC<PhotosGalleryProps> = ({ photos, onRemove }) => (
    <div className={styles.gallery}>
        {photos.map((file, idx) => (
            <Card key={idx} className={styles.card}>
                <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className={styles.img}
                />
                <button
                    className={styles.removeBtn}
                    onClick={() => onRemove(idx)}
                    aria-label="Удалить фото"
                >
                    &times;
                </button>
            </Card>
        ))}
    </div>
);
