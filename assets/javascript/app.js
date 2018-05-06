// initialization + global variables
var gifSearches = ["bacon","eggs sunny side up","pancake","coffee","cereal", "oatmeal"];
var existingButtons = gifSearches;
var gifInput = "";
var rowNum = 0;
var query;
var backgroundChoices=['primary','secondary','success','danger','warning','info','dark'];
var buttonChoices=['primary','success','danger','warning','info','light'];
var randomButton = Math.floor(Math.random()*buttonChoices.length);
// function to generate gif buttons & append to navbar. 
function makeButton(){
    for (var i=0; i < gifSearches.length ; i++) {
    var newButton = $('<button>');
    // makes the button href to top of screen so you see the gifs you requested after you click
    newButton.attr("onclick",'location.href="#top"');
    // bootstrap button classes, which a searchable class
    newButton.addClass("searchMe btn btn-lg my-auto mr-1 btn-outline-"+ buttonChoices[randomButton]).text(gifSearches[i]);
    // each button given id of it's title
    newButton.attr("id",gifSearches[i]).appendTo('#gif-buttons');
    };
}
// call function to set initial buttons on screen
makeButton();
// stylizes submit button and header text into random color each page refresh
$('#title').addClass('text-'+ buttonChoices[randomButton]);
$('#submit').addClass('btn-outline-'+ buttonChoices[randomButton]);


// when create button is clicked, the input is checked if already on the list to prevent duplicates
// then the input is added to the list of existing terms. The gif search array is cleared and replaced with input. 
// makeButton() called to append new button. Input field cleared for next submission
$('#submit').on("click", function(event) {
    event.preventDefault();
    gifInput = $("#gifInput").val().trim();
    if((existingButtons.indexOf(gifInput)===-1) && (gifInput !== '')){
        gifSearches = [gifInput];
        existingButtons.push(gifInput);
        makeButton();
    } else if(gifInput === ''){
        alert('Please type in something before clicking "create button"!')
    } else if((existingButtons.indexOf(gifInput)!==-1)){
        alert("Term already exists! Please input a different term.")
    };
    // clear the search field after you click
    $("#gifInput").val('');
    // this line gets the navbar height and pushes the body down that much so body is always visible w/fixed header
    $('#mainBody').css('margin-top',($('nav').height()+10)+'px'); 
});

// GIPHY KEY: tijQxlTuptL10zPKLPoI5zuxpjpKf7sl

// on button click, ajax call happens
$('body').on("click", '.searchMe', function() {
    $('#intro').css('display','none');
    // on click, the body topmargin is reajusted incase the screen resolution changes. Results will display proper margin after 
    $('#mainBody').css('margin-top',($('nav').height()+10)+'px'); 
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
      this.id + "&api_key=tijQxlTuptL10zPKLPoI5zuxpjpKf7sl&limit=12&rating=G";

    query = this.id;
    
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // promise section from AJAX request
      .then(function(response) {
    
        // storing the data from the AJAX request in the results variable
        var results = response.data;
        // iterates row number for rows to be created later
        rowNum ++;
        // create new row
         $('<div>').addClass("row rowGif row"+rowNum).prependTo('#mainBody');
        // create new columns (4 cols) for the newly created row above
        for (var i = 0; i < 4; i++) {
        $('<div>').addClass('col-md-3 col-sm-6 col-12').attr('id','col'+rowNum+i).css("padding",0).appendTo(".row"+rowNum);
        };
        
        var randomBackground = Math.floor(Math.random()*backgroundChoices.length);

        // description row created to be placed above gifs
        $('<div>').addClass("row description bg-" + backgroundChoices[randomBackground]).attr('id',query+"Gifs").prependTo('#mainBody').html("<h2>"+query+" gifs:</h2><p>All Rated G: You already have enough to explain to your boss...<p>");
       

        // Looping through each result item
        for (var i = 0; i < results.length; i++) {
            var newDiv =  $("<div>");
            // ****************************************************************
            // rating code below. Scope of this app is "G-rating Gifs only" for the
            // SFW theme. If it were all ratings, code below would actually be useful
            // ****************************************************************
            // var rating = '';
            // if(results[i].rating === 'g'){
            //     rating = "Rated G: You already have enough to explain to your boss..."
            // } else if (results[i].rating === 'pg') {
            //     rating = "That gif has a little questionable material. Tread with caution"
            // } else {
            //     rating = "Close the office door and clear browser history"
            // }
            // Creating a paragraph tag with the result item's rating
            // var ratingText = $("<p>").text(rating);
            // newDiv.append(ratingText);
            // ****************************************************************
            // Creating and storing an image tag
            var gifImage = $("<img>");
            // Setting the src attribute of the image to a property pulled off the result item
            gifImage.attr("src", results[i].images.fixed_height_still.url);
            gifImage.attr('data-animate', results[i].images.fixed_height.url)
            gifImage.attr('data-still', results[i].images.fixed_height_still.url)
            gifImage.attr('data-state', 'still');
            newDiv.append(gifImage);
            newDiv.addClass("gifBox");

            // ************
            // Working on this part still 
            // ************
            // create download <a> and append to infoBox and to newDiv
            // var textInfo = $("<a>").attr('href', results[i].images.fixed_height.url).attr('download', query+i+'.gif').text("click to download");          
            // $('<div>').append(textInfo).addClass("infoBox").appendTo(newDiv);

            // Prependng the newDiv to the HTML page in the "#mainBody" div
            $('#col'+rowNum+(i%4)).prepend(newDiv);
        }
      });
  });

  $('body').on("click", 'img', function() {
    // set get data-state info and assign to variable
    var state = $(this).attr("data-state");
    console.log(state);
    // If the clicked image's state is still, change its src attribute to data-animate value is.
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


