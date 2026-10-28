

var movies = [
  {
    id: 1,
    title: "Deadpool & Wolverine",
    genre: "Action",
    rating: "MA15+",
    price: 22,
    ageGroups: ["Teen", "Adult"],
    viewing: ["Friends", "Solo"]
  },
  {
    id: 2,
    title: "The Super Mario Bros. Movie",
    genre: "Animation",
    rating: "PG",
    price: 18,
    ageGroups: ["Child", "Teen", "Adult"],
    viewing: ["Family", "Friends"]
  },
  {
    id: 3,
    title: "Inside Out 2",
    genre: "Animation",
    rating: "PG",
    price: 17,
    ageGroups: ["Child", "Teen", "Adult"],
    viewing: ["Family", "Friends"]
  },
  {
    id: 4,
    title: "Interstellar",
    genre: "Sci-Fi",
    rating: "M",
    price: 20,
    ageGroups: ["Teen", "Adult"],
    viewing: ["Solo", "Date Night"]
  },
  {
    id: 5,
    title: "The Batman",
    genre: "Action",
    rating: "M",
    price: 22,
    ageGroups: ["Teen", "Adult"],
    viewing: ["Friends", "Solo"]
  },
  {
    id: 6,
    title: "Barbie",
    genre: "Comedy",
    rating: "PG",
    price: 19,
    ageGroups: ["Teen", "Adult"],
    viewing: ["Date Night", "Friends"]
  }
];



/* Helper functions  */

/* This finds a movie by its id and will then return the movie object, or null if it s mot found. */
function getMovieById(id) {
  for (var i = 0; i < movies.length; i++) {
    if (movies[i].id === id) {
      return movies[i];
    }
  }
  return null;
}

/* reads the movie id from the page address, ?movie=3 is 3 */
function getMovieIdFromURL() {
  var query = window.location.search;
  if (query === "") {
    return null;
  }

  var pairs = query.substring(1).split("&");   // removes the ? then splits into name=value pairs
  for (var i = 0; i < pairs.length; i++) {  //loops throyugh each pair 
    var parts = pairs[i].split("=");           // creates ["movie", "3"] 
    if (parts[0] === "movie") {
      var id = parseInt(parts[1], 10);
      if (!isNaN(id)) { // checks that the value is actuallya number
        return id;
      }
    }
  }
  return null;
}

/* Price reformtatting  */
function formatPrice(amount) {
  return "$" + amount.toFixed(2);
}

/* reads the form field */
function getValue(id) {
  return document.getElementById(id).value.trim();
}

/* Shows the error message under a field + gives the field a red border */
function showError(fieldId, errorId, message) {
  document.getElementById(errorId).textContent = message;
  if (fieldId !== null) {
    document.getElementById(fieldId).className = "input-error";
  }
}

/* Removes an error message and the red border */
function clearError(fieldId, errorId) {
  document.getElementById(errorId).textContent = "";
  if (fieldId !== null) {
    document.getElementById(fieldId).className = "";
  }
}

/*  email address format check */
function isValidEmail(text) {
  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(text);
}


/*  booking page -------------------------- */


function initBooking() {
  var form = document.getElementById("bookingForm");

  /* Pre-fill */
  var movieId = getMovieIdFromURL();
  if (movieId !== null && getMovieById(movieId) !== null) {
    document.getElementById("movie").value = movieId;
  }

  /* Checks date */
  document.getElementById("screeningDate").min = getTodayString();

  /* Connecting events to their functions */
  document.getElementById("movie").onchange = updateCost;
  document.getElementById("tickets").onchange = updateCost;
  document.getElementById("tickets").onkeyup = updateCost;
  document.getElementById("payVoucher").onclick = updatePaymentFields;
  document.getElementById("payOnline").onclick = updatePaymentFields;
  document.getElementById("sameEmail").onclick = copyBillingEmail;
  document.getElementById("email").onchange = copyBillingEmail;
  form.onsubmit = validateBooking;

  /* initial state */
  updateCost();
  updatePaymentFields();
}

/*Comverts date format */
function getTodayString() {
  var now = new Date();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return now.getFullYear() + "-" + month + "-" + day;
}

/* update the price per ticket and the overalll cost */
function updateCost() {
  var movie = getMovieById(parseInt(document.getElementById("movie").value, 10));
  var tickets = parseInt(document.getElementById("tickets").value, 10);
  var price = 0;

  if (movie !== null) {
    price = movie.price;
  }
  if (isNaN(tickets) || tickets < 1) {
    tickets = 0;
  }

  document.getElementById("ticketPrice").value = formatPrice(price);

  document.getElementById("totalCost").value = formatPrice(price * tickets);
}

