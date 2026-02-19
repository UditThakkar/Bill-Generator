import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { BILL_PREFIX, COMPANY_INFO } from "../constants/config";
import { getPDFStyles } from "../styles/pdf.styles";
import { BillItem } from "./calculations";

export const generatePDF = async (
  items: BillItem[],
  customerName: string,
  grandTotal: number,
  totalGST: number,
  gstIncluded: boolean,
  showGstNumber: boolean
) => {
  if (items.length === 0) return;

  const today = new Date().toLocaleDateString("en-IN");
  const billNumber = `${BILL_PREFIX}${Date.now().toString().slice(-6)}`;

  const rows = items
    .map(
      (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.itemName}</td>
          <td>${item.vehicleBrand || "-"}</td>
          <td align="center">${item.quantity}</td>
          <td align="right">Rs. ${item.listPrice.toFixed(2)}</td>
          <td align="center">${item.discountPercent}%</td>
          <td align="right">Rs. ${item.net.toFixed(2)}</td>
          <td align="right">Rs. ${item.amount.toFixed(2)}</td>
        </tr>
      `
    )
    .join("");

  const gstSummaryRow = gstIncluded
    ? ""
    : `
      <div class="summary-row">
        <span class="label">GST (18%):</span>
        <span class="amount">Rs. ${totalGST.toFixed(2)}</span>
      </div>
    `;

  const gstNumberRow = showGstNumber ? `<p>GSTIN: ${COMPANY_INFO.gstin}</p>` : "";

  const html = `
<html>
<head>
<meta charset="UTF-8" />
<style>
${getPDFStyles()}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="header-top">
      <div class="company-info">
        <h1>${COMPANY_INFO.nameHindi}</h1>
        <h1 style="font-size: 20px; color: #1F2937;">${COMPANY_INFO.nameEnglish}</h1>
        <p style="margin-top: 10px;">Address: ${COMPANY_INFO.address}</p>
        <p>Phone: +91 ${COMPANY_INFO.phone}</p>
        <p>Owner: ${COMPANY_INFO.owner}</p>
        ${gstNumberRow}
      </div>
      <div class="bill-header">
        <h2>INVOICE</h2>
        <div class="bill-details">
          <p><span class="bill-number">Bill #${billNumber}</span></p>
          <p>Date: ${today}</p>
        </div>
      </div>
    </div>
  </div>

  <div class="customer-section">
    <div class="customer-info">
      <h3>Bill To</h3>
      <p>${customerName || "N/A"}</p>
    </div>
    <div class="customer-info">
      <h3>Invoice Date</h3>
      <p>${today}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>SL</th>
        <th>Item Name</th>
        <th>Vehicle Brand</th>
        <th>Qty</th>
        <th>List Price</th>
        <th>Discount</th>
        <th>Net Price</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div class="summary">
    <div class="summary-box">
      <div class="summary-row">
        <span class="label">Subtotal:</span>
        <span class="amount">Rs. ${grandTotal.toFixed(2)}</span>
      </div>
      ${gstSummaryRow}
      <div class="summary-row total">
        <span class="label">GRAND TOTAL:</span>
        <span>Rs. ${(grandTotal + totalGST).toFixed(2)}</span>
      </div>
      <div style="font-size: 12px; color: #999; margin-top: 12px; text-align: center; font-weight: 500;">
        ${gstIncluded ? "(GST @18% included in Price)" : "(GST @18% calculated separately)"}
      </div>
    </div>
  </div>

  <div class="thank-you">
    Thank you for your business.
  </div>

  <div class="footer">
    <p>This is an electronically generated invoice.</p>
  </div>
</div>
</body>
</html>
  `;

  const { uri } = await Print.printToFileAsync({ html });

  const pdfName = `Bill_${Date.now()}.pdf`;
  const destination = new FileSystem.File(FileSystem.Paths.document, pdfName);

  const tempFile = new FileSystem.File(uri);
  await tempFile.move(destination);

  await Sharing.shareAsync(destination.uri);
};
