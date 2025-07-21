import { BrowserLink } from "../components/BrowserRouter.js";
import { auth, database } from "../lib/supabase.js";

export default function HomePage() {
  // Initialiser l'affichage utilisateur après le rendu
  setTimeout(async () => {
    await updateUserDisplay();
    await loadCommunities(); // Charger les communautés
    // Écouter les changements d'authentification
    auth.onAuthStateChange((event, session) => {
      updateUserDisplay();
      loadCommunities(); // Recharger les communautés quand l'auth change
    });
  }, 100);

  return {
    tag: "div",
    children: [
      createNavbar(),
      createContent()
    ]
  };
}

function createNavbar() {
  return {
    tag: "div",
    attributes: [["class", "navbar-desktop"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "container"]],
        children: [
          // Logo
          {
            tag: "div",
            attributes: [["class", "logo"]],
            children: [
              {
                tag: "img",
                attributes: [["class", "icon"], ["alt", ""], ["src", "images/logo.svg"]]
              },
              {
                tag: "div",
                attributes: [["class", "konect"]],
                children: ["Qonect"]
              }
            ]
          },
          
          // Navigation
          {
            tag: "div",
            attributes: [["class", "navigation"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "dropdown-separated"]],
                children: [
                  {
                    tag: "img",
                    attributes: [["class", "map-pin-icon"], ["alt", ""], ["src", "images/Icon_location.svg"]]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "label"]],
                    children: ["Paris"]
                  },
                  {
                    tag: "img",
                    attributes: [["class", "chevron-icon"], ["alt", ""], ["src", "images/Arrow.svg"]]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "divider"]],
                    children: [
                      {
                        tag: "div",
                        attributes: [["class", "divider1"]],
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                tag: "div",
                attributes: [["class", "dropdown"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "label"]],
                    children: ["Evenement"]
                  },
                  {
                    tag: "img",
                    attributes: [["class", "chevron-icon"], ["alt", ""], ["src", "images/Arrow.svg"]]
                  }
                ]
              },
              BrowserLink({
                link: "/communities",
                title: {
                  tag: "div",
                  attributes: [["class", "nav-link"]],
                  children: [
                    {
                      tag: "div",
                      attributes: [["class", "label"]],
                      children: ["Mes Communautés"]
                    }
                  ]
                }
              }),
              {
                tag: "div",
                attributes: [["class", "nav-link"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "label"]],
                    children: ["Billeterie"]
                  }
                ]
              },
              {
                tag: "div",
                attributes: [["class", "dropdown"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "label"]],
                    children: ["Centre d'aide"]
                  },
                  {
                    tag: "img",
                    attributes: [["class", "chevron-icon"], ["alt", ""], ["src", "images/Arrow.svg"]]
                  }
                ]
              }
            ]
          },
          
          // Buttons
          {
            tag: "div",
            attributes: [["class", "buttons"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "button-group"], ["id", "user-display-area"]],
                children: [
                  BrowserLink({
                    link: "/connexion",
                    title: {
                      tag: "div",
                      attributes: [["class", "dark-button"]],
                      children: [
                        {
                          tag: "img",
                          attributes: [["class", "map-pin-icon"], ["alt", ""], ["src", "images/Icon.svg"]]
                        },
                        {
                          tag: "div",
                          attributes: [["class", "label5"]],
                          children: ["Connexion"]
                        }
                      ]
                    }
                  })
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}

function createContent() {
  return {
    tag: "div",
    attributes: [["class", "content"]],
    children: [
      createHeroSection(),
      createCategoriesSection(),
      createUpcomingEventsSection(),
      createPopularNearEventsSection(),
      createFilterableEventsSection(),
      createSportsSection(),
      createMusicDanceSection(),
      createFeaturedSection(),
      createCommunitiesSection(), // Nouvelle section pour les communautés
      createBannerSection()
    ]
  };
}

function createHeroSection() {
  return {
    tag: "div",
    attributes: [["class", "search-form-hero"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "slider-background"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "prev-next-buttons"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "secondary-button"]],
                children: [
                  {
                    tag: "img",
                    attributes: [["class", "icon"], ["alt", ""], ["src", "images/Icon_location.svg"]]
                  }
                ]
              },
              {
                tag: "div",
                attributes: [["class", "secondary-button"]],
                children: [
                  {
                    tag: "img",
                    attributes: [["class", "icon"], ["alt", ""], ["src", "images/Icon_location.svg"]]
                  }
                ]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "text"]],
            children: [
              {
                tag: "b",
                attributes: [["class", "title"]],
                children: ["Découvrez des événements près de chez vous"]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "text1"]],
            children: ["Un seul endroit pour tous vos billets d'événements"]
          },
          {
            tag: "div",
            attributes: [["class", "event"]],
            children: [
              {
                tag: "img",
                attributes: [["class", "image-icon"], ["alt", ""], ["src", "images/image_header.jpg"]]
              },
              {
                tag: "div",
                attributes: [["class", "ticket"]],
                children: [
                  {
                    tag: "img",
                    attributes: [["class", "shape-icon"], ["alt", ""], ["src", "images/shape.svg"]]
                  },
                  {
                    tag: "img",
                    attributes: [["class", "divider-icon"], ["alt", ""], ["src", "images/divider.svg"]]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "text2"]],
                    children: [
                      {
                        tag: "div",
                        attributes: [["class", "jusqu"]],
                        children: ["Jusqu'à"]
                      },
                      {
                        tag: "div",
                        attributes: [["class", "div"]],
                        children: ["€56"]
                      }
                    ]
                  },
                  {
                    tag: "img",
                    attributes: [["class", "star-icon"], ["alt", ""], ["src", "images/star.svg"]]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        tag: "div",
        attributes: [["class", "search-form"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "input"]],
            children: [
              {
                tag: "img",
                attributes: [["class", "arrow-icon"], ["alt", ""], ["src", "images/Icon.svg"]]
              },
              {
                tag: "div",
                attributes: [["class", "placeholder"]],
                children: ["Recherche par événement ou communauté"]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "select"]],
            children: [
              {
                tag: "img",
                attributes: [["class", "arrow-icon"], ["alt", ""], ["src", "images/Icon_location.svg"]]
              },
              {
                tag: "div",
                attributes: [["class", "placeholder"]],
                children: ["Lieu"]
              },
              {
                tag: "img",
                attributes: [["class", "arrow-icon"], ["alt", ""], ["src", "images/Arrow.svg"]]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "primary-button"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "label"]],
                children: ["Recherche"]
              }
            ]
          }
        ]
      }
    ]
  };
}

