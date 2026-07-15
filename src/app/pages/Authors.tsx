import { ArrowRight } from 'lucide-react';
import { usePeople } from '../state/PeopleContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Authors() {
  const { authors } = usePeople();

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32">
          <div className="max-w-5xl">
            <p className="text-sm tracking-wider uppercase text-muted-foreground mb-6">Contributors</p>
            <h1 className="text-6xl md:text-7xl lg:text-8xl mb-12 text-secondary leading-[0.95]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Voices That<br />Matter
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Authors chosen not for their platform size, but for their craft, originality, and power to create lasting connections with readers.
            </p>
          </div>
        </div>
      </section>

      {/* Authors Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-20">
            {authors.map((author) => (
              <div key={author.id} className="group">
                <div className="aspect-[3/4] mb-6 bg-muted overflow-hidden">
                  {author.image ? (
                    <ImageWithFallback src={author.image} alt={author.name} className="w-full h-full object-cover grayscale" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50"></div>
                  )}
                </div>
                <h3 className="text-2xl mb-2 text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {author.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-1">{author.title}</p>
                {author.recognition && <p className="text-xs text-primary">{author.recognition}</p>}
                {author.bio && <p className="text-sm text-muted-foreground leading-relaxed mt-3">{author.bio}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="border-y border-border py-32 bg-card">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-20">
            <div className="space-y-8">
              <p className="text-2xl text-secondary leading-relaxed" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                "All my poetry is to empower each member of the family unit to fulfill their individual roles. The man is called to be the Provider & Protector, as the woman is meant to be the Receiver, Nurturer & Encourager mainly."
              </p>
              <div>
                <p className="text-sm text-muted-foreground">Jasper Okedi</p>
                <p className="text-xs text-muted-foreground/60">Author, Dead Dreams Are Alive</p>
              </div>
            </div>
            <div className="space-y-8">
              <p className="text-2xl text-secondary leading-relaxed" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                "This is the first of a collection of a 'ten poetry book series' of intimate expressions exchanged between Akim & Akipi. The masculine spirit of Akim sings from the position of leadership and security; the feminine spirit of Akipi sings as one in the anchoring of feminine submission."
              </p>
              <div>
                <p className="text-sm text-muted-foreground">Jasper Okedi</p>
                <p className="text-xs text-muted-foreground/60">Author, Love & Lavender</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Author Quote */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <p className="text-3xl md:text-4xl text-secondary leading-relaxed mb-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            "My writing is meant to achieve the above using “dialogue poetry”, to lead both men and women into their true roles. The man embraces the masculine while the woman embraces the feminine. The man leads the woman while she submits. This is the proper way of relationship function."
          </p>
          <div>
            <p className="text-sm tracking-wider uppercase text-muted-foreground">Jasper Okedi</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Founder & Author</p>
          </div>
        </div>
      </section>

      {/* Video Interview */}
      <section className="border-y border-border py-32 bg-card">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-sm tracking-wider uppercase text-muted-foreground mb-4">In Conversation</p>
            <h2 className="text-4xl md:text-5xl text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Watch the Interview
            </h2>
          </div>
          <div className="relative w-full aspect-video border border-border overflow-hidden">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/VZYH3EMHSPE?si=kN_K-rNyQDKNyjGx"
              title="YouTube video player"
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Submission Process */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl text-secondary mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Work With Us
            </h2>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              We seek manuscripts that demonstrate craft, originality, and the power to move readers. Stories chosen for their literary merit, not market trends.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16 mb-20">
            <div>
              <div className="text-5xl mb-6 text-muted-foreground/20" style={{ fontFamily: 'Cormorant Garamond, serif' }}>01</div>
              <h3 className="text-xl mb-4 text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Submit</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Send your completed manuscript, query letter, and author biography through our contact form.
              </p>
            </div>
            <div>
              <div className="text-5xl mb-6 text-muted-foreground/20" style={{ fontFamily: 'Cormorant Garamond, serif' }}>02</div>
              <h3 className="text-xl mb-4 text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Evaluation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our editorial collective reviews every submission for craft, originality, and cultural resonance.
              </p>
            </div>
            <div>
              <div className="text-5xl mb-6 text-muted-foreground/20" style={{ fontFamily: 'Cormorant Garamond, serif' }}>03</div>
              <h3 className="text-xl mb-4 text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Partnership</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If selected, we build a collaborative relationship to bring your work to discerning readers worldwide.
              </p>
            </div>
          </div>

          <div>
            <a
              href="/contact"
              className="inline-flex items-center gap-3 text-secondary hover:text-primary transition-colors group text-sm tracking-wider uppercase"
            >
              Submit Your Work
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
