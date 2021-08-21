// rotating menu bar animation
$(function() {
    $('.fas.fa-bars').click(function(){
        if ($(this).hasClass('animation1')){
            $(this).removeClass('animation1');
            $(this).addClass('animation2');
        } else {
            $(this).removeClass('animation2');
            $(this).addClass('animation1');
        };
    });
});


// hover animation side bars
$(function() {
    $('.float').hover(function(){
        $(this).attr('style', 'color: var(--clr-devfolio-lightgreen) !important; transform: translateY(-0.1em); transition: all 0.5s;');
    },
    function(){
        $(this).attr('style', 'color: var(--clr-devfolio-lightgray) !important; transform: translateY(0.1em); transition: all 0.5s;');
    });
});


// typing animation script
const allElements = document.querySelectorAll('.animated-text-cls');

if (allElements.length > 0) {
	allElements.forEach((element) => {
		const txtElement = element,
			wordsList = txtElement.getAttribute('data-words'),
			words = wordsList.split(', '); 

		let wordsCount = 0;

		entry();

		function entry() {
			if (wordsCount < words.length) {
				let word = words[wordsCount],
					txtArr = word.split(''), 
					count = 0;
                
				txtElement.textContent = '';

				txtArr.forEach((letter) => {
					let _letter = letter === ' ' ? '&nbsp;' : letter;

					txtElement.innerHTML += `<span>${_letter}</span>`;
				});

				let spans = txtElement.childNodes;

				const letterInterval = setInterval(activeLetter, 70);

				function activeLetter() {
					spans[count].classList.add('active');
					count++;

					if (count === spans.length) {
						clearInterval(letterInterval);

						setTimeout(() => {
							eraseText();
						}, 600);
					}
				}

				function eraseText() {
					let removeInterval = setInterval(removeLetter, 40);
					count--;

					function removeLetter() {
						spans[count].classList.remove('active');
						count--;

						if (count === -1) {
							clearInterval(removeInterval);
							wordsCount++;

							entry();
						}
					}
				}
			} else {
				wordsCount = 0;
				entry();
			}
		}
	});
}


// add animation to tech stack icons
$(document).ready(function() {
  $('#float-icons div.icon').each(function(){
    var self = this
    if($(self).hasClass('icon-move1')){
      $(self).removeClass('icon-move1')
    
    } else if ($(self).hasClass('icon-move2')){
      $(self).removeClass('icon-move2')
    }
  });
    $('#float-icons div.icon').each(function(i){
        var self = this
        if(i%2==1){
            setTimeout(function () {$(self).addClass('figure').addClass('icon-move1')}, i*1000)
        }else{
            setTimeout(function () {$(self).addClass('figure').addClass('icon-move2')}, i*1000)
        }
    });
});


// move tech stack icons with menu dropbar (mobile)
$(function(){
    $('.navbar-toggler').click(function(){
        if ($("div.navbar-collapse").hasClass("show")) {
          var tosub = $("div.navbar-collapse").css('height');
          console.log(tosub)
          var size = $('.icon:first-child').css('top');
          console.log(size)
			    var size = parseFloat(size)-parseFloat(tosub)
          console.log(size)
          $('#float-icons').children().animate({top:size},250);

        } else {
          var toadd = $("div.navbar-collapse").css('height');
          var size = $('.icon:first-child').css('top');
			    var size = parseFloat(size)+parseFloat(toadd)
          $('#float-icons').children().animate({top:size},250);

        }
    });
});


// contact form 
$('.contact-form').find('.form-control').each(function() {
	var targetItem = $(this).parent();
	if ($(this).val()) {
	  $(targetItem).find('label').css({
		'top': '0.8vw',
		'fontSize': '1vw'
	  });
	}
})
$('.contact-form').find('.form-control').focus(function() {
	$(this).parent('.input-block').addClass('focus');
	$(this).parent().find('label').animate({
	  'top': '0.8vw',
	  'fontSize': '1vw'
	}, 300);
})
$('.contact-form').find('.form-control').blur(function() {
	if ($(this).val().length == 0) {
	  $(this).parent('.input-block').removeClass('focus');
	  $(this).parent().find('label').animate({
		'top': '1.6vw',
		'fontSize': '1.3vw'
	  }, 300);
	}
})


// submit button
$("form:eq(0)").submit(function(e){
	e.preventDefault();
	var form = e.target;
	
	$('.col-sm-12 .button').toggleClass('active');
	$.when()
		.then($('.col-sm-12 .button').on('transitionend webkitTransitionEnd oTransitionEnd', function () {
			$(this).toggleClass('active');
		}))
		.then($('.col-sm-12 .button').on('transitionend webkitTransitionEnd oTransitionEnd', function () {
			$(this).addClass('finished');
			form.submit()
      form.reset();
		}));	
	
	return false;
});

// projects width = height
var cw = $('.project-grid').width();
$('.project-grid').css({'height':cw+'px'});

var cw = $('.github-project').width();
$('.github-project').css({'height':cw+'px'});

var cw = $('.project-img:eq(0) img').width();
$('.project-img:eq(0) img').css({'height':cw+'px'});
$('.project-grid').css({'height':'100%'});

// Reveal anination
const sr = ScrollReveal({
    origin: 'top',
    distance: '50px',
    duration: 2000,
    reset: false
});

// Elements with reveal animation

// navbar
sr.reveal('nav', {delay: 100})

// header
sr.reveal('#hello', {delay: 1000})
sr.reveal('#welcome', {delay: 2000})
sr.reveal('#animated-text', {delay: 3200})

// sections
sr.reveal('section *:not(.color-overlay):not(.project-img):not(.project-img *):not(#submitBtn):not(#submitBtn *)')

// Images zoom
let scaleAmount = 0.5;

function scrollZoom() {
  const images = document.querySelectorAll("[data-scroll-zoom]");
  let scrollPosY = 0;
  scaleAmount = scaleAmount / 100;

  const observerConfig = {
    rootMargin: "0% 0% 0% 0%",
    threshold: 0
  };

  images.forEach(image => {
    let isVisible = false;
    const observer = new IntersectionObserver((elements, self) => {
      elements.forEach(element => {
        isVisible = element.isIntersecting;
      });
    }, observerConfig);

    observer.observe(image);

    // Set initial image scale on page load
    image.style.transform = `scale(${1 + scaleAmount * percentageSeen(image)})`;

    // Only fires if IntersectionObserver is intersecting
    window.addEventListener("scroll", () => {
      if (isVisible) {
        scrollPosY = window.pageYOffset;
        image.style.transform = `scale(${1 +
          scaleAmount * percentageSeen(image)})`;
      }
    });
  });

  function percentageSeen(element) {
    const parent = element.parentNode;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const elPosY = parent.getBoundingClientRect().top + scrollY;
    const borderHeight = parseFloat(getComputedStyle(parent).getPropertyValue('border-bottom-width')) + parseFloat(getComputedStyle(element).getPropertyValue('border-top-width'));
    const elHeight = parent.offsetHeight + borderHeight;

    if (elPosY > scrollY + viewportHeight) {
      // If we haven't reached the image yet
      return 0;
    } else if (elPosY + elHeight < scrollY) {
      // If we've completely scrolled past the image
      return 100;
    } else {
      // When the image is in the viewport
      const distance = scrollY + viewportHeight - elPosY;
      let percentage = distance / ((viewportHeight + elHeight) / 100);
      percentage = Math.round(percentage);

      return percentage;
    }
  }
}

scrollZoom();