function createCategoriesSection() {
  return {
    tag: "div",
    attributes: [["class", "categories"]],
    children: [
      createCategoryCard("images/microphone.svg", "Concerts"),
      createCategoryCard("images/basketball.svg", "Sports"),
      createCategoryCard("images/target.svg", "Loisirs"),
      createCategoryCard("images/mirror-ball.svg", "Disco"),
      createCategoryCard("images/press-conference.svg", "Conference"),
      createCategoryCard("images/drama.svg", "Cinema")
    ]
  };
}

function createCategoryCard(iconSrc, text) {
  return {
    tag: "div",
    attributes: [["class", "column"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "events-category-card"]],
        children: [
          {
            tag: "img",
            attributes: [["class", "microphone-icon"], ["alt", ""], ["src", iconSrc]]
          },
          {
            tag: "div",
            attributes: [["class", "text3"]],
            children: [text]
          }
        ]
      }
    ]
  };
}

function createUpcomingEventsSection() {
  return {
    tag: "div",
    attributes: [["class", "upcoming-events"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "date-slider-title"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "date-slider"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "text9"]],
                children: [
                  {
                    tag: "b",
                    attributes: [["class", "number"]],
                    children: ["16"]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "text10"]],
                    children: ["Octobre, 2025"]
                  }
                ]
              },
              {
                tag: "div",
                attributes: [["class", "pre-next-buttons"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "secondary-button2"]],
                    children: [
                      {
                        tag: "img",
                        attributes: [["class", "icon"], ["alt", ""], ["src", "images/Icon.svg"]]
                      }
                    ]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "secondary-button2"]],
                    children: [
                      {
                        tag: "img",
                        attributes: [["class", "icon"], ["alt", ""], ["src", "images/Icon.svg"]]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "heading"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "heading1"]],
                children: ["Événements virtuel à venir"]
              },
              {
                tag: "div",
                attributes: [["class", "view-all-button"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "label"]],
                    children: ["Tout voir"]
                  },
                  {
                    tag: "img",
                    attributes: [["class", "icon"], ["alt", ""], ["src", "images/Arrow.svg"]]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        tag: "div",
        attributes: [["class", "divider"]],
        children: []
      },
      {
        tag: "div",
        attributes: [["class", "listings"]],
        children: [
          createEventCard1("images/event_1.jpg", "Nov 28", "15:00", "Événement virtuel", "Conference Notre Dame", "Free"),
          createEventCard1("images/event_2.jpg", "Nov 28", "17:00", "Événement virtuel", "Podcast motivation", "€15.00"),
          createEventCard1("images/event_3.jpg", "Nov 28", "8:30", "Événement virtuel", "Méditation du dimanche", "€23.00"),
          createEventCard1("images/event_4.jpg", "Nov 28", "10:00", "Événement virtuel", "Étirements et exercices du matin", "€12.00")
        ]
      }
    ]
  };
}

