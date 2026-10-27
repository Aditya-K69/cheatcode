// src/scraper.ts
import { LeetCode } from "leetcode-query";
import { db } from "./db.js";
import { problems } from "../db/schema.js";
import { sql } from "drizzle-orm";

const leetcode = new LeetCode();

// Helper function to pause
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function scrapeAll() {
  try {
    console.log("⏳ Fetching master list of problems from LeetCode...");

    // 1. Fetch all pages of problems
    let allQuestions: any[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const page = await leetcode.problems({ limit, offset });
      allQuestions.push(...page.questions);

      console.log(
        `   Fetched ${allQuestions.length} / ${page.total} problems...`,
      );

      // If we've fetched everything, stop. Otherwise, increase offset.
      if (allQuestions.length >= page.total) {
        hasMore = false;
      } else {
        offset += limit;
        await sleep(500); // Be polite to the API while fetching the list
      }
    }

    // Filter out paid problems
    const freeProblems = allQuestions.filter((q) => !q.isPaidOnly);
    console.log(
      `\n✅ Found ${freeProblems.length} free problems. Starting scrape...\n`,
    );

    // 2. Scrape individual problem details
    let count = 0;
    for (const p of freeProblems) {
      count++;
      console.log(`[${count}/${freeProblems.length}] ⏳ Fetching: ${p.title}`);

      try {
        const prob = await leetcode.problem(p.titleSlug);

        const metaData = prob.metaData
          ? JSON.parse(prob.metaData)
          : { params: [] };
        const rawTestCases = prob.exampleTestcases
          ? prob.exampleTestcases.split("\n")
          : [];
        const numParams = metaData.params.length;

        const testCases = [];
        if (numParams > 0) {
          for (let i = 0; i < rawTestCases.length; i += numParams) {
            testCases.push(rawTestCases.slice(i, i + numParams));
          }
        }

        await db
          .insert(problems)
          .values({
            leetcodeId: parseInt(prob.questionFrontendId),
            title: prob.title,
            slug: prob.titleSlug,
            difficulty: prob.difficulty,
            contentHtml: prob.content,
            params: metaData.params,
            testCases: testCases,
            hints: prob.hints || [],
            snippets: prob.codeSnippets || [],
            tags: prob.topicTags.map((t) => ({ name: t.name, slug: t.slug })),
          })
          .onConflictDoNothing({ target: problems.leetcodeId });

        console.log(
          `[${count}/${freeProblems.length}] ✅ Saved: ${prob.title}`,
        );
      } catch (err: any) {
        console.error(`❌ Failed to scrape ${p.title}:`, err.message);
      }

      await sleep(1200); // 1.2 second delay between problems
    }

    console.log("🎉 Scraping complete!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to run scraper:", error);
    process.exit(1);
  }
}

scrapeAll();
