const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const sizes = [72, 96, 128, 144, 152, 192, 384];
const source = path.join(__dirname, "../public/icons/icon-512.png");
const outDir = path.join(__dirname, "../public/icons");

async function generate() {
  console.log("Generando íconos PWA...");
  for (const size of sizes) {
    const out = path.join(outDir, `icon-${size}.png`);
    await sharp(source).resize(size, size).toFile(out);
    console.log(`✅ icon-${size}.png`);
  }

  // Apple icon 180x180
  await sharp(source)
    .resize(180, 180)
    .toFile(path.join(outDir, "apple-icon.png"));
  console.log("✅ apple-icon.png");

  // Favicon 32x32
  await sharp(source)
    .resize(32, 32)
    .toFile(path.join(outDir, "icon-32.png"));
  console.log("✅ icon-32.png");

  console.log("\n🎉 Todos los íconos generados!");
}

generate().catch(console.error);
