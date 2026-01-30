import React from 'react';
import { Sparkles, Heart, Globe, Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 pt-16 relative">
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-24 left-4 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all text-slate-700 hover:text-primary-600"
        aria-label="Retour"
      >
        <ArrowLeft size={24} />
      </button>
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 opacity-50"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-primary-600 uppercase bg-primary-50 rounded-full">
              Notre Histoire
            </span>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-slate-900 mb-6 leading-tight">
              Redéfinir l'Élégance Moderne
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Chez MissUniverse, nous croyons que la mode est bien plus que des vêtements. C'est une expression de soi, un art de vivre et une célébration de la beauté sous toutes ses formes.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Qualité Exceptionnelle</h3>
              <p className="text-slate-600">
                Chaque pièce est sélectionnée avec soin pour sa qualité irréprochable et son design intemporel. Nous ne faisons aucun compromis sur l'excellence.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Passion & Dévouement</h3>
              <p className="text-slate-600">
                Notre équipe est animée par une passion commune pour la mode et un désir ardent de satisfaire nos clientes les plus exigeantes.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Responsabilité</h3>
              <p className="text-slate-600">
                Nous nous engageons vers une mode plus durable et éthique, en collaborant avec des partenaires qui partagent nos valeurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
               <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                 <img 
                   src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                   alt="Notre atelier" 
                   className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                 />
               </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6">
                Du Rêve à la Réalité
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  L'aventure MissUniverse a commencé avec une vision simple : rendre la haute couture et le prêt-à-porter de luxe accessibles à toutes les femmes qui souhaitent affirmer leur style.
                </p>
                <p>
                  Depuis nos débuts modestes, nous avons grandi pour devenir une référence en matière d'élégance et de sophistication. Chaque collection est le fruit d'une recherche approfondie et d'une créativité sans bornes.
                </p>
                <p>
                  Aujourd'hui, nous continuons d'innover et de repousser les limites pour vous offrir une expérience shopping inoubliable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
