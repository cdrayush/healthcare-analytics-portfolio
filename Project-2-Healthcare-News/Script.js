/* =========================================================
   HEALTHCARE NEWS
   ========================================================= */


/* =========================================================
   1. API CONFIGURATION
========================================================= */

/*
   PUT YOUR WORKING NEWSAPI KEY HERE.

   Example:

   const API_KEY = "xxxxxxxxxxxxxxxx";

   Do NOT share your API key publicly.
*/


const API_URL =
    "https://newsapi.org/v2/everything";


/* =========================================================
   2. DOM ELEMENTS
========================================================= */

const cardsContainer =
    document.getElementById("cards-container");

const templateNewsCard =
    document.getElementById("template-news-card");

const searchInput =
    document.querySelector(".news-input");

const searchButton =
    document.querySelector(".search-button");

const navLinks =
    document.querySelectorAll(".nav-item a");

const resultsCount =
    document.getElementById("results-count");


/* =========================================================
   3. APPLICATION STATE
========================================================= */

/*
   The API is called once.

   All articles are stored here.

   Category filtering and searching happen
   locally after that.
*/

let allArticles = [];

let currentCategory = "all";

let currentSearch = "";


/* =========================================================
   4. MASTER HEALTHCARE QUERY
========================================================= */

/*
   Broad healthcare query.

   We want a large healthcare pool instead of
   requesting separate categories from the API.
*/

/*const HEALTHCARE_QUERY = `
    healthcare
    OR medicine
    OR medical
    OR hospital
    OR "digital health"
    OR "health technology"
    OR "health tech"
    OR medtech
    OR "medical device"
    OR pharmaceutical
    OR pharma
    OR biotech
    OR telemedicine
    OR telehealth
    OR "healthcare AI"
`;*/

/*const HEALTHCARE_QUERY = `
    healthcare
    OR medicine
    OR medical
    OR hospital
    OR "public health"
    OR "health service"
    OR "digital health"
    OR "digital healthcare"
    OR "health technology"
    OR "health tech"
    OR medtech
    OR "medical device"
    OR "medical devices"
    OR pharmaceutical
    OR pharma
    OR biotech
    OR telemedicine
    OR telehealth
    OR "healthcare AI"
    OR "healthcare company"
    OR "healthcare startup"
    OR "healthcare funding"
    OR "healthcare investment"
    OR "healthcare market"
    OR "healthcare business"
    OR "health insurance"
`;*/

const HEALTHCARE_QUERY = `
    healthcare
    OR medicine
    OR medical
    OR hospital
    OR "public health"
    OR "digital health"
    OR "health tech"
    OR medtech
    OR "medical device"
    OR pharmaceutical
    OR pharma
    OR biotech
    OR telemedicine
    OR telehealth
    OR "healthcare AI"
    OR "healthcare company"
    OR "healthcare startup"
    OR "healthcare funding"
    OR "healthcare investment"
    OR "health insurance"
`;


/* =========================================================
   5. FETCH HEALTHCARE NEWS
========================================================= */

async function fetchHealthcareNews() {

    showLoading();


    /* Check API key */

    if (
        !API_KEY ||
        API_KEY === "YOUR_NEWSAPI_KEY_HERE"
    ) {

        showError(
            "Add your NewsAPI key inside Script.js."
        );

        return;

    }


    try {

        const url =
            `${API_URL}?` +
            `q=${encodeURIComponent(HEALTHCARE_QUERY)}` +
            `&language=en` +
            `&sortBy=publishedAt` +
            `&pageSize=100` +
            `&apiKey=${encodeURIComponent(API_KEY)}`;


        console.log(
            "Fetching healthcare news..."
        );


        const response =
            await fetch(url);


        const data =
            await response.json();


        console.log(
            "NewsAPI response:",
            data
        );


        /* =================================================
           API ERROR
        ================================================= */

        if (
            !response.ok ||
            data.status !== "ok"
        ) {

            handleApiError(data);

            return;

        }


        /* =================================================
           NO ARTICLES
        ================================================= */

        if (
            !data.articles ||
            data.articles.length === 0
        ) {

            showNoResults(
                "The API returned no healthcare articles."
            );

            return;

        }


        /* =================================================
           FILTER ARTICLES
           ONLY KEEP ARTICLES WITH IMAGES
        ================================================= */

        let articles =
            data.articles.filter(article => {

                return (
                    article &&
                    article.title &&
                    article.url &&
                    article.urlToImage &&
                    article.urlToImage.trim() !== "" &&
                    article.title !== "[Removed]"
                );

            });


        /* =================================================
           REMOVE DUPLICATES
        ================================================= */

        articles =
            removeDuplicates(articles);


        /* =================================================
           CLASSIFY EVERY ARTICLE
        ================================================= */

        allArticles =
            articles.map(article => {

                return {

                    ...article,

                    category:
                        classifyArticle(article)

                };

            });


        console.log(
            "Articles with images:",
            allArticles.length
        );


        /* =================================================
           SHOW ARTICLES
        ================================================= */

        displayArticles(
            allArticles
        );

    }


    catch (error) {

        console.error(
            "NewsAPI error:",
            error
        );


        showError(
            "Unable to connect to NewsAPI. Check your internet connection."
        );

    }

}


