import React, { useCallback } from 'react';
import { Button } from '@gravity-ui/uikit';
import styles from './PhotoUploader.module.css';
import { PhotoUploaderProps } from '../../constants';

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onAdd }) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    Array.from(e.target.files).forEach(onAdd);
    e.target.value = '';
  }, [onAdd]);

  return (
    <div className={styles.uploader}>
      <Button view="outlined" size="l" component="label">
        Выбрать фото
        <input
          hidden
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
        />
      </Button>
    </div>
  );
};
