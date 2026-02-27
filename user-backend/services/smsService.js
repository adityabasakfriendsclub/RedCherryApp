/**
 * services/smsService.js — Red Cherry OTP SMS Service
 *
 * REASONS OTP IS NOT RECEIVED (all handled here):
 *  1. DEV_SKIP_SMS=false + Twilio TRIAL → only verified numbers get SMS
 *  2. Wrong phone format → must be E.164: +91XXXXXXXXXX
 *  3. Wrong TWILIO_PHONE_NUMBER → must be YOUR Twilio number, not personal
 *  4. Credentials not loaded → dotenv must run before require('smsService')
 *  5. Errors swallowed silently → this file logs full Twilio error codes
 */
"use strict";

// ── Startup credential diagnostic ─────────────────────────────────────────────
(function diagnoseCreds() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const tok = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  const skip = process.env.DEV_SKIP_SMS;
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║         SMS SERVICE — CREDENTIAL CHECK           ║");
  console.log("╠══════════════════════════════════════════════════╣");
  console.log(`║  DEV_SKIP_SMS       : ${String(skip).padEnd(26)}║`);
  console.log(
    `║  TWILIO_ACCOUNT_SID : ${sid ? sid.slice(0, 8) + "****          " : "❌ MISSING              "}║`,
  );
  console.log(
    `║  TWILIO_AUTH_TOKEN  : ${tok ? "****" + tok.slice(-4) + "              " : "❌ MISSING              "}║`,
  );
  console.log(
    `║  TWILIO_PHONE_NUMBER: ${from ? from.padEnd(26) : "❌ MISSING              "}║`,
  );
  console.log("╚══════════════════════════════════════════════════╝");
  if (skip === "true") {
    console.log(
      "ℹ️  [SMS] DEV_SKIP_SMS=true → OTP will print in terminal. No SMS sent.",
    );
  } else if (!sid || !tok || !from) {
    console.warn(
      "⚠️  [SMS] Missing Twilio credentials → auto-fallback to terminal OTP.",
    );
  } else {
    console.log(
      "✅ [SMS] Twilio credentials loaded. Live SMS will be attempted.",
    );
    console.log("⚠️  [SMS] TRIAL REMINDER: Only VERIFIED numbers receive SMS.");
    console.log(
      "   Verify at: https://console.twilio.com/us1/develop/phone-numbers/verified",
    );
  }
})();

// ── Twilio lazy singleton ──────────────────────────────────────────────────────
let _client = null;
function getClient() {
  if (!_client)
    _client = require("twilio")(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  return _client;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const getOTPExpiry = () =>
  new Date(
    Date.now() + parseInt(process.env.OTP_EXPIRES_MINUTES || "10", 10) * 60000,
  );

function buildE164(phoneNumber, countryCode) {
  const cleaned = String(phoneNumber).replace(/[\s\-().]/g, "");
  if (cleaned.startsWith("+")) return { valid: true, full: cleaned };
  if (countryCode === "+91" && !/^[6-9]\d{9}$/.test(cleaned))
    return {
      valid: false,
      error: `Invalid Indian mobile: "${cleaned}". Must be 10 digits starting 6-9.`,
    };
  return { valid: true, full: `${countryCode}${cleaned}` };
}

// ── Twilio error code → human fix map ─────────────────────────────────────────
const TWILIO_FIXES = {
  21211: "Invalid 'To' phone number — check country code + digits.",
  21608:
    "Unverified number. Trial accounts can only SMS verified numbers.\n         → Verify: https://console.twilio.com/us1/develop/phone-numbers/verified\n         → Or set DEV_SKIP_SMS=true in .env",
  21614: "Not a valid mobile number (may be landline).",
  21610: "Number has opted out / is blacklisted.",
  21702:
    "Your Twilio account is not enabled for this country. Enable at twilio.com/console.",
  63038: "Daily trial sending limit reached.",
  20003:
    "Auth failed — check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env.",
};

// ── Core sendOTP ───────────────────────────────────────────────────────────────
const sendOTP = async (
  phoneNumber,
  countryCode = "+91",
  otp,
  purpose = "signup",
) => {
  // 1. Validate phone
  const { valid, full, error: valErr } = buildE164(phoneNumber, countryCode);
  if (!valid) {
    console.error(`❌ [SMS] Validation failed: ${valErr}`);
    throw new Error(valErr);
  }

  const minutes = process.env.OTP_EXPIRES_MINUTES || 10;
  const body =
    purpose === "reset"
      ? `Your Red Cherry password-reset OTP is: ${otp}. Valid ${minutes} min. Do not share.`
      : `Your Red Cherry verification OTP is: ${otp}. Valid ${minutes} min. Do not share.`;

  const hasCreds =
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER;

  // 2. DEV / no-credentials mode → print in terminal
  if (process.env.DEV_SKIP_SMS === "true" || !hasCreds) {
    console.log("┌─────────────────────────────────────────────┐");
    console.log(`│  📱 DEV OTP  →  ${full}`);
    console.log(`│  🔑 CODE     →  ${otp}                      │`);
    console.log(`│  📋 PURPOSE  →  ${purpose}                   │`);
    console.log("└─────────────────────────────────────────────┘");
    return { success: true, devMode: true };
  }

  // 3. Send real SMS via Twilio
  try {
    console.log(
      `📡 [SMS] Sending via Twilio: from=${process.env.TWILIO_PHONE_NUMBER} to=${full}`,
    );
    const msg = await getClient().messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: full,
    });
    console.log(
      `✅ [SMS] Sent! SID=${msg.sid} Status=${msg.status} To=${full}`,
    );
    return { success: true, devMode: false, sid: msg.sid };
  } catch (err) {
    const code = err.code || "unknown";
    const fix = TWILIO_FIXES[code] || "";
    console.error("❌ [SMS] Twilio Error ─────────────────────────────");
    console.error(`   Code    : ${code}`);
    console.error(`   Message : ${err.message}`);
    console.error(`   To      : ${full}`);
    if (fix) console.error(`   💡 FIX  : ${fix}`);
    console.log("┌─────────────────────────────────────────────┐");
    console.log(`│  📱 FALLBACK OTP → ${full}`);
    console.log(`│  🔑 CODE         → ${otp}  ← use this      │`);
    console.log("└─────────────────────────────────────────────┘");
    throw new Error(
      TWILIO_FIXES[code] || `SMS failed (Twilio ${code}): ${err.message}`,
    );
  }
};

module.exports = { generateOTP, getOTPExpiry, sendOTP };
