"use client";

import { useState, useMemo } from "react";
import { ChevronRight, CheckCircle2, Star } from "lucide-react";
import { PageShell, KpiGrid, KpiTile } from "@/components/ui/PageShell";
import { Toolbar } from "@/components/ui/Toolbar";
import { SearchInput } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { DrilldownDrawer, DrawerSection, DrawerRow, DrawerChart } from "@/components/ui/DrilldownDrawer";
import { useToast } from "@/components/ui/Toast";
import { useDemoStore } from "@/stores/demoStore";
import { m4Clients } from "@/lib/demo-data";
import { HealthChip, HealthChipRow } from "@/components/ui/HealthChip";
import { Sparkline, demoSparkFromSeed } from "@/components/finance/Sparkline";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const CLIENTS = m4Clients;
const statutVariant = { ok: "emerald", warn: "amber", deficit: "red" };

const COST_SLICES = [
  { name: "Salaires", pct: 0.42, color: "#3b82f6" },
  { name: "Carburant", pct: 0.38, color: "#f97316" },
  { name: "Péages", pct: 0.08, color: "#8b5cf6" },
  { name: "Divers", pct: 0.12, color: "#6b7280" },
];
const CA_MONTHS = ["Nov", "Déc", "Jan", "Fév", "Mar", "Avr"];

function fmt(n, sign = false) {
  const s = sign && n >= 0 ? "+" : "";
  if (Math.abs(n) >= 1_000_000) return `${s}${(n / 1_000_000).toFixed(1)} M€`;
  return `${s}${(n / 1000).toFixed(0)} k€`;
}

function buildCaData(client) {
  const seed = client.name.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const base = client.ca / 6;
  return CA_MONTHS.map((month, i) => ({
    month,
    ca: Math.round(base + ((seed * (i + 2) * 17) % (base * 0.3)) - base * 0.15),
  }));
}

