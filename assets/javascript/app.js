// **********************************
// initialization + global variables:
// **********************************
var gifSearches = ["FAVORITES","bacon","eggs sunny side up","pancake","coffee","cereal", "oatmeal"];
var existingButtons = gifSearches;
var gifInput = "";
var rowNum = 0;
var query;
var backgroundChoices=['primary','secondary','success','danger','warning','info','dark'];
var buttonChoices=['primary','success','danger','warning','info','light'];
var randomButton = Math.floor(Math.random()*buttonChoices.length);
var favoriteGif=[];
var favoriteClicked = false;
var favoriteCreated = false;

// **********************************
// Establish functions to be called on later:
// **********************************

// function to generate gif buttons & append to navbar. 
function makeButton(){
    for (var i=0; i < gifSearches.length ; i++) {
    var newButton = $('<button>');
    // makes the button href to top of screen so you see the gifs you requested after you click
    newButton.attr("onclick",'location.href="#top"');
    // bootstrap button classes, with a searchMe class to be called on later
    newButton.addClass("searchMe btn btn-lg my-auto mr-1 btn-outline-"+ buttonChoices[randomButton]).text(gifSearches[i]);
    // each button given id of it's title
    newButton.attr("id",gifSearches[i]).appendTo('#gif-buttons');
    };
}

function makeFavorites(){
    if(!favoriteCreated){
    var randomBackground = Math.floor(Math.random()*backgroundChoices.length);
    // description row created to be placed above gifs
    $('<div>').addClass("row rowGif favoriteRow").attr('id','favrow').prependTo('#mainSection');
    $('<div>').attr('id','favrow1').addClass("row favoriteRow1 description bg-" + backgroundChoices[randomBackground]).attr('id',query+"Gifs").prependTo('#mainSection').html("<h2>Here are your favorites</h2><p>All Rated G: You already have enough to explain to your boss...<p>");         
    $('.favoriteRow').css('display','none');
    $('.favoriteRow1').css('display','none');
    favoriteCreated =true;
    };
};

function displayHideFav(){
    var randomBackground = Math.floor(Math.random()*backgroundChoices.length);
    if(favoriteClicked){
        $('#FAVORITES').attr('class',"searchMe btn btn-lg my-auto mr-1 btn-outline-"+ buttonChoices[randomButton]);
        favoriteClicked = false;
        $('.favoriteRow').css('display','none');
        $('.favoriteRow1').css('display','none');
    } else if(!favoriteClicked){
        $('#FAVORITES').attr('class',"searchMe btn btn-lg my-auto mr-1 btn-outline-"+ buttonChoices[randomButton]+" text-dark bg-"+ buttonChoices[randomButton]);
        favoriteClicked = true;
        $('.favoriteRow').css('display','');
        $('.favoriteRow1').css('display','').attr('class',"row favoriteRow1 description bg-" + backgroundChoices[randomBackground]);
    }
};

// **********************************
// Click events and execution of functions:
// **********************************

// trying to get local storage working:
// if(localStorage.getItem('faves',favoriteGif) === null){
//     favoriteGif = [];
// } else {
//     favoriteGif = localStorage.getItem('faves',favoriteGif)
// };

// call function to create empty favorites section
makeFavorites();
// call function to set initial buttons on screen
makeButton();
// stylizes submit button and header text into random color each page refresh
$('#title').addClass('text-'+ buttonChoices[randomButton]);
$('#submit').addClass('btn-outline-'+ buttonChoices[randomButton]);

// ***** Input search term for new button *******
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
    $('#mainSection').css('margin-top',($('nav').height()+10)+'px'); 
});

// GIPHY KEY: tijQxlTuptL10zPKLPoI5zuxpjpKf7sl

