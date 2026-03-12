import React from "react";
import { X, Download, Printer } from "lucide-react";

const QuotationPreview = ({ formData, onClose }) => {

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return "₹" + Number(amount).toLocaleString("en-IN");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 p-6">

      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center border-b p-6 bg-slate-50">

          <div>
            <h2 className="text-xl font-bold">
              Quotation Preview
            </h2>

            <p className="text-xs text-slate-500">
              {formData.quotationNumber}
            </p>
          </div>

          <div className="flex gap-2">

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
            >
              <Printer size={16} />
              Print
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-2"
            >
              <Download size={16} />
              Download
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-lg"
            >
              <X size={18} />
            </button>

          </div>

        </div>


        {/* Preview Content */}
        <div className="p-10 space-y-8 overflow-y-auto max-h-[80vh]">

          {/* Company Header */}
          <div className="flex justify-between items-start">

            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Veera Enterprises
              </h1>

              <p className="text-sm text-slate-500">
                Water Treatment & Purification Solutions
              </p>
            </div>

            <div className="text-right text-sm">

              <p>
                <span className="font-bold">Quotation No:</span>{" "}
                {formData.quotationNumber}
              </p>

              <p>
                <span className="font-bold">Date:</span>{" "}
                {formData.date}
              </p>

              <p>
                <span className="font-bold">Valid Until:</span>{" "}
                {formData.validUntil}
              </p>

            </div>

          </div>


          {/* Client Info */}
          <div className="border rounded-xl p-6 bg-slate-50">

            <h3 className="font-bold mb-3">
              Client Details
            </h3>

            <p className="font-bold">
              {formData.client}
            </p>

            <p className="text-sm text-slate-600">
              {formData.clientAddress}
            </p>

            <p className="text-sm text-slate-600">
              {formData.clientEmail}
            </p>

            <p className="text-sm text-slate-600">
              {formData.clientPhone}
            </p>

          </div>


          {/* Product */}
          <div>

            <h3 className="font-bold mb-2">
              Product
            </h3>

            <p className="text-slate-700">
              {formData.product}
            </p>

          </div>


          {/* Cost Breakdown */}
          <div>

            <h3 className="font-bold mb-4">
              Cost Breakdown
            </h3>

            <div className="overflow-x-auto">

              <table className="w-full border">

                <thead className="bg-slate-100 text-sm">

                  <tr>
                    <th className="p-3 border">Sr</th>
                    <th className="p-3 border">Area</th>
                    <th className="p-3 border">Scope</th>
                    <th className="p-3 border">Qty</th>
                    <th className="p-3 border">Amount</th>
                  </tr>

                </thead>

                <tbody>

                  {formData.costBreakdown.map((item) => (

                    <tr key={item.srNo} className="text-sm">

                      <td className="p-3 border">
                        {item.srNo}
                      </td>

                      <td className="p-3 border">
                        {item.area}
                      </td>

                      <td className="p-3 border">
                        {item.scope}
                      </td>

                      <td className="p-3 border">
                        {item.Qty}
                      </td>

                      <td className="p-3 border">
                        {formatCurrency(item.amount)}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>


          {/* Total */}
          <div className="flex justify-end">

            <div className="text-right">

              <p className="text-lg font-bold">
                Total: {formatCurrency(formData.totalCost)}
              </p>

            </div>

          </div>


          {/* Terms */}
          <div>

            <h3 className="font-bold mb-3">
              Terms & Conditions
            </h3>

            <ul className="list-disc ml-6 text-sm text-slate-600 space-y-1">

              <li>{formData.terms.pricingModel}</li>
              <li>{formData.terms.paymentMilestones}</li>
              <li>{formData.terms.taxes}</li>
              <li>{formData.terms.changeRequests}</li>

            </ul>

          </div>


          {/* Signature */}
          <div className="flex justify-between pt-10">

            <div>
              <p className="font-bold">
                Project Manager
              </p>

              <p className="text-sm text-slate-600">
                {formData.projectManager}
              </p>
            </div>

            <div>
              <p className="font-bold">
                Operations Manager
              </p>

              <p className="text-sm text-slate-600">
                {formData.operationManager}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default QuotationPreview;
