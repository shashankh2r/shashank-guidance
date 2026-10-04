from pathlib import Path

base = Path("/mnt/data/shashanks_guidance_update")
base.mkdir(exist_ok=True)

index_html = """<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Shashank's Guidance</title>

    <link rel="stylesheet" href="style.css">
</head>

<body>

<header>
    <h1>Shashank's Guidance 🎓</h1>

    <p>
        Explore courses, colleges, entrance exams, and career paths.
    </p>
</header>


<main>

    <!-- SEARCH PAGE -->

    <section id="searchPage">

        <section class="search-section">

            <h2>Find Your Course</h2>

            <input
                type="text"
                id="searchInput"
                placeholder="Search college, course, or entrance exam..."
            >

            <select id="locationFilter">
                <option value="">All Locations</option>
            </select>

            <select id="typeFilter">
                <option value="">All Institution Types</option>
            </select>

            <select id="categoryFilter">
                <option value="">All Categories</option>
            </select>

            <select id="degreeFilter">
                <option value="">All Degrees</option>
            </select>

            <select id="entranceFilter">
                <option value="">All Entrance Exams</option>
            </select>

            <br><br>

            <button onclick="searchCourses()">
                Search
            </button>

            <button onclick="resetFilters()">
                Reset
            </button>

        </section>


        <section>

            <h2>Courses & Colleges</h2>

            <div id="results">

                <div class="college-card">

                    <h3>Loading Shashank's Guidance...</h3>

                    <p>
                        Loading college database...
                    </p>

                </div>

            </div>

        </section>

    </section>


    <!-- COLLEGE DETAILS PAGE -->

    <section id="detailsPage" class="hidden">

        <button onclick="showSearchPage()">
            ← Back to Results
        </button>

        <div id="collegeDetails"></div>

    </section>

</main>


<footer>
    <p>Shashank's Guidance © 2026</p>
</footer>


<script src="script.js"></script>

</body>

</html>
"""

