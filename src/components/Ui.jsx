import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Panel({ children, className = '', ...props }) {
  return <section className={`panel ${className}`} {...props}>{children}</section>;
}

export function Heading({ eyebrow, title, description, right }) {
  return <div className="page-heading">
    <div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>
    {right && <div className="heading-right">{right}</div>}
  </div>;
}

export function ComingSoon({ tool, onBack }) {
  const Icon = tool.icon;
  return <div className="coming-wrap">
    <div className="coming-icon"><Icon size={30} /></div>
    <span className="chip chip-purple"><Sparkles size={13} /> On the roadmap</span>
    <h1>{tool.name}</h1>
    <p>{tool.description} This module is reserved in the app structure and can be built independently when you're ready.</p>
    <button className="button button-primary" onClick={onBack}>Explore available tools <ArrowRight size={16}/></button>
  </div>;
}
