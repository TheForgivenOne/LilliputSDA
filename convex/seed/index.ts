/**
 * Seed index - run all seeds
 * 
 * Usage:
 *   npx convex run seed:seedAll
 */

import { mutation } from "../_generated/server";

export const seedAll = mutation({
  handler: async (ctx) => {
    // Check if already seeded
    const existingBooks = await ctx.db.query("books").first();
    const existingScriptures = await ctx.db.query("scriptures").first();

    if (existingBooks && existingScriptures) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Seed books
    if (!existingBooks) {
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

      for (const book of booksData) {
        await ctx.db.insert("books", {
          order: book.id,
          abbreviation: book.abbrev,
          name: book.name,
          chapterCount: book.numChapters,
        });
      }
      console.log(`Seeded ${booksData.length} books`);
    } else {
      console.log("Books already seeded, skipping...");
    }

    // Seed scriptures (sample of Genesis 1 for demo)
    if (!existingScriptures) {
      const scripturesData = [
        { o: 1, r: "niv:Genesis:1:0", t: "Genesis 1", h: 1 },
        { o: 2, r: "niv:Genesis:1:0", t: "The Beginning", h: 2 },
        { o: 3, r: "niv:Genesis:1:1", t: "In the beginning God created the heavens and the earth." },
        { o: 4, r: "niv:Genesis:1:2", t: "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters." },
        { o: 5, r: "niv:Genesis:1:3", t: "And God said, \"Let there be light,\" and there was light." },
        { o: 6, r: "niv:Genesis:1:4", t: "God saw that the light was good, and he separated the light from the darkness." },
        { o: 7, r: "niv:Genesis:1:5", t: "God called the light \"day,\" and the darkness he called \"night.\" And there was evening, and there was morning—the first day." },
        { o: 8, r: "niv:Genesis:1:6", t: "And God said, \"Let there be a vault between the waters to separate water from water.\"" },
        { o: 9, r: "niv:Genesis:1:7", t: "So God made the vault and separated the water under the vault from the water above it. And it was so." },
        { o: 10, r: "niv:Genesis:1:8", t: "God called the vault \"sky.\" And there was evening, and there was morning—the second day." },
        { o: 11, r: "niv:Genesis:1:9", t: "And God said, \"Let the water under the sky be gathered to one place, and let dry ground appear.\" And it was so." },
        { o: 12, r: "niv:Genesis:1:10", t: "God called the dry ground \"land,\" and the gathered waters he called \"seas.\" And God saw that it was good." },
        { o: 13, r: "niv:Genesis:1:11", t: "Then God said, \"Let the land produce vegetation: seed-bearing plants and fruit trees, each according to its kind, with seed in it, bearing fruit with seed in it, according to its kind.\" And it was so." },
        { o: 14, r: "niv:Genesis:1:12", t: "The land produced vegetation—plants, each bearing seed according to its kind, and trees, each bearing fruit with seed in it according to its kind. And God saw that it was good." },
        { o: 15, r: "niv:Genesis:1:13", t: "And there was evening, and there was morning—the third day." },
        { o: 16, r: "niv:Genesis:1:14", t: "And God said, \"Let there be lights in the vault of the sky to separate the day from the night, and let them be for signs and for seasons, and for days and years.\"" },
        { o: 17, r: "niv:Genesis:1:15", t: "And let them be lights in the vault of the sky to give light on the earth.\" And it was so." },
        { o: 18, r: "niv:Genesis:1:16", t: "God made two great lights—the greater light to govern the day and the smaller light to govern the night. He also made the stars." },
        { o: 19, r: "niv:Genesis:1:17", t: "God set them in the vault of the sky to give light on the earth," },
        { o: 20, r: "niv:Genesis:1:18", t: "to govern the day and the night, and to separate light from darkness. And God saw that it was good." },
        { o: 21, r: "niv:Genesis:1:19", t: "And there was evening, and there was morning—the fourth day." },
        { o: 22, r: "niv:Genesis:1:20", t: "And God said, \"Let the water teem with living creatures, and let birds fly above the earth across the vault of the sky.\"" },
        { o: 23, r: "niv:Genesis:1:21", t: "So God created the great creatures of the sea and every living thing with which the water teems and that moves about in it, according to their kinds, and every winged bird according to its kind. And God saw that it was good." },
        { o: 24, r: "niv:Genesis:1:22", t: "God blessed them and said, \"Be fruitful and increase in number and fill the water in the seas, and let the birds increase on the earth.\"" },
        { o: 25, r: "niv:Genesis:1:23", t: "And there was evening, and there was morning—the fifth day." },
        { o: 26, r: "niv:Genesis:1:24", t: "And God said, \"Let the land produce living creatures according to their kinds: the livestock, the creatures that move along the ground, and the wild animals, each according to its kind.\" And it was so." },
        { o: 27, r: "niv:Genesis:1:25", t: "God made the wild animals according to their kinds, the livestock according to their kinds, and all the creatures that move along the ground according to their kinds. And God saw that it was good." },
        { o: 28, r: "niv:Genesis:1:26", t: "Then God said, \"Let us make mankind in our image, in our likeness, so that they may rule over the fish in the sea and the birds in the sky, over the livestock and all the wild animals, and over all the creatures that move along the ground.\"" },
        { o: 29, r: "niv:Genesis:1:27", t: "So God created mankind in his own image, in the image of God he created them; male and female he created them." },
        { o: 30, r: "niv:Genesis:1:28", t: "God blessed them and said to them, \"Be fruitful and increase in number; fill the earth and subdue it. Rule over the fish in the sea and the birds in the sky and over every living creature that moves on the ground.\"" },
        { o: 31, r: "niv:Genesis:1:29", t: "Then God said, \"I give you every seed-bearing plant on the face of the whole earth and every tree that has fruit with seed in it. They will be yours for food." },
        { o: 32, r: "niv:Genesis:1:30", t: "And to all the beasts of the earth and all the birds in the sky and all the creatures that move along the ground—everything that has the breath of life in it—I give every green plant for food.\" And it was so." },
        { o: 33, r: "niv:Genesis:1:31", t: "God saw all that he had made, and it was very good. And there was evening, and there was morning—the sixth day." },
      ];

      for (const s of scripturesData) {
        await ctx.db.insert("scriptures", {
          order: s.o,
          reference: s.r,
          text: s.t,
          heading: s.h ? String(s.h) : undefined,
          translation: "niv",
        });
      }
      console.log(`Seeded ${scripturesData.length} scriptures (Genesis 1 sample)`);
    } else {
      console.log("Scriptures already seeded, skipping...");
    }

    console.log("Seed complete!");
  },
});
