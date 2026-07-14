import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Building2,
  Wallet,
  Lock,
  CheckCircle2,
  ArrowLeft,
  AlertTriangle,
  Loader2,
  Receipt,
  RotateCcw,
} from "lucide-react";
import {
  createPaymentIntent,
  confirmPayment,
} from "../services/paymentService";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit Card", icon: CreditCard, desc: "Visa, Mastercard, AMEX" },
  { id: "bank_transfer", label: "Bank Transfer", icon: Building2, desc: "Direct bank payment" },
  { id: "wallet", label: "Digital Wallet", icon: Wallet, desc: "Apple Pay, Google Pay" },
];

const maskCardNumber = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})/g, "$1 ").trim();
};

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return digits.slice(0, 2) + " / " + digits.slice(2);
  }
  return digits;
};

const PaymentCheckout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const bookingId = searchParams.get("bookingId") || "";
  const amountParam = parseFloat(searchParams.get("amount")) || 0;

  const [selectedMethod, setSelectedMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form"); // form | processing | success | error
  const [paymentResult, setPaymentResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!bookingId || amountParam <= 0) {
      setErrorMsg("Invalid checkout parameters. Please go back and try again.");
      setStep("error");
    }
  }, [bookingId, amountParam]);

  const isFormValid = () => {
    if (!bookingId || amountParam <= 0) return false;
    if (selectedMethod === "card") {
      const digits = cardNumber.replace(/\s/g, "");
      return (
        digits.length === 16 &&
        cardExpiry.replace(/\D/g, "").length === 4 &&
        cardCvv.length >= 3
      );
    }
    return true;
  };

  const handlePayment = async () => {
    if (!isFormValid()) return;

    setLoading(true);
    setStep("processing");
    setErrorMsg("");

    try {
      // Step 1: create a payment intent on the server
      const intentRes = await createPaymentIntent({
        bookingId,
        amount: amountParam,
        method: selectedMethod,
      });

      if (!intentRes.success) {
        throw new Error(intentRes.message || "Failed to initialize payment");
      }

      // Simulate a brief processing delay (no real Stripe)
      await new Promise((r) => setTimeout(r, 1500));

      // Step 2: confirm the payment
      const confirmRes = await confirmPayment({
        paymentId: intentRes.payment._id,
        transactionId: `mock_txn_${Date.now().toString(36)}`,
      });

      if (!confirmRes.success) {
        throw new Error(confirmRes.message || "Payment confirmation failed");
      }

      setPaymentResult(confirmRes.payment);
      setStep("success");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong with your payment.");
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setStep("form");
    setErrorMsg("");
    setPaymentResult(null);
  };

  // ── Invalid params state ──
  if (step === "error" && !bookingId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Invalid Checkout</h2>
          <p className="text-slate-600">
            We couldn't find the booking details for this payment. Please go back
            and try again.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0056D2] px-6 py-3 text-white font-semibold hover:bg-[#0047AF] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Processing state ──
  if (step === "processing") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <Loader2 className="w-12 h-12 mx-auto text-[#0056D2] animate-spin" />
          <h2 className="text-2xl font-bold text-slate-900">
            Processing Payment...
          </h2>
          <p className="text-slate-500">
            Please don't close this page while we securely process your payment.
          </p>
        </div>
      </div>
    );
  }

  // ── Success state ──
  if (step === "success" && paymentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center animate-bounce-in">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Payment Successful!
            </h2>
            <p className="text-slate-600">
              Your payment of{" "}
              <span className="font-semibold text-slate-800">
                ${paymentResult.amount.toFixed(2)}
              </span>{" "}
              has been processed.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Receipt className="w-4 h-4" />
              <span>Transaction Receipt</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Transaction ID</span>
                <span className="font-mono text-slate-800 text-xs">
                  {paymentResult.transactionId}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Method</span>
                <span className="text-slate-800 capitalize">
                  {paymentResult.method.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Date</span>
                <span className="text-slate-800">
                  {new Date(paymentResult.paymentDate).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                  Completed
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/bookings")}
              className="w-full rounded-xl bg-[#0056D2] px-6 py-3 text-white font-semibold hover:bg-[#0047AF] transition"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full rounded-xl border border-slate-300 px-6 py-3 text-slate-700 font-semibold hover:bg-slate-50 transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Error retry state ──
  if (step === "error" && errorMsg) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Payment Failed
            </h2>
            <p className="text-slate-600">{errorMsg}</p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleRetry}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0056D2] px-6 py-3 text-white font-semibold hover:bg-[#0047AF] transition"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full rounded-xl border border-slate-300 px-6 py-3 text-slate-700 font-semibold hover:bg-slate-50 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main checkout form ──
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to booking
        </button>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left: order summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking</span>
                  <span className="font-medium text-slate-800 font-mono text-xs">
                    {bookingId.slice(0, 12)}...
                  </span>
                </div>
                <div className="border-t border-slate-100" />
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500">Amount</span>
                  <span className="text-2xl font-extrabold text-slate-900">
                    ${amountParam.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 flex items-start gap-3 text-sm text-slate-600">
              <Lock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <p>
                Your payment information is encrypted and securely processed.
                We never store your full card details.
              </p>
            </div>
          </div>

          {/* Right: payment form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                Checkout
              </h2>
              <p className="text-slate-500 text-sm mb-8">
                Choose your preferred payment method and enter your details.
              </p>

              {/* Payment method selector */}
              <div className="space-y-3 mb-8">
                <label className="block text-sm font-semibold text-slate-700">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {PAYMENT_METHODS.map((pm) => {
                    const Icon = pm.icon;
                    const isSelected = selectedMethod === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setSelectedMethod(pm.id)}
                        className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                          isSelected
                            ? "border-[#0056D2] bg-blue-50 ring-2 ring-[#0056D2]/20"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            isSelected ? "text-[#0056D2]" : "text-slate-400"
                          }`}
                        />
                        <span
                          className={`text-xs font-semibold ${
                            isSelected ? "text-[#0056D2]" : "text-slate-600"
                          }`}
                        >
                          {pm.label}
                        </span>
                        <span className="text-[10px] text-slate-400 hidden sm:block">
                          {pm.desc}
                        </span>
                        {isSelected && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0056D2] flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card details (shown only for card method) */}
              {selectedMethod === "card" && (
                <div className="space-y-5 mb-8 p-5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(maskCardNumber(e.target.value))
                        }
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm font-mono outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) =>
                          setCardExpiry(formatExpiry(e.target.value))
                        }
                        placeholder="MM / YY"
                        maxLength={7}
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-mono outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        CVV
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) =>
                            setCardCvv(
                              e.target.value.replace(/\D/g, "").slice(0, 4)
                            )
                          }
                          placeholder="***"
                          maxLength={4}
                          className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-3 text-sm font-mono outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bank transfer hint */}
              {selectedMethod === "bank_transfer" && (
                <div className="mb-8 p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-sm text-slate-600">
                  <p className="font-medium text-slate-800">
                    Bank Transfer Instructions
                  </p>
                  <p>
                    You will receive wire transfer details via email after
                    confirming. The booking will be held for 48 hours while we
                    await the transfer.
                  </p>
                </div>
              )}

              {/* Wallet hint */}
              {selectedMethod === "wallet" && (
                <div className="mb-8 p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-sm text-slate-600">
                  <p className="font-medium text-slate-800">
                    Digital Wallet
                  </p>
                  <p>
                    Click "Pay Now" to be redirected to your wallet provider for
                    secure authentication.
                  </p>
                </div>
              )}

              {/* Pay button */}
              <button
                type="button"
                onClick={handlePayment}
                disabled={!isFormValid() || loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0056D2] to-[#0040A0] px-6 py-4 text-white font-bold text-lg shadow-lg shadow-blue-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Lock className="w-5 h-5" />
                Pay ${amountParam.toFixed(2)}
              </button>

              <p className="text-center text-xs text-slate-400 mt-4">
                By confirming, you agree to our{" "}
                <a href="/terms" className="underline hover:text-slate-600">
                  Terms of Service
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;
