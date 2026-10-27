import { LayoutDashboard, SearchCheck, FileText, Tags, Calculator, ScanBarcode, PackageSearch, Layers } from 'lucide-react';

// This registry powers navigation and the tools directory. To add a tool:
// 1. Add its metadata here; 2. implement its component; 3. register it in App.jsx.
export const tools = [
  { id: 'keywords', name: 'Keyword Studio', description: 'Model-specific search terms, colour variants and one-click exports.', icon: SearchCheck, category: 'Listing tools', available: true },
  // { id: 'titles', name: 'Title Builder', description: 'Build clean, consistent marketplace product titles.', icon: FileText, category: 'Listing tools', available: false },
  // { id: 'skus', name: 'SKU Generator', description: 'Create short, structured SKU IDs for your catalogue.', icon: Tags, category: 'Listing tools', available: false },
  { id: 'profit', name: 'Profit Calculator', description: 'Understand settlement, fees, costs and return-adjusted margins.', icon: Calculator, category: 'Operations', available: false },
  { id: 'packing', name: 'Packing Checker', description: 'Verify scanned parcels against daily packing manifests.', icon: ScanBarcode, category: 'Operations', available: false },
  { id: 'catalogue', name: 'Catalogue Manager', description: 'Keep products, models, pack sizes and variants organised.', icon: PackageSearch, category: 'Operations', available: false },
  { id: 'bulk', name: 'Bulk Listing Tools', description: 'Prepare larger batches of model-specific listing data.', icon: Layers, category: 'Operations', available: false }
];
export const dashboardLink = { id: 'dashboard', name: 'Overview', icon: LayoutDashboard };
