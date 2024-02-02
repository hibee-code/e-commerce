import { MigrationInterface, QueryRunner } from "typeorm";

export class Sh1706826026007 implements MigrationInterface {
    name = 'Sh1706826026007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profile_collection" ("id" BIGSERIAL NOT NULL, "profileType" "public"."profile_collection_profiletype_enum" NOT NULL, "isAdmin" boolean NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "profileTypeId" bigint NOT NULL, "userId" bigint NOT NULL, CONSTRAINT "PK_e5d01864c4c3af52721b886fe83" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" BIGSERIAL NOT NULL, "firstName" character varying, "lastName" character varying, "email" character varying, "password" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" BIGSERIAL NOT NULL, "name" character varying, "description" character varying, "brand" character varying, "price" integer, "tag" integer, "quantity" integer, "rating" integer, "productCategory" "public"."product_productcategory_enum" NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart" ("id" BIGSERIAL NOT NULL, "description" character varying, "price" bigint, "quantity" bigint, "totalItem" bigint, "userId" bigint, "image" character varying NOT NULL, CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("cartId" BIGSERIAL NOT NULL, "isPaid" character varying, "orderDate" date, "deliveryStatus" "public"."order_deliverystatus_enum" NOT NULL, CONSTRAINT "PK_fe3963d525b2ee03ba471953a7c" PRIMARY KEY ("cartId"))`);
        await queryRunner.query(`CREATE TABLE "entity_profile" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_664b32a943f98981b7db3bfaefa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "entity_user_profile" ("id" BIGSERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "middleName" character varying, "email" character varying NOT NULL, "phone" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "isAdmin" boolean NOT NULL DEFAULT false, "entityProfileId" bigint NOT NULL, "phoneCodeId" bigint, CONSTRAINT "UQ_4b5ade5304fa8581cb0af0f9902" UNIQUE ("email"), CONSTRAINT "UQ_76e1a874d4915c7d390fa1c73ba" UNIQUE ("phone"), CONSTRAINT "PK_ed2cc6a17e618276474ac157e6b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart_details" ("id" BIGSERIAL NOT NULL, "cartId" bigint, "productId" bigint NOT NULL, "price" numeric NOT NULL, "createdAt" numeric NOT NULL, "item" numeric NOT NULL, "updateAt" numeric NOT NULL, CONSTRAINT "PK_6ac8b222cc04b34e7c14c1205cf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "entity_user_profile" ADD CONSTRAINT "FK_19b2f4ff2abd89dbe2b89cf8162" FOREIGN KEY ("entityProfileId") REFERENCES "entity_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_details" ADD CONSTRAINT "FK_213b59b40899244918966811c7d" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TABLE "typeorm_cache_table" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_1f1c066da68820c20a4ff873df1" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "typeorm_cache_table"`);
        await queryRunner.query(`ALTER TABLE "cart_details" DROP CONSTRAINT "FK_213b59b40899244918966811c7d"`);
        await queryRunner.query(`ALTER TABLE "entity_user_profile" DROP CONSTRAINT "FK_19b2f4ff2abd89dbe2b89cf8162"`);
        await queryRunner.query(`DROP TABLE "cart_details"`);
        await queryRunner.query(`DROP TABLE "entity_user_profile"`);
        await queryRunner.query(`DROP TABLE "entity_profile"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "profile_collection"`);
    }

}
