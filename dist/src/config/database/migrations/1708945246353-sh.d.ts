import { MigrationInterface, QueryRunner } from "typeorm";
export declare class Sh1708945246353 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
