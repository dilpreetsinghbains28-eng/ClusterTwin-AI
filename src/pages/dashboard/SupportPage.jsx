import { useState } from 'react';
import { useToast } from '../../components/ui/Toast';

export default function SupportPage() {
  const addToast = useToast();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!subject.trim()) newErrors.subject = 'Subject is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
    addToast('Support ticket submitted successfully');
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 px-container-padding-mobile md:px-container-padding-desktop">
      <div className="text-center mb-12">
        <h1 className="font-display-lg text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-br from-on-surface to-primary leading-tight mb-4">
          Support Center
        </h1>
        <p className="font-body-base text-on-surface-variant max-w-2xl mx-auto">
          Need help? Submit a ticket or browse our knowledge base.
        </p>
      </div>

      <div className="w-full max-w-2xl surface-glass p-8 rounded-xl border border-outline-variant/30">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
            <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <h2 className="font-headline-md text-2xl text-on-surface">Ticket Submitted</h2>
            <p className="font-body-base text-on-surface-variant">Your support request has been received. A team member will respond within 24 hours.</p>
            <button onClick={() => { setSubmitted(false); setSubject(''); setDescription(''); }} className="mt-4 primary-gradient text-white font-bold py-2 px-6 rounded-lg hover:shadow-[0_0_15px_rgba(107,216,203,0.5)] transition-all cursor-pointer">
              Submit Another Ticket
            </button>
          </div>
        ) : (
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="font-label-mono text-xs uppercase text-on-surface-variant">Subject</label>
              <input type="text" value={subject} onChange={e => { setSubject(e.target.value); setErrors(prev => ({...prev, subject: undefined})); }} placeholder="Issue with Digital Twin" className={`bg-surface-variant border rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none ${errors.subject ? 'border-error' : 'border-outline-variant/50'}`} />
              {errors.subject && <span className="font-label-mono text-[10px] text-error">{errors.subject}</span>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-mono text-xs uppercase text-on-surface-variant">Description</label>
              <textarea rows="5" value={description} onChange={e => { setDescription(e.target.value); setErrors(prev => ({...prev, description: undefined})); }} placeholder="Describe your issue..." className={`bg-surface-variant border rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none ${errors.description ? 'border-error' : 'border-outline-variant/50'}`}></textarea>
              {errors.description && <span className="font-label-mono text-[10px] text-error">{errors.description}</span>}
            </div>
            <button type="submit" className="w-full primary-gradient text-white font-bold py-3 rounded-lg hover:shadow-[0_0_15px_rgba(107,216,203,0.5)] transition-all mt-4 cursor-pointer">
              Submit Ticket
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
