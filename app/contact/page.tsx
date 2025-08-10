"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app: send to API/Email service
    setSubmitted(true);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-8">
          Have a question or feedback? Send us a message and we’ll get back to
          you soon.
        </p>
        {submitted ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-800">
            Thanks! Your message has been received.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <Textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="px-6">
              Send message
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
