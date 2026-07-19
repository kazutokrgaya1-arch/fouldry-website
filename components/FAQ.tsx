"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How do I get the files after I buy?",
    a: "Checkout is instant. Right after payment we send a one-time login link to your inbox — click it and your dashboard is waiting with a download button.",
  },
  {
    q: "Do I need to create a password?",
    a: "No. We use passwordless magic-link sign-in, so there's nothing to remember or reset.",
  },
  {
    q: "Can I use these templates commercially?",
    a: "Yes — every purchase includes a commercial use license for your own projects and client work.",
  },
  {
    q: "What if I lose access to my download?",
    a: "Log back in any time with the same magic-link flow. Your dashboard keeps every purchase on file permanently.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-b border-line">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <p className="font-mono text-xs tracking-[0.2em] text-blueprint mb-3">
          04 / NOTES
        </p>
        <h2 className="font-display text-3xl text-paper mb-10">
          Questions, answered.
        </h2>

        <div className="divide-y divide-line border-t border-b border-line">
          {faqs.map((item, i) => (
            <div key={item.q}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left"
              >
                <span className="text-paper font-medium">{item.q}</span>
                <span className="font-mono text-blueprint">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              {openIndex === i && (
                <p className="text-slate text-sm pb-5 pr-8">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
