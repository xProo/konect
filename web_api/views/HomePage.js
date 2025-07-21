import { BrowserLink } from "../components/BrowserRouter.js";

export default function HomePage() {
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
              {
                tag: "div",
                attributes: [["class", "dropdown"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "label"]],
                    children: ["Cummunautés"]
                  },
                  {
                    tag: "img",
                    attributes: [["class", "chevron-icon"], ["alt", ""], ["src", "images/Arrow.svg"]]
                  }
                ]
              },
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
                attributes: [["class", "button-group"]],
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