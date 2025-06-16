#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");
const minimist = require("minimist");
const slugify = require("slugify");

// Parse arguments
const args = minimist(process.argv.slice(2));
const appName = slugify(args._[0], { lower: true }); // first positional argument

if (!appName) {
  console.error("❌ Please provide a project name");
  process.exit(1);
}

const template = args.template || "react-swc-ts-tw";

console.log("🛠 Generating project with options:");
console.log({ appName, template });

// Load template path conditionally
const templatePath = path.join(__dirname, "templates", template);

const root = path.join(process.cwd(), appName);
fs.copySync(templatePath, `${root}/apps`);
const pkgJsonPath = path.join(root, "apps", appName, "package.json");
if (!fs.existsSync(pkgJsonPath)) {
  console.error(
    `❌ Template "${template}" does not contain a valid package.json`
  );
  process.exit(1);
}
const pkg = fs.readJsonSync(pkgJsonPath);
pkg.name = appName;
pkg.version = "0.1.0";
fs.writeJsonSync(pkgJsonPath, pkg, { spaces: 2 });

console.log(`✅ Project "${appName}" created.`);
