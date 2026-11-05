const fs = require("fs");
const head = fs.readFileSync("/tmp/admin_head.js", "utf8").replace(/\s+$/, "");
const tail = fs.readFileSync("/tmp/admin_tail.js", "utf8");
const block = fs.readFileSync("src/routes/products.block.js.txt", "utf8");
fs.writeFileSync("src/routes/admin.routes.js", `${head}\n\n${block}\n${tail}`);
console.log("head lines", head.split("\n").length, "block lines", block.split("\n").length, "tail lines", tail.split("\n").length);
