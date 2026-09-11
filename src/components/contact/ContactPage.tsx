import React, { useState } from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  general?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface ContactPageProps {
  onNavigate?: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your name.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide a message.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide a message with at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear individual field error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setStatus('submitting');
    setErrors({});

    // Client-side UI simulation for frontend form handling
    // (Backend Express API endpoint will be attached in a subsequent stage)
    setTimeout(() => {
      setStatus('success');
    }, 900);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
    setStatus('idle');
  };

  return (
    <article className="py-12 sm:py-20 lg:py-24 bg-[#FAFAF9] flex-1 text-stone-900" id="contact-page-root">
      <Container size="default">
        <div className="max-w-4xl mx-auto">
          {/* Header & Invitation to Connect */}
          <div className="space-y-4 pb-12 border-b border-stone-200/80">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-mono text-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Open to Conversations & Collaborations</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-stone-950">
              Get in touch.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
              Whether you have a technical question, want to discuss software development, or have an opportunity to collaborate, feel free to leave a note below.
            </p>
          </div>

          {/* Form & Direct Details Grid */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Context & Direct Contact Details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-500">
                  DIRECT CHANNELS
                </h2>
                <div className="space-y-2">
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Prefer direct email? Reach me directly anytime at:
                  </p>
                  <a
                    href="mailto:alawodeheritage@gmail.com"
                    className="inline-flex items-center gap-2 text-stone-950 font-medium text-base hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 rounded-sm"
                  >
                    <Icon name="mail" size="sm" className="text-stone-600" />
                    <span>alawodeheritage@gmail.com</span>
                  </a>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-stone-200">
                <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-500">
                  WHAT TO EXPECT
                </h2>
                <ul className="space-y-3 text-sm text-stone-600">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 shrink-0" />
                    <span>Response typically within 24 to 48 hours.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 shrink-0" />
                    <span>Open to engineering internships, full-stack projects, and technical peer discussions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 shrink-0" />
                    <span>Your contact details are treated with privacy and integrity.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200 text-xs font-mono text-stone-600 space-y-1">
                <div className="text-stone-900 font-semibold">Backend Integration Notice</div>
                <p className="font-sans text-stone-600 text-xs leading-relaxed">
                  Frontend interface active. Incoming messages will route through the dedicated Express API upon backend configuration.
                </p>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-xs">
                {status === 'success' ? (
                  <div className="space-y-6 text-left py-4" role="status" aria-live="polite">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                      <Icon name="check" size="md" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold font-display text-stone-950">
                        Message prepared successfully
                      </h3>
                      <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                        Thank you for reaching out, <strong className="font-semibold text-stone-900">{formData.name}</strong>. Your message has been received on the client interface and is ready for the upcoming server connection.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 text-xs font-mono text-stone-600 space-y-1">
                      <div><strong className="text-stone-800">Sender:</strong> {formData.email}</div>
                      <div className="truncate"><strong className="text-stone-800">Preview:</strong> &quot;{formData.message.slice(0, 70)}{formData.message.length > 70 ? '...' : ''}&quot;</div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleReset}
                      >
                        Send Another Message
                      </Button>
                      {onNavigate && (
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() => onNavigate('/')}
                        >
                          Return Home
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-6"
                    aria-label="Contact Form"
                  >
                    {/* General Error Alert */}
                    {errors.general && (
                      <div
                        className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-800 flex items-start gap-2"
                        role="alert"
                      >
                        <Icon name="error" size="sm" className="text-rose-600 mt-0.5 shrink-0" />
                        <span>{errors.general}</span>
                      </div>
                    )}

                    {/* Name Input */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="contact-name"
                          className="block text-sm font-semibold text-stone-900"
                        >
                          Your Name
                        </label>
                        <span className="text-xs font-mono text-stone-400">Required</span>
                      </div>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        disabled={status === 'submitting'}
                        value={formData.name}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'contact-name-error' : undefined}
                        placeholder="e.g., Alex Morgan"
                        className={`w-full px-3.5 py-2.5 rounded-lg border bg-stone-50/50 text-stone-900 placeholder:text-stone-400 text-sm transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 ${
                          errors.name
                            ? 'border-rose-400 bg-rose-50/20'
                            : 'border-stone-300 hover:border-stone-400'
                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                      />
                      {errors.name && (
                        <p
                          id="contact-name-error"
                          className="text-xs text-rose-600 flex items-center gap-1 mt-1"
                        >
                          <Icon name="error" size="sm" className="text-[14px]" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="contact-email"
                          className="block text-sm font-semibold text-stone-900"
                        >
                          Email Address
                        </label>
                        <span className="text-xs font-mono text-stone-400">Required</span>
                      </div>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        disabled={status === 'submitting'}
                        value={formData.email}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'contact-email-error' : undefined}
                        placeholder="you@example.com"
                        className={`w-full px-3.5 py-2.5 rounded-lg border bg-stone-50/50 text-stone-900 placeholder:text-stone-400 text-sm transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 ${
                          errors.email
                            ? 'border-rose-400 bg-rose-50/20'
                            : 'border-stone-300 hover:border-stone-400'
                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                      />
                      {errors.email && (
                        <p
                          id="contact-email-error"
                          className="text-xs text-rose-600 flex items-center gap-1 mt-1"
                        >
                          <Icon name="error" size="sm" className="text-[14px]" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Message Textarea */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="contact-message"
                          className="block text-sm font-semibold text-stone-900"
                        >
                          Message
                        </label>
                        <span className="text-xs font-mono text-stone-400">Required</span>
                      </div>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        required
                        disabled={status === 'submitting'}
                        value={formData.message}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? 'contact-message-error' : undefined}
                        placeholder="Write your note, question, or project inquiry..."
                        className={`w-full px-3.5 py-2.5 rounded-lg border bg-stone-50/50 text-stone-900 placeholder:text-stone-400 text-sm transition-colors resize-y focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 ${
                          errors.message
                            ? 'border-rose-400 bg-rose-50/20'
                            : 'border-stone-300 hover:border-stone-400'
                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                      />
                      {errors.message && (
                        <p
                          id="contact-message-error"
                          className="text-xs text-rose-600 flex items-center gap-1 mt-1"
                        >
                          <Icon name="error" size="sm" className="text-[14px]" />
                          <span>{errors.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Submit Button & Status Indicator */}
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        disabled={status === 'submitting'}
                        rightIcon={status === 'submitting' ? undefined : 'send'}
                        className="w-full sm:w-auto"
                      >
                        {status === 'submitting' ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin" />
                            <span>Sending message...</span>
                          </span>
                        ) : (
                          'Send Message'
                        )}
                      </Button>

                      <p className="text-xs font-mono text-stone-500 text-center sm:text-right">
                        Secure client-side validation
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
};