/* =========================================================
   6. CLASSIFY ARTICLES
========================================================= */

function classifyArticle(article) {

    const text =
        `
        ${article.title || ""}
        ${article.description || ""}
        ${article.content || ""}
        `.toLowerCase();


    /* =================================================
       HEALTH IT
    ================================================= */

    /*const healthITKeywords = [

        "health it",
        "healthcare it",
        "digital health",
        "digital healthcare",
        "telemedicine",
        "telehealth",
        "electronic health record",
        "electronic medical record",
        "ehr",
        "emr",
        "healthcare software",
        "health app",
        "healthcare cybersecurity",
        "health data",
        "health information technology",
        "artificial intelligence",
        "machine learning",
        "generative ai",
        "healthcare ai",
        "medical ai",
        "clinical ai"

    ];*/

    const healthITKeywords = [

    "health it",
    "healthcare it",

    "digital health",
    "digital healthcare",

    "health technology",
    "health tech",

    "telemedicine",
    "telehealth",

    "electronic health record",
    "electronic medical record",

    "ehr",
    "emr",

    "healthcare software",
    "medical software",

    "health app",
    "healthcare app",

    "health data",
    "health information technology",

    "healthcare cybersecurity",
    "medical cybersecurity",

    "artificial intelligence",
    "machine learning",
    "generative ai",

    "healthcare ai",
    "medical ai",
    "clinical ai",

    "healthcare automation",

    "remote patient monitoring",

    "digital therapeutics"

];


    if (
        containsKeyword(
            text,
            healthITKeywords
        )
    ) {

        return "it";

    }


    /* =================================================
       HEALTH BUSINESS
    ================================================= */

    /*const businessKeywords = [

        "healthcare company",
        "healthcare startup",
        "healthcare funding",
        "healthcare investment",
        "healthcare investors",
        "healthcare market",
        "healthcare acquisition",
        "healthcare merger",
        "healthcare revenue",
        "healthcare business",
        "health insurance",
        "hospital chain",
        "funding round",
        "series a",
        "series b",
        "acquisition",
        "merger",
        "ipo",
        "investment"

    ];*/

    const businessKeywords = [

    "healthcare company",
    "healthcare companies",

    "healthcare startup",
    "healthcare startups",

    "health tech company",

    "healthcare funding",
    "healthcare investment",
    "healthcare investor",
    "healthcare investors",

    "venture capital",
    "private equity",
    "funding round",

    "series a",
    "series b",
    "series c",
    "series d",

    "healthcare market",
    "healthcare markets",

    "healthcare business",

    "health insurance",
    "insurance company",

    "hospital chain",
    "hospital operator",
    "healthcare provider",

    "healthcare revenue",
    "healthcare earnings",

    "healthcare profit",

    "healthcare acquisition",
    "healthcare acquisitions",

    "healthcare merger",
    "healthcare mergers",

    "acquisition",
    "merger",

    "ipo",

    "investment",

    "investor",

    "revenue",

    "earnings",

    "profit",

    "shares",

    "stock",

    "market",

    "deal",

    "partnership",

    "expansion",

    "healthcare services"

];


    if (
        containsKeyword(
            text,
            businessKeywords
        )
    ) {

        return "business";

    }


    /* =================================================
       MEDTECH
    ================================================= */

    /*const medtechKeywords = [

        "medical device",
        "medical devices",
        "medtech",
        "medical technology",
        "robotic surgery",
        "surgical robot",
        "diagnostic device",
        "wearable medical",
        "medical implant",
        "implant",
        "prosthetic",
        "pacemaker",
        "medical equipment"

    ];*/

    const medtechKeywords = [

    "medical device",
    "medical devices",

    "medtech",
    "medical technology",

    "robotic surgery",
    "surgical robot",
    "surgical robotics",

    "diagnostic device",
    "diagnostic equipment",

    "medical equipment",

    "wearable medical",
    "medical wearable",

    "implant",
    "medical implant",

    "prosthetic",

    "pacemaker",

    "stent",

    "imaging device",

    "mri",
    "ct scanner",

    "ultrasound device",

    "patient monitoring device"

];


    if (
        containsKeyword(
            text,
            medtechKeywords
        )
    ) {

        return "medtech";

    }


    /* =================================================
       PHARMA
    ================================================= */

    /*const pharmaKeywords = [

        "pharmaceutical",
        "pharmaceuticals",
        "pharma",
        "clinical trial",
        "clinical trials",
        "drug approval",
        "drug development",
        "vaccine",
        "vaccination",
        "biotech",
        "biotechnology",
        "fda approval",
        "medicine approval",
        "drug discovery",
        "therapeutic"

    ];*/

    const pharmaKeywords = [

    "pharmaceutical",
    "pharmaceuticals",

    "pharma",

    "drug approval",
    "drug development",
    "drug discovery",

    "clinical trial",
    "clinical trials",

    "vaccine",
    "vaccination",

    "biotech",
    "biotechnology",

    "fda approval",

    "medicine approval",

    "therapeutic",

    "therapy",

    "oncology drug",

    "cancer drug",

    "gene therapy",

    "cell therapy"

];


    if (
        containsKeyword(
            text,
            pharmaKeywords
        )
    ) {

        return "pharma";

    }


    /* =================================================
       GENERAL HEALTHCARE
    ================================================= */

    return "healthcare";

}


