export const getPDFStyles = () => `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    color: #333;
    line-height: 1.8;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 50px 40px;
  }

  .header {
    border-bottom: 3px solid #2563EB;
    padding-bottom: 20px;
    margin-bottom: 30px;
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 15px;
  }

  .company-info h1 {
    font-size: 32px;
    color: #2563EB;
    margin-bottom: 8px;
    font-weight: bold;
  }

  .company-info p {
    font-size: 14px;
    color: #666;
    margin: 4px 0;
    font-weight: 500;
  }

  .bill-header {
    text-align: right;
  }

  .bill-header h2 {
    font-size: 24px;
    color: #1F2937;
    margin-bottom: 10px;
    font-weight: bold;
  }

  .bill-details {
    font-size: 13px;
    color: #666;
    font-weight: 500;
  }

  .bill-details p {
    margin: 4px 0;
  }

  .bill-number {
    font-weight: bold;
    color: #2563EB;
  }

  .customer-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    padding: 20px;
    background: #F9FAFB;
    border-radius: 8px;
  }

  .customer-info {
    flex: 1;
  }

  .customer-info h3 {
    font-size: 14px;
    color: #666;
    text-transform: uppercase;
    margin-bottom: 6px;
    font-weight: 700;
  }

  .customer-info p {
    font-size: 15px;
    color: #1F2937;
    margin: 5px 0;
    font-weight: 600;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }

  thead {
    background: #2563EB;
  }

  th {
    color: white;
    padding: 14px;
    text-align: left;
    font-size: 14px;
    font-weight: 700;
  }

  td {
    padding: 14px;
    border-bottom: 1px solid #E5E7EB;
    font-size: 14px;
    font-weight: 500;
  }

  tbody tr:hover {
    background: #F9FAFB;
  }

  .summary {
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
  }

  .summary-box {
    width: 280px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #E5E7EB;
    font-size: 14px;
  }

  .summary-row.total {
    border-bottom: 3px solid #2563EB;
    border-top: 2px solid #2563EB;
    padding: 18px 0;
    font-size: 18px;
    font-weight: bold;
    color: #2563EB;
  }

  .label {
    color: #666;
    font-weight: 600;
  }

  .amount {
    color: #1F2937;
    font-weight: 700;
  }

  .footer {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #E5E7EB;
    text-align: center;
    font-size: 12px;
    color: #999;
    font-weight: 500;
  }

  .thank-you {
    text-align: center;
    margin-top: 30px;
    font-size: 14px;
    color: #666;
    font-weight: 600;
  }
`;