script_js = r"""let colleges = [];


// ================================
// LOAD DATABASE
// ================================

async function loadColleges() {

    const results =
        document.getElementById("results");

    try {

        const response =
            await fetch("./colleges.json");

        if (!response.ok) {

            throw new Error(
                `Could not load colleges.json (${response.status})`
            );

        }

        const data =
            await response.json();

        if (!Array.isArray(data.colleges)) {

            throw new Error(
                "The JSON file must contain a colleges array."
            );

        }

        colleges = data.colleges;

        console.log(
            `Loaded ${colleges.length} colleges.`
        );

        populateFilters();

        searchCourses();

    } catch (error) {

        console.error(
            "Database loading failed:",
            error
        );

        results.innerHTML = `

            <div class="college-card">

                <h3>Database Error</h3>

                <p>
                    ${error.message}
                </p>

                <p>
                    Make sure colleges.json is in the
                    same folder as index.html.
                </p>

            </div>

        `;
    }
}


// ================================
// AUTOMATIC FILTERS
// ================================

function addOptions(selectId, values) {

    const select =
        document.getElementById(selectId);

    const firstOption =
        select.options[0].outerHTML;

    select.innerHTML =
        firstOption;

    const uniqueValues =
        [...new Set(values)]
            .filter(Boolean)
            .sort();

    uniqueValues.forEach(function(value) {

        const option =
            document.createElement("option");

        option.value = value;
        option.textContent = value;

        select.appendChild(option);

    });
}


function populateFilters() {

    const locations =
        colleges.flatMap(function(college) {

            return [
                college.city,
                college.state
            ];

        });


    const types =
        colleges.map(function(college) {

            return college.type;

        });


    const categories =
        colleges.map(function(college) {

            return college.category;

        });


    const degrees =
        colleges.flatMap(function(college) {

            return college.courses.map(
                function(course) {

                    return course.degree;

                }
            );

        });


    const entranceExams =
        colleges.flatMap(function(college) {

            return college.courses.flatMap(
                function(course) {

                    return course.entrance;

                }
            );

        });


    addOptions(
        "locationFilter",
        locations
    );


    addOptions(
        "typeFilter",
        types
    );


    addOptions(
        "categoryFilter",
        categories
    );


    addOptions(
        "degreeFilter",
        degrees
    );


    addOptions(
        "entranceFilter",
        entranceExams
    );
}


// ================================
// SEARCH
// ================================

function searchCourses() {

    const searchText =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    const selectedLocation =
        document
            .getElementById("locationFilter")
            .value
            .toLowerCase();


    const selectedType =
        document
            .getElementById("typeFilter")
            .value
            .toLowerCase();


    const selectedCategory =
        document
            .getElementById("categoryFilter")
            .value
            .toLowerCase();


    const selectedDegree =
        document
            .getElementById("degreeFilter")
            .value
            .toLowerCase();


    const selectedEntrance =
        document
            .getElementById("entranceFilter")
            .value
            .toLowerCase();


    const results =
        document.getElementById("results");


    results.innerHTML = "";


    let found = 0;


    colleges.forEach(function(college, collegeIndex) {

        const locationMatches =
            !selectedLocation ||

            college.city
                .toLowerCase()
                === selectedLocation ||

            college.state
                .toLowerCase()
                === selectedLocation;


        const typeMatches =
            !selectedType ||

            (college.type || "")
                .toLowerCase()
                === selectedType;


        const categoryMatches =
            !selectedCategory ||

            (college.category || "")
                .toLowerCase()
                === selectedCategory;


        if (
            !locationMatches ||
            !typeMatches ||
            !categoryMatches
        ) {
            return;
        }


        college.courses.forEach(
            function(course) {

                const searchMatches =

                    !searchText ||

                    college.name
                        .toLowerCase()
                        .includes(searchText) ||

                    course.name
                        .toLowerCase()
                        .includes(searchText) ||

                    course.degree
                        .toLowerCase()
                        .includes(searchText) ||

                    course.entrance.some(
                        function(exam) {

                            return exam
                                .toLowerCase()
                                .includes(searchText);

                        }
                    );


                const degreeMatches =

                    !selectedDegree ||

                    course.degree
                        .toLowerCase()
                        === selectedDegree;


                const entranceMatches =

                    !selectedEntrance ||

                    course.entrance.some(
                        function(exam) {

                            return exam
                                .toLowerCase()
                                === selectedEntrance;

                        }
                    );


                if (
                    searchMatches &&
                    degreeMatches &&
                    entranceMatches
                ) {

                    found++;


                    const card =
                        document.createElement("div");


                    card.className =
                        "college-card";


                    card.innerHTML = `

                        <h3>
                            ${college.name}
                        </h3>

                        <p>
                            <strong>Course:</strong>
                            ${course.name}
                        </p>

                        <p>
                            <strong>Degree:</strong>
                            ${course.degree}
                        </p>

                        <p>
                            <strong>Type:</strong>
                            ${college.type || "Not specified"}
                        </p>

                        <p>
                            <strong>Category:</strong>
                            ${college.category || "Not specified"}
                        </p>

                        <p>
                            <strong>Duration:</strong>
                            ${course.duration}
                        </p>

                        <p>
                            <strong>Location:</strong>
                            ${college.city},
                            ${college.state}
                        </p>

                        <p>
                            <strong>Entrance:</strong>
                            ${course.entrance.length
                                ? course.entrance.join(", ")
                                : "Check official college website"}
                        </p>

                        <button
                            class="details-button"
                            onclick="showCollegeDetails(
                                ${collegeIndex}
                            )"
                        >
                            View College Details →
                        </button>

                    `;


                    results.appendChild(card);

                }

            }
        );

    });


    if (found === 0) {

        results.innerHTML = `

            <div class="college-card">

                <h3>No results found</h3>

                <p>
                    Try changing your search or filters.
                </p>

            </div>

        `;
    }
}


// ================================
// COLLEGE DETAILS
// ================================

function showCollegeDetails(collegeIndex) {

    const college =
        colleges[collegeIndex];


    if (!college) {
        return;
    }


    document
        .getElementById("searchPage")
        .classList.add("hidden");


    document
        .getElementById("detailsPage")
        .classList.remove("hidden");


    const details =
        document.getElementById("collegeDetails");


    let coursesHTML = "";


    college.courses.forEach(function(course) {

        coursesHTML += `

            <div class="course-card">

                <h3>
                    ${course.name}
                </h3>

                <p>
                    <strong>Degree:</strong>
                    ${course.degree}
                </p>

                <p>
                    <strong>Duration:</strong>
                    ${course.duration}
                </p>

                <p>
                    <strong>Entrance:</strong>
                    ${course.entrance.length
                        ? course.entrance.join(", ")
                        : "Check official college website"}
                </p>

            </div>

        `;

    });


    details.innerHTML = `

        <div class="details-card">

            <h2>
                ${college.name}
            </h2>

            <p>
                <strong>Type:</strong>
                ${college.type || "Not specified"}
            </p>

            <p>
                <strong>Category:</strong>
                ${college.category || "Not specified"}
            </p>

            <p>
                <strong>Location:</strong>
                ${college.city}, ${college.state}
            </p>

            <h2>
                Courses
            </h2>

            ${coursesHTML}

            <p>

                <a
                    href="${college.website}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Visit Official College Website →
                </a>

            </p>

        </div>

    `;
}


// ================================
// BACK TO SEARCH
// ================================

function showSearchPage() {

    document
        .getElementById("detailsPage")
        .classList.add("hidden");


    document
        .getElementById("searchPage")
        .classList.remove("hidden");

}


// ================================
// RESET
// ================================

function resetFilters() {

    document
        .getElementById("searchInput")
        .value = "";


    document
        .getElementById("locationFilter")
        .selectedIndex = 0;


    document
        .getElementById("typeFilter")
        .selectedIndex = 0;


    document
        .getElementById("categoryFilter")
        .selectedIndex = 0;


    document
        .getElementById("degreeFilter")
        .selectedIndex = 0;


    document
        .getElementById("entranceFilter")
        .selectedIndex = 0;


    searchCourses();
}


// ================================
// START
// ================================

loadColleges();
"""

