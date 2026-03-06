


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "date" timestamp with time zone NOT NULL,
    "category" "text" NOT NULL,
    "image_url" "text",
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "events_category_check" CHECK (("category" = ANY (ARRAY['ecoturismo'::"text", 'cultura'::"text", 'talleres'::"text", 'activismo'::"text"])))
);


ALTER TABLE "public"."events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."highlight_cards" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "section" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "image_url" "text" NOT NULL,
    "display_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "category" "text",
    CONSTRAINT "highlight_cards_section_check" CHECK (("section" = ANY (ARRAY['raices'::"text", 'preservacion'::"text"])))
);


ALTER TABLE "public"."highlight_cards" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."otomi_elements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "scenario_id" "uuid" NOT NULL,
    "otomi_word" "text" NOT NULL,
    "spanish_word" "text" NOT NULL,
    "image_url" "text",
    "emoji" "text" DEFAULT '❓'::"text",
    "position_x" integer DEFAULT 50 NOT NULL,
    "position_y" integer DEFAULT 50 NOT NULL,
    "display_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."otomi_elements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."otomi_scenarios" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "subtitle" "text" NOT NULL,
    "bg_gradient" "text" DEFAULT 'linear-gradient(180deg, #87CEEB 0%, #F5DEB3 60%, #8B7355 100%)'::"text" NOT NULL,
    "bg_emoji" "text" DEFAULT '🌿'::"text",
    "display_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "bg_image_url" "text"
);


ALTER TABLE "public"."otomi_scenarios" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."testimonials" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "author" "text" NOT NULL,
    "content" "text" NOT NULL,
    "event_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."testimonials" OWNER TO "postgres";


ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."highlight_cards"
    ADD CONSTRAINT "highlight_cards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."otomi_elements"
    ADD CONSTRAINT "otomi_elements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."otomi_scenarios"
    ADD CONSTRAINT "otomi_scenarios_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."testimonials"
    ADD CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_events_category" ON "public"."events" USING "btree" ("category");



CREATE INDEX "idx_events_date" ON "public"."events" USING "btree" ("date");



CREATE INDEX "idx_highlight_cards_section" ON "public"."highlight_cards" USING "btree" ("section");



CREATE INDEX "idx_otomi_elements_scenario" ON "public"."otomi_elements" USING "btree" ("scenario_id");



CREATE INDEX "idx_otomi_scenarios_order" ON "public"."otomi_scenarios" USING "btree" ("display_order");



CREATE INDEX "idx_testimonials_event" ON "public"."testimonials" USING "btree" ("event_id");



ALTER TABLE ONLY "public"."otomi_elements"
    ADD CONSTRAINT "otomi_elements_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "public"."otomi_scenarios"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."testimonials"
    ADD CONSTRAINT "testimonials_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE SET NULL;



CREATE POLICY "Allow authenticated delete on highlight_cards" ON "public"."highlight_cards" FOR DELETE USING (true);



CREATE POLICY "Allow authenticated insert on highlight_cards" ON "public"."highlight_cards" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow authenticated update on highlight_cards" ON "public"."highlight_cards" FOR UPDATE USING (true);



CREATE POLICY "Allow delete on events" ON "public"."events" FOR DELETE USING (true);



CREATE POLICY "Allow delete on otomi_elements" ON "public"."otomi_elements" FOR DELETE USING (true);



CREATE POLICY "Allow delete on otomi_scenarios" ON "public"."otomi_scenarios" FOR DELETE USING (true);



CREATE POLICY "Allow insert on events" ON "public"."events" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow insert on otomi_elements" ON "public"."otomi_elements" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow insert on otomi_scenarios" ON "public"."otomi_scenarios" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow public read on events" ON "public"."events" FOR SELECT USING (true);



CREATE POLICY "Allow public read on highlight_cards" ON "public"."highlight_cards" FOR SELECT USING (true);



CREATE POLICY "Allow public read on otomi_elements" ON "public"."otomi_elements" FOR SELECT USING (true);



CREATE POLICY "Allow public read on otomi_scenarios" ON "public"."otomi_scenarios" FOR SELECT USING (true);



CREATE POLICY "Allow public read on testimonials" ON "public"."testimonials" FOR SELECT USING (true);



CREATE POLICY "Allow update on events" ON "public"."events" FOR UPDATE USING (true);



CREATE POLICY "Allow update on otomi_elements" ON "public"."otomi_elements" FOR UPDATE USING (true);



CREATE POLICY "Allow update on otomi_scenarios" ON "public"."otomi_scenarios" FOR UPDATE USING (true);



ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."highlight_cards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."otomi_elements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."otomi_scenarios" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."testimonials" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";



GRANT ALL ON TABLE "public"."highlight_cards" TO "anon";
GRANT ALL ON TABLE "public"."highlight_cards" TO "authenticated";
GRANT ALL ON TABLE "public"."highlight_cards" TO "service_role";



GRANT ALL ON TABLE "public"."otomi_elements" TO "anon";
GRANT ALL ON TABLE "public"."otomi_elements" TO "authenticated";
GRANT ALL ON TABLE "public"."otomi_elements" TO "service_role";



GRANT ALL ON TABLE "public"."otomi_scenarios" TO "anon";
GRANT ALL ON TABLE "public"."otomi_scenarios" TO "authenticated";
GRANT ALL ON TABLE "public"."otomi_scenarios" TO "service_role";



GRANT ALL ON TABLE "public"."testimonials" TO "anon";
GRANT ALL ON TABLE "public"."testimonials" TO "authenticated";
GRANT ALL ON TABLE "public"."testimonials" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


  create policy "Allow delete on otomi-element-images"
  on "storage"."objects"
  as permissive
  for delete
  to public
using ((bucket_id = 'otomi-element-images'::text));



  create policy "Allow public deletes from highlight-images"
  on "storage"."objects"
  as permissive
  for delete
  to public
using ((bucket_id = 'highlight-images'::text));



  create policy "Allow public read on otomi-element-images"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'otomi-element-images'::text));



  create policy "Allow public uploads to highlight-images"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'highlight-images'::text));



  create policy "Allow upload to otomi-element-images"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'otomi-element-images'::text));



