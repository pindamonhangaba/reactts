export const format = {
  SPTBR: 'DD/MM/YYYY',
  EXTPTBR: 'DD [de] MMMM, YYYY',
  MONYEA: 'MM/YYYY',
  DAYMON: 'DD/MM',
  YMDDASH: 'YYYY-MM-DD',
  RFC3349: 'YYYY-MM-DDTHH:mm:ssZ',
  DASHUN: 'YYYY-MM-DD',
};

/*
 * Returns the width of the browser's scrollbar
 * */
export function getScrollbarWidth() {
  let outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps

  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  // force scrollbars
  outer.style.overflow = 'scroll';

  // add innerdiv
  let inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;

  // remove divs
  outer.parentNode && outer.parentNode.removeChild(outer);

  return widthNoScroll - widthWithScroll;
}