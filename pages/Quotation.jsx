import React, { useState, useEffect } from "react";
import QuotationPreview from "./QuotationPreview";
import { Droplets } from "lucide-react";
// import QuotationPreview from './QuotationPreview';
// import'./Quotation.css';
// import { matchRoutes } from 'react-router-dom';



const CreateQuotation = ({ selectedClient, setCurrentPage }) => {
  
  const [showPreview, setShowPreview] = useState(false);

  const [clients, setClients] = useState([]);

  const [quotations, setQuotations] = useState([]);

   const [showQuotationForm, setShowQuotationForm] = useState(false); 


  const [formData, setFormData] = useState({
    id: null,
    quotationNumber: `QT-${Date.now().toString().slice(-6)}`,
    date: new Date().toLocaleDateString("en-IN"),
    validUntil: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    ).toLocaleDateString("en-IN"),
    product: "",
    client: selectedClient?.name || "",
    clientAddress: "",
    clientEmail: "",
    clientPhone: "",
    preparedBy: "Development Team",
    documentType: "Commercial Quotation",
    version: "1.0",
    currency: "INR",
    totalCost: 0,
    aboutProject: "",
    costBreakdown: [
      { srNo: 1, area: "Architecture & Planning", scope: "", amount: 0,Qty:1 }
      
    ],
    includes: [
      "Complete enterprise-grade web platform",
      "Backend APIs + database",
      "QA testing & production rollout",
    ],
    timeline: [
      {
        phase: "Phase-1 (MVP)",
        duration: "8 Weeks",
        deliverables: "Core 3D editor, drag-drop, materials",
      },
      {
        phase: "Phase-2 (Advanced)",
        duration: "12 Weeks",
        deliverables: "Save/load, user accounts, admin panel",
      },
      {
        phase: "Phase-3 (Premium)",
        duration: "Optional",
        deliverables: "AI layout, pricing, checkout",
      },
    ],
    totalTimeline: "20-24 Weeks",
    terms: {
      pricingModel: "Fixed Price",
      paymentMilestones: "Phase-wise (Mutually agreed)",
      taxes: "GST applicable as per government norms",
      domainServer: "Not included (Charged separately)",
      changeRequests: "Any scope change will be quoted separately",
    },
    projectManager: "Sagar Solanke",
    operationManager: "Bikram Burman",
    projectManagerSignature: null,
    operationManagerSignature: null,
  });
  useEffect(() => {
    if (selectedClient) {
      setFormData((prev) => ({
        ...prev,
        client: selectedClient.name || "",
        clientEmail: selectedClient.email || "",
        clientPhone: selectedClient.phone || "",
        clientAddress: selectedClient.address || "",
      }));
    }
  }, [selectedClient]);

  useEffect(() => {
    const total = calculateTotal();
    setFormData((prev) => ({
      ...prev,
      totalCost: total,
    }));
  }, [formData.costBreakdown]);

  const addCostItem = () => {
    setFormData({
      ...formData,
      costBreakdown: [
        ...formData.costBreakdown,
        {
          srNo: formData.costBreakdown.length + 1,
          area: "",
          scope: "",
          amount: 0,
         Qty: 1
        },
      ],
    });
  };

  const removeCostItem = (index) => {
    const newItems = formData.costBreakdown.filter((_, i) => i !== index);
    // Re-number the items
    const reNumberedItems = newItems.map((item, i) => ({
      ...item,
      srNo: i + 1,
    }));
    setFormData({ ...formData, costBreakdown: reNumberedItems });
  };

  const updateCostItem = (index, field, value) => {
    const newItems = formData.costBreakdown.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setFormData({ ...formData, costBreakdown: newItems });
  };

  const calculateTotal = () => {
    return formData.costBreakdown.reduce((total, item) => {
      // const amount = parseFloat(item.amount);
    return total + item.amount * item.Qty;
    }, 0);
  };
  const formatIndianCurrency = (amount) => {
    if (!amount || amount === 0) return "₹ 0";

    if (amount >= 10000000) {
      return `₹ ${(amount / 10000000).toFixed(2)} Crores`;
    } else if (amount >= 100000) {
      return `₹ ${(amount / 100000).toFixed(2)} Lakhs`;
    } else {
      return `₹ ${amount.toLocaleString("en-IN")}`;
    }
  };

  const saveQuotation = async () => {


    if (!formData.client || !formData.product) {
      alert("Client and Product name required ❗");
      return;
    }

    // 1. Get the Unique EmpId from localStorage
   const currentEmpId = localStorage.getItem("empId") || "1";

    // if (!currentEmpId) {
    //   alert("Session expired. Please login again. ❌");
    //   return;
    // }

    // 2. Prepare the payload with the dynamic fields
const payload = {
  quotationNumber: "Q-" + Date.now(),
  date: new Date(),
  validUntil: new Date(),
  product: formData.product,
  client: formData.client,
  clientAddress: "",
  clientEmail: "",
  clientPhone: "",
  preparedBy: currentEmpId,
  documentType: "Quotation",
  version: "1.0",
  currency: "INR",
  totalCost: formData.totalCost,
  aboutProject: "",
  costBreakdown: formData.costBreakdown,
  includes: [],
  timeline: [],
  totalTimeline: "",
  terms: formData.terms,
  projectManager: "",
  operationManager: "",
};
    try {
      const response = await fetch("http://localhost:8080/api/quotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Send payload, not formData
      });

      if (!response.ok) {
        // If server returns 500, this alert will trigger
        alert("Error saving quotation ❌");
        return;
      }

      const data = await response.json();

      // ✅ Sync the ID from the database into your local state
      setFormData((prev) => ({
        ...prev,
        id: data.id,
      }));

      alert("Quotation Saved Successfully ✅");
      setShowPreview(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Server error ❌");
    }
  };

  return (
    
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl">
        {/* Professional Header */}
        
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="relative px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="text-white">

<div className="flex items-center gap-2">
  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
    <Droplets className="text-white" size={30} />
  </div>

  <div>
    <h1 className="font-bold text-lg leading-tight text-[25px]">Veera</h1>
    <p className="text-[15px] text-slate-400">Enterprises</p>
  </div>
</div>




                
                {/* <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">VE</span>
                  </div>
                  <div>
                    <div className="text-2xl lg:text-3xl font-bold tracking-wide">
                      Veera Enterprises
                    </div>
                    <div className="text-sm lg:text-base text-gray-300">
                      <p className="text-[10px]">
                        Your trusted partner for pure water solutions.
                      </p>
                    </div>
                  </div>
                </div> */}
              </div>
           <button
                 onClick={addCostItem}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-900 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <span className="mr-2">+</span> Add Cost Item
                </button>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400"></div>
        </div>
        {/* Client & Project Details */}
<div className="px-4 sm:px-6 lg:px-8 mt-6">
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">

    <h2 className="text-lg font-bold mb-4">Client & Product Details</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* Client Name */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Client Name
        </label>
        <input
          type="text"
          value={formData.client}
          onChange={(e) =>
            setFormData({ ...formData, client: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Enter Client Name"
        />
      </div>

      {/* Project Name */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Product Name
        </label>
        <input
          type="text"
          value={formData.product}
          onChange={(e) =>
            setFormData({ ...formData, product: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Enter Product Name"
        />
      </div>

    </div>
  </div>
</div>

        {/* Cost Breakdown */}
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mt-[50px]">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-sm font-bold mr-[10px]">
                  1
                </span>
                Cost Breakdown
              </h2>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700 text-sm w-20">
                        Sr. No
                      </th>
                      <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700 text-sm">
                      Product Name
                      </th>
                      <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700 text-sm">
                        Scope Includes
                      </th>
                      <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700 text-sm w-32">
                        Amount (₹ Lakhs)
                      </th>
                      <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700 text-sm w-32">
                        Qty
                      </th>
                      <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700 text-sm w-20">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.costBreakdown.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="border border-gray-200 p-3 text-center font-medium text-gray-600">
                          {item.srNo}
                        </td>
                        <td className="border border-gray-200 p-3">
                          <input
                            type="text"
                            className="w-full outline-none bg-transparent font-medium text-gray-800 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-2 py-1 transition-all"
                            value={item.area}
                            onChange={(e) =>
                              updateCostItem(index, "area", e.target.value)
                            }
                            placeholder="Enter development area"
                          />
                        </td>

                        <td className="border border-gray-200 p-3">
                          <textarea
                            className="w-full outline-none bg-transparent text-gray-700 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-2 py-1 transition-all resize-none text-sm leading-relaxed"
                            rows={3}
                            value={item.scope}
                            onChange={(e) =>
                              updateCostItem(index, "scope", e.target.value)
                            }
                            placeholder="Enter scope details"
                          />

                        </td>
                        <td className="border border-gray-200 p-3">
                          <input
                            type="number"
                            className="w-full outline-none bg-transparent font-semibold text-orange-600 focus:bg-orange-50 focus:ring-2 focus:ring-orange-200 rounded px-2 py-1 transition-all text-center"
                            value={item.amount}
                            onChange={(e) =>
                              updateCostItem(index, "amount", e.target.value)
                            }
                            placeholder="Amount"
                          />

                        </td>
                         <td className="border border-gray-200 p-3">
                          <input
                            type="number"
                            className="w-full outline-none bg-transparent font-semibold text-orange-600 focus:bg-orange-50 focus:ring-2 focus:ring-orange-200 rounded px-2 py-1 transition-all text-center"
                            value={item.Qty}
                            onChange={(e) =>
                              updateCostItem(index, "Qty", e.target.value)
                            }
                            placeholder="quantity"
                          />
                        </td>

                        <td className="border border-gray-200 p-3 text-center">
                          <button
                            onClick={() => removeCostItem(index)}
                            className="bg-orange-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors text-xs"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gradient-to-r from-orange-100 to-amber-100 font-bold">
                      <td
                        className="border border-gray-200 p-4 text-center"
                        colSpan={4}
                      >
                        <span className="text-gray-800 text-lg">
                          TOTAL PRODUCT COST
                        </span>
                      </td>
                      <td className="border border-gray-200 p-4 text-center">
                        <span className="text-orange-700 text-lg font-bold">
                          {formatIndianCurrency(formData.totalCost)}
                        </span>
                      </td>
                      <td className="border border-gray-200 p-4"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="relative px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white">
              <div>
                <h4 className="font-semibold mb-2 text-orange-400">
                  Contact Information
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <span className="mr-2">📧</span> hr@smartmatrixtech.com
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🌐</span> www.smartmatrixtech.com
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📱</span> 9146637761
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-orange-400">
                  Office Address
                </h4>
                <div className="text-sm text-gray-300">
                  Pragati Chowk, Kolhapur
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-orange-400">
                  TERMS & CONDITIONS
                </h4>
                <div className="text-sm text-gray-300">
                  <div className="flex items-center mb-1">
                    <span className="mr-2">1)</span> 80% PAYMENT ADVANCE
                  </div>
                  <div className="flex items-center">
                    2) 10% PAYMENT ON MATERIAL RECEIVING
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400"></div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={saveQuotation}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl"
            >
              💾 Save Quotation
            </button>

            <button
              onClick={() => {
                if (!formData.id) {
                  alert(
                    "Please save the quotation before previewing or sending for approval.",
                  );
                  return;
                }
                setShowPreview(true);
              }}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            >
              <span className="mr-2 text-lg">👁️</span> Preview
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <QuotationPreview
          formData={formData}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default CreateQuotation;
