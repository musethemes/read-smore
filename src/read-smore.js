import { getWordCount, getCharCount, trimSpaces } from "./utils";


'use strict';

/**
 * Defaults
 */
const defaultOptions = {
  blockClassName: 'read-smore',
  wordsCount: 70,
  charsCount: 150,
  moreText: 'Read More',
  lessText: 'Read Less',
  ellipse: '...',
  isInline: false,
  animate: false,
  animationDuration: 400,
  animationOverflow: false
};

/**
 * ReadSmore
 * @param {HTML element} element
 * @param {Object} options
 * @returns
 */
function ReadSmore(element, options) {
  options = Object.assign({}, defaultOptions, options);

  // Internal Settings
  let settings = {
    originalContentArr: [],
    truncatedContentArr: [],
  };

  /**
   * Init plugin
   * Loop over instances and begin truncation procress
   * @public
   */
  function init() {
    document.fonts.ready.then(function() {
      for (let i = 0, n = element.length; i < n; ++i) {
        // Set the inline attribute if needed
        if(options.isInline) {
          $(element[i]).attr('data-read-smore-inline', 'true');
        }
        
        // Set the original height for animation purposes
        if(options.animate) {
          // Set the overflow to auto so that the height can be calculated
          if(options.animationOverflow) {
            $(element[i]).css('overflow', 'auto');
          }
          
          // If the button is inline create a fake invisible button to calculate the height
          if(options.isInline) {
            createLink(i);
            $(element[i]).find('.read-smore__link-wrap').css('opacity', '0');
          }
          
          // Store the original full height of the block
          $(element[i]).attr('data-read-smore-full-height', Math.ceil($(element[i]).outerHeight(true)));

          // We have the height, so remove the fake button
          if(options.isInline) {
            $(element[i]).find('.read-smore__link-wrap').remove();
          }
        }

        truncate(element[i], i);

        // Store the truncated height for animation purposes
        if(options.animate) {
          $(element[i]).attr('data-read-smore-truncated-height', Math.ceil($(element[i]).outerHeight(true)));
        }
      }
    });
  }

  /**
   * Ellpise Content
   * Handles content ellipse by words or charactes
   * @param {String} str - content string.
   * @param {Number} max - Number of words||chars2 to show before truncation.
   * @param {Bool} isChars - is by chars
   */
  function ellipse(str, max, isChars = false) {
    // Trim starting/ending empty spaces
    const trimedSpaces = trimSpaces(str);
    const ellipse = options.ellipse || '...';

    if (isChars) {
      return trimedSpaces.split('').slice(0, max).join('') + ellipse;
    }

    return trimedSpaces.split(/\s+/).slice(0, max).join(' ') + ellipse;
  }

  /**
   * Truncate Logic
   * @param {HTML Elmenent} el - single element instance
   * @param {Number} i - current instance index
   */
  function truncate(el, idx) {
    // User defined word count or defaults
    const numberWords = el.dataset.readSmoreWords || options.wordsCount;
    // User defined chars (if exists) or defaults
    const numberCount = el.dataset.readSmoreChars || numberWords;
    const originalContent = el.innerHTML;
    // Ellipser: content, count, is chars bool
    const truncateContent = ellipse(
      originalContent,
      numberCount,
      el.dataset.readSmoreChars ? true : false
    );
    const originalContentCount = el.dataset.readSmoreWords
      ? getWordCount(originalContent)
      : getCharCount(originalContent);

    settings.originalContentArr.push(originalContent);
    settings.truncatedContentArr.push(truncateContent);

    if (numberCount < originalContentCount) {
      el.innerHTML = settings.truncatedContentArr[idx];
      let self = idx;
      createLink(self);
    }
  }

  /**
   * Create Link
   * Creates and Inserts Read More Link
   * @param {number} idx - index reference of looped item
   */
  function createLink(idx, clicked = false) {
    const linkWrap = document.createElement('span');
    let linkText = options.moreText;

    // If button was clicked, change the text
    if(clicked) {
      linkText = options.lessText;
    }

    linkWrap.className = `${options.blockClassName}__link-wrap read-smore__link-wrap`;

    linkWrap.innerHTML = `<a id=${options.blockClassName}_${idx}
                             class=${options.blockClassName}__link read-smore__link
                             style="cursor:pointer;"
                             data-clicked="${clicked}">
                             ${linkText}
                          </a>`;

    // Inset created link
    if(options.isInline) {
      element[idx].append(linkWrap);
    } else {
      element[idx].after(linkWrap);
    }

    // Call link click handler
    handleLinkClick(idx);
  }

  /**
   * Link Click Listener
   * @param {number} index - index of clicked link
   */
  function handleLinkClick(idx) {
    const link = document.querySelector(`#${options.blockClassName}_${idx}`);

    link.addEventListener('click', (e) => {
      element[idx].classList.toggle('is-expanded');
      const target = e.currentTarget;

      if (target.dataset.clicked !== 'true') {
        element[idx].innerHTML = settings.originalContentArr[idx];
        target.innerHTML = options.lessText;
        target.dataset.clicked = true;

        // Recreate the link
        if(options.isInline) {
          createLink(idx, true);
        }

        // Animate height, replace the content at the end
        if(options.animate) {
          $(element[idx]).css('height', $(element[idx]).attr('data-read-smore-truncated-height'));

          $(element[idx]).animate({
              height: $(element[idx]).attr('data-read-smore-full-height') + 'px'
          }, options.animationDuration, function(){
              $(this).height('auto');
          });
        }
      } else {
        target.innerHTML = options.moreText;
        target.dataset.clicked = false;

        // Animate height, replace the content at the end
        if(options.animate) {
          $(element[idx]).css({
            'height': $(element[idx]).attr('data-read-smore-full-height'),
            'overflow': 'hidden'
          });

          $(element[idx]).animate({
              height: $(element[idx]).attr('data-read-smore-truncated-height') + 'px'
          }, options.animationDuration, function(){
              $(this).height('auto');

              if(options.animationOverflow) {
                $(this).css('overflow', 'auto');
              } else {
                $(this).css('overflow', '');
              }

              element[idx].innerHTML = settings.truncatedContentArr[idx];
              
              // Recreate the link
              if(options.isInline) {
                createLink(idx, false);
              }
          });
        } else {
          element[idx].innerHTML = settings.truncatedContentArr[idx];

          // Recreate the link
          if(options.isInline) {
            createLink(idx, false);
          }
        }
      }
    });
  }

  // API
  return {
    init: init,
  };
}

ReadSmore.options = defaultOptions;

export default ReadSmore;
