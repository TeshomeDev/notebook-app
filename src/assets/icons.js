const svg = (paths) =>
  `<svg
     xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round"
     >${paths}</svg`;

export const icons = {
  bookOpen: svg(
    '<path d="M12 5v16"/><path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"/>'
  ),

  menu: svg('<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>'),

  x: svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),

  mail: svg(
    '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>'
  ),

  linkedin: svg(
    '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>'
  ),

  arrowLeft: svg('<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>'),

  arrowRight: svg('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'),
};
