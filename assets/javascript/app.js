class CrunchyGif {

    constructor() {

        this.topics = ['doge', 'fractals', 'psychedelic', 'rick flair', 'ron burgundy', 'tropic thunder', 'space'];
        // this.currentTopic = [];
        // let ratings = ['g', 'pg', 'pg13', 'r'];     
        // this.rating = 'r';

    }

    //couldnt figure this section out
    // =======================================

    // async setContext(topic) {

    //     if (this.currentTopic.length === 0) {
    //         // wait for the promise to either resolve or reject
    //         // try/catch block so the application doesn't crash if the promise rejects
    //         try {
    //             const response = await this.getGifs(topic);
    //             this.currentTopic = response;
    //         } catch (err) {
    //             // this block should never be entered.
    //             console.log(err);
    //         }
    //     }
    // }

    // ========================================

    // Render buttons with topic tag to page 
    renderButtons() {
        // Deleting the button prior to adding new buttons to avoid duplicates
        $('#buttons-view').empty();

        // Looping through the array of topics
        for (let i = 0; i < this.topics.length; i++) {
            // Then dynamicaly generating buttons for each topic in the array
            const topicBtn = $('<a>');
            // Adding a class of movie-btn to our button (along with Materialize classes)
            topicBtn.addClass('topic-btn collection-item btn');
            // Adding a data-attribute
            topicBtn.attr('data-topic', this.topics[i]);
            // Providing the initial button text
            topicBtn.text(this.topics[i]);
            // Adding the button to the buttons-view div
            $('#buttons-view').append(topicBtn);
        }
    }

    //render results to the page
    renderGifs(response) {

        let gifObjArray = response.data;
        console.log(gifObjArray);

        for (let i = 0; i < gifObjArray.length; i++) {

            // Creating and storing a div tag
            var gifCard = $("<div>");

            // Creating a paragraph tag with the result item's rating
            var info = $("<p>").text("Rating: " + gifObjArray[i].rating);

            // Creating and storing an image tag
            var gifImage = $("<img>");

            // Setting the src attribute to the still state url of the result gifObject by detault
            // set animated url as another attribute to allow for on click animation
            gifImage.attr('src', gifObjArray[i].images.original_still.url);
            gifImage.attr('data-state', 'still');
            gifImage.attr('data-still', gifObjArray[i].images.original_still.url);
            gifImage.attr('data-animate', gifObjArray[i].images.original.url);
            gifImage.addClass('gif responsive-img');

            // Appending the paragraph and image tag to the animalDiv
            gifCard.append(info);
            gifCard.append(gifImage);

            // Prependng the animalDiv to the HTML page in the "#gifs-appear-here" div
            $("#gifs-space").prepend(gifCard);
        }

    }

    // Add topic to topics array and call renderButtons if it exists
    // need to pass event Object as arg to function to avoid context issues  
    addTopic(event) {

        event.preventDefault();
        // This line grabs the input from the textbox
        const topic = $('#topic-input').val().trim();
        // Get the result of the getTopic promise
        // this.getGifs(topic).then(response => {
        this.topics.push(topic);
        // this.currentTopic = response;
        this.renderButtons();
        //     }).catch(err => {
        //         //
        //         console.log(err);
        //         alert(`No results for ${topic} on Giphy =[ \nTry a different search!`);
        //     });
    }

    // returns the array of gifObjects
    getGifs(topic) {
        let queryURL = 'http://api.giphy.com/v1/gifs/search?q=' + topic + '&api_key=HwvU5T8lYgcO6IUp9uCaN02WQDRY6Lt9&limit=10';

        return new Promise((resolve, reject) => {
            $.ajax({
                url: queryURL,
                method: 'GET'
            }).then(response => {
                // Reject the promise if no results for keyword
                if (response.Error) reject('No Crunchiness here =[');
                // call the render gifs function with response as an arg
                this.renderGifs(response);
            });
        });
    }

}

// Initialize the CrunChyGifs
// call to renderButtons function to show the intial buttons
const gifApp = new CrunchyGif();
gifApp.renderButtons();

$(document).on("click", '.gif', function () {
    console.log('you have clicked a gif!')

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


// This handles the  add topic button
$('#add-topic').on('click', (event) => {
    gifApp.addTopic(event);
});

// listener for click events on all elements with class 'topic-btn'
$(document).on('click', '.topic-btn', function () {
    const topic = $(this).attr('data-topic');
    console.log('you clicked ' + topic);
    gifApp.getGifs(topic);
});
