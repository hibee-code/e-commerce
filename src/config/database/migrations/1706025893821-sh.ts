import { MigrationInterface, QueryRunner } from "typeorm";

export class Sh1706025893821 implements MigrationInterface {
    name = 'Sh1706025893821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."product_productcategory_enum" RENAME TO "product_productcategory_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."product_productcategory_enum" AS ENUM('electronics', 'clothing', 'sports_and_outdoor', 'footwear', 'books')`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "productCategory" TYPE "public"."product_productcategory_enum" USING "productCategory"::"text"::"public"."product_productcategory_enum"`);
        await queryRunner.query(`DROP TYPE "public"."product_productcategory_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."order_deliverystatus_enum" RENAME TO "order_deliverystatus_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."order_deliverystatus_enum" AS ENUM('delivered', 'pending')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "deliveryStatus" TYPE "public"."order_deliverystatus_enum" USING "deliveryStatus"::"text"::"public"."order_deliverystatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."order_deliverystatus_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_deliverystatus_enum_old" AS ENUM('delivery', 'ongoing', 'unknown')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "deliveryStatus" TYPE "public"."order_deliverystatus_enum_old" USING "deliveryStatus"::"text"::"public"."order_deliverystatus_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."order_deliverystatus_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."order_deliverystatus_enum_old" RENAME TO "order_deliverystatus_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."product_productcategory_enum_old" AS ENUM('Electronics', 'clothes', 'food', 'shoe', 'products')`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "productCategory" TYPE "public"."product_productcategory_enum_old" USING "productCategory"::"text"::"public"."product_productcategory_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."product_productcategory_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."product_productcategory_enum_old" RENAME TO "product_productcategory_enum"`);
    }

}