/* Show the voucher box or the card boxes */
function updatePaymentFields() {
  var voucherBox = document.getElementById("voucherFields");
  var cardBox = document.getElementById("cardFields");

  voucherBox.style.display = "none";
  cardBox.style.display = "none";

  if (document.getElementById("payVoucher").checked) {
    voucherBox.style.display = "block";
  } 
  else if (document.getElementById("payOnline").checked) {
    cardBox.style.display = "block";
  }

  clearError("voucherCode", "errVoucher");
  clearError("cardType", "errCardType");
  clearError("cardNumber", "errCardNumber");
  clearError("cardName", "errCardName");
  clearError("cardExpiry", "errCardExpiry");
  clearError("cardCvv", "errCardCvv");
  clearError(null, "errPayment");
}


function copyBillingEmail() {
  if (document.getElementById("sameEmail").checked)
     { document.getElementById("billingEmail").value = document.getElementById("email").value;
  }
}

/* Checks for any errors */
function validateBooking() {
  var detailsOk = validateBookingDetails();
  var paymentOk = validatePayment();

  if (detailsOk && paymentOk) {
    clearError(null, "errForm");
    return true;
  }

  showError(null, "errForm", "Please correvt the errors above");
  return false;
}



function validateBookingDetails() {
  var ok = true;

  
  clearError("fullName", "errFullName");
  if (getValue("fullName") === "") {
    showError("fullName", "errFullName", "Please enter your full name.");
    ok = false;
  }

 
  clearError("email", "errEmail");
  if (getValue("email") === "") {
    showError("email", "errEmail", "Please enter your email address.");
    ok = false;
  } else if (!isValidEmail(getValue("email"))) {
    showError("email", "errEmail", "Please enter a valid email address, like name@example.com.");
    ok = false;
  }


   
  clearError("phone", "errPhone");
  
  var phone = getValue("phone");
  if (phone === "") {
    showError("phone", "errPhone", "Please enter your phone number.");
    ok = false;
  } else if (!/^[0-9]+$/.test(phone)) {
    showError("phone", "errPhone", "Phone number must contain digits only.");
    ok = false;
  } else if (phone.length < 10) {
    showError("phone", "errPhone", "Phone number must contain at least 10 digits.");
    ok = false;
  }


  clearError("movie", "errMovie");
  if (getValue("movie") === "") {
    showError("movie", "errMovie", "Please choose a movie.");
    ok = false;
  }

 
  clearError("screeningDate", "errDate");
  clearError("screeningTime", "errTime");
  var date = getValue("screeningDate");
  var time = getValue("screeningTime");
  if (date === "") {
    showError("screeningDate", "errDate", "Please choose a screening date.");
    ok = false;
  }
  if (time === "") {
    showError("screeningTime", "errTime", "Please choose a screening time.");

    ok = false;
  }
  if (date !== "" && time !== "") {
    var screening = new Date(date + "T" + time);
    if (screening < new Date()) {
      showError("screeningDate", "errDate", "The screening date and time must not be in the past.");
      ok = false;
    }
  }

    clearError("tickets", "errTickets");
    var tickets = parseInt(getValue("tickets"), 10);
        if (isNaN(tickets) || tickets < 1) {
        showError("tickets", "errTickets", "Number of tickets must be greater than 0.");
     ok = false;
  }

  return ok;
}

