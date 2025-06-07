import React from 'react';
import styles from './ResultsTable.module.css';
import { ResultsTableProps } from '../../constants';

export const ResultsTable: React.FC<ResultsTableProps> = ({ data, finalScore }) => {
  const getStatus = (score: number | null) => {
    if (score === null) return 'Не видно';
    return score > 0 ? 'Бита' : 'Не бита';
  };

  const formatScore = (score: number | null) => {
    if (score === null) return '';
    return score.toFixed(2);
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Часть машины</th>
            <th>Бита/не бита</th>
            <th>Степень повреждений</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>{row.label}</td>
              <td>{getStatus(row.score)}</td>
              <td>{formatScore(row.score)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.footer}>
        Итоговая оценка состояния машины: {finalScore !== null ? finalScore.toFixed(2) : ''}
      </div>
    </div>
  );
};
