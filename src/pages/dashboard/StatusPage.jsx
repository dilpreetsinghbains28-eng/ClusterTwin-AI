export default function StatusPage() {
  const services = [
    { name: "Global Edge Network", status: "Operational", color: "bg-primary" },
    { name: "Digital Twin Engine", status: "Operational", color: "bg-primary" },
    { name: "Predictive AI Models", status: "Degraded Performance", color: "bg-error" },
    { name: "Data Ingestion API", status: "Operational", color: "bg-primary" },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 px-container-padding-mobile md:px-container-padding-desktop">
      <div className="w-full max-w-3xl surface-glass p-8 rounded-xl border border-outline-variant/30">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-outline-variant/30">
          <h1 className="font-display-lg text-3xl text-on-surface">System Status</h1>
          <div className="flex items-center gap-2 bg-error/10 text-error px-4 py-2 rounded-full font-label-mono text-sm border border-error/30">
            <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
            Partial Outage
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {services.map((service, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-surface-variant/50 rounded-lg border border-outline-variant/50">
              <span className="font-body-base text-on-surface">{service.name}</span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${service.color}`}></span>
                <span className="font-label-mono text-xs text-on-surface-variant uppercase">{service.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
