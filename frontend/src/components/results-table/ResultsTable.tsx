import React from 'react';
import styles from './ResultsTable.module.css';
import { ResultsTableProps } from '../../constants';

export const ResultsTable: React.FC<ResultsTableProps> = ({ data, finalScore }) => (
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
            <td>{row.status}</td>
            <td>{row.score !== null ? row.score : ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className={styles.footer}>
      Итоговая оценка состояния машины: {finalScore !== null ? finalScore : ''}
    </div>
  </div>
);
