-- Existing users intentionally keep a NULL identifier.
ALTER TABLE "public"."userinfo"
ADD COLUMN "identifier" INTEGER,
ADD CONSTRAINT "userinfo_identifier_non_negative" CHECK ("identifier" >= 0);

CREATE UNIQUE INDEX "userinfo_identifier_key"
ON "public"."userinfo"("identifier");
