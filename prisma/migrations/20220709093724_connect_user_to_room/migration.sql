-- AlterTable
ALTER TABLE "User" ADD COLUMN     "room_id" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
