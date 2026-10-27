CREATE TABLE "problems" (
	"id" serial PRIMARY KEY,
	"leetcode_id" integer NOT NULL UNIQUE,
	"title" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"difficulty" varchar(10) NOT NULL,
	"content_html" text NOT NULL,
	"params" jsonb NOT NULL,
	"test_cases" jsonb NOT NULL,
	"hints" jsonb NOT NULL,
	"snippets" jsonb NOT NULL,
	"tags" jsonb NOT NULL
);