/* Check payment method */
function validatePayment() {
  var ok = true;

  clearError(null, "errPayment");
  var useVoucher = document.getElementById("payVoucher").checked;
  var useOnline = document.getElementById("payOnline").checked;

  if (!useVoucher && !useOnline) {
    showError(null, "errPayment", "Please choose a payment method.");
    ok = false;
  }

  /* Voucher */
  clearError("voucherCode", "errVoucher");
  if (useVoucher) {
    var voucher = getValue("voucherCode");
    if (voucher.length !== 12 || isNaN(voucher)) {
      showError("voucherCode", "errVoucher", "The voucher code must be 12 digits");
      ok = false;
    }
  }

  /* details */
  clearError("cardType", "errCardType");
  clearError("cardNumber", "errCardNumber");
  clearError("cardName", "errCardName");
  clearError("cardExpiry", "errCardExpiry");
  clearError("cardCvv", "errCardCvv");
  
  if (useOnline) {
    var cardType = getValue("cardType");
    var cardNumber = getValue("cardNumber");

    if (cardType === "") {
      showError("cardType", "errCardType", "Please select a card type");
      ok = false;
    }

    /* NOte-- only Amex has 15 digs */
    var expectedLength = 16;
    if (cardType === "Amex") {
      expectedLength = 15;
    }
    if (cardNumber === "") {
      showError("cardNumber", "errCardNumber", "Please enter your card number.");
      ok = false;
    } else if (!/^[0-9]+$/.test(cardNumber)) { // regex used to check contents of entry
      showError("cardNumber", "errCardNumber", "The card number must contain digits only.");
      ok = false;
    } else if (cardType !== "" && cardNumber.length !== expectedLength) {
      showError("cardNumber", "errCardNumber", cardType + " card numbers must have " + expectedLength + " digits.");
      ok = false;
    }

    if (getValue("cardName") === "") {
      showError("cardName", "errCardName", "Please enter the name on the card.");
      ok = false;
    }

    /* validating expiry */
    var expiry = getValue("cardExpiry");
    if (expiry === "") {
      showError("cardExpiry", "errCardExpiry", "Please enter the card expiry date.");
      ok = false;
    } else {
      var expiryParts = expiry.split("-"); // to format it back to original to check
      var expiryYear = parseInt(expiryParts[0], 10);
      var expiryMonth = parseInt(expiryParts[1], 10);
      var now = new Date();
      var thisYear = now.getFullYear();
      var thisMonth = now.getMonth() + 1;
      if (expiryYear < thisYear || (expiryYear === thisYear && expiryMonth < thisMonth)) {
        showError("cardExpiry", "errCardExpiry", "This card has expired.");
        ok = false;
      }
    }

    if (!/^[0-9]{3,4}$/.test(getValue("cardCvv"))) {
      showError("cardCvv", "errCardCvv", "The security code must be 3 or 4 digits.");
      ok = false;
    }
  }

  /* The billing email */
  clearError("billingEmail", "errBillingEmail");
  if (getValue("billingEmail") === "") {
    showError("billingEmail", "errBillingEmail", "Please enter a billing email address.");
    ok = false;
  } else if (!isValidEmail(getValue("billingEmail"))) {
    showError("billingEmail", "errBillingEmail", "Please enter a valid billing email address.");
    ok = false;
  }

  return ok;
}


/*Page setup*/

function init() {
  if (document.getElementById("bookingForm")) {
    initBooking(); }

  if (document.getElementById("registerForm")) {
    initRegister();
  }

  if (document.getElementById("recommendForm")) {
    initRecommend();
  }
}



/*registration page */

/* Connect the registration form to its validation */
function initRegister() {
  document.getElementById("registerForm").onsubmit = validateRegister;
}

/* ths loops then returns true if at least one is ticked */
function isAnyChecked(ids) {
  for (var i = 0; i < ids.length; i++) {
    if (document.getElementById(ids[i]).checked) {
      return true;
    }
  }
  return false;
}

