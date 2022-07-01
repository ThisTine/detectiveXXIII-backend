-- CreateEnum
CREATE TYPE "CodeType" AS ENUM ('EVENT', 'PARING');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "event_group_id" TEXT,
ADD COLUMN     "event_hints_count" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Hint" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Hint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Opened_Code" (
    "user_id" TEXT NOT NULL,
    "code_id" TEXT NOT NULL,

    CONSTRAINT "User_Opened_Code_pkey" PRIMARY KEY ("user_id","code_id")
);

-- CreateTable
CREATE TABLE "Code" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CodeType" NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "Code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "user_count" INTEGER NOT NULL DEFAULT 1,
    "code" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event_Group" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Event_Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event_Group_On_Hint" (
    "group_id" TEXT NOT NULL,
    "hint_id" TEXT NOT NULL,

    CONSTRAINT "Event_Group_On_Hint_pkey" PRIMARY KEY ("group_id","hint_id")
);

-- CreateTable
CREATE TABLE "Event_Hint" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "code_id" TEXT NOT NULL,

    CONSTRAINT "Event_Hint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin_User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "Admin_User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin_Token" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exprie_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Code_user_id_key" ON "Code"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Event_Hint_code_id_key" ON "Event_Hint"("code_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_event_group_id_fkey" FOREIGN KEY ("event_group_id") REFERENCES "Event_Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hint" ADD CONSTRAINT "Hint_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Opened_Code" ADD CONSTRAINT "User_Opened_Code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Opened_Code" ADD CONSTRAINT "User_Opened_Code_code_id_fkey" FOREIGN KEY ("code_id") REFERENCES "Code"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Code" ADD CONSTRAINT "Code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event_Group_On_Hint" ADD CONSTRAINT "Event_Group_On_Hint_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Event_Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event_Group_On_Hint" ADD CONSTRAINT "Event_Group_On_Hint_hint_id_fkey" FOREIGN KEY ("hint_id") REFERENCES "Event_Hint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event_Hint" ADD CONSTRAINT "Event_Hint_code_id_fkey" FOREIGN KEY ("code_id") REFERENCES "Code"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin_Token" ADD CONSTRAINT "Admin_Token_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "Admin_User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
