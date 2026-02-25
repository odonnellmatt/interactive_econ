import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const BASE_URL = 'https://interactive-econ.vercel.app';

const modules = [
    { id: 'standard', title: 'Supply & Demand Shifts', description: 'Curve shifts and their effect on equilibrium price and quantity.' },
    { id: 'ceiling', title: 'Price Ceiling', description: 'Binding vs. non-binding ceilings, shortages, and deadweight loss.' },
    { id: 'floor', title: 'Price Floor', description: 'Binding vs. non-binding floors, surpluses, and deadweight loss.' },
    { id: 'tax', title: 'Taxes & Tax Incidence', description: 'Per-unit tax wedge, tax revenue, and deadweight loss.' },
    { id: 'world', title: 'World Price & Trade', description: 'Free trade, imports/exports, tariffs, and tariff revenue.' },
    { id: 'elasticity', title: 'Elasticity', description: 'How slope affects price/quantity responses and tax incidence.' },
];

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-md bg-gray-700 hover:bg-gray-600 text-gray-100 transition-all"
        >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
}

const IFrameCodes: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Canvas iFrame Embed Codes</h2>
                <p className="text-sm text-gray-500 mb-1">
                    Each module is designed to be embedded independently into a Canvas page or assignment.
                    Copy the HTML code below and paste it into Canvas's <strong>HTML Editor</strong>.
                </p>
                <p className="text-sm text-gray-400">Deployed at: <code className="bg-gray-100 px-1 rounded">{BASE_URL}</code></p>
            </div>

            {/* Full sandbox embed */}
            {(() => {
                const url = BASE_URL;
                const code = `<iframe\n  src="${url}"\n  width="100%"\n  height="850px"\n  style="border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 4px 6px -1px rgb(0 0 0/.1);"\n  title="EconPlayground — Full Interactive Sandbox"\n  allowfullscreen\n></iframe>`;
                return (
                    <div className="bg-white rounded-2xl shadow-sm border border-indigo-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-indigo-100 flex items-start justify-between gap-4 bg-indigo-50">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1 block">Complete App</span>
                                <h3 className="font-bold text-gray-900">Full Sandbox (all modules)</h3>
                                <p className="text-sm text-gray-500 mt-0.5">All modules with tab navigation — suitable for an overview or general resource page.</p>
                            </div>
                            <a href={url} target="_blank" rel="noopener noreferrer"
                                className="shrink-0 text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline whitespace-nowrap">
                                Preview ↗
                            </a>
                        </div>
                        <div className="bg-gray-900 px-4 py-3">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-mono text-gray-400">{url}</span>
                                <CopyButton text={code} />
                            </div>
                            <pre className="text-xs font-mono text-gray-200 overflow-x-auto whitespace-pre">{code}</pre>
                        </div>
                    </div>
                );
            })()}

            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">Per-Module iFrames</p>

            {modules.map((m) => {
                const url = `${BASE_URL}/?model=${m.id}`;
                const code = `<iframe\n  src="${url}"\n  width="100%"\n  height="850px"\n  style="border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 4px 6px -1px rgb(0 0 0/.1);"\n  title="${m.title}"\n  allowfullscreen\n></iframe>`;
                return (
                    <div key={m.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-gray-900">{m.title}</h3>
                                <p className="text-sm text-gray-500 mt-0.5">{m.description}</p>
                            </div>
                            <a href={url} target="_blank" rel="noopener noreferrer"
                                className="shrink-0 text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline whitespace-nowrap">
                                Preview ↗
                            </a>
                        </div>
                        <div className="bg-gray-900 px-4 py-3">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-mono text-gray-400">{url}</span>
                                <CopyButton text={code} />
                            </div>
                            <pre className="text-xs font-mono text-gray-200 overflow-x-auto whitespace-pre">{code}</pre>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default IFrameCodes;
