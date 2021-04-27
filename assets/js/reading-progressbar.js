// File#: reading-progressbar
(function() {
    var readingIndicator = document.getElementsByClassName('js-reading-progressbar')[0],
      readingIndicatorContent = document.getElementsByClassName('js-reading-content')[0];
    
    if( readingIndicator && readingIndicatorContent) {
      var progressInfo = [],
        progressEvent = false,
        progressFallback = readingIndicator.getElementsByClassName('js-reading-progressbar__fallback')[0],
        progressIsSupported = 'value' in readingIndicator;
  
      progressInfo['height'] = readingIndicatorContent.offsetHeight;
      progressInfo['top'] = readingIndicatorContent.getBoundingClientRect().top;
      progressInfo['window'] = window.innerHeight;
      progressInfo['class'] = 'reading-progressbar--is-active';
      
      //init indicator
      setProgressIndicator();
      // wait for font to be loaded - reset progress bar
      if(document.fonts) {
        document.fonts.ready.then(function() {
          triggerReset();
        });
      }
      // listen to window resize - update progress
      window.addEventListener('resize', function(event){
        triggerReset();
      });
  
      //listen to the window scroll event - update progress
      window.addEventListener('scroll', function(event){
        if(progressEvent) return;
        progressEvent = true;
        (!window.requestAnimationFrame) ? setTimeout(function(){setProgressIndicator();}, 250) : window.requestAnimationFrame(setProgressIndicator);
      });
      
      function setProgressIndicator() {
        progressInfo['top'] = readingIndicatorContent.getBoundingClientRect().top;
        if(progressInfo['height'] <= progressInfo['window']) {
          // short content - hide progress indicator
          Util.removeClass(readingIndicator, progressInfo['class']);
          progressEvent = false;
          return;
        }
        // get new progress and update element
        Util.addClass(readingIndicator, progressInfo['class']);
        var value = (progressInfo['top'] >= 0) ? 0 : 100*(0 - progressInfo['top'])/(progressInfo['height'] - progressInfo['window']);
        readingIndicator.setAttribute('value', value);
        if(!progressIsSupported && progressFallback) progressFallback.style.width = value+'%';
        progressEvent = false;
      };
  
      function triggerReset() {
        if(progressEvent) return;
        progressEvent = true;
        (!window.requestAnimationFrame) ? setTimeout(function(){resetProgressIndicator();}, 250) : window.requestAnimationFrame(resetProgressIndicator);
      };
  
      function resetProgressIndicator() {
        progressInfo['height'] = readingIndicatorContent.offsetHeight;
        progressInfo['window'] = window.innerHeight;
        setProgressIndicator();
      };
    }
  }());