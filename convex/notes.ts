import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    subject: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return [];
    }

    let notes = await ctx.db
      .query("notes")
      .withIndex("by_user_updated", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    if (args.subject && args.subject.trim().length > 0) {
      const subject = args.subject.trim().toLowerCase();
      notes = notes.filter((n) => n.subject.toLowerCase() === subject);
    }

    if (args.search && args.search.trim().length > 0) {
      const needle = args.search.trim().toLowerCase();
      notes = notes.filter(
        (n) =>
          n.title.toLowerCase().includes(needle) ||
          n.transcript.toLowerCase().includes(needle) ||
          n.subject.toLowerCase().includes(needle),
      );
    }

    return notes;
  },
});

export const get = query({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const note = await ctx.db.get(args.id);
    if (!note || note.userId !== userId) {
      return null;
    }
    return note;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    subject: v.string(),
    transcript: v.string(),
    durationSec: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    const now = Date.now();
    return await ctx.db.insert("notes", {
      userId,
      title: args.title.trim() || "Untitled note",
      subject: args.subject.trim() || "General",
      transcript: args.transcript,
      durationSec: Math.max(0, Math.round(args.durationSec)),
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("notes"),
    title: v.optional(v.string()),
    subject: v.optional(v.string()),
    transcript: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    const note = await ctx.db.get(args.id);
    if (!note || note.userId !== userId) {
      throw new Error("Note not found");
    }

    const patch: {
      title?: string;
      subject?: string;
      transcript?: string;
      updatedAt: number;
    } = { updatedAt: Date.now() };

    if (args.title !== undefined) {
      patch.title = args.title.trim() || "Untitled note";
    }
    if (args.subject !== undefined) {
      patch.subject = args.subject.trim() || "General";
    }
    if (args.transcript !== undefined) {
      patch.transcript = args.transcript;
    }

    await ctx.db.patch(args.id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    const note = await ctx.db.get(args.id);
    if (!note || note.userId !== userId) {
      throw new Error("Note not found");
    }
    await ctx.db.delete(args.id);
  },
});
