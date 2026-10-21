import { exportJWK, exportPKCS8, generateKeyPair } from "jose";

const keys = await generateKeyPair("RS256", { extractable: true });
const privateKey = await exportPKCS8(keys.privateKey);
const publicKey = await exportJWK(keys.publicKey);
const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });

console.log(
  `JWT_PRIVATE_KEY=${JSON.stringify(privateKey.trimEnd().replace(/\n/g, " "))}`,
);
console.log(`JWKS=${jwks}`);
console.log("");
console.log(
  "Set these on your Convex deployment (Dashboard → Settings → Environment Variables)",
);
console.log("or: npx convex env set JWT_PRIVATE_KEY '…' / JWKS '…'");
