-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "year" INTEGER NOT NULL DEFAULT 2,
    "lifes" INTEGER NOT NULL DEFAULT 5,
    "img" TEXT NOT NULL,
    "opened_hints" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
