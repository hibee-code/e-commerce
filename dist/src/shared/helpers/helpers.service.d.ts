import { DataSource } from 'typeorm';
export declare class HelpersService {
    private dbSource;
    constructor(dbSource: DataSource);
    private dbManager;
}
