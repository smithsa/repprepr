var COUNTDOWN_SECONDS = document.querySelector(".countdown__seconds");
var EXERCISE_CAROUSEL = $(".carousel");
var EXERCISE_CAROUSEL_ITEMS = $(".carousel-item");
var currentCarouselDurationCount;
var IS_PAUSED = true;
var IS_RESTARTED = false;
var endingExerciseAudio = new Audio("./../assets/audio/gong.wav");


EXERCISE_CAROUSEL.carousel({
  interval: false
});


$( document ).ready(function() {


	// pause functionality
	$(".carousel img").on("click", function() {
		IS_PAUSED = !IS_PAUSED;
		IS_PAUSED ? EXERCISE_CAROUSEL.addClass("paused") : EXERCISE_CAROUSEL.removeClass("paused");
	});

	// restart timer
	$("#btn__restart").on("click", function() {
		IS_RESTARTED = true;
	});

	// start button
	$("#btn__start").on("click", function() {
		IS_PAUSED = false;
		$(this).remove();
	});

	// run the timer
	if (COUNTDOWN_SECONDS) {

		currentCarouselDurationCount = getCurrentExerciseAttribute("data-duration");
		COUNTDOWN_SECONDS.innerHTML = currentCarouselDurationCount;
		startExerciseCountDown(0, currentCarouselDurationCount);

		EXERCISE_CAROUSEL.on("slid.bs.carousel", function () {
			currentCarouselDurationCount = getCurrentExerciseAttribute("data-duration");
			currentCarouselIndexOrder = getCurrentExerciseAttribute("data-order");

			// only go to next slide if it is not the last slide
			if(currentCarouselIndexOrder + 1 !== EXERCISE_CAROUSEL_ITEMS.length) {
				COUNTDOWN_SECONDS.innerHTML = currentCarouselDurationCount;
				startExerciseCountDown(0, currentCarouselDurationCount);
			}
		});

	}

});

function getCurrentExerciseAttribute(attr) {
	return parseInt(document.querySelector(".carousel-item.active").getAttribute(attr));
}

function startExerciseCountDown(exerciseSecondsPassed, exerciseDurationInSeconds) {
	var timerInterval = setInterval(function(){ 

		if (IS_RESTARTED) {
			exerciseSecondsPassed = 0;
			exerciseDurationInSeconds = IS_PAUSED ? getCurrentExerciseAttribute("data-duration") : getCurrentExerciseAttribute("data-duration") + 1;
			IS_RESTARTED = false;
		}

		if (!IS_PAUSED) exerciseSecondsPassed = exerciseSecondsPassed + 1;


		COUNTDOWN_SECONDS.innerHTML = exerciseDurationInSeconds - exerciseSecondsPassed;

		// stop the interval timer
		if (exerciseSecondsPassed == exerciseDurationInSeconds) {
			clearInterval (timerInterval);
			endingExerciseAudio.play();
			// navigate to the next slide and start new countdown
			var nextSlideTimeout = setTimeout(function(){ 
				EXERCISE_CAROUSEL.carousel('next');
				clearTimeout(nextSlideTimeout);
			 }, 1500);

		} 
	 }, 1000);
}