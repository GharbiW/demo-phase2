import { PageShell, SectionCard } from "@/components/ui/PageShell";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

const REGLES = [
  { poste: "Carburant tracteur", axe: "Tracteur → Tournée → Client", methode: "Km réels × coût/L", priorite: "Critique" },
  { poste: "Salaires & charges RH", axe: "Chauffeur → Tournée → Client", methode: "Jours travaillés × forfait jour", priorite: "Critique" },
  { poste: "Loyer tracteur", axe: "Tracteur → Tournées proportionnelles", methode: "Forfait mensuel ÷ jours utilisés", priorite: "Élevée" },
  { poste: "Loyer semi-remorque", axe: "Semi → Tournée", methode: "Forfait unitaire (~700€/u) ÷ tournées", priorite: "Élevée" },
  { poste: "Péages", axe: "Tracteur → Tournée → Client", methode: "Tarif PTV par trajet ou AS24 réels", priorite: "Élevée" },
  { poste: "Entretien / casse / pneus", axe: "Véhicule → Pool de tournées", methode: "% CA (1,7%) ou coût direct", priorite: "Modérée" },
  { poste: "Repositionnements / pieds", axe: "Tournée (non imputé au client)", methode: "Km × coût/km + temps × coût horaire", priorite: "Modérée" },
  { poste: "Sous-traitance achat", axe: "Direct → Client/Tournée", methode: "Prix d'achat unitaire", priorite: "Critique" },
];

const prioV = { Critique: "red", Élevée: "amber", Modérée: "neutral" };

export default function ReglesAllocationPage() {
  return (
    <PageShell
      moduleLabel="M3 — Moteur de coûts"
      title="Règles d'allocation"
      description="Comment chaque poste de coût est imputé aux axes analytiques (tournée, chauffeur, client, véhicule)."
      bare
      noPad
    >
      <div className="px-6 py-6">
        <SectionCard title="Règles par poste de coût" noPad>
          <Table>
            <Thead>
              <Tr>
                <Th>Poste</Th>
                <Th>Axe d&apos;allocation</Th>
                <Th>Méthode</Th>
                <Th>Priorité</Th>
              </Tr>
            </Thead>
            <Tbody>
              {REGLES.map((r) => (
                <Tr key={r.poste}>
                  <Td className="font-medium">{r.poste}</Td>
                  <Td muted>{r.axe}</Td>
                  <Td muted className="text-xs">{r.methode}</Td>
                  <Td><Badge variant={prioV[r.priorite] ?? "neutral"} size="sm">{r.priorite}</Badge></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </SectionCard>
      </div>
    </PageShell>
  );
}
