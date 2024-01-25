import { MigrationInterface, QueryRunner } from 'typeorm';

export class Sh1705600382147 implements MigrationInterface {
  name = 'Sh1705600382147';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product" ("id" BIGSERIAL NOT NULL, "name" character varying, "description" character varying, "brand" character varying, "price" integer, "tag" integer, "quantity" integer, "rating" integer, "productCategory" "public"."product_productcategory_enum" NOT NULL, "userId" bigint, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" BIGSERIAL NOT NULL, "firstName" character varying, "lastName" character varying, "email" character varying, "password" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart" ("id" BIGSERIAL NOT NULL, "description" character varying, "price" bigint, "quantity" bigint, "totalItem" bigint, "userId" bigint, "image" character varying, CONSTRAINT "REL_756f53ab9466eb52a52619ee01" UNIQUE ("userId"), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("cartId" BIGSERIAL NOT NULL, "isPaid" character varying, "orderDate" date, "deliveryStatus" "public"."order_deliverystatus_enum" NOT NULL, CONSTRAINT "PK_fe3963d525b2ee03ba471953a7c" PRIMARY KEY ("cartId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart_details" ("id" BIGSERIAL NOT NULL, "cartId" bigint, "productId" bigint NOT NULL, "price" numeric NOT NULL, "createdAt" numeric NOT NULL, "item" numeric NOT NULL, "updateAt" numeric NOT NULL, CONSTRAINT "PK_6ac8b222cc04b34e7c14c1205cf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_329b8ae12068b23da547d3b4798" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_details" ADD CONSTRAINT "FK_213b59b40899244918966811c7d" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE "typeorm_cache_table" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_1f1c066da68820c20a4ff873df1" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "typeorm_cache_table"`);
    await queryRunner.query(
      `ALTER TABLE "cart_details" DROP CONSTRAINT "FK_213b59b40899244918966811c7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_329b8ae12068b23da547d3b4798"`,
    );
    await queryRunner.query(`DROP TABLE "cart_details"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "cart"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "product"`);
  }
}
