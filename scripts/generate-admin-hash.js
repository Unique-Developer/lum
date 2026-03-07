/**
 * Generate ADMIN_PASSWORD_HASH for .env.local
 * Usage: node scripts/generate-admin-hash.js <password>
 */
const bcrypt = require("bcryptjs");
const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/generate-admin-hash.js <password>");
  process.exit(1);
}
bcrypt.hash(password, 12).then((hash) => {
  console.log("Add to .env.local:");
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
});