function createEventCard1(imageSrc, date, time, type, title, price) {
  return {
    tag: "div",
    attributes: [["class", "event-listing-card-v1"]],
    children: [
      {
        tag: "img",
        attributes: [["class", "image-icon1"], ["alt", ""], ["src", imageSrc]]
      },
      {
        tag: "div",
        attributes: [["class", "body"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "metatitle"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "meta"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "date"]],
                    children: [
                      {
                        tag: "img",
                        attributes: [["class", "calendar-icon"], ["alt", ""], ["src", "images/calendar.svg"]]
                      },
                      {
                        tag: "div",
                        attributes: [["class", "time"]],
                        children: [date]
                      }
                    ]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "time"]],
                    children: [time]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "time"]],
                    children: ["·"]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "time"]],
                    children: [type]
                  }
                ]
              },
              {
                tag: "div",
                attributes: [["class", "title1"]],
                children: [title]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "price"]],
            children: [price]
          }
        ]
      }
    ]
  };
}

function createPopularNearEventsSection() {
  return {
    tag: "div",
    attributes: [["class", "popular-near-events"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "header"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "heading-pills"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "heading2"]],
                children: ["Populaire à proximité"]
              },
              {
                tag: "div",
                attributes: [["class", "pills"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "pill"]],
                    children: [
                      {
                        tag: "div",
                        attributes: [["class", "label2"]],
                        children: ["Tout"]
                      }
                    ]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "pill1"]],
                    children: [
                      {
                        tag: "div",
                        attributes: [["class", "label2"]],
                        children: ["Theater & Cinema"]
                      }
                    ]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "pill1"]],
                    children: [
                      {
                        tag: "div",
                        attributes: [["class", "label2"]],
                        children: ["Sports"]
                      }
                    ]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "pill1"]],
                    children: [
                      {
                        tag: "div",
                        attributes: [["class", "label2"]],
                        children: ["Concert"]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "view-all-button"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "label"]],
                children: ["Tout voir"]
              },
              {
                tag: "img",
                attributes: [["class", "icon"], ["alt", ""], ["src", "images/icon.svg"]]
              }
            ]
          }
        ]
      },
      {
        tag: "div",
        attributes: [["class", "listings1"]],
        children: [
          createLargeEventCard("images/proxi_1.jpg", "Nov 7", "10:00", "Sports", "Entraînez-vous avec des stars du fitness", "Montreuil", "€25.00"),
          {
            tag: "div",
            attributes: [["class", "column6"]],
            children: [
              createSmallEventCard("images/proxi_2.jpg", "Dec 26", "19:00", "Concert", "Winter Fest", "Amiens", "€32.00"),
              createSmallEventCard("images/proxi_3.jpg", "Oct 15", "18:00", "Théatre et Cinéma", "Parallax Show Ballet", "MO", "€56.00")
            ]
          }
        ]
      }
    ]
  };
}

function createLargeEventCard(imageSrc, date, time, type, title, location, price) {
  return {
    tag: "div",
    attributes: [["class", "event-listing-card-v14"]],
    children: [
      {
        tag: "img",
        attributes: [["class", "image-icon5"], ["alt", ""], ["src", imageSrc]]
      },
      {
        tag: "div",
        attributes: [["class", "body4"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "metatitle4"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "meta"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "date"]],
                    children: [
                      {
                        tag: "img",
                        attributes: [["class", "calendar-icon"], ["alt", ""], ["src", "images/calendar.svg"]]
                      },
                      {
                        tag: "div",
                        attributes: [["class", "time"]],
                        children: [date]
                      }
                    ]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "time"]],
                    children: [time]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "time"]],
                    children: ["·"]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "time"]],
                    children: [type]
                  }
                ]
              },
              {
                tag: "div",
                attributes: [["class", "title1"]],
                children: [title]
              },
              {
                tag: "div",
                attributes: [["class", "date"]],
                children: [
                  {
                    tag: "img",
                    attributes: [["class", "calendar-icon"], ["alt", ""], ["src", "images/map-pin.svg"]]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "time"]],
                    children: [location]
                  }
                ]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "price-button"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "price4"]],
                children: [price]
              },
              {
                tag: "div",
                attributes: [["class", "dark-button"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "label2"]],
                    children: ["Réserver"]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}

