import { describe, it, expect } from "vitest";
import { getUnsplashImage, CHURCH_IMAGES, IMAGE_SIZES } from "@/lib/images";

describe("getUnsplashImage", () => {
  it("generates correct Unsplash URL", () => {
    const url = getUnsplashImage("abc123", 800, 600, 80);
    expect(url).toBe(
      "https://images.unsplash.com/photo-abc123?w=800&h=600&fit=crop&auto=format&q=80"
    );
  });

  it("uses default quality of 80", () => {
    const url = getUnsplashImage("abc123", 400, 300);
    expect(url).toContain("q=80");
  });

  it("accepts custom quality", () => {
    const url = getUnsplashImage("abc123", 400, 300, 90);
    expect(url).toContain("q=90");
  });
});

describe("CHURCH_IMAGES", () => {
  it("has hero church building image", () => {
    expect(CHURCH_IMAGES.hero.churchBuilding).toBeDefined();
    expect(CHURCH_IMAGES.hero.churchBuilding).toContain("/images/logos/current-church.png");
  });

  it("has congregation images", () => {
    expect(CHURCH_IMAGES.congregation.main).toBeDefined();
    expect(CHURCH_IMAGES.congregation.worship).toBeDefined();
  });

  it("has ministry images", () => {
    expect(CHURCH_IMAGES.ministries.youth.main).toBeDefined();
    expect(CHURCH_IMAGES.ministries.womens.main).toBeDefined();
    expect(CHURCH_IMAGES.ministries.mens.main).toBeDefined();
    expect(CHURCH_IMAGES.ministries.music.main).toBeDefined();
    expect(CHURCH_IMAGES.ministries.community.main).toBeDefined();
    expect(CHURCH_IMAGES.ministries.pathfinders.main).toBeDefined();
  });

  it("has history images", () => {
    expect(CHURCH_IMAGES.history.vintage).toBeDefined();
    expect(CHURCH_IMAGES.history.oldSite).toHaveLength(9);
  });

  it("has placeholder image", () => {
    expect(CHURCH_IMAGES.placeholder.sermon).toBeDefined();
  });
});

describe("IMAGE_SIZES", () => {
  it("defines thumbnail size", () => {
    expect(IMAGE_SIZES.thumbnail).toEqual({ width: 400, height: 300 });
  });

  it("defines card size", () => {
    expect(IMAGE_SIZES.card).toEqual({ width: 600, height: 400 });
  });

  it("defines hero size", () => {
    expect(IMAGE_SIZES.hero).toEqual({ width: 1920, height: 1080 });
  });

  it("defines video size", () => {
    expect(IMAGE_SIZES.video).toEqual({ width: 640, height: 360 });
  });
});
