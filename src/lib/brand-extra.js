/**
 * Extra monochrome brand marks that simple-icons does not ship (it removed AWS, PowerShell and
 * Windows; its .NET mark is a text wordmark and its AMD mark adds the "AMD" wordmark). Only the path
 * data is copied here, so the big icon-set JSON never reaches the bundle.
 *
 * Each viewBox is centred on the path's bounding box and fits it exactly on the long edge, like a
 * simple-icons glyph (24 on the long edge), so it renders at the same optical size. Most are square.
 * Marks much wider than tall (the .NET wave, the AWS smile) set `aspect` (box width / height, > 1):
 * brand() then draws them that much wider than `size` so they carry the same visual weight as the
 * square marks, and `stroke` (viewBox units) adds a hairline outline to a mark too thin to read.
 * Trademarks belong to their owners.
 */

export const BRAND_EXTRA = {
  // The smile-and-arrow cut from mdi:aws (Material Design Icons, Apache-2.0); the "aws" letters are
  // dropped because they repeat the label. It is a thin stroke, so it gets a wide box and a hairline
  // outline, and it is only mapped to the bare "AWS" (the 28px marquee), where it still reads.
  aws: {
    title: 'Amazon Web Services',
    viewBox: '1.7 8.887 20.6 13.733',
    aspect: 1.5,
    stroke: 0.4,
    path: 'M20.08 15.53C17.89 17.14 14.71 18 12 18c-3.85 0-7.3-1.42-9.91-3.77c-.21-.19-.02-.44.23-.29c2.82 1.63 6.29 2.62 9.89 2.62c2.43 0 5.1-.5 7.55-1.56c.37-.15.68.26.32.53M21 14.5c-.29-.37-1.86-.18-2.57-.1c-.21.03-.24-.16-.05-.3c1.25-.87 3.31-.6 3.54-.33c.24.3-.06 2.36-1.23 3.34c-.19.15-.36.07-.28-.11c.27-.68.86-2.16.59-2.5',
  },
  // mdi:microsoft-windows (Material Design Icons, Apache-2.0)
  windows: {
    title: 'Windows',
    viewBox: '2 3 19 19',
    path: 'M3 12V6.75l6-1.32v6.48zm17-9v8.75l-10 .15V5.21zM3 13l6 .09v6.81l-6-1.15zm17 .25V22l-10-1.91V13.1z',
  },
  // mdi:powershell (Material Design Icons, Apache-2.0)
  powershell: {
    title: 'PowerShell',
    viewBox: '1.47 1.47 21.06 21.06',
    path: 'M21.83 4c.49 0 .8.4.67.89l-3.16 14.22c-.11.49-.59.89-1.08.89H2.17c-.49 0-.8-.4-.67-.89L4.66 4.89C4.77 4.4 5.25 4 5.74 4zm-6 12h-4c-.46 0-.83.38-.83.84c0 .47.37.85.83.85h4c.47 0 .85-.38.85-.85c0-.46-.38-.84-.85-.84m-10.05.28a.87.87 0 0 0-.21 1.22c.28.42.84.5 1.24.23c7.35-5.17 7.4-5.23 7.45-5.26c.18-.16.27-.38.28-.6c.01-.2-.04-.37-.16-.56L9.46 6.03A.867.867 0 0 0 8.21 6c-.36.32-.38.88-.05 1.24l4.15 4.44z',
  },
  // devicon dot-net-plain (Devicon, MIT)
  dotnet: {
    title: '.NET',
    viewBox: '1.229 19.162 125.547 89.676',
    aspect: 1.4,
    fillRule: 'evenodd',
    path: 'M82.108 78.432c.479-1.232 1.022-2.445 1.427-3.701q3.43-10.645 6.805-21.309c.865-2.731 1.813-5.42 3.515-7.767c2.692-3.709 6.442-5.652 10.88-6.331a37.5 37.5 0 0 1 5.28-.406c5.267-.05 10.536-.015 15.804-.01c.28 0 .56.029.957.052c-.129.304-.199.525-.311.724c-1.955 3.494-3.872 7.009-5.885 10.468c-3.505 6.022-7.016 12.042-10.631 17.998c-2.319 3.819-4.834 7.52-7.687 10.974c-2.105 2.548-4.321 4.984-7.146 6.77c-1.925 1.217-3.981 1.929-6.315 1.917c-8.278-.045-16.556-.012-24.834-.024c-2.461-.004-4.568-.941-6.356-2.603c-2.563-2.381-4.093-5.412-5.345-8.608c-2.284-5.835-3.563-11.951-5.031-18.014c-.688-2.838-1.47-5.654-2.215-8.478c-.048-.183-.142-.354-.25-.617l-.577.542c-3.228 3.207-6.071 6.741-8.615 10.498c-.693 1.024-.926 2.374-1.313 3.591c-1.424 4.47-2.722 8.983-4.264 13.411c-1.477 4.242-4.125 7.616-8.264 9.61a18.6 18.6 0 0 1-7.689 1.855c-3.98.088-7.962.098-11.943.134c-.952.009-.996-.069-.748-.99c1.707-6.338 3.87-12.514 6.58-18.492c2.794-6.167 6.085-12.048 10.231-17.419c2.823-3.657 5.941-7.031 9.843-9.582c1.979-1.293 4.083-2.315 6.477-2.584c.394-.045.793-.073 1.189-.073c8.478-.004 16.956.082 25.433-.039c4.547-.065 7.839 1.855 10.304 5.515c1.533 2.276 2.63 4.761 3.553 7.328c1.861 5.178 3.018 10.547 4.325 15.878c.748 3.051 1.581 6.081 2.379 9.12c.06.228.157.446.238.668z',
  },
  // AMD arrow cut from simple-icons siAmd (CC0); the wordmark is dropped
  amd: {
    title: 'AMD',
    viewBox: '18.277 9.137 5.726 5.726',
    path: 'M18.324 9.137l1.559 1.56h2.556v2.557L24 14.814V9.137zM19.881 11.01l-1.604 1.603v2.25h2.246l1.604-1.607h-2.246z',
  },
};