function createSmallEventCard(imageSrc, date, time, type, title, location, price) {
  return {
    tag: "div",
    attributes: [["class", "event-listing-card-v2"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "body4"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "meta-title"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "meta-title"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "meta"]],
                    children: [
                      {
                        tag: "div",
                        attributes: [["class", "date"]],
                        children: [
                          {
                            tag: "img",
                            attributes: [["class", "calendar-icon"], ["alt", ""], ["src", "images/calendar.svg"]]
                          },
                          {
                            tag: "div",
                            attributes: [["class", "time"]],
                            children: [date]
                          }
                        ]
                      },
                      {
                        tag: "div",
                        attributes: [["class", "time"]],
                        children: [time]
                      },
                      {
                        tag: "div",
                        attributes: [["class", "time"]],
                        children: ["·"]
                      },
                      {
                        tag: "div",
                        attributes: [["class", "time"]],
                        children: [type]
                      }
                    ]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "title1"]],
                    children: [title]
                  }
                ]
              },
              {
                tag: "div",
                attributes: [["class", "date"]],
                children: [
                  {
                    tag: "img",
                    attributes: [["class", "calendar-icon"], ["alt", ""], ["src", "images/map-pin.svg"]]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "time"]],
                    children: [location]
                  }
                ]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "price-button"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "price4"]],
                children: [price]
              },
              {
                tag: "div",
                attributes: [["class", "dark-button"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "label2"]],
                    children: ["Réserver"]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        tag: "img",
        attributes: [["class", "image-icon6"], ["alt", ""], ["src", imageSrc]]
      }
    ]
  };
}

function createFilterableEventsSection() {
  return {
    tag: "div",
    attributes: [["class", "filterable-events"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "content1"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "heading3"]],
            children: ["Sélectionnez votre événement"]
          },
          {
            tag: "div",
            attributes: [["class", "filters"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "inputs"]],
                children: [
                  createFilterSelect("images/Icon.svg", "Categorie", "images/Arrow.svg"),
                  createFilterSelect("images/Icon.svg", "Lieu", "images/Arrow.svg"),
                  createFilterSelect("images/Icon.svg", "Date", null),
                  createFilterSelect("images/Icon.svg", "Prix", "images/Arrow.svg")
                ]
              },
              {
                tag: "div",
                attributes: [["class", "sort"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "label10"]],
                    children: ["Trier par"]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "select4"]],
                    children: [
                      {
                        tag: "img",
                        attributes: [["class", "icon8"], ["alt", ""], ["src", "images/Icon.svg"]]
                      },
                      {
                        tag: "div",
                        attributes: [["class", "option"]],
                        children: ["Plus populaire"]
                      },
                      {
                        tag: "img",
                        attributes: [["class", "icon8"], ["alt", ""], ["src", "images/Arrow.svg"]]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "listings2"]],
            children: [
              createFilteredEventCard("images/s_event_1.jpg", "Sep 23", "18:00", "Conference", "Forum d'affaires de Chicago", "Chicago", "€75.00"),
              createFilteredEventCard("images/s_event_2.png", "Nov 8", "17:30", "Concert", "Soirée musique classique", "Strasbourg", "€60.00"),
              createFilteredEventCard("images/s_event_3.png", "Oct 16", "22:00", "Disco", "Disco Sunset Party", "Paris", "€45.00")
            ]
          }
        ]
      },
      {
        tag: "div",
        attributes: [["class", "primary-button1"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "label"]],
            children: ["Afficher les 32 événements"]
          }
        ]
      }
    ]
  };
}

function createFilterSelect(iconSrc, text, arrowSrc) {
  return {
    tag: "div",
    attributes: [["class", "select1"]],
    children: [
      {
        tag: "img",
        attributes: [["class", "icon8"], ["alt", ""], ["src", iconSrc]]
      },
      {
        tag: "div",
        attributes: [["class", arrowSrc ? "option" : "placeholder4"]],
        children: [text]
      },
      ...(arrowSrc ? [{
        tag: "img",
        attributes: [["class", "icon8"], ["alt", ""], ["src", arrowSrc]]
      }] : [])
    ]
  };
}

