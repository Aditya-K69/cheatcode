// src/controllers/problems.ts
import type { Request, Response, NextFunction } from "express";
import { db } from "../utils/db.js";
import { problems } from "../db/schema.js";
import { sql, asc } from "drizzle-orm";
import { AppError } from "../utils/errors.js";

export const getProblems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. Validate pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    if (isNaN(page) || page < 1) {
      throw new AppError(400, "Page must be a positive number");
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      throw new AppError(400, "Limit must be between 1 and 100");
    }

    const offset = (page - 1) * limit;

    // 2. Fetch data and total count concurrently
    const [data, totalCountResult] = await Promise.all([
      db
        .select({
          id: problems.id,
          leetcodeId: problems.leetcodeId,
          title: problems.title,
          slug: problems.slug,
          difficulty: problems.difficulty,
          tags: problems.tags,
        })
        .from(problems)
        .orderBy(asc(problems.leetcodeId))
        .limit(limit)
        .offset(offset),

      db.select({ count: sql<number>`count(*)` }).from(problems),
    ]);

    const total = Number(totalCountResult[0].count);
    const totalPages = Math.ceil(total / limit);

    // 3. Check if the requested page is out of bounds
    // We only throw an error if the database actually has problems,
    // but the requested page exceeds the total pages available.
    if (total > 0 && page > totalPages) {
      throw new AppError(
        404,
        `Page ${page} does not exist. Maximum page is ${totalPages}.`,
      );
    }

    // 4. Format and return
    res.json({
      success: true,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};
