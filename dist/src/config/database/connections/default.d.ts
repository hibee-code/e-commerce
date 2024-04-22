import { DataSource } from 'typeorm';
import { Pool } from 'pg';
declare const dataSource: DataSource;
export declare const getPool: () => Promise<Pool>;
export default dataSource;
