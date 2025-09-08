-- CreateTable
CREATE TABLE "public"."project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "sharedArea" INTEGER NOT NULL,
    "options" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subProject" (
    "id" SERIAL NOT NULL,
    "area" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,
    "point" INTEGER NOT NULL,
    "userId" INTEGER,
    "projectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subProject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."subProject" ADD CONSTRAINT "subProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."userinfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subProject" ADD CONSTRAINT "subProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
