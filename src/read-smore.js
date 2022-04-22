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
  animate: true,
  animationDuration: 400
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
        // Set the original height for animation purposes
        if(options.animate) {
          //$(element[i]).css('overflow', 'auto');
          $(element[i]).attr('data-read-smore-full-height', Math.ceil($(element[i]).outerHeight(true)));
        }

        truncate(element[i], i);

        // Set the truncated height for animation purposes
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
    const numberCount = el.dataset.readSmoreChars || options.wordsCount;
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
  function createLink(idx) {
    const linkWrap = document.createElement('span');

    linkWrap.className = `${options.blockClassName}__link-wrap`;

    linkWrap.innerHTML = `<a id=${options.blockClassName}_${idx}
                             class=${options.blockClassName}__link
                             style="cursor:pointer;">
                             ${options.moreText}
                          </a>`;

    // Inset created link
    element[idx].after(linkWrap);

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
              $(this).css('overflow', '');

              element[idx].innerHTML = settings.truncatedContentArr[idx];
          });
        } else {
          element[idx].innerHTML = settings.truncatedContentArr[idx];
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
