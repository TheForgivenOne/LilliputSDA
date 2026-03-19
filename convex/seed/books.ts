/**
 * Seed script for books
 * 
 * Usage:
 *   npx convex run seed:seedBooks
 */

import { mutation } from "../_generated/server";

export const seedBooks = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("books").first();
    if (existing) {
      console.log("Books already seeded, skipping...");
      return;
    }

    const booksData = [
      { id: 1, abbrev: "ge", name: "Genesis", numChapters: 50 },
      { id: 2, abbrev: "ex", name: "Exodus", numChapters: 40 },
      { id: 3, abbrev: "le", name: "Leviticus", numChapters: 27 },
      { id: 4, abbrev: "nu", name: "Numbers", numChapters: 36 },
      { id: 5, abbrev: "de", name: "Deuteronomy", numChapters: 34 },
      { id: 6, abbrev: "jos", name: "Joshua", numChapters: 24 },
      { id: 7, abbrev: "jud", name: "Judges", numChapters: 21 },
      { id: 8, abbrev: "ru", name: "Ruth", numChapters: 4 },
      { id: 9, abbrev: "1sa", name: "1 Samuel", numChapters: 31 },
      { id: 10, abbrev: "2sa", name: "2 Samuel", numChapters: 24 },
      { id: 11, abbrev: "1ki", name: "1 Kings", numChapters: 22 },
      { id: 12, abbrev: "2ki", name: "2 Kings", numChapters: 25 },
      { id: 13, abbrev: "1ch", name: "1 Chronicles", numChapters: 29 },
      { id: 14, abbrev: "2ch", name: "2 Chronicles", numChapters: 36 },
      { id: 15, abbrev: "ezr", name: "Ezra", numChapters: 10 },
      { id: 16, abbrev: "ne", name: "Nehemiah", numChapters: 13 },
      { id: 17, abbrev: "et", name: "Esther", numChapters: 10 },
      { id: 18, abbrev: "job", name: "Job", numChapters: 42 },
      { id: 19, abbrev: "ps", name: "Psalms", numChapters: 150 },
      { id: 20, abbrev: "pr", name: "Proverbs", numChapters: 31 },
      { id: 21, abbrev: "ec", name: "Ecclesiastes", numChapters: 12 },
      { id: 22, abbrev: "so", name: "Song of Solomon", numChapters: 8 },
      { id: 23, abbrev: "isa", name: "Isaiah", numChapters: 66 },
      { id: 24, abbrev: "jer", name: "Jeremiah", numChapters: 52 },
      { id: 25, abbrev: "la", name: "Lamentations", numChapters: 5 },
      { id: 26, abbrev: "eze", name: "Ezekiel", numChapters: 48 },
      { id: 27, abbrev: "da", name: "Daniel", numChapters: 12 },
      { id: 28, abbrev: "ho", name: "Hosea", numChapters: 14 },
      { id: 29, abbrev: "jo", name: "Joel", numChapters: 3 },
      { id: 30, abbrev: "am", name: "Amos", numChapters: 9 },
      { id: 31, abbrev: "ob", name: "Obadiah", numChapters: 1 },
      { id: 32, abbrev: "jon", name: "Jonah", numChapters: 4 },
      { id: 33, abbrev: "mic", name: "Micah", numChapters: 7 },
      { id: 34, abbrev: "na", name: "Nahum", numChapters: 3 },
      { id: 35, abbrev: "hab", name: "Habakkuk", numChapters: 3 },
      { id: 36, abbrev: "zep", name: "Zephaniah", numChapters: 3 },
      { id: 37, abbrev: "hag", name: "Haggai", numChapters: 2 },
      { id: 38, abbrev: "zec", name: "Zechariah", numChapters: 14 },
      { id: 39, abbrev: "mal", name: "Malachi", numChapters: 4 },
      { id: 40, abbrev: "mt", name: "Matthew", numChapters: 28 },
      { id: 41, abbrev: "mr", name: "Mark", numChapters: 16 },
      { id: 42, abbrev: "lu", name: "Luke", numChapters: 24 },
      { id: 43, abbrev: "joh", name: "John", numChapters: 21 },
      { id: 44, abbrev: "ac", name: "Acts", numChapters: 28 },
      { id: 45, abbrev: "ro", name: "Romans", numChapters: 16 },
      { id: 46, abbrev: "1co", name: "1 Corinthians", numChapters: 16 },
      { id: 47, abbrev: "2co", name: "2 Corinthians", numChapters: 13 },
      { id: 48, abbrev: "ga", name: "Galatians", numChapters: 6 },
      { id: 49, abbrev: "eph", name: "Ephesians", numChapters: 6 },
      { id: 50, abbrev: "php", name: "Philippians", numChapters: 4 },
      { id: 51, abbrev: "col", name: "Colossians", numChapters: 4 },
      { id: 52, abbrev: "1th", name: "1 Thessalonians", numChapters: 5 },
      { id: 53, abbrev: "2th", name: "2 Thessalonians", numChapters: 3 },
      { id: 54, abbrev: "1ti", name: "1 Timothy", numChapters: 6 },
      { id: 55, abbrev: "2ti", name: "2 Timothy", numChapters: 4 },
      { id: 56, abbrev: "tit", name: "Titus", numChapters: 3 },
      { id: 57, abbrev: "phm", name: "Philemon", numChapters: 1 },
      { id: 58, abbrev: "heb", name: "Hebrews", numChapters: 13 },
      { id: 59, abbrev: "jas", name: "James", numChapters: 5 },
      { id: 60, abbrev: "1pe", name: "1 Peter", numChapters: 5 },
      { id: 61, abbrev: "2pe", name: "2 Peter", numChapters: 3 },
      { id: 62, abbrev: "1jo", name: "1 John", numChapters: 5 },
      { id: 63, abbrev: "2jo", name: "2 John", numChapters: 1 },
      { id: 64, abbrev: "3jo", name: "3 John", numChapters: 1 },
      { id: 65, abbrev: "jude", name: "Jude", numChapters: 1 },
      { id: 66, abbrev: "re", name: "Revelation", numChapters: 22 },
    ];

    console.log("Seeding books...");

    for (const book of booksData) {
      await ctx.db.insert("books", {
        order: book.id,
        abbreviation: book.abbrev,
        name: book.name,
        chapterCount: book.numChapters,
      });
    }

    console.log(`Seeded ${booksData.length} books`);
  },
});
