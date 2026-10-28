MoviNite ----------

Nyasha | 105933091 | COS10005 Web Development

Mercury link: https://mercury.swin.edu.au/cos10005/s105933091/Assignment3/index.html
GitHub repository: https://github.com/txshino/Web2

Img Links:
Inside out: https://www.wired.com/2015/06/pixar-inside-out/
Cinema: https://www.hamburg.com/visitors/explore/film/kinopolis-hafencity-1082606
batman: https://sm.mashable.com/mashable_in/seo/3/32259/32259_jb62.jpg
barbie: https://www.imdb.com/title/tt1517268/
D&W: https://www.disneyplus.com/en-au/browse/entity-120ae1e6-2240-4924-a4ce-f8de6e28b0b1
SuperMario: https://www.imdb.com/title/tt6718170/


WEBSITE STRUCTURE ------------

assignment2/
|-- index.html       Home page
|-- movies.html      Movie listing
|-- recommend.html   Recommendation form and results
|-- register.html    Registration form
|-- booking.html     Ticket booking form
|-- css/
|   `-- style.css    The stylesheet
|-- js/
|   `-- script.js    All JavaScript
|-- images/
`-- Readme.txt       

Every page has the same header, navigation menu and footer. The link for the page you are on is highlighted in the navigation bar.
Layout is responsive. style.css has three media queries.


HOW THE JS WORKS -------

All my JavaScript is contained inside of the js/script.js file. When a page loads, a function called init() runs. It checks which form is on the page (booking, registration or recommendation) and will then initialisee only the code that page needs.

The movie data
One array called movies stores the six movies with their id, title, genre, age rating, ticket price, which age groups its for and the occasion. The booking page and the recommendation page both read from this array.

Each link puts the movie's id number in the page address, for example .html?movie=4. The recommendation results use the same kind of link. When the booking page loads, the script reads the address, splits out the number after "movie=", and selects the matching movie in the dropdown. If there is no number, the field returns to the default empty option. 


For both forms if anything is wrong, a red message appears under that field, the field gets a red border, and the form isnt sent. Messages are cleared and re-checked each time the form is submitted. Several components of the code utilise regex to validate that the input is correct.

Recommendation page:
The user chooses a genre, an age group and a viewing preference. The script then follows these steps:
    1 Age filter: any movie that does not suit the chosen age group is removed. This is mainly for children.
    2 Scoring: each movie that is left earns 3 points if its genre matches the chosen genre and 2 points if it suits the chosen viewing preference as its less important.
    3 Ranking: the movies are sorted from highest score to lowest, and the best three that earned points are shown. They all also each have a Book button.

The only combinations that could return no movies have the age filter, therefore, the fallback is to list kids movies.

KNOWN ISSUES AND LIMITATIONS ------------
- The session times shown on the movies page are for information. The booking
form lets the user pick any date and time that is not in the past. It would be niceto also prefill times by selecting them on the movie page.
- Ticket types are all the same price despite having options.
- The movie data is written into the code which makes it hard to change movie listings easily.
- The date and time check uses the clock on the customers devicec



