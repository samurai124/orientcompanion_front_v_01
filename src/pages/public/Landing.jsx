import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { VISUALS } from '@/lib/visuals';
import {
  HeroCard,
  SectionHeading,
  BentoCard,
  VisualCard,
  TrustStrip,
} from '@/components/design';
import { Reveal } from '@/components/motion';

export function Landing() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
      {/* 1. Hero Card matching reference */}
      <HeroCard
        title="Là où votre avenir s'épanouit"
        subtitle="Une plateforme d'orientation intelligente post-bac, conçue pour vous guider vers les meilleures opportunités académiques et professionnelles au Maroc."
        cta={{ label: "Commencer", to: "/register" }}
        image={VISUALS.heroField}
        floatingObjects={[
          { visual: VISUALS.objCap, position: 'bottom-8 sm:bottom-16 left-4 sm:left-12 md:left-20', size: 'w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36', delay: 0 },
          { visual: VISUALS.objCompass, position: 'bottom-10 sm:bottom-20 right-4 sm:right-16 md:right-24', size: 'w-18 h-18 sm:w-24 sm:h-24 md:w-32 md:h-32', delay: 0.8 },
        ]}
      />

      {/* 2. Intro Split Section */}
      <section className="pt-4 sm:pt-8">
        <SectionHeading
          align="split"
          eyebrow="Qu'est-ce qu'OrientCompanion ?"
          title="Une orientation sereine et personnalisée dès le lycée"
          paragraph="OrientCompanion est la première plateforme marocaine d'orientation académique qui allie la psychométrie RIASEC validée, l'anticipation algorithmique des seuils de notes et la préparation intensive aux concours d'accès."
          buttonText="Explorer"
          buttonTo="/register"
        />
      </section>

      {/* 3. Bento Row of 3 Cards matching reference */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Card 1: Wide light lavender card with coneflower visual (6 cols) */}
          <Reveal delay={0.05} className="lg:col-span-6 flex flex-col">
            <BentoCard
              variant="light"
              subtitle="Profilage holistique"
              title="Une orientation qui grandit avec vous"
              description="Découvrez vos affinités profondes grâce à un test RIASEC complet et explorez les filières universitaires et professionnelles qui vous correspondent vraiment."
              visual={VISUALS.flowerSprout}
              imageClassName="max-h-48 sm:max-h-56 w-auto"
              className="h-full min-h-[380px]"
            />
          </Reveal>

          {/* Card 2: Dark navy card (3 cols) */}
          <Reveal delay={0.15} className="lg:col-span-3 flex flex-col">
            <BentoCard
              variant="dark"
              subtitle="Seuils d'admission"
              title="Des objectifs de notes clairs"
              description="Visualisez les écarts entre votre moyenne actuelle et les seuils historiques des écoles ciblées pour concentrer vos efforts là où ça compte."
              className="h-full min-h-[380px]"
              footer={
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                  <span>Simulateur dynamique</span>
                  <span className="font-semibold text-white">Précision 98%</span>
                </div>
              }
            />
          </Reveal>

          {/* Card 3: Dark navy card (3 cols) */}
          <Reveal delay={0.25} className="lg:col-span-3 flex flex-col">
            <BentoCard
              variant="dark"
              subtitle="Préparation d'élite"
              title="Votre préparation aux concours"
              description="Annales corrigées, examens blancs chronométrés au format officiel marocain et séances individuelles avec des conseillers chevronnés."
              className="h-full min-h-[380px]"
              footer={
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                  <span>Concours ENSA / ENCG / FMP</span>
                  <span className="font-semibold text-white">Annales 2024</span>
                </div>
              }
            />
          </Reveal>
        </div>
      </section>

      {/* 4. Trust Strip with Marquee Wordmarks */}
      <section>
        <TrustStrip
          caption="Les établissements couverts"
          items={[
            "ENSA MAROC",
            "ENCG",
            "FST",
            "FACULTÉS DE MÉDECINE (FMP/FMD)",
            "IAV HASSAN II",
            "ENSIAS",
            "CPGE MAROC",
            "INPT",
            "EHTP",
            "ISCAE",
            "ENSAM",
            "EST",
          ]}
        />
      </section>

      {/* 5. Parcours / Use Cases Section */}
      <section className="space-y-12">
        <SectionHeading
          align="split"
          eyebrow="OrientCompanion en action"
          title="Des parcours pensés pour chaque étape clé"
          paragraph="Que vous soyez en 1ère ou 2ème année du baccalauréat, ou déjà bachelier en réorientation, notre technologie s'adapte à vos aspirations académiques."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <Reveal delay={0.08} className="flex flex-col">
            <VisualCard
              badge="Lycéens"
              subtitle="Étape 01"
              title="Avant le bac"
              description="Clarifiez vos intérêts avec le test RIASEC, calculez les notes requises au national et au régional et constituez un dossier solide."
              linkText="Découvrir le test"
              linkTo="/register"
              visual={VISUALS.objBook}
              className="h-full"
            />
          </Reveal>

          <Reveal delay={0.16} className="flex flex-col">
            <VisualCard
              badge="Grandes Écoles"
              subtitle="Étape 02"
              title="Après le bac"
              description="Accédez aux fiches exhaustives de chaque établissement supérieur au Maroc : filières, débouchés, frais et seuils d'admissibilité vérifiés."
              linkText="Explorer les écoles"
              linkTo="/login"
              visual={VISUALS.buildingColumns}
              className="h-full"
            />
          </Reveal>

          <Reveal delay={0.24} className="flex flex-col">
            <VisualCard
              badge="Concours d'accès"
              subtitle="Étape 03"
              title="Concours & Mentorat"
              description="Maximisez vos chances avec un programme de révision ciblé par matière et réservez des séances privées avec des mentors d'orientation."
              linkText="Préparer les concours"
              linkTo="/register"
              visual={VISUALS.objHourglass}
              className="h-full"
            />
          </Reveal>
        </div>
      </section>

      {/* 6. Final Dark CTA Card with Flower Ambience */}
      <section className="pt-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] md:rounded-[32px] dark-navy-card border border-white/10 p-8 sm:p-14 text-center shadow-lg">
            {/* Ambient decorative blur */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-lavender-600/15 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-lavender-400/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium backdrop-blur-xs border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-lavender-300" />
                <span>Rejoignez plus de 15 000 étudiants</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white leading-tight">
                Prêt à faire fleurir votre avenir académique ?
              </h2>

              <p className="text-sm sm:text-base text-white/70 leading-relaxed font-normal max-w-lg mx-auto">
                Créez votre compte en quelques instants pour débloquer votre profil RIASEC et suivre vos objectifs de notes dès aujourd'hui.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white text-ink-dark px-8 py-3.5 text-sm font-medium hover:bg-lavender-100 transition-all duration-200 group shadow-md"
                >
                  <span>Créer mon compte gratuitement</span>
                  <ArrowRight className="w-4 h-4 text-ink transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/15 border border-white/15 px-6 py-3.5 text-sm font-medium transition-colors"
                >
                  <span>J'ai déjà un compte</span>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

export default Landing;
