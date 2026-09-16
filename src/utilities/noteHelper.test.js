import { describe, it, expect } from "vitest";
import { stripHtml } from "./noteHelpers.js";

describe("stripHtml()", () => {
  it("returns undefined when given a falsy input", () => {
    expect(stripHtml("")).toBeUndefined()
    expect(stripHtml(null)).toBeUndefined();
    expect(stripHtml(undefined)).toBeUndefined();
  })

  it("returns a string by removing HTML tags from an input", ()=>{
    const input = "<p>stripping <strong>HTML</strong> tags</p>";

    expect(stripHtml(input)).toBe("stripping HTML tags")
  })
})
