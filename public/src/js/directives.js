'use strict';

angular.module('insight')
  .directive('scroll', function ($window) {
    return function(scope, element, attrs) {
      angular.element($window).bind('scroll', function() {
        if (this.pageYOffset >= 200) {
          scope.secondaryNavbar = true;
        } else {
          scope.secondaryNavbar = false;
        }
        scope.$apply();
      });
    };
  })
  .directive('whenScrolled', function($window) {
    return {
      restric: 'A',
      link: function(scope, elm, attr) {
        var pageHeight, clientHeight, scrollPos;
        $window = angular.element($window);

        var handler = function() {
          pageHeight = window.document.documentElement.scrollHeight;
          clientHeight = window.document.documentElement.clientHeight;
          scrollPos = window.pageYOffset;

          if (pageHeight - (scrollPos + clientHeight) === 0) {
            scope.$apply(attr.whenScrolled);
          }
        };

        $window.on('scroll', handler);

        scope.$on('$destroy', function() {
          return $window.off('scroll', handler);
        });
      }
    };
  })
  .directive('clipCopy', function() {

      return {
        restric: 'A',
        scope: { clipCopy: '=clipCopy' },
        template: '<div class="tooltip fade right in" style="display: none;"><div class="tooltip-arrow"></div><div class="tooltip-inner">Copied!</div></div>',
        link: function(scope, elm) {
			elm.on('mousedown', function(event) {
	  		  var text = scope.clipCopy;

	  		  var textArea = document.createElement("textarea");

	  		  // Place in top-left corner of screen regardless of scroll position.
	  		  textArea.style.position = 'fixed';
	  		  textArea.style.top = 0;
	  		  textArea.style.left = 0;

	  		  // Ensure it has a small width and height. Setting to 1px / 1em
	  		  // doesn't work as this gives a negative w/h on some browsers.
	  		  textArea.style.width = '2em';
	  		  textArea.style.height = '2em';

	  		  // We don't need padding, reducing the size if it does flash render.
	  		  textArea.style.padding = 0;

	  		  // Clean up any borders.
	  		  textArea.style.border = 'none';
	  		  textArea.style.outline = 'none';
	  		  textArea.style.boxShadow = 'none';

	  		  // Avoid flash of white box if rendered for any reason.
	  		  textArea.style.background = 'transparent';
  
	  		  var regex = /<br\s*[\/]?>/gi;
	  		  textArea.value = text.replace(regex, "\n");

	  		  document.body.appendChild(textArea);

	  		  textArea.select();

	  		  try {
	  		    var successful = document.execCommand('copy');
	  			document.execCommand("RemoveFormat");
	  		    var msg = successful ? 'successful' : 'unsuccessful';
	  		    //console.log('Copying text command was ' + msg);
				angular.element(elm[0].querySelector('.tooltip'))[0].style.display = "block";
				angular.element(elm[0].querySelector('.tooltip'))[0].style.opacity = "1";
				setTimeout(function(){ angular.element(elm[0].querySelector('.tooltip'))[0].style.opacity = "0"; angular.element(elm[0].querySelector('.tooltip'))[0].style.display = "none";}, 1000);
				
	  		  } catch (err) {
	  		    console.log('Oops, unable to copy');
	  		  }
	  		  document.body.removeChild(textArea);
			});
        }
      };
  })
  .directive('focus', function ($timeout) {
    return {
      scope: {
        trigger: '@focus'
      },
      link: function (scope, element) {
        scope.$watch('trigger', function (value) {
          if (value === "true") {
            $timeout(function () {
              element[0].focus();
            });
          }
        });
      }
    };
  });
