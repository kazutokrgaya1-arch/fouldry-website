"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How do I get the files after I buy?",
    a: "Checkout is instant. Right after payment we send a one-time login link to your inbox — click it and your dashboard is waiting with a download button for your template.",
  },
  {
    q: "Do I need to know how to code?",
    a: "No coding is required to use the templates — they're ready-made HTML/CSS/JS files you can open and customize with any text editor, or hand off to a developer for tweaks.",
  },
  {
    q: "Can I use these templates for client projects?",
    a: "Yes — every purchase includes a commercial use license, so you can use it for your own site or build it for a client.",
  },
  {
    q: "What's included in the download?",
    a: "Each template comes as a complete, ready-to-deploy package: all HTML, CSS, and JavaScript files, fully responsive and tested across devices.",
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
