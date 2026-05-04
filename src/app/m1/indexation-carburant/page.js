"use client";

import { Fragment, useState } from "react";
import { PageShell, SectionCard, KpiGrid, KpiTile } from "@/components/ui/PageShell";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { DrilldownDrawer, DrawerSection, DrawerRow } from "@/components/ui/DrilldownDrawer";
import { EditableField } from "@/components/ui/EditableField";
import Toast from "@/components/ui/Toast";
import { m1Contracts, m1FuelIndexationFields } from "@/lib/demo-data";
import { cockpitFuelIndices, cockpitIndexationTableRows } from "@/lib/cockpit-mock-data";
import { FuelPump12mChart } from "@/components/cockpit/FuelPump12mChart";
import { Save, Info, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import { useDemoStore } from "@/stores/demoStore";

const H5_PENDING = "H5 — Formule Auchan (M-1 moins TCPE) à confirmer";

const TYPE_COLORS = {
  GO: "blue",
  GNC: "emerald",
  GNV: "emerald",
  GNL: "emerald",
  BIO_GNC: "emerald",
  FIOUL_FRIGO: "purple",
};

const MODE_LABELS = {
  PIED_DE_FACTURE: "Pied de facture",
  SUR_KM: "Sur km",
  VARIATION_TK: "Variation TK",
};

export default function IndexationCarburantPage() {
  const { state, actions } = useDemoStore();
  const [selected, setSelected] = useState(null);
  const [contracts, setContracts] = useState(m1Contracts);
  const [toast, setToast] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleSave = (contractId, field, val) => {
    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId ? { ...c, indexation: { ...c.indexation, [field]: val } } : c
      )
    );
    showToast(`✓ Indexation ${contractId} — "${field}" mis à jour → ${val}`);
  };

  const selectedContract = selected ? contracts.find((c) => c.id === selected) : null;

  const totalCA = contracts.reduce((s, c) => s + c.caAnnuel, 0);
  const actifs = contracts.filter((c) => c.statut === "Actif").length;

  // Calculateur d’indexation (démo) — conversion indices → impact €
  const currentContract = contracts.find((c) => c.client === state.selectedContract) || contracts[0];
  const ixState = state.indexation;
  const indiceKey = ixState.base_indice === "Dirham" ? "DIREM" : "CNR";
  const indexNow = cockpitFuelIndices[indiceKey]?.[ixState.mode_temporel === "M_MOINS_2" ? "M-2" : ixState.mode_temporel === "M_MOINS_1" ? "M-1" : "M"] ?? 108.1;
  const indexRef = cockpitFuelIndices[indiceKey]?.ref ?? 101.0;
  const evolutionPct = ((indexNow - indexRef) / indexRef) * 100;
  const caMensuel = (currentContract?.caAnnuel ?? 17_200_000) / 12;
  const impactEuro =
    ixState.type_ponderation === "POURCENT_FORFAIT"
      ? caMensuel * (ixState.ponderation_valeur ?? 0.35) * (evolutionPct / 100)
      : // volume (démo) : pondération_valeur = conso L/100, km_contractuels = km/mois
        ((Number(ixState.km_contractuels ?? 22000) / 100) * Number(ixState.ponderation_valeur ?? 28)) * (cockpitFuelIndices[indiceKey]?.M ?? 112.4) * 0.001;

  return (
    <PageShell
      title="P1.2 — Indexation carburant"
      subtitle="Paramétrage des formules d'indexation par contrat — 8 contrats · CNR / Dirham / Engie"
      actions={
        <button onClick={() => showToast("Calcul déclenché — Simulation indexation T-1 en cours...")}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[#E80912] hover:bg-[#c7080f] text-white text-sm font-semibold transition-colors">
          <Save className="w-4 h-4" />
          Simuler T-1
        </button>
      }
    >
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <KpiGrid cols={4}>
        <KpiTile label="CA total indexé" value="17,2 M€" sub="Ensemble des contrats actifs" />
        <KpiTile label="Contrats actifs" value={actifs} sub={`sur ${contracts.length} total`} />
        <KpiTile label="Impact indexation T-1" value="+385 k€" sub="Gain estimé période" trend="up" />
        <KpiTile label="Hypothèse H5" value="En attente" sub="Formule Auchan — à confirmer" color="warn" />
      </KpiGrid>

      <SectionCard
        title="Calculateur d’indexation (démo) — conversion indices → impact €"
        description="Type d’indice, période (M/M-1/M-2) et pondération (% prix ou volume). Met à jour l’impact dans toute la démo."
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Contrat actif démo</p>
            <select
              value={state.selectedContract}
              onChange={(e) => actions.setSelectedContract(e.target.value)}
              className="w-full h-10 rounded-xl border border-neutral-200 bg-white text-sm px-3"
            >
              {contracts.map((c) => (
                <option key={c.id} value={c.client}>
                  {c.client}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-neutral-500 mt-2">
              CA annuel : <span className="font-mono">{(currentContract?.caAnnuel ?? 0).toLocaleString("fr-FR")} €</span>
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Indice & période</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => actions.updateIndexation({ base_indice: "CNR" })}
                className={`h-9 rounded-lg border text-xs font-semibold ${ixState.base_indice !== "Dirham" ? "border-blue-200 bg-blue-50 text-blue-900" : "border-neutral-200 bg-white text-neutral-700"}`}
              >
                CNR
              </button>
              <button
                type="button"
                onClick={() => actions.updateIndexation({ base_indice: "Dirham" })}
                className={`h-9 rounded-lg border text-xs font-semibold ${ixState.base_indice === "Dirham" ? "border-blue-200 bg-blue-50 text-blue-900" : "border-neutral-200 bg-white text-neutral-700"}`}
              >
                DIREM
              </button>
            </div>
            <select
              value={ixState.mode_temporel}
              onChange={(e) => actions.updateIndexation({ mode_temporel: e.target.value })}
              className="w-full h-10 rounded-xl border border-neutral-200 bg-white text-sm px-3"
            >
              <option value="M">M</option>
              <option value="M_MOINS_1">M-1</option>
              <option value="M_MOINS_2">M-2</option>
            </select>
            <div className="text-[11px] text-neutral-600">
              Indice ref: <span className="font-mono">{indexRef.toFixed(1)}</span> → indice {ixState.mode_temporel.includes("2") ? "M-2" : ixState.mode_temporel.includes("1") ? "M-1" : "M"} :{" "}
              <span className="font-mono">{indexNow.toFixed(1)}</span> (<span className="font-mono">{evolutionPct.toFixed(2)}%</span>)
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Pondération & impact</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => actions.updateIndexation({ type_ponderation: "POURCENT_FORFAIT" })}
                className={`h-9 rounded-lg border text-xs font-semibold ${ixState.type_ponderation === "POURCENT_FORFAIT" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-neutral-200 bg-white text-neutral-700"}`}
              >
                % du prix
              </button>
              <button
                type="button"
                onClick={() => actions.updateIndexation({ type_ponderation: "CONSO_X_KM" })}
                className={`h-9 rounded-lg border text-xs font-semibold ${ixState.type_ponderation === "CONSO_X_KM" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-neutral-200 bg-white text-neutral-700"}`}
              >
                Volume (conso)
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-neutral-500">Pondération</label>
                <input
                  type="number"
                  step="0.01"
                  value={ixState.ponderation_valeur}
                  onChange={(e) => actions.updateIndexation({ ponderation_valeur: Number(e.target.value) })}
                  className="w-full h-10 rounded-xl border border-neutral-200 px-3 font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-500">Km (si volume)</label>
                <input
                  type="number"
                  value={ixState.km_contractuels ?? 22000}
                  onChange={(e) => actions.updateIndexation({ km_contractuels: Number(e.target.value) })}
                  className="w-full h-10 rounded-xl border border-neutral-200 px-3 font-mono"
                />
              </div>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Impact financier mensuel (démo)</p>
              <p className="text-2xl font-bold font-mono text-emerald-800 mt-1">
                {impactEuro >= 0 ? "+" : ""}{Math.round(impactEuro / 1000)} k€
              </p>
              <p className="text-[11px] text-emerald-800/70 mt-1">
                Appliqué à <strong>{state.selectedContract}</strong> · pondération{" "}
                {ixState.type_ponderation === "POURCENT_FORFAIT" ? `${Math.round(ixState.ponderation_valeur * 100)}%` : `${ixState.ponderation_valeur} L/100`}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const keur = Math.round(impactEuro / 1000);
                actions.updateIndexation({ indexationImpactKEUR: keur });
                showToast(`✓ Impact indexation mis à jour → ${keur >= 0 ? "+" : ""}${keur} k€`);
              }}
              className="w-full h-10 rounded-xl bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800"
            >
              Appliquer l’impact à la démo
            </button>
          </div>
        </div>
      </SectionCard>

      {/* H5 alert */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">
          <strong>H5 — Hypothèse en attente :</strong> {H5_PENDING}. Impact direct sur le calcul d&apos;indexation du contrat Auchan (2,9 M€ CA).
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard title="Vue synthétique — contrats & indices (démo prompt)">
          <div className="overflow-x-auto rounded-xl border border-neutral-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-[10px] uppercase tracking-wider text-neutral-500">
                  <th className="px-3 py-2 font-semibold">Client</th>
                  <th className="px-3 py-2 font-semibold">Indice</th>
                  <th className="px-3 py-2 font-semibold">Méthode</th>
                  <th className="px-3 py-2 font-semibold text-right">Pond.</th>
                  <th className="px-3 py-2 font-semibold text-right">Évol.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {cockpitIndexationTableRows.map((r) => (
                  <tr key={r.id} className="hover:bg-neutral-50/80">
                    <td className="px-3 py-2 font-medium text-neutral-900">{r.client}</td>
                    <td className="px-3 py-2 text-neutral-700">{r.indice}</td>
                    <td className="px-3 py-2 font-mono text-xs">{r.methode}</td>
                    <td className="px-3 py-2 text-right font-mono">{r.ponderationPct}%</td>
                    <td className="px-3 py-2 text-right font-semibold text-emerald-700">+{r.evolutionBrutePct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
        <SectionCard title="Évolution prix à la pompe — 12 mois (Recharts)">
          <FuelPump12mChart />
          <p className="text-[11px] text-neutral-500 mt-2">Série indicative démo — Gasoil vs Gaz (€).</p>
        </SectionCard>
      </div>

      {/* Contracts table */}
      <SectionCard title="Contrats — paramétrage indexation" noPad>
        <Table compact stickyHeader>
          <Thead>
            <Tr>
              <Th>Contrat</Th>
              <Th>Client</Th>
              <Th>Base indice</Th>
              <Th>Type carburant</Th>
              <Th>Mode temporel</Th>
              <Th>Pondération</Th>
              <Th>Mode facturation</Th>
              <Th>Niveau</Th>
              <Th>Statut</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {contracts.map((c) => {
              const ix = c.indexation;
              const isExpanded = expandedId === c.id;
              return (
                <Fragment key={c.id}>
                  <Tr clickable highlighted={selected === c.id}
                    onClick={() => { setSelected(c.id); setExpandedId(null); }}>
                    <Td><span className="font-mono text-xs text-neutral-500">{c.id}</span></Td>
                    <Td><span className="font-semibold text-neutral-900">{c.client}</span></Td>
                    <Td><span className="text-xs">{ix.base_indice}</span></Td>
                    <Td>
                      <Badge color={TYPE_COLORS[ix.type_carburant] || "neutral"} size="sm">{ix.type_carburant}</Badge>
                    </Td>
                    <Td><span className="text-xs font-mono">{ix.mode_temporel}</span></Td>
                    <Td>
                      <span className="text-xs">
                        {ix.type_ponderation === "POURCENT_FORFAIT"
                          ? `${(ix.ponderation_valeur * 100).toFixed(0)}% forfait`
                          : `${ix.ponderation_valeur} L/100km`}
                      </span>
                    </Td>
                    <Td><span className="text-xs">{MODE_LABELS[ix.mode_facturation_igo] || ix.mode_facturation_igo}</span></Td>
                    <Td>
                      <Badge color={ix.niveau_application === "SPECIFIQUE_PRESTATION" ? "red" : "neutral"} size="sm">
                        {ix.niveau_application === "SPECIFIQUE_PRESTATION" ? "Par prestation" : "Hérité contrat"}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge color={c.statut === "Actif" ? "emerald" : "amber"} size="sm">{c.statut}</Badge>
                    </Td>
                    <Td>
                      <button onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : c.id); }}
                        className="p-1 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </Td>
                  </Tr>
                  {isExpanded && (
                    <Tr key={`${c.id}-expanded`}>
                      <Td colSpan={10}>
                        <div className="bg-neutral-50 border-t border-b border-neutral-100 px-4 py-4">
                          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Formulaire d&apos;indexation complet — {c.client}</div>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div>
                              <label className="text-xs text-neutral-500 block mb-1">Indice de référence (valeur actuelle)</label>
                              <EditableField
                                value={String(ix.indice_reference)}
                                onSave={(v) => handleSave(c.id, "indice_reference", v)}
                                type="number"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-neutral-500 block mb-1">Base indice</label>
                              <EditableField
                                value={ix.base_indice}
                                onSave={(v) => handleSave(c.id, "base_indice", v)}
                              />
                            </div>
                            <div>
                              <label className="text-xs text-neutral-500 block mb-1">Type pondération</label>
                              <EditableField
                                value={ix.type_ponderation}
                                onSave={(v) => handleSave(c.id, "type_ponderation", v)}
                              />
                            </div>
                            <div>
                              <label className="text-xs text-neutral-500 block mb-1">Valeur pondération</label>
                              <EditableField
                                value={String(ix.ponderation_valeur)}
                                onSave={(v) => handleSave(c.id, "ponderation_valeur", v)}
                                type="number"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-neutral-500 block mb-1">Km contractuels (CONSO_X_KM)</label>
                              <EditableField
                                value={ix.km_contractuels ? String(ix.km_contractuels) : "N/A"}
                                onSave={(v) => handleSave(c.id, "km_contractuels", v)}
                                type="number"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-neutral-500 block mb-1">Mode facturation IGO</label>
                              <EditableField
                                value={ix.mode_facturation_igo}
                                onSave={(v) => handleSave(c.id, "mode_facturation_igo", v)}
                              />
                            </div>
                            <div>
                              <label className="text-xs text-neutral-500 block mb-1">Niveau d&apos;application</label>
                              <EditableField
                                value={ix.niveau_application}
                                onSave={(v) => handleSave(c.id, "niveau_application", v)}
                              />
                            </div>
                            <div>
                              <label className="text-xs text-neutral-500 block mb-1">Mode temporel</label>
                              <EditableField
                                value={ix.mode_temporel}
                                onSave={(v) => handleSave(c.id, "mode_temporel", v)}
                              />
                            </div>
                          </div>
                          {c.client === "FedEx" && (
                            <div className="mt-4 flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
                              <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                              <p className="text-xs text-blue-700">
                                <strong>FedEx — Indexation par prestation (H6)</strong> : 173 lignes de règles.
                                Niveau application = SPECIFIQUE_PRESTATION. Import CSV prévu.
                              </p>
                            </div>
                          )}
                        </div>
                      </Td>
                    </Tr>
                  )}
                </Fragment>
              );
            })}
          </Tbody>
        </Table>
      </SectionCard>

      {/* Spec fields reference */}
      <SectionCard title="Champs du référentiel d'indexation — spec ADV">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {m1FuelIndexationFields.map((f) => (
            <div key={f.key} className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
              <div className="font-mono text-xs text-[#E80912] font-semibold mb-1">{f.key}</div>
              <div className="text-xs text-neutral-500">{f.type}</div>
              <div className="text-xs text-neutral-400 italic mt-0.5">{f.example}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Drawer */}
      {selectedContract && (
        <DrilldownDrawer
          open={!!selected}
          onClose={() => setSelected(null)}
          title={`Indexation — ${selectedContract.client}`}
          subtitle={selectedContract.type}
          width="md"
        >
          <DrawerSection title="Paramétrage indexation">
            {Object.entries(selectedContract.indexation).map(([k, v]) => (
              <DrawerRow key={k} label={k} value={v === null ? "N/A" : String(v)} />
            ))}
          </DrawerSection>
          <DrawerSection title="Infos contrat">
            <DrawerRow label="CA annuel" value={`${(selectedContract.caAnnuel / 1000000).toFixed(1)} M€`} />
            <DrawerRow label="Complexité" value={selectedContract.complexite} />
            <DrawerRow label="Durée" value={`${selectedContract.dateDebut} → ${selectedContract.dateFin}`} />
            <DrawerRow label="Particularité" value={selectedContract.particularite} />
          </DrawerSection>
        </DrilldownDrawer>
      )}
    </PageShell>
  );
}