function createFilteredEventCard(imageSrc, date, time, type, title, location, price) {
  return {
    tag: "div",
    attributes: [["class", "event-listing-card-v15"]],
    children: [
      {
        tag: "img",
        attributes: [["class", "image-icon5"], ["alt", ""], ["src", imageSrc]]
      },
      {
        tag: "div",
        attributes: [["class", "body"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "metatitle4"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "meta"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "date"]],
                    children: [
                      {
                        tag: "img",
                        attributes: [["class", "calendar-icon"], ["alt", ""], ["src", "images/calendar.svg"]]
                      },
                      {
                        tag: "div",
                        attributes: [["class", "time"]],
                        children: [date]
                      }
                    ]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "time"]],
                    children: [time]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "time"]],
                    children: ["·"]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "time"]],
                    children: [type]
                  }
                ]
              },
              {
                tag: "div",
                attributes: [["class", "title1"]],
                children: [title]
              },
              {
                tag: "div",
                attributes: [["class", "date"]],
                children: [
                  {
                    tag: "img",
                    attributes: [["class", "calendar-icon"], ["alt", ""], ["src", "images/map-pin.svg"]]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "time"]],
                    children: [location]
                  }
                ]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "price-button"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "price4"]],
                children: [price]
              },
              {
                tag: "div",
                attributes: [["class", "dark-button"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "label2"]],
                    children: ["Réserver"]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}

function createSportsSection() {
  return {
    tag: "div",
    attributes: [["class", "popular-near-events"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "header"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "heading4"]],
            children: ["Sports"]
          },
          {
            tag: "div",
            attributes: [["class", "view-all-button"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "label"]],
                children: ["Tout voir"]
              },
              {
                tag: "img",
                attributes: [["class", "icon"], ["alt", ""], ["src", "images/Arrow.svg"]]
              }
            ]
          }
        ]
      },
      {
        tag: "div",
        attributes: [["class", "listings3"]],
        children: [
          createSportCard("images/event_3.jpg", "Jul 8", "10:30", "New York", "Championnat de football : la bataille pour la coupe"),
          createSportCard("images/event_1.jpg", "Jun 29", "13:45", "Berlin", "Evenement de sport : j'ai plus d'idée là"),
          createSportCard("images/event_4.jpg", "May 17", "12:00", "Marseille", "Evenement de sport : j'ai plus d'idée là"),
          createSportCard("images/event_2.jpg", "Aug 23", "18:00", "Tours", "Evenement de sport : j'ai plus d'idée là"),
          {
            tag: "div",
            attributes: [["class", "secondary-button4"]],
            children: [
              {
                tag: "img",
                attributes: [["class", "icon"], ["alt", ""], ["src", "images/Icon.svg"]]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "secondary-button5"]],
            children: [
              {
                tag: "img",
                attributes: [["class", "icon"], ["alt", ""], ["src", "images/Arrow.svg"]]
              }
            ]
          }
        ]
      }
    ]
  };
}

function createSportCard(imageSrc, date, time, location, title) {
  return {
    tag: "div",
    attributes: [["class", "event-listing-card-v3"]],
    children: [
      {
        tag: "img",
        attributes: [["class", "image-icon11"], ["alt", ""], ["src", imageSrc]]
      },
      {
        tag: "div",
        attributes: [["class", "meta-title"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "meta10"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "date"]],
                children: [
                  {
                    tag: "img",
                    attributes: [["class", "calendar-icon"], ["alt", ""], ["src", "images/calendar.svg"]]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "time"]],
                    children: [date]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "time"]],
                    children: [time]
                  }
                ]
              },
              {
                tag: "div",
                attributes: [["class", "date"]],
                children: [
                  {
                    tag: "img",
                    attributes: [["class", "calendar-icon"], ["alt", ""], ["src", "images/map-pin.svg"]]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "time"]],
                    children: [location]
                  }
                ]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "title1"]],
            children: [title]
          }
        ]
      }
    ]
  };
}

function createMusicDanceSection() {
  return {
    tag: "div",
    attributes: [["class", "popular-near-events"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "header"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "heading4"]],
            children: ["Music & Dance"]
          },
          {
            tag: "div",
            attributes: [["class", "view-all-button"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "label"]],
                children: ["Tout voir"]
              },
              {
                tag: "img",
                attributes: [["class", "icon"], ["alt", ""], ["src", "images/Arrow.svg"]]
              }
            ]
          }
        ]
      },
      {
        tag: "div",
        attributes: [["class", "listings3"]],
        children: [
          createSportCard("images/proxi_3.jpg", "Dec 19", "11:30", "Los Angeles", "Spectacle de ballet"),
          createSportCard("images/soiree_music.jpg", "Nov 21", "14:00", "Paris", "Soirée musique classique"),
          createSportCard("images/chanteur_xxx.jpg", "Nov 15", "20:00", "San Francisco", "Chanteurs Xxxx"),
          createSportCard("images/duel_danse.jpg", "Oct 17", "18:30", "Tokyo", "Duel de danse urbaine"),
          {
            tag: "div",
            attributes: [["class", "secondary-button4"]],
            children: [
              {
                tag: "img",
                attributes: [["class", "icon"], ["alt", ""], ["src", "images/Icon.svg"]]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "secondary-button5"]],
            children: [
              {
                tag: "img",
                attributes: [["class", "icon"], ["alt", ""], ["src", "images/Arrow.svg"]]
              }
            ]
          }
        ]
      }
    ]
  };
}

