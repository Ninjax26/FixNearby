import { checkPasswordStrength } from '../utils/passwordPolicy.js';

async function runTests() {
  console.log("--- STARTING PASSWORD STRENGTH TESTING ---");
  const weakPassword = "123";
  const mediumPassword = "Password123";
  const strongPassword = "Password123!!";

  if (checkPasswordStrength(weakPassword)) throw new Error("Weak password incorrectly marked strong");
  if (checkPasswordStrength(mediumPassword)) throw new Error("Medium password lacking symbols marked strong");
  if (!checkPasswordStrength(strongPassword)) throw new Error("Strong password incorrectly rejected");

  console.log("SUCCESS: Password security policy verification passed.");
  process.exit(0);
}

runTests().catch(err => {
  console.error("PASSWORD POLICY TESTS FAILED:", err);
  process.exit(1);
});
