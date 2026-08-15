import type { Metadata } from "next";
import { TreeMonitoring } from "@/components/trees/tree-monitoring";

export const metadata: Metadata = { title: "Daraxt monitoringi" };

export default function TreesPage() {
  return (
    <div className="standard-page wide-page">
      <header className="page-heading"><p className="eyebrow">Yashil monitoring</p><h1>Har bir daraxtni kuzating</h1><p>Joylashuv, surat, sug‘orish va yashab qolish holatini bir joyda saqlang.</p></header>
      <TreeMonitoring />
    </div>
  );
}
