import { z } from 'zod';
export const schemas = {
  pages: {
    home: z.object({
      "announcement": z.object({
        "text": z.string(),
        "cta": z.string(),
        "ctaHref": z.string(),
        "targetDate": z.string()
      }),
      "hero": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "subtitle": z.string(),
        "tagline": z.string(),
        "primaryCta": z.string(),
        "primaryCtaHref": z.string(),
        "secondaryCta": z.string(),
        "secondaryCtaHref": z.string(),
        "videoUrl": z.string()
      }),
      "partners": z.object({
        "label": z.string(),
        "logos": z.array(z.object({
          "id": z.string(),
          "name": z.string()
        }))
      }),
      "race": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "body": z.string(),
        "cta1": z.string(),
        "cta1Href": z.string(),
        "cta2": z.string(),
        "cta2Href": z.string()
      }),
      "season": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "allRacesCta": z.string(),
        "allRacesHref": z.string(),
        "events": z.array(z.object({
          "id": z.string(),
          "date": z.string(),
          "edition": z.string(),
          "city": z.string(),
          "href": z.string()
        }))
      }),
      "judge": z.object({
        "eyebrow": z.string(),
        "titlePart1": z.string(),
        "titlePart2": z.string(),
        "body": z.string(),
        "cta": z.string(),
        "ctaHref": z.string()
      }),
      "brands": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "body": z.string(),
        "cta": z.string(),
        "ctaHref": z.string()
      }),
      "legacyPartners": z.object({
        "eyebrow": z.string(),
        "titlePart1": z.string(),
        "titlePart2": z.string(),
        "logos": z.array(z.object({
          "id": z.string(),
          "name": z.string()
        }))
      }),
      "footer": z.object({
        "tagline": z.string(),
        "instagramUrl": z.string(),
        "linkedinUrl": z.string(),
        "email": z.string(),
        "address": z.string(),
        "copyright": z.string()
      })
    }),
    marathax_home: z.object({
      "hero": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "subtitle": z.string(),
        "body": z.string(),
        "prizeLabel": z.string(),
        "prize": z.string(),
        "cta": z.string(),
        "ctaHref": z.string(),
        "learnMore": z.string(),
        "learnMoreHref": z.string()
      }),
      "stats": z.array(z.object({
        "id": z.string(),
        "value": z.string(),
        "label": z.string()
      })),
      "about": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "body": z.string(),
        "cta": z.string(),
        "ctaHref": z.string()
      }),
      "format": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "body": z.string(),
        "cta": z.string(),
        "ctaHref": z.string(),
        "items": z.array(z.object({
          "id": z.string(),
          "icon": z.string(),
          "label": z.string()
        }))
      }),
      "prizes": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "aotLabel": z.string(),
        "aotCash": z.string(),
        "aotExtra": z.string(),
        "cta": z.string(),
        "ctaHref": z.string()
      }),
      "cta": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "body": z.string(),
        "cta": z.string(),
        "ctaHref": z.string(),
        "date": z.string()
      })
    }),
    marathax_about: z.object({
      "hero": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "body": z.string()
      }),
      "mission": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "body": z.string()
      }),
      "pillars": z.array(z.object({
        "id": z.string(),
        "title": z.string(),
        "body": z.string()
      })),
      "military": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "body": z.string(),
        "quote": z.string(),
        "quoteAuthor": z.string()
      }),
      "values": z.array(z.object({
        "id": z.string(),
        "label": z.string()
      }))
    }),
    marathax_format: z.object({
      "hero": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "body": z.string()
      }),
      "overview": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "body": z.string()
      }),
      "runSections": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "body": z.string(),
        "items": z.array(z.object({
          "id": z.string(),
          "number": z.string(),
          "label": z.string(),
          "detail": z.string()
        }))
      }),
      "stations": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "body": z.string(),
        "items": z.array(z.object({
          "id": z.string(),
          "number": z.string(),
          "label": z.string(),
          "reps": z.string(),
          "detail": z.string()
        }))
      }),
      "rules": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "items": z.array(z.object({
          "id": z.string(),
          "rule": z.string()
        }))
      }),
      "participation": z.object({
        "eyebrow": z.string(),
        "individual": z.object({
          "title": z.string(),
          "body": z.string()
        }),
        "doubles": z.object({
          "title": z.string(),
          "body": z.string()
        })
      })
    }),
    marathax_categories: z.object({
      "hero": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "body": z.string()
      }),
      "aot": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "body": z.string(),
        "prize": z.string()
      }),
      "totalPool": z.string(),
      "eventDate": z.string(),
      "openSection": z.object({
        "title": z.string(),
        "rows": z.array(z.object({
          "id": z.string(),
          "category": z.string(),
          "ageGroup": z.string(),
          "p1": z.string(),
          "p2": z.string(),
          "p3": z.string(),
          "p4": z.string(),
          "p5": z.string()
        }))
      }),
      "doublesSection": z.object({
        "title": z.string(),
        "rows": z.array(z.object({
          "id": z.string(),
          "category": z.string(),
          "ageGroup": z.string(),
          "p1": z.string(),
          "p2": z.string(),
          "p3": z.string(),
          "p4": z.string(),
          "p5": z.string()
        }))
      }),
      "risingStarSection": z.object({
        "title": z.string(),
        "rows": z.array(z.object({
          "id": z.string(),
          "category": z.string(),
          "ageGroup": z.string(),
          "p1": z.string(),
          "p2": z.string(),
          "p3": z.string(),
          "p4": z.string(),
          "p5": z.string()
        }))
      }),
      "note": z.string()
    }),
    marathax_contact: z.object({
      "hero": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "body": z.string()
      }),
      "channels": z.array(z.object({
        "id": z.string(),
        "type": z.string(),
        "label": z.string(),
        "handle": z.string(),
        "href": z.string(),
        "note": z.string()
      })),
      "form": z.object({
        "title": z.string(),
        "namePlaceholder": z.string(),
        "emailPlaceholder": z.string(),
        "subjectPlaceholder": z.string(),
        "messagePlaceholder": z.string(),
        "submitLabel": z.string()
      })
    }),
    marathax_gallery: z.object({
      "hero": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "body": z.string()
      }),
      "cta": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "button": z.string()
      })
    }),
    marathax_register: z.object({
      "hero": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "body": z.string()
      }),
      "payment": z.object({
        "label": z.string(),
        "body": z.string()
      }),
      "terms": z.object({
        "label": z.string()
      }),
      "submitLabel": z.string(),
      "successTitle": z.string(),
      "successBody": z.string(),
      "successNote": z.string(),
      "successRegisterAnother": z.string()
    })
  },
  site: z.object({
    "brandName": z.string(),
    "tagline": z.string(),
    "eventDate": z.string(),
    "eventDateISO": z.string(),
    "prizePool": z.string(),
    "athleteOfTournamentCash": z.string(),
    "nav": z.array(z.object({
      "id": z.string(),
      "label": z.string(),
      "href": z.string()
    })),
    "registerHref": z.string(),
    "instagram": z.string(),
    "whatsapp": z.string(),
    "email": z.string(),
    "footerTagline": z.string(),
    "copyright": z.string()
  })
};
export type Schemas = typeof schemas;