/* Returning false stops the submit, so nothing is sent until every error is fixed */
function validateRegister() {
  var ok = true;

  /* Username with requirements */
  clearError("username", "errUsername");
  var username = getValue("username");
  if (username === "") {
    showError("username", "errUsername", "Please enter a username.");
    ok = false;
  } else if (username.length < 5) {
    showError("username", "errUsername", "Username must be at least 5 characters.");
    ok = false;
  } else if (!/^[A-Za-z0-9_]+$/.test(username)) {
    showError("username", "errUsername", "Username can only contain letters numbers and underscores");
    ok = false;
  }

  /* Email */
  clearError("email", "errEmail");
  if (getValue("email") === "") {
    showError("email", "errEmail", "Please enter your email address.");
    ok = false;
  } else if (!isValidEmail(getValue("email"))) {
    showError("email", "errEmail", "Please enter a valid email address.");
    ok = false;
  }

  /* Phone - 8 to 15 digits */
  clearError("phone", "errPhone");
  var phone = getValue("phone");
  if (phone === "") {
    showError("phone", "errPhone", "Please enter your phone number.");
    ok = false;
  } else if (!/^[0-9]+$/.test(phone)) {
    showError("phone", "errPhone", "Phone number can only consist of digits");
    ok = false;
  } else if (phone.length < 8 || phone.length > 15) {
    showError("phone", "errPhone", "Number must be between 8 and 15 digits .");
    ok = false;
  }

  /* Password check */
  clearError("password", "errPassword");
  var password = document.getElementById("password").value;
  if (password === "") {
    showError("password", "errPassword", "Please enter a password.");
    ok = false;
  } else {
    var missing = [];
    if (password.length < 10) {
      missing.push("at least 10 characters");
    }
    if (!/[A-Z]/.test(password)) {
      missing.push("an uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      missing.push("a lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      missing.push("a number");
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      missing.push("a special character");
    }
    if (missing.length > 0) {
      showError("password", "errPassword", "Password needs " + missing.join(", ") + ".");
      ok = false;
    }
  }

  /* must match the password */
  clearError("confirmPassword", "errConfirm");
  var confirm = document.getElementById("confirmPassword").value;
  if (confirm === "") {
    showError("confirmPassword", "errConfirm", "Please confirm your password.");
    ok = false;
  } else if (confirm !== password) {
    showError("confirmPassword", "errConfirm", "The passwords do not match.");
    ok = false;
  }

  /* below checks selection */
  clearError(null, "errGender");
  if (!isAnyChecked(["genderFemale", "genderMale", "genderNonBinary", "genderNoAnswer"])) {
    showError(null, "errGender", "Please select an option for gender.");
    ok = false;
  }

  
  clearError(null, "errGenres");
  if (!isAnyChecked(["genreAction", "genreComedy", "genreAnimation", "genreDrama", "genreSciFi"])) {
   
    showError(null, "errGenres", "Please choose at least one genre.");
    ok = false;
  }


  clearError("country", "errCountry");
  if (getValue("country") === "") {
    showError("country", "errCountry", "Please choose your country or region.");
    ok = false;
  }

  /* primary notification to fix errors */
  if (ok) {
    clearError(null, "errForm");
  } else {
    showError(null, "errForm", "Please fix the errors above, then try again.");
  }
  return ok;
}

/* Recommended paaain page ---------------
   Importantly, movies that do not suit the chosen age group are left out. Other results are scored by weight */

/* Connects the form to the recommendation code */
function initRecommend() {
  document.getElementById("recommendForm").onsubmit = showRecommendations;
}

/* Works out the score for one movie.
   Returns -1 if the movie does not suit the age group (byeee)). */
function getScore(movie, genre, ageGroup, viewing) {
  if (movie.ageGroups.indexOf(ageGroup) === -1) {
    return -1;
  }

  var score = 0;
  if (movie.genre === genre) {
    score = score + 3;
  }
  if (movie.viewing.indexOf(viewing) !== -1) {
    score = score + 2;
  }
  return score;
}

/* Builds the HTML for one result card */
function makeCard(movie) {
  return '<div class="card"><h3>' + movie.title + '</h3>' +
    '<p>' + movie.genre + ', rated ' + movie.rating + ', ' + formatPrice(movie.price) + ' per adult ticket</p>' +
    '<p><a href="booking.html?movie=' + movie.id + '" class="button">Book ' + movie.title + '</a></p></div>';
}

/* Runs when the form is submitted. It always returns false so the page does not reload. */
function showRecommendations() {
  var genre = getValue("genre");
  var ageGroup = getValue("ageGroup");
  var viewing = getValue("viewing");
  var ok = true;

  /* Every choice is req */
  clearError("genre", "errGenre");
  clearError("ageGroup", "errAgeGroup");
  clearError("viewing", "errViewing");

  if (genre === "") {
    showError("genre", "errGenre", "Please choose a genre.");
    ok = false;
  }
  if (ageGroup === "") {
    showError("ageGroup", "errAgeGroup", "Please choose an age group.");
    ok = false;
  }
  if (viewing === "") {
    showError("viewing", "errViewing", "Please choose who you are watching with.");
    ok = false;
  }

  if (!ok) {
    document.getElementById("results").innerHTML = "";
    return false;
  }

  var cards = "";
  var count = 0;       // how many movies have been added so far

  /* Goes through the possible scores from the highest (5) down to 1, adding every movie with that score until thers 3 */
  for (var score = 5; score >= 1; score--) {
    for (var i = 0; i < movies.length; i++) {
      if (count < 3 && getScore(movies[i], genre, ageGroup, viewing) === score) {
        cards = cards + makeCard(movies[i], count === 0);
        count = count + 1;
      }
    }
  }

  var html = "";
  if (count > 0) {
    html = "<h2>Recommended for you</h2>";
    html = html + "<p> You chose " + genre + ", " + ageGroup + " and " + viewing + ".</p>";
  } 
  else {
    /* Kids age group fallback */
    html = "<h2>Our closest suggestions</h2>";
    html = html + "<p>No movie matches your genre or viewing choice exactly, but these suit the kids age group.</p>";
    for (var j = 0; j < movies.length; j++) {
      if (count < 3 && getScore(movies[j], genre, ageGroup, viewing) === 0) {
        cards = cards + makeCard(movies[j]);
        count = count + 1;
      }
    }
  }

  document.getElementById("results").innerHTML = html + '<div class="card-grid">' + cards + "</div>";
  return false;
}

window.onload = init;