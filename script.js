let colleges = [];


// =====================================================
// LOAD DATABASE
// =====================================================

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


        colleges =
            data.colleges;


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

                <h3>
                    Database Error
                </h3>

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


// =====================================================
// SAFE VALUE
// =====================================================

function safeValue(
    value,
    fallback = "Not yet verified"
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return fallback;

    }


    return value;

}


// =====================================================
// ADD FILTER OPTIONS
// =====================================================

function addOptions(
    selectId,
    values
) {

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


    uniqueValues.forEach(
        function(value) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                value;


            option.textContent =
                value;


            select.appendChild(
                option
            );

        }
    );

}


// =====================================================
// POPULATE FILTERS
// =====================================================

function populateFilters() {

    const locations =
        colleges.flatMap(
            function(college) {

                return [
                    college.city,
                    college.state
                ];

            }
        );


    const types =
        colleges.map(
            function(college) {

                return college.type;

            }
        );


    const categories =
        colleges.map(
            function(college) {

                return college.category;

            }
        );


    const degrees =
        colleges.flatMap(
            function(college) {

                return (
                    college.courses || []
                ).map(
                    function(course) {

                        return course.degree;

                    }
                );

            }
        );


    const entranceExams =
        colleges.flatMap(
            function(college) {

                return (
                    college.courses || []
                ).flatMap(
                    function(course) {

                        return (
                            course.entrance || []
                        );

                    }
                );

            }
        );


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


// =====================================================
// SEARCH COURSES
// =====================================================

function searchCourses() {

    const searchText =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase()
            .trim();


    const selectedLocation =
        document
            .getElementById(
                "locationFilter"
            )
            .value
            .toLowerCase();


    const selectedType =
        document
            .getElementById(
                "typeFilter"
            )
            .value
            .toLowerCase();


    const selectedCategory =
        document
            .getElementById(
                "categoryFilter"
            )
            .value
            .toLowerCase();


    const selectedDegree =
        document
            .getElementById(
                "degreeFilter"
            )
            .value
            .toLowerCase();


    const selectedEntrance =
        document
            .getElementById(
                "entranceFilter"
            )
            .value
            .toLowerCase();


    const results =
        document.getElementById(
            "results"
        );


    results.innerHTML = "";


    let found = 0;


    colleges.forEach(
        function(
            college,
            collegeIndex
        ) {


            const locationMatches =

                !selectedLocation ||

                (college.city || "")
                    .toLowerCase()
                    === selectedLocation ||

                (college.state || "")
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


            const courses =
                college.courses || [];


            courses.forEach(
                function(course) {


                    const entrance =
                        course.entrance || [];


                    const searchMatches =

                        !searchText ||

                        (college.name || "")
                            .toLowerCase()
                            .includes(
                                searchText
                            ) ||

                        (course.name || "")
                            .toLowerCase()
                            .includes(
                                searchText
                            ) ||

                        (course.degree || "")
                            .toLowerCase()
                            .includes(
                                searchText
                            ) ||

                        entrance.some(
                            function(exam) {

                                return exam
                                    .toLowerCase()
                                    .includes(
                                        searchText
                                    );

                            }
                        );


                    const degreeMatches =

                        !selectedDegree ||

                        (course.degree || "")
                            .toLowerCase()
                            === selectedDegree;


                    const entranceMatches =

                        !selectedEntrance ||

                        entrance.some(
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
                            document.createElement(
                                "div"
                            );


                        card.className =
                            "college-card";


                        card.innerHTML = `

                            <h3>
                                ${safeValue(
                                    college.name,
                                    "Unnamed College"
                                )}
                            </h3>


                            <p>
                                <strong>
                                    Course:
                                </strong>

                                ${safeValue(
                                    course.name
                                )}
                            </p>


                            <p>
                                <strong>
                                    Degree:
                                </strong>

                                ${safeValue(
                                    course.degree
                                )}
                            </p>


                            <p>
                                <strong>
                                    Type:
                                </strong>

                                ${safeValue(
                                    college.type
                                )}
                            </p>


                            <p>
                                <strong>
                                    Category:
                                </strong>

                                ${safeValue(
                                    college.category
                                )}
                            </p>


                            <p>
                                <strong>
                                    Duration:
                                </strong>

                                ${safeValue(
                                    course.duration
                                )}
                            </p>


                            <p>
                                <strong>
                                    Location:
                                </strong>

                                ${safeValue(
                                    college.city
                                )},

                                ${safeValue(
                                    college.state
                                )}
                            </p>


                            <p>
                                <strong>
                                    Entrance:
                                </strong>

                                ${
                                    entrance.length
                                    ? entrance.join(", ")
                                    : "Not yet verified"
                                }
                            </p>


                            <p>
                                <strong>
                                    Eligibility:
                                </strong>

                                ${safeValue(
                                    course.eligibility
                                )}
                            </p>


                            <p>
                                <strong>
                                    Fees:
                                </strong>

                                ${safeValue(
                                    course.fees
                                )}
                            </p>


                            <p>
                                <strong>
                                    Admission:
                                </strong>

                                ${safeValue(
                                    course.admissionProcess
                                )}
                            </p>


                            <button
                                class="details-button"
                                data-college-index="${collegeIndex}"
                            >
                                View College Details →
                            </button>

                        `;


                        const detailsButton =
                            card.querySelector(
                                ".details-button"
                            );


                        detailsButton.addEventListener(
                            "click",
                            function() {

                                showCollegeDetails(
                                    collegeIndex
                                );

                            }
                        );


                        results.appendChild(
                            card
                        );

                    }

                }
            );

        }
    );


    if (found === 0) {

        results.innerHTML = `

            <div class="college-card">

                <h3>
                    No results found
                </h3>

                <p>
                    Try changing your search
                    or filters.
                </p>

            </div>

        `;

    }

}


// =====================================================
// COLLEGE DETAILS
// =====================================================

function showCollegeDetails(
    collegeIndex
) {

    const college =
        colleges[collegeIndex];


    if (!college) {

        return;

    }


    document
        .getElementById(
            "searchPage"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "detailsPage"
        )
        .classList.remove(
            "hidden"
        );


    const details =
        document.getElementById(
            "collegeDetails"
        );


    let coursesHTML = "";


    const courses =
        college.courses || [];


    courses.forEach(
        function(course) {


            const entrance =
                course.entrance || [];


            coursesHTML += `

                <div class="course-card">

                    <h3>
                        ${safeValue(
                            course.name
                        )}
                    </h3>


                    <p>
                        <strong>
                            Degree:
                        </strong>

                        ${safeValue(
                            course.degree
                        )}
                    </p>


                    <p>
                        <strong>
                            Duration:
                        </strong>

                        ${safeValue(
                            course.duration
                        )}
                    </p>


                    <p>
                        <strong>
                            Entrance:
                        </strong>

                        ${
                            entrance.length
                            ? entrance.join(", ")
                            : "Not yet verified"
                        }
                    </p>


                    <p>
                        <strong>
                            Eligibility:
                        </strong>

                        ${safeValue(
                            course.eligibility
                        )}
                    </p>


                    <p>
                        <strong>
                            Fees:
                        </strong>

                        ${safeValue(
                            course.fees
                        )}
                    </p>


                    <p>
                        <strong>
                            Admission Process:
                        </strong>

                        ${safeValue(
                            course.admissionProcess
                        )}
                    </p>

                </div>

            `;

        }
    );


    details.innerHTML = `

        <div class="details-card">

            <h2>
                ${safeValue(
                    college.name,
                    "Unnamed College"
                )}
            </h2>


            <p>
                <strong>
                    Type:
                </strong>

                ${safeValue(
                    college.type
                )}
            </p>


            <p>
                <strong>
                    Category:
                </strong>

                ${safeValue(
                    college.category
                )}
            </p>


            <p>
                <strong>
                    Location:
                </strong>

                ${safeValue(
                    college.city
                )},

                ${safeValue(
                    college.state
                )}
            </p>


            <h2>
                Courses
            </h2>


            <p class="verification-note">

                Admission, eligibility, and fee
                information is displayed only
                when available in the database.

            </p>


            ${coursesHTML}


            ${
                college.website
                ? `

                    <p>

                        <a
                            href="${college.website}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Visit Official College Website →
                        </a>

                    </p>

                `
                : ""
            }

        </div>

    `;

}


// =====================================================
// BACK TO SEARCH
// =====================================================

function showSearchPage() {

    document
        .getElementById(
            "detailsPage"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "searchPage"
        )
        .classList.remove(
            "hidden"
        );

}


// =====================================================
// RESET FILTERS
// =====================================================

function resetFilters() {

    document
        .getElementById(
            "searchInput"
        )
        .value = "";


    document
        .getElementById(
            "locationFilter"
        )
        .selectedIndex = 0;


    document
        .getElementById(
            "typeFilter"
        )
        .selectedIndex = 0;


    document
        .getElementById(
            "categoryFilter"
        )
        .selectedIndex = 0;


    document
        .getElementById(
            "degreeFilter"
        )
        .selectedIndex = 0;


    document
        .getElementById(
            "entranceFilter"
        )
        .selectedIndex = 0;


    searchCourses();

}


// =====================================================
// ASSISTANT — ADD MESSAGE
// =====================================================

function addAssistantMessage(
    message,
    sender
) {

    const chat =
        document.getElementById(
            "assistantChat"
        );


    if (!chat) {

        return;

    }


    const messageBox =
        document.createElement(
            "div"
        );


    if (sender === "user") {

        messageBox.className =
            "user-message";


        messageBox.innerHTML = `

            <strong>
                You
            </strong>

            <p>
                ${message}
            </p>

        `;

    } else {

        messageBox.className =
            "assistant-message";


        messageBox.innerHTML = `

            <strong>
                Assistant
            </strong>

            <p>
                ${message}
            </p>

        `;

    }


    chat.appendChild(
        messageBox
    );


    chat.scrollTop =
        chat.scrollHeight;

}


// =====================================================
// ASSISTANT — SEARCH DATABASE
// =====================================================

function findAssistantResults(
    query
) {

    const text =
        query
            .toLowerCase()
            .trim();


    const results = [];


    colleges.forEach(
        function(college) {


            const courses =
                college.courses || [];


            courses.forEach(
                function(course) {


                    const searchArea = [

                        college.name,

                        college.city,

                        college.state,

                        college.type,

                        college.category,

                        course.name,

                        course.degree,

                        ...(course.entrance || [])

                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();


                    if (
                        searchArea.includes(
                            text
                        )
                    ) {

                        results.push({

                            college: college,

                            course: course

                        });

                    }

                }
            );

        }
    );


    return results;

}


// =====================================================
// ASSISTANT — RESPONSE
// =====================================================

function generateAssistantResponse(
    query
) {

    const text =
        query
            .toLowerCase()
            .trim();


    if (!text) {

        return "Please type a question first.";

    }


    // GREETING

    if (
        text === "hi" ||
        text === "hello" ||
        text === "hey"
    ) {

        return `
            Hi! 👋 Ask me about colleges,
            courses, locations, degrees,
            or entrance exams.
        `;

    }


    // DATABASE COUNT

    if (
        text.includes("how many colleges") ||
        text.includes("number of colleges")
    ) {

        return `

            My current database contains

            <strong>
                ${colleges.length}
            </strong>

            colleges.

        `;

    }


    // SEARCH

    let results =
        findAssistantResults(
            query
        );


    // LIMIT

    results =
        results.slice(0, 8);


    if (results.length === 0) {

        return `

            I couldn't find a matching
            college or course in the
            current database.

            <br><br>

            Try mentioning a college name,
            course, location, degree,
            or entrance exam.

        `;

    }


    let response = `

        I found

        <strong>
            ${results.length}
        </strong>

        matching result(s):

        <br><br>

    `;


    results.forEach(
        function(result) {


            const college =
                result.college;


            const course =
                result.course;


            response += `

                <div
                    style="margin-bottom:15px;"
                >

                    <strong>
                        ${safeValue(
                            college.name
                        )}
                    </strong>

                    <br>

                    Course:
                    ${safeValue(
                        course.name
                    )}

                    <br>

                    Degree:
                    ${safeValue(
                        course.degree
                    )}

                    <br>

                    Location:
                    ${safeValue(
                        college.city
                    )},

                    ${safeValue(
                        college.state
                    )}

                    <br>

                    Entrance:

                    ${
                        course.entrance &&
                        course.entrance.length
                        ? course.entrance.join(", ")
                        : "Not yet verified"
                    }

                </div>

            `;

        }
    );


    response += `

        <small>

            Information shown here comes
            from the current Shashank's
            Guidance database.

        </small>

    `;


    return response;

}


// =====================================================
// ASSISTANT — SEND
// =====================================================

function sendAssistantMessage() {

    const input =
        document.getElementById(
            "assistantInput"
        );


    if (!input) {

        console.error(
            "assistantInput was not found."
        );

        return;

    }


    const query =
        input.value.trim();


    if (!query) {

        return;

    }


    addAssistantMessage(
        query,
        "user"
    );


    input.value = "";


    const response =
        generateAssistantResponse(
            query
        );


    addAssistantMessage(
        response,
        "assistant"
    );

}


// =====================================================
// INITIALIZE BUTTONS
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {


        // SEARCH BUTTON

        const searchButton =
            document.getElementById(
                "searchButton"
            );


        if (searchButton) {

            searchButton.addEventListener(
                "click",
                searchCourses
            );

        }


        // RESET BUTTON

        const resetButton =
            document.getElementById(
                "resetButton"
            );


        if (resetButton) {

            resetButton.addEventListener(
                "click",
                resetFilters
            );

        }


        // BACK BUTTON

        const backButton =
            document.getElementById(
                "backButton"
            );


        if (backButton) {

            backButton.addEventListener(
                "click",
                showSearchPage
            );

        }


        // ASSISTANT SEND BUTTON

        const sendButton =
            document.getElementById(
                "assistantSendButton"
            );


        if (sendButton) {

            sendButton.addEventListener(
                "click",
                sendAssistantMessage
            );

        }


        // ASSISTANT ENTER KEY

        const assistantInput =
            document.getElementById(
                "assistantInput"
            );


        if (assistantInput) {

            assistantInput.addEventListener(
                "keydown",
                function(event) {

                    if (
                        event.key === "Enter"
                    ) {

                        sendAssistantMessage();

                    }

                }
            );

        }

    }
);


// =====================================================
// START APPLICATION
// =====================================================

loadColleges();