// ****** button click event for AJAX call ********
// on button click, ajax call happens
$('body').on("click", '.searchMe', function() {
    $('#intro').css('display','none');
    // on click, the body topmargin is reajusted incase the screen resolution changes. Results will display proper margin after 
    $('#mainSection').css('margin-top',($('nav').height()+10)+'px');
  
    if (this.id !== "FAVORITES"){    
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
            var textDiv =  $("<div>");
            // ****************************************************************
            // rating code below. Scope of this app is "G-rating Gifs only" for the
            // SFW theme. If it were all ratings, code below would actually be useful
            // ****************************************************************
            var rating = '';
            if(results[i].rating === 'g'){
                rating = "Rated G:"
            } else if (results[i].rating === 'pg') {
                rating = "Rated PG:"
            } else {
                rating = "Rating: Unrated (or worse)"
            }
            // Creating a paragraph tag with the result item's rating
            var gifTitle= results[i].title;
            if((results[i].title === "")||(results[i].title === " ")){gifTitle="(No Title)"};
            var titleLine = $("<h4>").text(gifTitle);
            var ratingLine = $("<p>").text(rating);
            var downloadLine= $("<p>").html("&nbsp &nbsp or &nbsp &nbsp").prepend($("<a>").attr('href', results[i].images.fixed_height.url).attr('download', query+i+'.gif').text("Click to download")).append($("<span>").addClass('gifCookie').attr('data-url', results[i].images.fixed_height.url).attr('data-urlStill', results[i].images.fixed_height_still.url).attr('data-name', gifTitle).text("Add to Favorites"));
            textDiv.addClass("gifInfo").append(titleLine).append(ratingLine).append(downloadLine).appendTo(newDiv);
            // ****************************************************************
            // Creating and storing an image tag
            var gifImage = $("<img>");
            // Setting the src attribute of the image to a property pulled off the result item
            gifImage.attr("src", results[i].images.fixed_height_still.url);
            gifImage.attr('data-animate', results[i].images.fixed_height.url)
            gifImage.attr('data-still', results[i].images.fixed_height_still.url)
            gifImage.attr('data-state', 'still');
            newDiv.prepend(gifImage);
            newDiv.addClass("gifBox");
           
            // Prependng the newDiv to the HTML page in the "#mainBody" div, id col0 to col3 using modulus
            $('#col'+rowNum+((i+3)%4)).prepend(newDiv);
        }
      });
    } else if(this.id === "FAVORITES"){
      if(favoriteGif.length === 0){
        $('.favoriteRow').text("please add some favorites and come back")
        displayHideFav();
        }else{
          makeFavorites();
          displayHideFav();
          $('.favoriteRow').empty();
          
     
    // create new columns (4 cols) for the newly created row above
    for (var i = 0; i < 4; i++) {
    $('<div>').addClass('col-md-3 col-sm-6 col-12').attr('id','favCol'+i).css("padding",0).appendTo("#favrow");
    };    

    // Looping through each result item
    for (var i = 0; i < favoriteGif.length; i++) {
        var newDiv =  $("<div>");
        var textDiv =  $("<div>");
        var favoriteName =  favoriteGif[i].title;
        var favoriteUrl =  favoriteGif[i].url;
        var favoriteUrlStill =  favoriteGif[i].urlStill;
        var titleLine = $("<h4>").text(favoriteName);
        textDiv.addClass("gifInfo").append(titleLine).appendTo(newDiv);
        // ****************************************************************
        // Creating and storing an image tag
        var gifImage = $("<img>");
        // Setting the src attribute of the image to a property pulled off the result item
        gifImage.attr("src", favoriteUrlStill);
        gifImage.attr('data-animate', favoriteUrl)
        gifImage.attr('data-still', favoriteUrlStill)
        gifImage.attr('data-state', 'still');
        newDiv.prepend(gifImage);
        newDiv.addClass("gifBox");
       
        // Prependng the newDiv to the HTML page in the "#mainSection" div, id col0 to col3 using modulus
        $('#favCol'+(i%4)).prepend(newDiv);
        }
    }
  }   
  });
// function for when you click on gif image to toggle animate/still
  $('body').on("click", 'img', function() {
    // set get data-state info and assign to variable
    var state = $(this).attr("data-state");
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

// function for adding favorites to cookie
$('body').on("click", '.gifCookie', function() {
  // set get data-state info and assign to variable
  var favName = $(this).attr("data-name");
  var favUrl = $(this).attr("data-url");
  var favUrlStill = $(this).attr("data-urlStill");
  var favObject = {"title":favName, "url": favUrl, "urlStill": favUrlStill}
  $(this).css("color",'white').css('background-color','red').text('Added to Favorites');
  if( favoriteGif.indexOf(favObject) === -1){
    favoriteGif.push(favObject);
    localStorage.setItem('faves',favoriteGif);  
};
 
  $('#FAVORITES').text('FAVORITES: '+favoriteGif.length); 
  
//   var stringified = JSON.stringify(favoriteGif);
//   createCookie('favoriteGif', stringified);
  // var cookieString = "url="+favUrl+"; expires=Thu, 16 May 2019 12:00:00 UTC; path=/";
  // document.cookie = cookieString;
  // console.log(cookieString);
  // console.log(document.cookie);
});  

// function getCookie(cname) {
//   var name = cname + "=";
//   var decodedCookie = decodeURIComponent(document.cookie);
//   var ca = decodedCookie.split(';');
//   for(var i = 0; i <ca.length; i++) {
//       var c = ca[i];
//       while (c.charAt(0) == ' ') {
//           c = c.substring(1);
//       }
//       if (c.indexOf(name) == 0) {
//           return c.substring(name.length, c.length);
//       }
//   }
//   return "";
// }

// // woking on adding cookies for favorites
// var faves = [
//   {id: 'firstid', href: 'firsthref.html'},
//   {id: 'secondid', href: 'secondhref.html'}
// ];

// // access the fave objects with faves[0].id or faves[0].href
// // add to the fave objects with faves.push({id: 'newid', href: 'newhref.html'})

// // stringify the array/object so that you can store it in a cookie
// var stringified = JSON.stringify(faves);
// createCookie('faves', stringified);

// // parse to convert the stringified content back to array/object data
// faves = JSON.parse(readCookie());

// function createCookie(name, value, days) {
//   var expires = '',
//       date = new Date();
//   if (days) {
//       date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//       expires = '; expires=' + date.toGMTString();
//   }
//   document.cookie = name + '=' + value + expires + '; path=/';
// }

// stringify the array/object so that you can store it in a cookie


// parse to convert the stringified content back to array/object data


// function createCookie(name, value, days) {
//   var expires = '',
//       date = new Date();
//   if (days) {
//       date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//       expires = '; expires=' + date.toGMTString();
//   }
//   document.cookie = name + '=' + value + expires + '; path=/';
// }
// function readCookie(name) {
//   var nameEQ = name + '=',
//       allCookies = document.cookie.split(';'),
//       i,
//       cookie;
//   for (i = 0; i < allCookies.length; i += 1) {
//       cookie = allCookies[i];
//       while (cookie.charAt(0) === ' ') {
//           cookie = cookie.substring(1, cookie.length);
//       }
//       if (cookie.indexOf(nameEQ) === 0) {
//           return cookie.substring(nameEQ.length, cookie.length);
//       }
//   }
//   return null;
// }

// function eraseCookie(name) {
//   createCookie(name, '', -1);
//}