CREATE TABLE "users" (
    "id" integer PRIMARY KEY,
    "lastname" varchar(45),
    "firstname" varchar(30),
    "email" varchar(255) UNIQUE ,
    "password" varchar(128),
    "permission_id" integer NOT NULL,
    "is_active" boolean DEFAULT False,
    "group_id" integer
);

CREATE TABLE "permissions" (
  "id" serial PRIMARY KEY,
  "description" varchar(255) NOT NULL UNIQUE
);

CREATE TABLE "groups" (
  "id" serial PRIMARY KEY,
  "description" varchar(255) UNIQUE
);

CREATE TABLE "tests" (
  "id" serial PRIMARY KEY,
  "user_id" integer NOT NULL,
  "date" timestamp DEFAULT now(),
  "is_rating" boolean default False,
   "finish_until" timestamp,
   "send_at" timestamp
);

CREATE TABLE "tasks" (
  "id" serial PRIMARY KEY,
  "test_id" integer NOT NULL,
  "task_type" integer NOT NULL,
  "condition" jsonb NOT NULL,
  "solution" jsonb NOT NULL,
  "student_solution" jsonb,
  "solved" boolean default False,
  "weight" integer default 1
);

CREATE TABLE "task_types" (
  "id" serial PRIMARY KEY,
  "description" varchar(255) UNIQUE
);

CREATE TABLE "marks" (
  "user_id" integer NOT NULL,
  "test_id" integer NOT NULL,
  "mark" integer NOT NULL,
  comment varchar(255)
);

CREATE TABLE "presentation" (
  "id" serial PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "access" integer[]
);

CREATE TABLE "presentation_slide" (
  "presentation_id" integer NOT NULL,
  "index" integer NOT NULL,
  "image_src" varchar(255) NOT NULL,
  "audio_src" varchar(255) NOT NULL,
  "name" varchar(255) NOT NULL

);


ALTER TABLE "users" ADD FOREIGN KEY ("permission_id") REFERENCES "permissions" ON DELETE SET DEFAULT;
ALTER TABLE "users" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ON DELETE SET DEFAULT;
ALTER TABLE "tasks" ADD FOREIGN KEY ("task_type") REFERENCES "task_types" ON DELETE SET DEFAULT;
ALTER TABLE "tasks" ADD FOREIGN KEY ("test_id") REFERENCES "tests" ON DELETE SET DEFAULT;
ALTER TABLE "marks" ADD FOREIGN KEY ("user_id") REFERENCES "users" ON DELETE SET DEFAULT;
ALTER TABLE "marks" ADD FOREIGN KEY ("test_id") REFERENCES "tests" ON DELETE SET DEFAULT;
ALTER TABLE "presentation_slide" ADD FOREIGN KEY ("presentation_id") REFERENCES "presentation" ON DELETE SET DEFAULT;