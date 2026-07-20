import { useState } from 'react';
import { useToast } from '../../components/ui/Toast';

const CodeBlock = ({ code, language = 'bash' }) => {
  const addToast = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    addToast('Code copied to clipboard');
  };

  return (
    <div className="relative group bg-[#0F172A] rounded-xl border border-outline-variant/30 overflow-hidden my-4">
      <div className="flex justify-between items-center px-4 py-2 bg-surface-container-low border-b border-outline-variant/30">
        <span className="font-label-mono text-xs text-on-surface-variant uppercase">{language}</span>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1 font-label-mono text-[10px] text-primary hover:text-white transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">content_copy</span>
          Copy
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="font-label-mono text-sm text-[#A5B4FC] whitespace-pre-wrap">{code}</code>
      </pre>
    </div>
  );
};

export default function DocumentationPage() {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const docs = [
    { 
      id: "getting-started",
      title: "Getting Started", 
      icon: "rocket_launch", 
      desc: "Learn how to connect your first factory cluster.",
      content: (
        <div className="space-y-6">
          <p className="font-body-base text-on-surface-variant leading-relaxed">
            Welcome to ClusterTwin AI. This guide will walk you through deploying your first industrial edge node and linking it to the central intelligence cloud.
          </p>
          <h2 className="font-headline-md text-xl text-on-surface">1. Install Edge Daemon</h2>
          <p className="font-body-base text-on-surface-variant leading-relaxed">
            Run the following command on your edge server (Ubuntu 22.04+ recommended) to install the ClusterTwin Daemon.
          </p>
          <CodeBlock 
            language="bash" 
            code={`curl -sL https://pkg.clustertwin.ai/install.sh | sudo bash\nclustertwind start`}
          />
          <h2 className="font-headline-md text-xl text-on-surface">2. Authenticate Cluster</h2>
          <p className="font-body-base text-on-surface-variant leading-relaxed">
            Use your API key from the Settings panel to authenticate the cluster with the global network.
          </p>
          <CodeBlock 
            language="bash" 
            code={`clustertwind auth --token "ct_live_8f92jks0293js" --cluster-name "Alpha_Sector"`}
          />
        </div>
      )
    },
    { 
      id: "api-reference",
      title: "API Reference", 
      icon: "code", 
      desc: "Integrate ClusterTwin AI with your existing ERP systems.",
      content: (
        <div className="space-y-6">
          <p className="font-body-base text-on-surface-variant leading-relaxed">
            The ClusterTwin REST API allows deep integration with SAP, Oracle ERP, and custom manufacturing execution systems (MES).
          </p>
          <h2 className="font-headline-md text-xl text-on-surface">Authentication</h2>
          <p className="font-body-base text-on-surface-variant leading-relaxed">
            All endpoints require a Bearer token in the Authorization header.
          </p>
          <CodeBlock 
            language="http" 
            code={`GET /api/v4/telemetry/nodes HTTP/1.1\nHost: api.clustertwin.ai\nAuthorization: Bearer ct_live_8f92jks0293js`}
          />
          <h2 className="font-headline-md text-xl text-on-surface">Fetch Live Telemetry</h2>
          <p className="font-body-base text-on-surface-variant leading-relaxed">
            Retrieve real-time JSON payloads containing OEE, active warnings, and predictive metrics.
          </p>
          <CodeBlock 
            language="json" 
            code={`{\n  "cluster_id": "Alpha_Sector",\n  "oee": 94.2,\n  "status": "Optimal",\n  "active_warnings": 0\n}`}
          />
        </div>
      )
    },
    { 
      id: "digital-twin",
      title: "Digital Twin Specs", 
      icon: "view_in_ar", 
      desc: "Understanding the physics engine and simulation parameters.",
      content: (
        <div className="space-y-6">
          <p className="font-body-base text-on-surface-variant leading-relaxed">
            The Digital Twin Engine utilizes a high-fidelity physics simulator to replicate mechanical stresses in real-time.
          </p>
          <h2 className="font-headline-md text-xl text-on-surface">Supported CAD Formats</h2>
          <ul className="list-disc pl-5 font-body-base text-on-surface-variant space-y-2">
            <li>STEP (.stp, .step) - Recommended</li>
            <li>IGES (.igs, .iges)</li>
            <li>glTF 2.0 (for purely visual overlays)</li>
          </ul>
          <h2 className="font-headline-md text-xl text-on-surface">Simulation Overrides</h2>
          <p className="font-body-base text-on-surface-variant leading-relaxed">
            To manually trigger a material stress scenario programmatically:
          </p>
          <CodeBlock 
            language="javascript" 
            code={`import { TwinEngine } from '@clustertwin/sdk';\n\nconst engine = new TwinEngine({ apiKey: 'YOUR_KEY' });\n\nawait engine.simulateScenario('EX-B-902', {\n  thermalLoad: 125.0,\n  vibrationAmplitude: 4.2\n});`}
          />
        </div>
      )
    },
    { 
      id: "iot-sensors",
      title: "IoT Sensors", 
      icon: "sensors", 
      desc: "Supported hardware and data ingestion formats.",
      content: (
        <div className="space-y-6">
          <p className="font-body-base text-on-surface-variant leading-relaxed">
            ClusterTwin supports standard MQTT and OPC UA protocols for ingesting raw sensor data at high frequencies.
          </p>
          <h2 className="font-headline-md text-xl text-on-surface">MQTT Topic Structure</h2>
          <p className="font-body-base text-on-surface-variant leading-relaxed">
            Publish your sensor payloads to the following topic structure:
          </p>
          <CodeBlock 
            language="text" 
            code={`ctwin/v1/telemetry/{cluster_id}/{machine_id}/{sensor_type}`}
          />
          <h2 className="font-headline-md text-xl text-on-surface">Example Payload (Vibration)</h2>
          <p className="font-body-base text-on-surface-variant leading-relaxed">
            Data should be sent in highly compact JSON arrays to reduce overhead.
          </p>
          <CodeBlock 
            language="json" 
            code={`{\n  "ts": 1718302941000,\n  "axis": ["x", "y", "z"],\n  "val": [0.04, 0.01, 1.22]\n}`}
          />
        </div>
      )
    },
  ];

  if (selectedDoc) {
    const doc = docs.find(d => d.id === selectedDoc);
    
    // Handle mock search filtering within the doc
    const isSearchMatch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.desc.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      <div className="w-full max-w-4xl mx-auto py-8 px-container-padding-mobile md:px-container-padding-desktop flex flex-col min-h-[calc(100vh-100px)]">
        {/* Breadcrumbs & Back */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSelectedDoc(null)}
              className="flex items-center gap-1 font-label-mono text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back
            </button>
            <span className="text-outline-variant">/</span>
            <span className="font-label-mono text-xs text-on-surface-variant">Documentation</span>
            <span className="text-outline-variant">/</span>
            <span className="font-label-mono text-xs text-primary">{doc.title}</span>
          </div>

          {/* Search */}
          <div className="flex items-center bg-surface-container-high rounded-lg px-3 py-2 border border-outline-variant/30 w-full md:w-64">
            <span className="material-symbols-outlined text-outline-variant text-sm mr-2">search</span>
            <input 
              className="bg-transparent border-none outline-none text-body-sm font-body-sm text-on-surface w-full p-0 placeholder-outline-variant focus:ring-0" 
              placeholder="Search docs..." 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 surface-glass p-8 md:p-12 rounded-xl border border-outline-variant/30">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-outline-variant/30">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
              <span className="material-symbols-outlined text-primary text-2xl">{doc.icon}</span>
            </div>
            <div>
              <h1 className="font-display-lg text-3xl text-on-surface mb-1">{doc.title}</h1>
              <p className="font-body-base text-on-surface-variant">{doc.desc}</p>
            </div>
          </div>
          
          <div className={isSearchMatch || searchQuery === '' ? 'block' : 'opacity-20 pointer-events-none'}>
            {doc.content}
          </div>
          {!isSearchMatch && searchQuery !== '' && (
            <div className="mt-4 text-center text-on-surface-variant font-body-sm">
              No exact match found in this section for "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 px-container-padding-mobile md:px-container-padding-desktop">
      <div className="text-center mb-12">
        <h1 className="font-display-lg text-4xl md:text-5xl text-on-surface leading-tight mb-4">
          Documentation
        </h1>
        <p className="font-body-base text-on-surface-variant max-w-2xl mx-auto">
          Everything you need to build, integrate, and scale your industrial digital twins.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {docs.map((doc, idx) => (
          <div 
            key={idx} 
            onClick={() => setSelectedDoc(doc.id)}
            className="surface-glass p-6 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-colors cursor-pointer group"
          >
            <span className="material-symbols-outlined text-primary text-3xl mb-4 group-hover:scale-110 transition-transform">{doc.icon}</span>
            <h3 className="font-headline-md text-xl text-on-surface mb-2">{doc.title}</h3>
            <p className="font-body-sm text-on-surface-variant">{doc.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
