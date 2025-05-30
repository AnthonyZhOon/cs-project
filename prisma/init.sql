CREATE user "prisma" WITH PASSWORD 'custom_password' bypassrls createdb;

-- extend prisma's privileges to postgres (necessary to view changes in Dashboard)
GRANT "prisma" TO "postgres";

-- Grant it necessary permissions over the relevant schemas (public)
GRANT USAGE ON schema public TO prisma;

GRANT CREATE ON schema public TO prisma;

GRANT ALL ON ALL TABLES IN schema public TO prisma;

GRANT ALL ON ALL routines IN schema public TO prisma;

GRANT ALL ON ALL sequences IN schema public TO prisma;

ALTER DEFAULT PRIVILEGES FOR role postgres IN schema public GRANT ALL ON TABLES TO prisma;

ALTER DEFAULT PRIVILEGES FOR role postgres IN schema public GRANT ALL ON routines TO prisma;

ALTER DEFAULT PRIVILEGES FOR role postgres IN schema public GRANT ALL ON sequences TO prisma;

GRANT ALL ON SCHEMA public TO prisma;

-- Allow schema to be changed whatever