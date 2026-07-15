import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { usePeople } from '../state/PeopleContext';

export function About() {
  const { team } = usePeople();

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32">
          <div className="max-w-5xl">
            <p className="text-sm tracking-wider uppercase text-muted-foreground mb-6">About PROCURA</p>
            <h1 className="text-6xl md:text-7xl lg:text-8xl mb-12 text-secondary leading-[0.95]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Literary Curation<br />for the Discerning<br />Reader
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Founded in 2019 to bridge the gap between exceptional stories and the readers who will treasure them.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Founded in 2019 by a collective of literary enthusiasts, editors, and industry veterans, PROCURA emerged from a single conviction: remarkable manuscripts were being lost in the noise of mass publishing.
              </p>
              <p>
                We witnessed readers struggling to discover their next obsession. Authors disconnected from their audience. Stories chosen for commercial potential alone, not their power to move, challenge, and transform.
              </p>
              <p>
                PROCURA was born to bridge these gaps—a publishing house that operates as a literary curator, where every book earns its place through craft, originality, and emotional resonance.
              </p>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden">
              <ImageWithFallback
                src="public\community\dominari-community (10).jpg"
                alt="Publishing library"
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Founder Quote */}
      <section className="border-y border-border py-24 bg-card">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <p className="text-3xl md:text-4xl text-secondary leading-relaxed mb-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            "We don't just publish books; we cultivate literary experiences that create lasting connections between stories and souls."
          </p>
          <p className="text-sm tracking-wider uppercase text-muted-foreground">Founder's Principle</p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl text-secondary mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Our Values
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-2xl mb-4 text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Literary Excellence
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We champion quality over quantity, seeking stories that demonstrate exceptional craft, originality, and emotional resonance.
              </p>
            </div>
            <div>
              <h3 className="text-2xl mb-4 text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Author Partnership
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Collaborative relationships built on transparency and respect. We support authors throughout their creative journey, not just at publication.
              </p>
            </div>
            <div>
              <h3 className="text-2xl mb-4 text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Reader Connection
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every book we publish is chosen with our readers in mind—creating meaningful connections between stories and souls.
              </p>
            </div>
            <div>
              <h3 className="text-2xl mb-4 text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Cultural Impact
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We seek stories that contribute to important conversations, challenge perspectives, and enrich our collective understanding.
              </p>
            </div>
            <div>
              <h3 className="text-2xl mb-4 text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Sustainability
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Committed to environmentally responsible publishing practices and supporting sustainable literary ecosystems.
              </p>
            </div>
            <div>
              <h3 className="text-2xl mb-4 text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Innovation
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We embrace new technologies and approaches that enhance the reading experience while honoring literary traditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Highlight */}
      {team.length > 0 && (
        <section className="border-y border-border py-32 bg-card">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-32">
            <div className="mb-4">
              <p className="text-sm tracking-wider uppercase text-muted-foreground mb-4">Behind PROCURA</p>
              <h2 className="text-4xl md:text-5xl text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Our Team
              </h2>
            </div>
            {team.map((member, index) => (
              <div key={member.id} className="grid lg:grid-cols-5 gap-12 items-start">
                <div className={`lg:col-span-2 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="aspect-[3/4] bg-muted overflow-hidden">
                    {member.image ? (
                      <ImageWithFallback src={member.image} alt={member.name} className="w-full h-full object-cover grayscale" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50"></div>
                    )}
                  </div>
                </div>
                <div className={`lg:col-span-3 space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div>
                    <h2 className="text-3xl md:text-4xl text-secondary mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      {member.name}
                    </h2>
                    <p className="text-sm tracking-wider uppercase text-muted-foreground">{member.title}</p>
                  </div>
                  {member.bio && (
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>{member.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}


      {/* Call to Action */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-4xl md:text-5xl text-secondary mb-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Join the PROCURA Community
          </h2>
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            Whether you're a reader seeking your next great book, an author with a story to tell, or a literary professional looking to collaborate, we invite you to be part of our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/catalog"
              className="inline-flex items-center justify-center px-8 py-4 bg-secondary text-background hover:bg-primary transition-colors text-sm tracking-wider uppercase"
            >
              Browse Catalog
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border border-border text-secondary hover:bg-card transition-colors text-sm tracking-wider uppercase"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