/* =========================================================
   7. KEYWORD HELPER
========================================================= */

function containsKeyword(
    text,
    keywords
) {

    return keywords.some(
        keyword =>
            text.includes(keyword)
    );

}


/* =========================================================
   8. REMOVE DUPLICATES
========================================================= */

function removeDuplicates(articles) {

    const seen =
        new Set();


    return articles.filter(article => {

        const identifier =
            article.url ||
            article.title;


        if (
            seen.has(identifier)
        ) {

            return false;

        }


        seen.add(identifier);


        return true;

    });

}


/* =========================================================
   9. DISPLAY ARTICLES
========================================================= */

function displayArticles(
    articles
) {

    cardsContainer.innerHTML = "";


    /* =================================================
       CATEGORY FILTER
    ================================================= */

    let filteredArticles =
        articles.filter(article => {

            if (
                currentCategory === "all"
            ) {

                return true;

            }


            return (
                article.category ===
                currentCategory
            );

        });


    /* =================================================
       SEARCH FILTER
    ================================================= */

    if (
        currentSearch
    ) {

        const search =
            currentSearch.toLowerCase();


        filteredArticles =
            filteredArticles.filter(article => {

                const searchableText =
                    `
                    ${article.title || ""}
                    ${article.description || ""}
                    ${article.content || ""}
                    ${article.source?.name || ""}
                    `
                    .toLowerCase();


                return searchableText.includes(
                    search
                );

            });

    }


    /* =================================================
       RESULT COUNT
    ================================================= */

    resultsCount.textContent =
        `${filteredArticles.length} articles found`;


    /* =================================================
       NO RESULTS
    ================================================= */

    if (
        filteredArticles.length === 0
    ) {

        if (
            currentSearch
        ) {

            showNoResults(
                `No articles found for "${currentSearch}".`
            );

        }

        else {

            showNoResults(
                "No articles found in this category."
            );

        }


        return;

    }


    /* =================================================
       CREATE CARDS
    ================================================= */

    filteredArticles.forEach(
        article => {

            createNewsCard(
                article
            );

        }
    );

}


/* =========================================================
   10. CREATE CARD
========================================================= */

function createNewsCard(
    article
) {

    const cardClone =
        templateNewsCard.content.cloneNode(true);


    const card =
        cardClone.querySelector(".card");

    const image =
        cardClone.querySelector(".news-img");

    const title =
        cardClone.querySelector(".news-title");

    const source =
        cardClone.querySelector(".news-source");

    const description =
        cardClone.querySelector(".news-desc");

    const category =
        cardClone.querySelector(".news-category");

    const readMore =
        cardClone.querySelector(".read-more");


    /* =================================================
       IMAGE
    ================================================= */

    image.src =
        article.urlToImage;


    image.alt =
        article.title ||
        "Healthcare News";


    /*
       If the image URL is broken,
       remove the card.
    */

    image.addEventListener(
        "error",
        function() {

            if (card) {

                card.remove();

            }

        }
    );


    /* =================================================
       TITLE
    ================================================= */

    title.textContent =
        article.title;


    /* =================================================
       SOURCE
    ================================================= */

    const sourceName =
        article.source?.name ||
        "Healthcare News";


    source.textContent =
        `${sourceName} · ${formatDate(article.publishedAt)}`;


    /* =================================================
       DESCRIPTION
    ================================================= */

    description.textContent =
        article.description ||
        "Read the latest healthcare developments.";


    /* =================================================
       CATEGORY
    ================================================= */

    category.textContent =
        getCategoryName(
            article.category
        );


    /* =================================================
       LINK
    ================================================= */

    readMore.href =
        article.url;


    /* =================================================
       ADD TO DOM
    ================================================= */

    cardsContainer.appendChild(
        cardClone
    );

}


