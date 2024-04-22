import { DataSource } from 'typeorm';
export declare const dataSourceFor: (connectionName?: string) => DataSource;
export declare const connectDataSourceFor: (connectionName?: string) => Promise<DataSource | undefined>;
