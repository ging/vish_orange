
var $grid;
$(document).ready(function() {

//-------- INITIAL SCROLL -----------

	var scroll_arrow = $('.scroll_arrow');

	var scroll = function() {

    document.getElementById('elab-apps').scrollIntoView({block: 'start', behavior: 'smooth'});
	};

	scroll_arrow.on('click', scroll);


//-------- LANGUAJE MENU -----------

	var accordion = function (className) {
	  var item = $(className);
	  item.toggleClass("closed");
	  if (item.css('max-height') == '0px'){
	  	item.css('max-height', item.prop("scrollHeight") + 20 + "px");
	  } else {
	  	item.css('max-height', '0');
	  }
	};

	//////////OPEN LANGUAJE //////////

	var language_arrow = $("#lang_arrow");

	language_arrow.on("click", function() {
    $(this).toggleClass("closed");
    accordion(".other_languages");
	});


  //------------ CREATE APP DIVS -------------

  $('.alt_text').hide();

	var apps = $(SAMPLE);
  var main_apps = $('.elab-apps');


  var create_apps = function () {

    var app = "";

    apps.each((i, e) => {

      var name1 = (apps[i].app.split(" ").length != 1) ? (apps[i].app.split(" ")[0]) : "";
      var name2 = (apps[i].app.split(" ").length != 1) ? (apps[i].app.split(" ")[1]) :  apps[i].app;

      app += "<div class='app-item all " + apps[i].category + " " + apps[i].class + " " + apps[i].type + "'>";
      app += "<div class='app app" + i + " " + apps[i].category + " " + apps[i].class + " " + apps[i].type + "'>";
      app += "<span class='icon-cross app_cross'></span>";
      app += "<div class='app_text'>";
      app += "<div class='name_text'>";
      app += "<p class='type'>" + apps[i].type + "</p>";
      app += "<div class='name'>";
      app += "<a class='app_go' href='" + apps[i].url + "'>";
      //app += "<p class='name1'>" + apps[i].app.split(" ")[0] + "</p>";
      //app += "<p class='name2'>" + apps[i].app.split(" ")[1] + "</p>";
      app += "<p class='name1'>" + name1 + "</p>";
      app += "<p class='name2'>" + name2 + "</p>";
      app += "</a>";
      app += "</div>";
      app += "</div>";
      app += "<div class='def_arrow'><span class='icon-arrow_right info_arrow'></span></div>";
      app += "</div>"; //app_text
      app += "<div class='def_app'>";
      app += "<div class='def_title'>" + apps[i].name + "</div>";
      app += "<div class='def_author'>autor: " + apps[i].author + "</div>";
      app += "<div class='def_details'><span class='def_det def_language'>" + apps[i].language + "</span>";
      app += "<span class='def_det def_rate'>" + apps[i].rate + "</span>";
      app += "<span class='def_det def_difficulty'>" + apps[i].difficulty + "</span>"; 
      app += "<span class='def_det def_duration'>" + apps[i].duration + "</span>"; 
      app += "</div>";
      app += "<div class='def_definition'>" + apps[i].definition + "</div>"; 
      app += "<a class='def_play' href='" + apps[i].url + "'><span class='play_text'>ir a la aplicación</span> <img src='assets/elab/start.svg'></a>"; 
      //app += "<a class='def_play' href='" + apps[i].url + "'><img src='assets/elab/start.svg'></a>";      
      app += "</div>"; //def_app
      app += "</div>"; //app
      app += "</div>"; //app-item
    });

    main_apps.append(app);
  };

  create_apps();


  //------------ APP DIVS HEIGHT -------------

  var blocksFn = () => {
    var blocks = $('.app');
    blocks.each((i, e) => {
      var blocksparent = $(e).parents('.app-item');
      let newHeight = $(e).outerWidth();
      if (blocksparent.hasClass('big')) {
        newHeight = $(e).outerWidth() / 2 - parseFloat(blocksparent.css('margin-right')) / 2;
      } 
       $(e).css({
        height: newHeight + 'px'
        });
    });
  };

  $(window).on('load resize' , () => {
    setTimeout(()=>{
      blocksFn();
      $grid.isotope();
    },500);
    
  });


//----------- APP DIV BIG --------------

 var growBlock = () => {
    var arrow_app = $('.info_arrow');
    var cross_app = $('.app_cross');
    var whosBig = null;

    arrow_app.each((i, e) => {
      $(e).on('click', (ev) => {
        var parent = $(ev.target).parents(".app-item");
        var parentmin = $(ev.target).parents(".app");
        console.log(parentmin);
        if (parent.is(whosBig)) {
          parent.removeClass('big');
          $('.app').removeClass('no-hover');
          $('.info_arrow').css('pointer-events', 'auto');
          whosBig = null;
        } else {
          if (whosBig) {
            whosBig.removeClass('big');
            $('.app').removeClass('no-hover');
            $('.info_arrow').css('pointer-events', 'auto');
          }
          parent.addClass('big');
          parentmin.addClass('no-hover');
          $(e).css('pointer-events', 'none');
          whosBig = parent;
        }
        //setTimeout(blocksFn,500);
        setTimeout(()=>{$grid.isotope()},200);
      }); 
    });

    cross_app.each((i, e) => {
      $(e).on('click', (ev) => {
        $('.app-item').removeClass('big');
        $('.app').removeClass('no-hover');
        $('.info_arrow').css('pointer-events', 'auto');
        whosBig = null;
        setTimeout(()=>{$grid.isotope()},100);
      }); 
    });

  };


  $(window).on('load' , () => {
    $grid.isotope();
    growBlock();
  });



//------------ FILTERS + SEARCH -----------------


// quick search regex
var qsRegex;
var buttonFilter;
var timevalue;

// init Isotope
$grid = $('.elab-apps').isotope({
  itemSelector: '.app-item',
  //layoutMode: 'layout',
/*  layoutMode: 'fitRows',
  fitRows: {
    gutter: 40
  },*/
  filter: function() {
    var $this = $(this);
    var searchResult = qsRegex ? $this.text().match( qsRegex ) : true;
    var buttonResult = buttonFilter ? $this.is( buttonFilter ) : true;
    return searchResult && buttonResult;
  }
});

$('#filters').on( 'click', '.icon-menu', function() {
  $('.app-item').removeClass('big');
  $('.app').removeClass('no-hover');
  buttonFilter = $( this ).attr('data-filter');
  if ($(buttonFilter).length == 0) {
    $grid.isotope();
    $('.alt_text').show();
    scroll();
    timevalue = window.setTimeout(function(){
      $('.alt_text').hide();
      $(".icon-all")[0].click();
    }, 3000);
  } else {
    $grid.isotope();
clearTimeout(timevalue);
    $('.alt_text').hide();
    scroll();
  }
});

// use value of search field to filter
var $quicksearch = $('#appSearch').keyup( debounce( function() {
  qsRegex = new RegExp( $quicksearch.val(), 'gi' );
  $grid.isotope();
  scroll();
}) );


  // change is-checked class on buttons
$('.filters').each( function( i, buttonGroup ) {
  var $buttonGroup = $( buttonGroup );
  $buttonGroup.on( 'click', '.icon-menu', function() {
    $buttonGroup.find('.is-checked').removeClass('is-checked');
    $( this ).addClass('is-checked');
  });
});


// debounce so filtering doesn't happen every millisecond
function debounce( fn, threshold ) {
  var timeout;
  threshold = threshold || 100;
  return function debounced() {
    clearTimeout( timeout );
    var args = arguments;
    var _this = this;
    function delayed() {
      fn.apply( _this, args );
    }
    timeout = setTimeout( delayed, threshold );
  };
}



});
