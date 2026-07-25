import {
  Search,
  Compass,
  Palette,
  Layout,
  Server,
  Cable,
  Database,
  ShieldCheck,
  Rocket,
  Gauge,
  Activity,
  RefreshCw,
} from "lucide-react";

const ICONS = {
  search: Search,
  compass: Compass,
  palette: Palette,
  layout: Layout,
  server: Server,
  cable: Cable,
  database: Database,
  shield: ShieldCheck,
  rocket: Rocket,
  gauge: Gauge,
  activity: Activity,
  refresh: RefreshCw,
};

export function getWhatIDoIcon(name) {
  return ICONS[name] || Layout;
}