function createFeaturedSection() {
  return {
    tag: "div",
    attributes: [["class", "popular-near-events"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "divider1"]],
        children: []
      },
      {
        tag: "div",
        attributes: [["class", "header"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "heading4"]],
            children: ["À la une"]
          },
          {
            tag: "div",
            attributes: [["class", "view-all-button"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "label"]],
                children: ["Tout voir"]
              },
              {
                tag: "img",
                attributes: [["class", "icon"], ["alt", ""], ["src", "images/Arrow.svg"]]
              }
            ]
          }
        ]
      },
      {
        tag: "div",
        attributes: [["class", "cards"]],
        children: [
          createBlogCard("images/uno1.jpg", "Concert", "Outils pour vendre des billets en ligne et gérer vos concerts", "Créez et gérez facilement vos concerts sur notre plateforme pour offrir des expériences inoubliables à…", "10"),
          createBlogCard("images/uno2.jpg", "Planing", "Idées d'événements pour célébrer la culture, et les communautés", "S'impliquer auprès de votre communauté et célébrer la culture ensemble est aussi une stratégie intelligente pour votre entreprise...", "15"),
          createBlogCard("images/uno1.jpg", "Hobbies", "20 idées d'activités créatives pour événements afin de favoriser un changement positif", "Le type d'événement que vous choisissez dépend de vos objectifs. Pour vous inspirer à franchir la prochaine étape, il...", "8")
        ]
      }
    ]
  };
}

function createBlogCard(imageSrc, category, title, excerpt, duration) {
  return {
    tag: "div",
    attributes: [["class", "blog-card-v8"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "image"]],
        children: [
          {
            tag: "img",
            attributes: [["class", "image-icon19"], ["alt", ""], ["src", imageSrc]]
          },
          {
            tag: "div",
            attributes: [["class", "category10"]],
            children: [category]
          }
        ]
      },
      {
        tag: "div",
        attributes: [["class", "body18"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "text21"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "title19"]],
                children: [title]
              },
              {
                tag: "div",
                attributes: [["class", "excerpt"]],
                children: [excerpt]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "length"]],
            children: [`Lecture : ${duration} minutes`]
          }
        ]
      }
    ]
  };
}

function createBannerSection() {
  return {
    tag: "div",
    attributes: [["class", "banner"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "image3"]],
        children: [
          {
            tag: "img",
            attributes: [["class", "phone-icon"], ["alt", ""], ["src", "images/phone.svg"]]
          },
          {
            tag: "div",
            attributes: [["class", "secondary-button8"]],
            children: [
              {
                tag: "img",
                attributes: [["class", "calendar-icon"], ["alt", ""], ["src", "images/Icon.svg"]]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "secondary-button9"]],
            children: [
              {
                tag: "img",
                attributes: [["class", "calendar-icon"], ["alt", ""], ["src", "images/Icon.svg"]]
              }
            ]
          },
          {
            tag: "img",
            attributes: [["class", "image-icon22"], ["alt", ""], ["src", "images/reduc.png"]]
          },
          {
            tag: "div",
            attributes: [["class", "search"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "border"]],
                children: []
              },
              {
                tag: "div",
                attributes: [["class", "rechercher"]],
                children: ["Rechercher..."]
              },
              {
                tag: "img",
                attributes: [["class", "icon22"], ["alt", ""], ["src", "images/icon.svg"]]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "logo"]],
            children: [
              {
                tag: "img",
                attributes: [["class", "icon23"], ["alt", ""], ["src", "images/icon.svg"]]
              },
              {
                tag: "div",
                attributes: [["class", "konect"]],
                children: ["Qonect"]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "primary-button2"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "label"]],
                children: ["Reserver"]
              }
            ]
          }
        ]
      },
      {
        tag: "div",
        attributes: [["class", "text24"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "text25"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "heading7"]],
                children: ["Téléchargez notre application !"]
              },
              {
                tag: "div",
                attributes: [["class", "excerpt"]],
                children: ["Trouvez l'événement parfait près de chez vous, réservez vos billets ou votre place pour des expériences passionnantes — tout cela en un seul endroit avec l'application Finder. Découvrez des événements, sécurisez votre réservation et profitez d'offres exclusives en toute simplicité. Installez l'application dès maintenant et ne ratez plus jamais rien !"]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "pre-next-buttons"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "app-store-button"]],
                children: [
                  {
                    tag: "img",
                    attributes: [["class", "google-play-icon"], ["alt", ""], ["src", "images/appstore_logo.svg"]]
                  },
                  {
                    tag: "img",
                    attributes: [["class", "app-store-icon"], ["alt", ""], ["src", "images/app_store.svg"]]
                  }
                ]
              },
              {
                tag: "div",
                attributes: [["class", "app-store-button"]],
                children: [
                  {
                    tag: "img",
                    attributes: [["class", "google-play-icon"], ["alt", ""], ["src", "images/google_play_logo.svg"]]
                  },
                  {
                    tag: "img",
                    attributes: [["class", "google-play-icon1"], ["alt", ""], ["src", "images/Google play.svg"]]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}

// === SECTION COMMUNAUTÉS ===

function createCommunitiesSection() {
  return {
    tag: "div",
    attributes: [["class", "popular-near-events"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "header"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "heading4"]],
            children: ["🏘️ Découvrez les Communautés"]
          },
          {
            tag: "div",
            attributes: [["class", "view-all-button"]],
            children: [
              BrowserLink({
                link: "/communities",
                title: {
                  tag: "div",
                  attributes: [["class", "label"]],
                  children: ["Gérer mes communautés"]
                }
              }),
              {
                tag: "img",
                attributes: [["class", "icon"], ["alt", ""], ["src", "images/Arrow.svg"]]
              }
            ]
          }
        ]
      },
      {
        tag: "div",
        attributes: [["id", "communities-container"], ["style", { minHeight: "200px" }]],
        children: [
          {
            tag: "div",
            attributes: [["style", { textAlign: "center", padding: "50px", color: "#666" }]],
            children: ["Chargement des communautés..."]
          }
        ]
      }
    ]
  };
}