export default function ParClientPage() {
  const { state, actions } = useDemoStore();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [drawer, setDrawer] = useState(null);

  const filtered = useMemo(() => CLIENTS.filter((c) => {
    const matchSearch = search === "" || c.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Tous" || c.statut === statusFilter;
    return matchSearch && matchStatus;
  }), [search, statusFilter]);

  const totalCA = CLIENTS.reduce((s, c) => s + c.ca, 0);
  const totalMarge = CLIENTS.reduce((s, c) => s + c.marge, 0);
  const avgTxMarge = (totalMarge / totalCA * 100).toFixed(1);

  const costPieData = useMemo(() => drawer
    ? COST_SLICES.map((s) => ({ name: s.name, value: Math.round(drawer.coutReel * s.pct), color: s.color }))
    : [], [drawer]);

  const caData = useMemo(() => drawer ? buildCaData(drawer) : [], [drawer]);

  return (
    <PageShell
      moduleLabel="M4 — Moteur de rentabilité"
      title="Rentabilité par client"
      description="P&L synthétique par client/contrat : CA, coûts réels, marge brute et taux."
      bare
      noPad
    >
      <div className="px-6 pt-6 space-y-3">
        <KpiGrid cols={4}>
          <KpiTile label="Clients actifs" value={CLIENTS.length} sub="Contrats Phase 2" />
          <KpiTile label="CA portefeuille" value={fmt(totalCA)} sub="Cumul période" />
          <KpiTile label="Marge brute totale" value={fmt(totalMarge, true)} sub={`Taux moyen : ${avgTxMarge}%`} trend="up" />
          <KpiTile label="Client actif démo" value={state.selectedContract} sub="Défini dans M1" accent />
        </KpiGrid>
        <HealthChipRow>
          <HealthChip label="Tous" value={CLIENTS.length} color="neutral" isActive={statusFilter === "Tous"} onClick={() => setStatusFilter("Tous")} />
          <HealthChip label="Rentable" value={CLIENTS.filter((c) => c.statut === "ok").length} color="emerald" isActive={statusFilter === "ok"} onClick={() => setStatusFilter(statusFilter === "ok" ? "Tous" : "ok")} />
          <HealthChip label="À surveiller" value={CLIENTS.filter((c) => c.statut === "warn").length} color="amber" isActive={statusFilter === "warn"} onClick={() => setStatusFilter(statusFilter === "warn" ? "Tous" : "warn")} />
          <HealthChip label="Déficitaire" value={CLIENTS.filter((c) => c.statut === "deficit").length} color="red" isActive={statusFilter === "deficit"} onClick={() => setStatusFilter(statusFilter === "deficit" ? "Tous" : "deficit")} />
        </HealthChipRow>
      </div>

      <div className="px-6 py-5">
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <Toolbar
            left={
              <>
                <SearchInput placeholder="Rechercher un client…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="Tous">Tous statuts</option>
                  <option value="ok">Rentable</option>
                  <option value="warn">À surveiller</option>
                  <option value="deficit">Déficitaire</option>
                </Select>
              </>
            }
          />
          <Table>
            <Thead>
              <Tr>
                <Th>Client</Th>
                <Th>Type</Th>
                <Th right>CA</Th>
                <Th right>Coût réel</Th>
                <Th>Trend marge</Th>
                <Th right>Marge brute</Th>
                <Th right>Tx marge</Th>
                <Th right>Tournées</Th>
                <Th>Statut</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((c) => (
                <Tr key={c.id} clickable onClick={() => setDrawer(c)} highlighted={state.selectedContract === c.name}>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {c.name[0]}
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900">{c.name}</div>
                        {state.selectedContract === c.name && <Badge variant="blue" size="sm">Actif</Badge>}
                      </div>
                    </div>
                  </Td>
                  <Td muted>{c.type}</Td>
                  <Td right className="tabular-nums font-medium">{fmt(c.ca)}</Td>
                  <Td right className="tabular-nums text-neutral-500">{fmt(c.coutReel)}</Td>
                  <Td>
                    <Sparkline values={demoSparkFromSeed(c.name.length * 7 + c.txMarge * 10, 7)} width={72} height={28} />
                  </Td>
                  <Td right>
                    <span className={`tabular-nums font-medium ${c.marge < 0 ? "text-red-600" : "text-emerald-700"}`}>
                      {fmt(c.marge, true)}
                    </span>
                  </Td>
                  <Td right>
                    <span className={`text-xs font-semibold ${c.txMarge < 0 ? "text-red-600" : c.txMarge < 8 ? "text-amber-600" : "text-emerald-700"}`}>
                      {c.txMarge}%
                    </span>
                  </Td>
                  <Td right muted className="tabular-nums">{c.tournees}</Td>
                  <Td>
                    <Badge variant={statutVariant[c.statut] ?? "neutral"} size="sm">
                      {c.statut === "ok" ? "Rentable" : c.statut === "warn" ? "À surveiller" : "Déficitaire"}
                    </Badge>
                  </Td>
                  <Td>
                    <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </div>

      <DrilldownDrawer
        open={!!drawer}
        title={drawer?.name ?? ""}
        subtitle={drawer?.type}
        onClose={() => setDrawer(null)}
        width="lg"
        footer={
          <>
            <Button
              variant="primary"
              size="sm"
              icon={<Star className="w-4 h-4" />}
              onClick={() => {
                actions.setSelectedContract(drawer.name);
                showToast(`Client actif défini : ${drawer.name}`, "success");
                setDrawer(null);
              }}
            >
              Définir comme client actif
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => {
                actions.markInvestigated(`cl-${drawer.id}`, true);
                showToast("Client marqué comme traité", "success");
              }}
            >
              Marquer traité
            </Button>
          </>
        }
      >
        {drawer && (
          <>
            <DrawerSection title="P&L Synthétique">
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="rounded-lg bg-neutral-50 border border-neutral-100 p-2.5 text-center">
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider">CA</p>
                  <p className="text-sm font-bold text-neutral-900 tabular-nums">{fmt(drawer.ca)}</p>
                </div>
                <div className="rounded-lg bg-neutral-50 border border-neutral-100 p-2.5 text-center">
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Coût réel</p>
                  <p className="text-sm font-bold text-neutral-900 tabular-nums">{fmt(drawer.coutReel)}</p>
                </div>
                <div className={`rounded-lg border p-2.5 text-center ${drawer.marge < 0 ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`}>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Marge</p>
                  <p className={`text-sm font-bold tabular-nums ${drawer.marge < 0 ? "text-red-600" : "text-emerald-700"}`}>{fmt(drawer.marge, true)}</p>
                </div>
              </div>
              <DrawerRow label="Taux de marge" value={`${drawer.txMarge}%`} highlight={drawer.txMarge < 5} />
              <DrawerRow label="Nb tournées" value={drawer.tournees} />
            </DrawerSection>

            <DrawerSection title="CA mensuel — 6 mois">
              <DrawerChart title="Évolution CA (€)" height={160}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={caData} margin={{ top: 6, right: 10, bottom: 0, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} width={38} axisLine={false} tickLine={false}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Bar dataKey="ca" fill="#3b82f6" radius={[4, 4, 0, 0]} name="CA mensuel" />
                    <ReTooltip
                      formatter={(v) => [`${v.toLocaleString("fr-FR")} €`, "CA mensuel"]}
                      contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </DrawerChart>
            </DrawerSection>

            <DrawerSection title="Décomposition coûts">
              <div className="flex gap-3 items-center">
                <div style={{ width: 140, height: 130 }} className="shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={38}
                        outerRadius={60}
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {costPieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <ReTooltip
                        formatter={(v) => [`${(v / 1000).toFixed(0)} k€`]}
                        contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-1.5">
                  {costPieData.map((s) => (
                    <div key={s.name} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="text-xs text-neutral-600">{s.name}</span>
                      </div>
                      <span className="text-xs font-medium tabular-nums text-neutral-800">
                        {(s.value / 1000).toFixed(0)} k€
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </DrawerSection>

            <DrawerSection title="Liens">
              <a href="/m1/adv-contrats" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5" />Voir le contrat ADV
              </a>
              <a href="/rentabilite/par-tournee" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1">
                <ChevronRight className="w-3.5 h-3.5" />Voir les tournées associées
              </a>
            </DrawerSection>
          </>
        )}
      </DrilldownDrawer>
    </PageShell>
  );
}
