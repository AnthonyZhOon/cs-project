-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "visibility" "public"."WorkspaceMemberRole" NOT NULL DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "public"."Task" ADD COLUMN     "visibility" "public"."WorkspaceMemberRole" NOT NULL DEFAULT 'MEMBER';
