"use client";

import Link from "next/link";
import { AlertTriangle, Package, Truck } from "lucide-react";
import { PageShell, SectionCard, KpiGrid, KpiTile } from "@/components/ui/PageShell";
import { Badge } from "@/components/ui/Badge";
import { m4SemiRemorquesDemo } from "@/lib/demo-data";

export default function ParSemiRemorquePage() {
  const conflits = m4SemiRemorquesDemo.filter((s) => s.conflit).length;
  const mutualises = m4SemiRemorquesDemo.filter((s) => s.mode.startsWith("Mutualisé")).length;

  return (
    <PageShell
      moduleLabel="M4 — Moteur de rentabilité"
      title="Semi-remorques déclaratifs"
      description="Phase test scope Phase 2 : déclaration mutualisé / dédié, % d’affectation par tournée, alerte conflit d’affectation — données démo."
      bare
      noPad
    >
      <div className="px-6 pt-6">
        <KpiGrid cols={4}>
          <KpiTile label="Semi suivis" value={m4SemiRemorquesDemo.length} sub="Parc démo" />
          <KpiTile label="Mutualisés" value={mutualises} sub="Partage clients" />
          <KpiTile label="Conflits détectés" value={conflits} accent={conflits > 0} sub="Affectation > 100% cumulée" />
          <KpiTile label="Loyer moyen" value="~706 €" sub="Forfait / semi / mois" />
        </KpiGrid>
      </div>

      <div className="px-6 py-5 space-y-4">
        {conflits > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <strong>Conflit d’affectation</strong> — un semi mutualisé est saisi sur des tournées dont la somme des % dépasse la capacité logique (démo). Vérifier la déclaration côté exploitation.
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {m4SemiRemorquesDemo.map((s) => (
            <SectionCard key={s.id} title={`${s.immat}`} description={s.mode}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center">
                  <Package className="w-4 h-4 text-neutral-600" />
                </div>
                {s.conflit ? (
                  <Badge variant="amber" size="sm">Conflit affectation</Badge>
                ) : (
                  <Badge variant="emerald" size="sm">OK</Badge>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Affectation moyenne</span>
                  <span className="font-semibold tabular-nums text-neutral-900">{s.affectationPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Tournées (période)</span>
                  <span className="font-medium tabular-nums">{s.tournees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Clients / contrats</span>
                  <span className="text-xs text-neutral-700 text-right max-w-[60%]">{s.clients}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Loyer indicatif</span>
                  <span className="tabular-nums font-medium">{s.loyerMensuel} € / mois</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100">
                <Link
                  href="/rentabilite/par-tournee"
                  className="inline-flex items-center justify-center gap-2 h-9 px-3 rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-800 hover:bg-neutral-50 transition-colors"
                >
                  <Truck className="w-4 h-4" />
                  Voir tournées liées
                </Link>
              </div>
            </SectionCard>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
