/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/m5", destination: "/rentabilite/synthese", permanent: false },
      { source: "/m5/vue-synthetique", destination: "/rentabilite/synthese", permanent: false },
      { source: "/m5/vue-detaillee-kpis", destination: "/rentabilite/kpis", permanent: false },
      { source: "/m5/theorique-vs-reel", destination: "/rentabilite/theorique-reel", permanent: false },
      { source: "/m5/vue-indexation", destination: "/rentabilite/indexation", permanent: false },
      { source: "/m5/vue-sous-traitance", destination: "/rentabilite/sous-traitance", permanent: false },
      { source: "/m5/alertes", destination: "/m6/alertes", permanent: false },
      { source: "/rentabilite/alertes", destination: "/m6/alertes", permanent: false },
      { source: "/rentabilite/analyse-ecarts", destination: "/m6/analyse-ecarts", permanent: false },
      { source: "/rentabilite/theorique-reel", destination: "/rentabilite/synthese", permanent: false },
      { source: "/rentabilite/indexation", destination: "/m1/indexation-carburant", permanent: false },
      { source: "/rentabilite/planning", destination: "/rentabilite/synthese", permanent: false },
      { source: "/m5/integration-planning", destination: "/rentabilite/synthese", permanent: false },
      { source: "/m1/chiffrage-spot", destination: "/m1/adv-contrats", permanent: false },
      { source: "/m4", destination: "/rentabilite/par-tournee", permanent: false },
      { source: "/m4/par-tournee", destination: "/rentabilite/par-tournee", permanent: false },
      { source: "/m4/par-client", destination: "/rentabilite/par-client", permanent: false },
      { source: "/m4/par-chauffeur", destination: "/rentabilite/par-chauffeur", permanent: false },
      { source: "/m4/par-vehicule", destination: "/rentabilite/par-vehicule", permanent: false },
      { source: "/m4/par-semi-remorque", destination: "/rentabilite/semi-remorque", permanent: false },
      { source: "/m4/sous-traitance", destination: "/rentabilite/sous-traitance", permanent: false },
      { source: "/m4/analyse-ecarts", destination: "/m6/analyse-ecarts", permanent: false },
      { source: "/m2/sources", destination: "/m2", permanent: false },
      { source: "/m2/connecteurs", destination: "/m2", permanent: false },
      { source: "/m2/monitoring-api", destination: "/m2", permanent: false },
      { source: "/m2/pipeline-etl", destination: "/m2", permanent: false },
      { source: "/m2/qualite-alertes", destination: "/m2", permanent: false },
      { source: "/m2/gouvernance", destination: "/m2", permanent: false },
    ];
  },
};

export default nextConfig;