// Fonction pour charger les communautés
async function loadCommunities() {
  try {
    const { data: communities, error } = await database.getCommunities();
    
    if (error) {
      console.error('Erreur lors du chargement des communautés:', error);
      return;
    }

    await displayCommunities(communities || []);
  } catch (error) {
    console.error('Erreur inattendue:', error);
  }
}

// Fonction pour afficher les communautés
async function displayCommunities(communities) {
  const container = document.getElementById('communities-container');
  if (!container) return;
  
  if (communities.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 50px; color: #666;">
        <p>🏘️ Aucune communauté disponible pour le moment.</p>
        <p><a href="/communities" style="color: #007bff; text-decoration: none;">Créez la première communauté !</a></p>
      </div>
    `;
    return;
  }

  // Récupérer l'utilisateur actuel pour vérifier les appartenances
  const { data: { user } } = await auth.getCurrentUser();
  
  // Vérifier les appartenances si l'utilisateur est connecté
  let userMemberships = [];
  if (user) {
    try {
      const { data: memberships } = await database.getUserMemberships(user.id);
      userMemberships = memberships?.map(m => m.community_id) || [];
    } catch (error) {
      console.error('Erreur lors du chargement des appartenances:', error);
    }
  }

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 25px; padding: 20px 0;">
      ${communities.map(community => createCommunityCard(community, user, userMemberships)).join('')}
    </div>
  `;
}

// Fonction pour créer une carte de communauté
function createCommunityCard(community, user, userMemberships) {
  const isUserReferent = user && community.referent_id === user.id;
  const isUserMember = user && userMemberships.includes(community.id);
  
  let actionButton = '';
  if (!user) {
    actionButton = `
      <button onclick="navigateToLogin()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
        Se connecter pour rejoindre
      </button>
    `;
  } else if (isUserReferent) {
    actionButton = `
      <button onclick="viewDashboard('${community.id}')" style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
        📊 Dashboard
      </button>
    `;
  } else if (isUserMember) {
    actionButton = `
      <button onclick="leaveCommunityFromHome('${community.id}')" style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
        Quitter
      </button>
    `;
  } else {
    actionButton = `
      <button onclick="joinCommunityFromHome('${community.id}')" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
        🤝 Rejoindre
      </button>
    `;
  }

  const imageHtml = community.image_url 
    ? `<img src="${community.image_url}" alt="${community.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;" onerror="this.style.display='none'">` 
    : '';

  return `
    <div style="
      border: 1px solid #ddd; 
      border-radius: 15px; 
      padding: 20px; 
      background: #fff; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
      position: relative;
    " onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.1)'">
      
      ${imageHtml}
      
      <div style="margin-bottom: 10px;">
        <span style="
          background: #e9ecef; 
          color: #6c757d; 
          padding: 4px 8px; 
          border-radius: 12px; 
          font-size: 12px; 
          font-weight: 600;
          text-transform: uppercase;
        ">${community.category}</span>
      </div>
      
      <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px; font-weight: 600;">${community.name}</h3>
      
      <p style="margin: 0 0 10px 0; color: #666; font-size: 14px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
        ${community.description}
      </p>
      
      <div style="display: flex; align-items: center; margin-bottom: 15px; color: #888; font-size: 14px;">
        <span style="margin-right: 4px;">📍</span>
        <span>${community.location}</span>
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
        <div style="font-size: 12px; color: #999;">
          Créée le ${new Date(community.created_at).toLocaleDateString('fr-FR')}
        </div>
        ${actionButton}
      </div>
    </div>
  `;
}

// Fonction pour rejoindre une communauté depuis la page d'accueil
async function joinCommunityFromHome(communityId) {
  try {
    const { data: { user } } = await auth.getCurrentUser();
    
    if (!user) {
      alert('Vous devez être connecté pour rejoindre une communauté.');
      return;
    }

    const { error } = await database.joinCommunity(user.id, communityId);
    
    if (error) {
      alert(`Erreur lors de l'adhésion : ${error.message}`);
    } else {
      alert('Vous avez rejoint la communauté avec succès ! 🎉');
      await loadCommunities(); // Recharger les communautés
    }
  } catch (error) {
    alert(`Erreur inattendue : ${error.message}`);
  }
}

// Fonction pour quitter une communauté depuis la page d'accueil
async function leaveCommunityFromHome(communityId) {
  if (!confirm('Êtes-vous sûr de vouloir quitter cette communauté ?')) {
    return;
  }

  try {
    const { data: { user } } = await auth.getCurrentUser();
    
    if (!user) {
      alert('Erreur : utilisateur non connecté.');
      return;
    }

    const { error } = await database.leaveCommunity(user.id, communityId);
    
    if (error) {
      alert(`Erreur : ${error.message}`);
    } else {
      alert('Vous avez quitté la communauté.');
      await loadCommunities(); // Recharger les communautés
    }
  } catch (error) {
    alert(`Erreur inattendue : ${error.message}`);
  }
}

// Fonction pour voir le dashboard d'une communauté
function viewDashboard(communityId) {
  window.history.pushState({}, '', `/community-dashboard?id=${communityId}`);
  const popStateEvent = new PopStateEvent('popstate', { state: {} });
  window.dispatchEvent(popStateEvent);
}

// Fonction pour mettre à jour l'affichage utilisateur dans la navbar
async function updateUserDisplay() {
  const userDisplayArea = document.getElementById('user-display-area');
  if (!userDisplayArea) return;
  
  try {
    const { data: { user } } = await auth.getCurrentUser();
    
    if (user) {
      // Utilisateur connecté - afficher nom/prénom et bouton déconnexion
      let displayName = user.email;
      if (user.user_metadata && user.user_metadata.full_name) {
        displayName = user.user_metadata.full_name;
      } else if (user.user_metadata && user.user_metadata.prenom && user.user_metadata.nom) {
        displayName = `${user.user_metadata.prenom} ${user.user_metadata.nom}`;
      }
      
      userDisplayArea.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="text-align: right;">
            <div style="font-weight: 600; color: #333; font-size: 14px;"> ${displayName}</div>
            <div style="font-size: 12px; color: #666;">${user.email}</div>
          </div>
          <button id="logout-btn" class="dark-button" style="padding: 8px 16px; font-size: 14px;">
            Déconnexion
          </button>
        </div>
      `;
      
      // Ajouter l'événement de déconnexion
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
          await handleLogout();
        });
      }
      
    } else {
      // Utilisateur non connecté - afficher bouton connexion
      userDisplayArea.innerHTML = `
        <div class="dark-button" style="cursor: pointer;" onclick="navigateToLogin()">
          <img class="map-pin-icon" alt="" src="images/Icon.svg" />
          <div class="label5">Connexion</div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'utilisateur:', error);
  }
}

async function handleLogout() {
  try {
    const { error } = await auth.signOut();
    if (error) {
      console.error('Erreur de déconnexion:', error);
    } else {
      // Rafraîchir l'affichage
      await updateUserDisplay();
    }
  } catch (error) {
    console.error('Erreur inattendue:', error);
  }
}

function navigateToLogin() {
  window.history.pushState({}, '', '/connexion');
  const popStateEvent = new PopStateEvent('popstate', { state: {} });
  window.dispatchEvent(popStateEvent);
}

// Rendre les fonctions disponibles globalement
window.navigateToLogin = navigateToLogin;
window.joinCommunityFromHome = joinCommunityFromHome;
window.leaveCommunityFromHome = leaveCommunityFromHome;
window.viewDashboard = viewDashboard;