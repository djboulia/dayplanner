/*
 * renders the Charity Navigator logo via SVG paths
 *
 * CN Logo represented as an SVG path
 * https://commons.wikimedia.org/wiki/File:Charity_Navigator_logo.svg
 */

var CNLogo = [
  {
    type: 'path', // C
    path: 'M2.23,92.07c0-25.34,20.28-46.39,45.49-46.39a44.64,44.64,0,0,1,35.6,17.41l-11.95,9.1a28.74,28.74,0,0,0-23.26-11.7c-17,0-29.89,14.43-29.89,31.58s12.6,31.45,29.89,31.45a28.76,28.76,0,0,0,23.26-11.69l11.95,9.09a44.62,44.62,0,0,1-35.6,17.42C22.51,138.34,2.23,117.41,2.23,92.07Z',
    fill: '#011936',
  },
  {
    type: 'path', // H
    path: 'M151.5,102.73v34.05H136.43v-33c0-9.75-5.85-14.94-12.61-14.94s-15.46,4-15.46,15.85v32.1H93.29V43.08h15.07V85.32c3-7.41,12.73-10.79,18.84-10.79C142.8,74.53,151.5,85.06,151.5,102.73Z',
    fill: '#011936',
  },
  {
    type: 'path', // A
    path: 'M213.4,76.09h15.08v60.69H213.4v-9.49c-4,6.63-12.08,11-20.79,11-16.24,0-29.24-13.13-29.24-32,0-18.32,12.48-31.84,29.63-31.84,8.32,0,16.38,3.64,20.4,10Zm-.26,30.28A17.77,17.77,0,0,0,195.6,88.56c-9.74,0-17.15,8.06-17.15,17.81s7.41,17.93,17.28,17.93A17.69,17.69,0,0,0,213.14,106.37Z',
    fill: '#011936',
  },
  {
    type: 'path', // R
    path: 'M284.88,76.61l-3,14.29a19,19,0,0,0-8.84-2.21c-9.88,0-15.34,9.88-15.34,26.9v21.19h-15.2V76.09H257.6v13C260.84,79,267.47,74.53,275,74.53A22.16,22.16,0,0,1,284.88,76.61Z',
    fill: '#011936',
  },
  {
    type: 'path', // I
    path: 'M291.05,54.65c0-5.33,4.55-9.23,9.88-9.23s9.74,3.9,9.74,9.23-4.29,9.23-9.74,9.23S291.05,59.85,291.05,54.65Zm2.34,82.13V76.09h15.07v60.69Z',
    fill: '#011936',
  },
  {
    type: 'path', // T
    path: 'M356.89,76.09v12H344v48.73H328.94V88.05H318v-12h10.91V53.74H344V76.09Z',
    fill: '#011936',
  },
  {
    type: 'path', // Y
    path: 'M410.31,76.09h16.25l-37.69,90.32H373l13.65-33.92-24.17-56.4H379l15.73,38.46Z',
    fill: '#011936',
  },
  {
    type: 'path', // N
    path: 'M59.41,160.75H75.27v89.53H60.84L25.11,190v60.3H9.25V160.75h15l35.21,59.77Z',
    fill: '#011936',
  },
  {
    type: 'path', // A
    path: 'M139.47,189.59h15.07v60.69H139.47V240.8c-4,6.62-12.09,11-20.79,11-16.25,0-29.24-13.12-29.24-32,0-18.32,12.47-31.83,29.63-31.83,8.31,0,16.37,3.63,20.4,10Zm-.26,30.28a17.77,17.77,0,0,0-17.54-17.8c-9.75,0-17.16,8.06-17.16,17.8s7.41,17.94,17.29,17.94A17.7,17.7,0,0,0,139.21,219.87Z',
    fill: '#011936',
  },
  {
    type: 'path', // V
    path: 'M211.46,189.59h16.37l-25.6,60.69H188.46l-25.35-60.69h16.25l16.11,41.59Z',
    fill: '#011936',
  },
  {
    type: 'path', // I
    path: 'M234,168.15c0-5.32,4.55-9.22,9.88-9.22s9.75,3.9,9.75,9.22-4.29,9.23-9.75,9.23S234,173.35,234,168.15Zm2.34,82.13V189.59h15.08v60.69Z',
    fill: '#011936',
  },
  {
    type: 'path', // G
    path: 'M313.64,189.59h15.08v52.76c0,27.29-13.26,39.12-34.05,39.12A31.52,31.52,0,0,1,266,263.8l12.48-5.72a18.65,18.65,0,0,0,16.24,9.75c11.7,0,19-6.63,19-24v-1.43c-4.28,6.24-12.73,9.49-20.14,9.49-16,0-29.89-12.6-29.89-32S277.39,188,293.37,188c7.8,0,16,3.24,20.27,9.48Zm-.25,30.15a17.65,17.65,0,0,0-17.55-17.67c-9.36,0-17,7.54-17,17.67s7.66,18.07,17,18.07A17.68,17.68,0,0,0,313.39,219.74Z',
    fill: '#011936',
  },
  {
    type: 'path', // A
    path: 'M390.45,189.59h15.08v60.69H390.45V240.8c-4,6.62-12.08,11-20.79,11-16.24,0-29.24-13.12-29.24-32,0-18.32,12.48-31.83,29.63-31.83,8.32,0,16.37,3.63,20.4,10Zm-.26,30.28a17.77,17.77,0,0,0-17.54-17.8c-9.75,0-17.16,8.06-17.16,17.8s7.41,17.94,17.29,17.94A17.7,17.7,0,0,0,390.19,219.87Z',
    fill: '#011936',
  },
  {
    type: 'path', // T
    path: 'M454.41,189.59v12H441.54v48.73H426.47V201.55H415.55v-12h10.92V167.24h15.07v22.35Z',
    fill: '#011936',
  },
  {
    type: 'path', // O
    path: 'M459.71,219.87c0-19.23,15-31.83,32.23-31.83s32.36,12.6,32.36,31.83-15.08,32-32.36,32S459.71,239.11,459.71,219.87Zm49.38,0c0-10.39-7.79-17.8-17.15-17.8s-17,7.41-17,17.8c0,10.66,7.66,17.94,17,17.94S509.09,230.53,509.09,219.87Z',
    fill: '#011936',
  },
  {
    type: 'path', // R
    path: 'M578.23,190.12l-3,14.29a18.93,18.93,0,0,0-8.83-2.21c-9.88,0-15.34,9.88-15.34,26.9v21.18h-15.2V189.59H551v13c3.24-10.14,9.87-14.55,17.41-14.55A22.16,22.16,0,0,1,578.23,190.12Z',
    fill: '#011936',
  },
  {
    type: 'circle',
    cx: '566.2',
    cy: '80.13',
    r: '9.47',
    fill: '#011936',
  },
  {
    type: 'circle',
    cx: '519.8',
    cy: '126.52',
    r: '9.47',
    fill: '#3f5df5',
  },
  {
    type: 'circle',
    cx: '473.42',
    cy: '80.13',
    r: '9.47',
    fill: '#89e260',
  },
  {
    type: 'path',
    path: 'M489.54,33.16a4.38,4.38,0,0,0,2.62,7.43,29,29,0,0,1,25.56,25.56,4.34,4.34,0,0,0,8.64,0,29,29,0,0,1,25.57-25.56,4.23,4.23,0,0,0,2.6-1.21A4.37,4.37,0,0,0,551.92,32a29,29,0,0,1-17.25-8.32,29,29,0,0,1-8.32-17.24,4.39,4.39,0,0,0-1.2-2.63,4.38,4.38,0,0,0-7.42,2.63A29,29,0,0,1,492.17,32,4.35,4.35,0,0,0,489.54,33.16Z',
    fill: '#3f5df5',
  },
];

module.exports = CNLogo;