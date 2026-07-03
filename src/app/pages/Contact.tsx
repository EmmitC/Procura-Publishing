import { useState } from 'react';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32">
          <div className="max-w-5xl">
            <p className="text-sm tracking-wider uppercase text-muted-foreground mb-6">Contact</p>
            <h1 className="text-6xl md:text-7xl lg:text-8xl mb-12 text-secondary leading-[0.95]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Start a<br />Conversation
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Whether you're a reader, author, or literary professional, we'd love to hear from you. Choose your preferred contact option below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-20">
            {/* Contact Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label htmlFor="name" className="block text-sm tracking-wider uppercase text-muted-foreground mb-3">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-0 py-3 bg-transparent border-b border-border text-secondary placeholder-muted-foreground focus:border-secondary focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm tracking-wider uppercase text-muted-foreground mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-0 py-3 bg-transparent border-b border-border text-secondary placeholder-muted-foreground focus:border-secondary focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm tracking-wider uppercase text-muted-foreground mb-3">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-0 py-3 bg-transparent border-b border-border text-secondary focus:border-secondary focus:outline-none transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="manuscript">Manuscript Submission</option>
                    <option value="rights">Rights & Permissions</option>
                    <option value="general">General Inquiry</option>
                    <option value="media">Media Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm tracking-wider uppercase text-muted-foreground mb-3">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-0 py-3 bg-transparent border-b border-border text-secondary placeholder-muted-foreground focus:border-secondary focus:outline-none resize-none transition-colors"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-secondary text-background hover:bg-primary transition-colors text-sm tracking-wider uppercase"
                >
                  Submit
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-5 space-y-12">
              <div>
                <h3 className="text-sm tracking-wider uppercase text-muted-foreground mb-6">Location</h3>
                <p className="text-secondary leading-relaxed">
                  123 Publishing Avenue<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </div>

              <div>
                <h3 className="text-sm tracking-wider uppercase text-muted-foreground mb-6">Contact</h3>
                <div className="space-y-3 text-secondary">
                  <p>(555) 123-4567</p>
                  <p>info@dominari.com</p>
                  <p>submissions@dominari.com</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm tracking-wider uppercase text-muted-foreground mb-6">Hours</h3>
                <div className="space-y-2 text-sm text-secondary">
                  <div className="flex justify-between">
                    <span>Monday — Friday</span>
                    <span>9:00 — 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 — 14:00</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submission Guidelines */}
      <section className="border-y border-border py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl text-secondary mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Manuscript Submission Guidelines
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl mb-4 text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Required Materials
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                <li>Query letter</li>
                <li>Author biography</li>
                <li>Complete manuscript (PDF or DOC)</li>
                <li>Synopsis (1-2 pages)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl mb-4 text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Review Process
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our editorial team reviews all submissions within 8-12 weeks. Each manuscript receives careful consideration.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-4 text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Submissions Policy
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We accept simultaneous submissions. Notify us immediately if your manuscript is accepted elsewhere.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
