const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
const path = require("node:path");
const fs = require("node:fs");
const { chromium } = require("playwright");

const projectRoot = path.resolve(__dirname, "..");
const portfolioUrl = pathToFileURL(path.join(projectRoot, "index.html")).href;
const edgeCandidates = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
];

let browser;

before(async () => {
  const executablePath = edgeCandidates.find((candidate) => fs.existsSync(candidate));
  browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
    args: ["--disable-crash-reporter", "--no-first-run"],
  });
});

after(async () => {
  await browser?.close();
});

async function openPortfolio(viewport = { width: 1440, height: 1000 }) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  await page.route("https://fonts.googleapis.com/**", (route) =>
    route.fulfill({ status: 200, contentType: "text/css", body: "" }),
  );
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(portfolioUrl, { waitUntil: "networkidle" });
  return { page, errors };
}

test("the curated portfolio keeps the seven professional projects and excludes academic cards", async () => {
  const { page } = await openPortfolio();
  const projectIds = await page.locator(".project-card").evaluateAll((cards) =>
    cards.map((card) => card.dataset.id),
  );

  assert.deepEqual(projectIds, [
    "howeya-seo-ai",
    "influencer-classifier",
    "meeting-assistant",
    "voltiq",
    "yaqiz",
    "digital-employee",
    "ergoai",
  ]);
  assert.equal(await page.getByRole("button", { name: "Machine Learning" }).count(), 0);
  await page.close();
});

test("a project case study opens from the keyboard and restores focus when closed", async () => {
  const { page } = await openPortfolio();
  const firstProject = page.locator(".project-card").first();
  await firstProject.focus();
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog");
  await assert.doesNotReject(() => dialog.waitFor({ state: "visible", timeout: 2000 }));
  assert.equal(await dialog.getAttribute("aria-modal"), "true");
  assert.equal(await dialog.getAttribute("aria-hidden"), "false");
  assert.equal(await page.evaluate(() => document.activeElement?.id), "modal-close");
  assert.equal(await page.locator("header").getAttribute("inert"), "");
  assert.equal(await page.locator("main").getAttribute("inert"), "");
  assert.equal(await page.locator("footer").getAttribute("inert"), "");

  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#project-modal").getAttribute("aria-hidden"), "true");
  assert.equal(await page.locator("header").getAttribute("inert"), null);
  assert.equal(await page.locator("main").getAttribute("inert"), null);
  assert.equal(await page.locator("footer").getAttribute("inert"), null);
  assert.equal(
    await page.evaluate(() => document.activeElement?.classList.contains("project-card")),
    true,
  );
  await page.close();
});

test("mobile navigation exposes and updates its expanded state", async () => {
  const { page } = await openPortfolio({ width: 390, height: 844 });
  const toggle = page.getByRole("button", { name: "Toggle navigation menu" });

  assert.equal(await toggle.getAttribute("aria-expanded"), "false");
  await toggle.click();
  assert.equal(await toggle.getAttribute("aria-expanded"), "true");
  await page.getByRole("link", { name: "Projects", exact: true }).click();
  assert.equal(await toggle.getAttribute("aria-expanded"), "false");
  await page.close();
});

test("the resume button opens the current self-hosted CV", async () => {
  const { page } = await openPortfolio();
  const resumeLink = page.getByRole("link", { name: "View Resume" });

  assert.equal(await resumeLink.getAttribute("href"), "Ahmed_Eldemery.pdf");
  assert.equal(fs.existsSync(path.join(projectRoot, "Ahmed_Eldemery.pdf")), true);
  assert.equal(await resumeLink.getAttribute("rel"), "noopener noreferrer");
  await page.close();
});

test("the DEPI Microsoft Machine Learning Engineer certificate is listed and viewable", async () => {
  const { page } = await openPortfolio();
  const certificate = page.getByRole("link", { name: "View DEPI certificate" });

  assert.equal(await certificate.getAttribute("href"), "depi-microsoft-machine-learning-engineer-certificate.pdf");
  assert.equal(
    fs.existsSync(path.join(projectRoot, "depi-microsoft-machine-learning-engineer-certificate.pdf")),
    true,
  );
  const certificatePanel = certificate.locator("xpath=ancestor::div[contains(@class, 'glass-panel')][1]");
  assert.equal(
    await certificatePanel.getByRole("heading", { name: "Certifications & Education" }).count(),
    1,
  );
  assert.match(
    await certificate.locator("xpath=ancestor::*[contains(@class, 'honor-item')][1]").innerText(),
    /Digital Egypt Pioneers Program.*Microsoft Machine Learning Engineer.*November 2025.*July 2026/s,
  );
  await page.close();
});

test("rapid project filter changes cannot leave stale hidden cards", async () => {
  const { page } = await openPortfolio();
  await page.getByRole("button", { name: "Computer Vision" }).click();
  await page.getByRole("button", { name: "All Projects" }).click();
  await page.waitForTimeout(350);

  assert.equal(await page.locator(".project-card.hidden").count(), 0);
  assert.equal(await page.locator('.project-card[aria-hidden="false"]').count(), 7);
  await page.close();
});

test("project imagery is optimized and motion respects the user preference", async () => {
  const { page, errors } = await openPortfolio();
  const images = await page.locator(".project-img").evaluateAll((elements) =>
    elements.map((image) => ({
      src: image.getAttribute("src"),
      loading: image.getAttribute("loading"),
      decoding: image.getAttribute("decoding"),
    })),
  );

  assert.ok(images.every((image) => image.src.endsWith(".webp")));
  assert.ok(images.every((image) => image.loading === "lazy"));
  assert.ok(images.every((image) => image.decoding === "async"));
  assert.deepEqual(errors, []);

  await page.emulateMedia({ reducedMotion: "reduce" });
  const motion = await page.locator(".avatar-wrapper").evaluate((element) => {
    const styles = getComputedStyle(element);
    return { animationName: styles.animationName, transitionDuration: styles.transitionDuration };
  });
  assert.equal(motion.animationName, "none");
  assert.equal(motion.transitionDuration, "0s");
  await page.close();
});