style_css = """* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #f4f6f8;
    color: #222;
}

/* Header */

header {
    background: #172554;
    color: white;
    text-align: center;
    padding: 60px 20px;
}

header h1 {
    font-size: 45px;
    margin: 0 0 10px;
}

header p {
    font-size: 18px;
}

/* Main */

main {
    max-width: 1100px;
    margin: auto;
    padding: 40px 20px;
}

/* Search */

.search-section {
    background: white;
    padding: 30px;
    border-radius: 15px;
    margin-bottom: 40px;
}

.search-section h2 {
    margin-top: 0;
}

input,
select {
    padding: 14px;
    margin: 5px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
}

input {
    width: 45%;
}

select {
    min-width: 180px;
}

/* Buttons */

button {
    padding: 14px 25px;
    margin: 5px;
    border: none;
    border-radius: 8px;
    background: #2563eb;
    color: white;
    font-size: 16px;
    cursor: pointer;
}

button:hover {
    background: #1d4ed8;
}

/* Results */

#results {
    display: grid;
    gap: 20px;
}

.college-card {
    background: white;
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.college-card h3 {
    margin-top: 0;
    color: #172554;
}

.college-card p {
    margin: 10px 0;
}

.college-card a {
    color: #2563eb;
    text-decoration: none;
}

.college-card a:hover {
    text-decoration: underline;
}

/* Details */

.details-card {
    background: white;
    padding: 35px;
    border-radius: 15px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.details-card h2 {
    color: #172554;
    margin-top: 0;
}

.course-card {
    border: 1px solid #ddd;
    padding: 20px;
    margin-top: 20px;
    border-radius: 10px;
}

.course-card h3 {
    color: #172554;
}

.details-button {
    margin-top: 15px;
}

.hidden {
    display: none;
}

/* Footer */

footer {
    text-align: center;
    padding: 30px;
    color: #666;
}

/* Mobile */

@media (max-width: 700px) {

    header h1 {
        font-size: 34px;
    }

    input,
    select {
        width: 100%;
        margin: 6px 0;
    }

    .search-section {
        padding: 20px;
    }

    main {
        padding: 25px 15px;
    }
}
"""

for name, content in [
    ("index.html", index_html),
    ("script.js", script_js),
    ("style.css", style_css),
]:
    (base / name).write_text(content, encoding="utf-8")

print("Created updated files:")
for p in sorted(base.iterdir()):
    print(p)