/* =========================================================
   11. CATEGORY NAME
========================================================= */

function getCategoryName(
    category
) {

    switch (category) {

        case "business":

            return "Health Business";


        case "it":

            return "Health IT";


        case "medtech":

            return "MedTech";


        case "pharma":

            return "Pharma";


        case "healthcare":

            return "Healthcare";


        default:

            return "Healthcare";

    }

}


/* =========================================================
   12. CATEGORY BUTTONS
========================================================= */

navLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            function(event) {

                event.preventDefault();


                /*
                   Get category from HTML
                */

                currentCategory =
                    link.dataset.category;


                /*
                   Remove active state
                */

                navLinks.forEach(
                    nav => {

                        nav.parentElement
                            .classList.remove("active");

                    }
                );


                /*
                   Add active state
                */

                link.parentElement
                    .classList.add("active");


                /*
                   IMPORTANT:

                   We do NOT call the API.

                   We filter allArticles locally.
                */

                displayArticles(
                    allArticles
                );

            }
        );

    }
);


/* =========================================================
   13. SEARCH
========================================================= */

function performSearch() {

    currentSearch =
        searchInput.value.trim();


    /*
       Search the articles already loaded.

       NO API REQUEST.
    */

    displayArticles(
        allArticles
    );

}


/* =========================================================
   14. SEARCH BUTTON
========================================================= */

searchButton.addEventListener(
    "click",
    performSearch
);


/* =========================================================
   15. ENTER KEY
========================================================= */

searchInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            performSearch();

        }

    }
);


/* =========================================================
   16. DATE FORMAT
========================================================= */

function formatDate(
    dateString
) {

    if (!dateString) {

        return "Recently";

    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Recently";

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   17. LOADING
========================================================= */

function showLoading() {

    cardsContainer.innerHTML = `

        <div class="loading">

            Loading healthcare news...

        </div>

    `;


    resultsCount.textContent =
        "Loading articles...";

}


/* =========================================================
   18. NO RESULTS
========================================================= */

function showNoResults(
    message
) {

    cardsContainer.innerHTML = `

        <div class="no-results">

            <h3>
                No Articles Found
            </h3>

            <p>
                ${message}
            </p>

        </div>

    `;


    resultsCount.textContent =
        "0 articles found";

}


/* =========================================================
   19. ERROR
========================================================= */

function showError(
    message
) {

    cardsContainer.innerHTML = `

        <div class="error-message">

            <h3>
                Healthcare News
            </h3>

            <p>
                ${message}
            </p>

        </div>

    `;


    resultsCount.textContent =
        "Unable to load articles";

}


/* =========================================================
   20. API ERROR HANDLER
========================================================= */

function handleApiError(
    data
) {

    console.error(
        "NewsAPI Error:",
        data
    );


    let message =
        "Unable to load healthcare news.";


    if (
        data.code ===
        "apiKeyInvalid"
    ) {

        message =
            "Your NewsAPI key is invalid.";

    }


    else if (
        data.code ===
        "apiKeyExhausted"
    ) {

        message =
            "Your daily NewsAPI request limit has been reached.";

    }


    else if (
        data.code ===
        "apiKeyDisabled"
    ) {

        message =
            "Your NewsAPI key has been disabled.";

    }


    else if (
        data.code ===
        "apiKeyMissing"
    ) {

        message =
            "Your NewsAPI key is missing.";

    }


    else if (
        data.message
    ) {

        message =
            data.message;

    }


    showError(
        message
    );

}


/* =========================================================
   21. START APPLICATION
========================================================= */

/*
   ONLY ONE API REQUEST HAPPENS HERE.

   After this:
   - category buttons = local
   - search = local
   - filtering = local
*/

fetchHealthcareNews();