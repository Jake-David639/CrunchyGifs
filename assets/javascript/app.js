Class CrunchyGif = {

    constructor() {

        this.APIkey = 'HwvU5T8lYgcO6IUp9uCaN02WQDRY6Lt9';
        this.rating = 'r';
        this.queryURL = 'http://api.giphy.com/v1/gifs/search?q=' + keyWord + '&api_key=' + APIkey + '&limit=10';
        this.topics = ['doge', 'fractals', 'psychedelic', 'rick flair', 'ron burgundy', 'tropic thunder', 'space'];
        this.currentTopic = {};
        // let ratings = ['g', 'pg', 'pg13', 'r'];     

    }
        
        async setContext (topic) {

        if (Object.keys(this.currentTopic).length === 0) {
            // wait for the promise to either resolve or reject
            // try/catch block so the application doesn't crash if the promise rejects
            try {
                const response = await this.getTopic(topic);
                this.currentTopic = response;
            } catch (err) {
                // this block should never be entered.
                console.log(err);
            }
        }
    }

        // Render buttons with topic tag to page 
        renderButtons () {
        // Deleting the button prior to adding new buttons to avoid duplicates
        $('#buttons-view').empty();

        // Looping through the array of topics
        for (let i = 0; i < this.topics.length; i++) {
            // Then dynamicaly generating buttons for each topic in the array
            const topicBtn = $('<a>');
            // Adding a class of movie-btn to our button (along with Materialize classes)
            topicBtn.addClass('topic-btn collection-item');
            // Adding a data-attribute
            topicBtn.attr('data-topic', this.topics[i]);
            // Providing the initial button text
            topicBtn.text(this.topics[i]);
            // Adding the button to the buttons-view div
            $('#buttons-view').append(topicBtn);
        }
    }

        //render results to the page
        renderGifs (gifObject) {

        // Creating and storing a div tag
        var gifCard = $("<div>");

        // Creating a paragraph tag with the result item's rating
        var info = $("<p>").text("Rating: " + gifObject.rating);

        // Creating and storing an image tag
        var gifImage = $("<img>");

        // Setting the src attribute to the still state url of the result gifObject by detault
        // set animated url as another attribute to allow for on click animation
        gifImage.attr('src', gifObject.images.original_still.url);
        gifImage.attr('data-state', 'still');
        gifImage.attr('data-still', gifObject.images.original_still.url);
        gifImage.attr('data-animate', gifObject.images.original.url);
        gifImage.addClass('gif');

        // Appending the paragraph and image tag to the animalDiv
        gifCard.append(info);
        gifCard.append(gifImage);

        // Prependng the animalDiv to the HTML page in the "#gifs-appear-here" div
        $("#gifs-appear-here").prepend(gifCard);

    }

        // Add topic to topics array and call renderButtons if it exists
        // need to pass event Object as arg to function to avoid context issues  
        addTopic (event) {
        event.preventDefault();
        // This line grabs the input from the textbox
        const topic = $('#search-input').val().trim();
        // Get the result of the getMovie promise
        this.getMovie(movie).then(response => {
            this.topics.push(movie);
            this.currentTopic = response;
            this.renderButtons();
        }).catch(err => {
            //
            console.log(err);
            alert(`No results for ${topic} on Giphy =[ \nTry a different search!`);
        });
    }

        getTopic (topic) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: this.queryURL,
                method: 'GET'
            }).then(topic => {
                // Reject the promise if no results for keyword
                if (topic.Error) reject('No Crunchiness here =[');
                // Resolve and return the responce object
                resolve(topic);
            });
        });
    }


}

// Initialize the CrunChyGifs
// call to renderButtons function to show the intial buttons
const gifApp = new CrunchyGif();
gifApp.renderButtons();

$(".gif").on("click", function () {

    var state = $(this).attr("data-state");
    // If the clicked image's state is still, update its src attribute to what its data-animate value is.
    // Then, set the image's data-state to animate
    // Else set src to the data-still value
    if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
    } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }
});


// This handles events where a topic button is clicked
$('#add-topic').on('click', (event) => {
    gifApp.addTopic(event);
});

// listener for click events on all elements with class 'topic-btn'
$(document).on('click', '.topic-btn', function () {
    const topic = $(this).attr('data-topic');
    gifApp.renderGifs(topic);
});
