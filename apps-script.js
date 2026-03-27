// =============================================
// SUPALEDGERS WAITLIST — Google Apps Script
// =============================================
// 1. Go to https://sheets.new to create a new Google Sheet
// 2. Name it "SupaLedgers Waitlist"
// 3. In Row 1, add these headers:
//    Timestamp | First Name | Last Name | Email | Phone | Company | Team Size | Industry | Current Tools | Pain Points
// 4. Go to Extensions > Apps Script
// 5. Paste this entire code, replacing the default code
// 6. Update the EMAIL_TO variable below with your email
// 7. Click Deploy > New deployment > Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 8. Copy the deployment URL and give it to me
// =============================================

const EMAIL_TO = "teams@fieldelevate.com";
const SHEET_NAME = "Sheet1"; // or whatever your sheet tab is named

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Write to Google Sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    sheet.appendRow([
      new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
      data.firstName || "",
      data.lastName || "",
      data.email || "",
      data.phone || "",
      data.company || "",
      data.size || "",
      data.industry || "",
      data.currentTools || "",
      data.painPoints || ""
    ]);
    
    // Send email notification
    const subject = `🚀 New SupaLedgers Waitlist Signup: ${data.firstName} ${data.lastName} (${data.company})`;
    const body = `
New waitlist signup!

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Company: ${data.company}
Team Size: ${data.size || "Not specified"}
Industry: ${data.industry || "Not specified"}
Current Tools: ${data.currentTools || "Not provided"}
Biggest Pain Point: ${data.painPoints || "Not provided"}

---
Submitted: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}
    `.trim();
    
    MailApp.sendEmail({
      to: EMAIL_TO,
      subject: subject,
      body: body
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "SupaLedgers Waitlist API is running" }))
    .setMimeType(ContentService.MimeType.JSON);
}
