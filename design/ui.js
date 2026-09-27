/* ui.js: the behaviours behind components.css. Plain script, no build, works from file://.
   Exposes a global `ui` plus a few bare helpers (el, icon, toast) for convenience. */
(function () {
const ICONS = {
"arrow-counter-clockwise": "M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L44.59,96H72a8,8,0,0,1,0,16H24a8,8,0,0,1-8-8V56a8,8,0,0,1,16,0V85.8L60.25,60A96,96,0,0,1,224,128Z",
"arrow-left": "M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z",
"arrows-left-right": "M213.66,181.66l-32,32a8,8,0,0,1-11.32-11.32L188.69,184H48a8,8,0,0,1,0-16H188.69l-18.35-18.34a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,213.66,181.66Zm-139.32-64a8,8,0,0,0,11.32-11.32L67.31,88H208a8,8,0,0,0,0-16H67.31L85.66,53.66A8,8,0,0,0,74.34,42.34l-32,32a8,8,0,0,0,0,11.32Z",
"bank": "M24,104H48v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16H208V104h24a8,8,0,0,0,4.19-14.81l-104-64a8,8,0,0,0-8.38,0l-104,64A8,8,0,0,0,24,104Zm40,0H96v64H64Zm80,0v64H112V104Zm48,64H160V104h32ZM128,41.39,203.74,88H52.26ZM248,208a8,8,0,0,1-8,8H16a8,8,0,0,1,0-16H240A8,8,0,0,1,248,208Z",
"buildings": "M240,208H224V96a16,16,0,0,0-16-16H144V32a16,16,0,0,0-24.88-13.32L39.12,72A16,16,0,0,0,32,85.34V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM208,96V208H144V96ZM48,85.34,128,32V208H48ZM112,112v16a8,8,0,0,1-16,0V112a8,8,0,1,1,16,0Zm-32,0v16a8,8,0,0,1-16,0V112a8,8,0,1,1,16,0Zm0,56v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Zm32,0v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Z",
"calculator": "M80,120h96a8,8,0,0,0,8-8V64a8,8,0,0,0-8-8H80a8,8,0,0,0-8,8v48A8,8,0,0,0,80,120Zm8-48h80v32H88ZM200,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V40A16,16,0,0,0,200,24Zm0,192H56V40H200ZM100,148a12,12,0,1,1-12-12A12,12,0,0,1,100,148Zm40,0a12,12,0,1,1-12-12A12,12,0,0,1,140,148Zm40,0a12,12,0,1,1-12-12A12,12,0,0,1,180,148Zm-80,40a12,12,0,1,1-12-12A12,12,0,0,1,100,188Zm40,0a12,12,0,1,1-12-12A12,12,0,0,1,140,188Zm40,0a12,12,0,1,1-12-12A12,12,0,0,1,180,188Z",
"caret-down": "M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z",
"check-circle": "M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z",
"clock-counter-clockwise": "M136,80v43.47l36.12,21.67a8,8,0,0,1-8.24,13.72l-40-24A8,8,0,0,1,120,128V80a8,8,0,0,1,16,0Zm-8-48A95.44,95.44,0,0,0,60.08,60.15C52.81,67.51,46.35,74.59,40,82V64a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H72a8,8,0,0,0,0-16H49c7.15-8.42,14.27-16.35,22.39-24.57a80,80,0,1,1,1.66,114.75,8,8,0,1,0-11,11.64A96,96,0,1,0,128,32Z",
"copy": "M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z",
"download-simple": "M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z",
"file-pdf": "M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z",
"floppy-disk": "M219.31,72,184,36.69A15.86,15.86,0,0,0,172.69,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V83.31A15.86,15.86,0,0,0,219.31,72ZM168,208H88V152h80Zm40,0H184V152a16,16,0,0,0-16-16H88a16,16,0,0,0-16,16v56H48V48H172.69L208,83.31ZM160,72a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h56A8,8,0,0,1,160,72Z",
"gear-six": "M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm109.94-52.79a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A112.1,112.1,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.62a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21Zm-15,34.91-28.57,16.25a8,8,0,0,0-3,3c-.58,1-1.19,2.06-1.81,3.06a7.94,7.94,0,0,0-1.22,4.21l-.15,32.25a95.89,95.89,0,0,1-25.37,14.3L134,199.13a8,8,0,0,0-3.91-1h-.19c-1.21,0-2.43,0-3.64,0a8.08,8.08,0,0,0-4.1,1l-28.84,16.1A96,96,0,0,1,67.88,201l-.11-32.2a8,8,0,0,0-1.22-4.22c-.62-1-1.23-2-1.8-3.06a8.09,8.09,0,0,0-3-3.06l-28.6-16.29a90.49,90.49,0,0,1,0-28.26L61.67,97.63a8,8,0,0,0,3-3c.58-1,1.19-2.06,1.81-3.06a7.94,7.94,0,0,0,1.22-4.21l.15-32.25a95.89,95.89,0,0,1,25.37-14.3L122,56.87a8,8,0,0,0,4.1,1c1.21,0,2.43,0,3.64,0a8.08,8.08,0,0,0,4.1-1l28.84-16.1A96,96,0,0,1,188.12,55l.11,32.2a8,8,0,0,0,1.22,4.22c.62,1,1.23,2,1.8,3.06a8.09,8.09,0,0,0,3,3.06l28.6,16.29A90.49,90.49,0,0,1,222.9,142.12Z",
"globe-simple": "M128,24h0A104,104,0,1,0,232,128,104.12,104.12,0,0,0,128,24Zm87.62,96H175.79C174,83.49,159.94,57.67,148.41,42.4A88.19,88.19,0,0,1,215.63,120ZM96.23,136h63.54c-2.31,41.61-22.23,67.11-31.77,77C118.45,203.1,98.54,177.6,96.23,136Zm0-16C98.54,78.39,118.46,52.89,128,43c9.55,9.93,29.46,35.43,31.77,77Zm11.36-77.6C96.06,57.67,82,83.49,80.21,120H40.37A88.19,88.19,0,0,1,107.59,42.4ZM40.37,136H80.21c1.82,36.51,15.85,62.33,27.38,77.6A88.19,88.19,0,0,1,40.37,136Zm108,77.6c11.53-15.27,25.56-41.09,27.38-77.6h39.84A88.19,88.19,0,0,1,148.41,213.6Z",
"list-bullets": "M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z",
"map-pin": "M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z",
"note-pencil": "M229.66,58.34l-32-32a8,8,0,0,0-11.32,0l-96,96A8,8,0,0,0,88,128v32a8,8,0,0,0,8,8h32a8,8,0,0,0,5.66-2.34l96-96A8,8,0,0,0,229.66,58.34ZM124.69,152H104V131.31l64-64L188.69,88ZM200,76.69,179.31,56,192,43.31,212.69,64ZM224,128v80a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h80a8,8,0,0,1,0,16H48V208H208V128a8,8,0,0,1,16,0Z",
"pencil-simple-line": "M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H216a8,8,0,0,0,0-16H115.32l112-112A16,16,0,0,0,227.32,73.37ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.32,64l24-24L216,84.69Z",
"pencil-simple": "M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z",
"percent": "M205.66,61.64l-144,144a8,8,0,0,1-11.32-11.32l144-144a8,8,0,0,1,11.32,11.31ZM50.54,101.44a36,36,0,0,1,50.92-50.91h0a36,36,0,0,1-50.92,50.91ZM56,76A20,20,0,1,0,90.14,61.84h0A20,20,0,0,0,56,76ZM216,180a36,36,0,1,1-10.54-25.46h0A35.76,35.76,0,0,1,216,180Zm-16,0a20,20,0,1,0-5.86,14.14A19.87,19.87,0,0,0,200,180Z",
"plus": "M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z",
"receipt": "M72,104a8,8,0,0,1,8-8h96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,104Zm8,40h96a8,8,0,0,0,0-16H80a8,8,0,0,0,0,16ZM232,56V208a8,8,0,0,1-11.58,7.15L192,200.94l-28.42,14.21a8,8,0,0,1-7.16,0L128,200.94,99.58,215.15a8,8,0,0,1-7.16,0L64,200.94,35.58,215.15A8,8,0,0,1,24,208V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56Zm-16,0H40V195.06l20.42-10.22a8,8,0,0,1,7.16,0L96,199.06l28.42-14.22a8,8,0,0,1,7.16,0L160,199.06l28.42-14.22a8,8,0,0,1,7.16,0L216,195.06Z",
"seal-check": "M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-11.55,39.29c-4.79,5-9.75,10.17-12.38,16.52-2.52,6.1-2.63,13.07-2.73,19.82-.1,7-.21,14.33-3.32,17.43s-10.39,3.22-17.43,3.32c-6.75.1-13.72.21-19.82,2.73-6.35,2.63-11.52,7.59-16.52,12.38S132,224,128,224s-9.15-4.92-14.11-9.69-10.17-9.75-16.52-12.38c-6.1-2.52-13.07-2.63-19.82-2.73-7-.1-14.33-.21-17.43-3.32s-3.22-10.39-3.32-17.43c-.1-6.75-.21-13.72-2.73-19.82-2.63-6.35-7.59-11.52-12.38-16.52S32,132,32,128s4.92-9.15,9.69-14.11,9.75-10.17,12.38-16.52c2.52-6.1,2.63-13.07,2.73-19.82.1-7,.21-14.33,3.32-17.43S70.51,56.9,77.55,56.8c6.75-.1,13.72-.21,19.82-2.73,6.35-2.63,11.52-7.59,16.52-12.38S124,32,128,32s9.15,4.92,14.11,9.69,10.17,9.75,16.52,12.38c6.1,2.52,13.07,2.63,19.82,2.73,7,.1,14.33.21,17.43,3.32s3.22,10.39,3.32,17.43c.1,6.75.21,13.72,2.73,19.82,2.63,6.35,7.59,11.52,12.38,16.52S224,124,224,128,219.08,137.15,214.31,142.11ZM173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z",
"sparkle": "M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM137,164.22a8,8,0,0,0-4.74,4.74L112,223.85,91.78,169A8,8,0,0,0,87,164.22L32.15,144,87,123.78A8,8,0,0,0,91.78,119L112,64.15,132.22,119a8,8,0,0,0,4.74,4.74L191.85,144ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z",
"trash": "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z",
"upload-simple": "M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0ZM93.66,77.66,120,51.31V144a8,8,0,0,0,16,0V51.31l26.34,26.35a8,8,0,0,0,11.32-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40A8,8,0,0,0,93.66,77.66Z",
"user-circle": "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z",
"warning-circle": "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z",
"x": "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"
};
ICONS['caret-up'] = 'M213.66,165.66a8,8,0,0,1-11.32,0L128,91.31l-74.34,74.35a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,213.66,165.66Z';
ICONS['caret-left-bold'] = 'M168.49,199.51a12,12,0,0,1-17,17l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,0,1,17,17L97,128Z';
ICONS['caret-right-bold'] = 'M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,0,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z';
ICONS['caret-down-bold'] = 'M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z';

// ---- DOM ----
// el('div', { class, onclick, 'data-x', html }, ...children). Arrays flatten; null/false children are skipped.
function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k === 'html') e.innerHTML = v;
    else if (v !== false && v != null) e.setAttribute(k, v);
  }
  for (const k of kids.flat()) { if (k == null || k === false) continue; e.append(k.nodeType ? k : document.createTextNode(k)); }
  return e;
}
// Two sizes: 16px (default) and 12px ('xs'). 12px icons are always the bold variant, so 'xs' swaps in `<name>-bold`.
const boldAt12 = name => name.endsWith('-bold') ? name : (ICONS[name + '-bold'] ? name + '-bold' : (console.warn(`icon ${name}: no bold variant for 12px`), name));
const icon = (name, cls = '') => { if (cls.split(' ').includes('xs')) name = boldAt12(name); const t = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); t.setAttribute('viewBox', '0 0 256 256'); t.setAttribute('fill', 'currentColor'); t.setAttribute('class', 'i ' + cls); t.innerHTML = `<path d="${ICONS[name]}"/>`; return t; };
const iconHtml = (name, size = 16) => { if (size !== 16 && size !== 12) console.warn(`icon ${name}: only 16px or 12px`); if (size === 12) name = boldAt12(name); return `<svg viewBox="0 0 256 256" fill="currentColor" width="${size}" height="${size}"><path d="${ICONS[name]}"/></svg>` };
const field = (label, input) => el('label', { class: 'field' }, el('span', { class: 'fl' }, label), input);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---- toast ----
let toastEl = null;
function toast(msg) {
  if (!toastEl) { toastEl = el('div', { class: 'toast' }); document.body.append(toastEl); }
  toastEl.textContent = msg; toastEl.classList.add('on');
  clearTimeout(toastEl._t); toastEl._t = setTimeout(() => toastEl.classList.remove('on'), 1800);
}

// ---- two-click confirm ----
// First click arms the button (label becomes confirmLabel); second click runs onConfirm. Leaving `resetOn` disarms.
function confirmClick(btn, { label = 'Delete', confirmLabel = 'Confirm delete', resetOn = btn.parentElement, onConfirm }) {
  if (!btn.classList.contains('armed')) {
    btn.classList.add('armed'); btn.textContent = confirmLabel;
    resetOn.addEventListener('mouseleave', () => { btn.classList.remove('armed'); btn.textContent = label; }, { once: true });
    return false;
  }
  onConfirm(); return true;
}

// ---- motion ----
// Fade a container out, run `change` (which replaces its content), fade back in.
function swapFade(node, change, ms = 160) {
  node.classList.add('fade', 'fading');
  setTimeout(() => { change(); void node.offsetWidth; node.classList.remove('fading'); }, ms);
}
// Fade a container out in place, run `change`, bring the new content up from below. Use it when the whole content is
// replaced by a different item (switching documents); swapFade is for in-place refreshes.
function swapSlide(node, change, ms = 180) {
  node.classList.add('swap');
  node.classList.add('out');
  setTimeout(() => {
    change();
    node.style.transition = 'none'; node.classList.add('below'); void node.offsetWidth; node.style.transition = '';
    node.classList.remove('out', 'below');
  }, ms);
}
// Grow a freshly inserted row from zero height (call right after it is in the DOM).
function rowIn(row) {
  const h = row.offsetHeight; row.classList.add('enter');
  row.style.cssText = 'height:0;padding-top:0;padding-bottom:0;opacity:0;transform:translateY(-10px);transition:none';
  void row.offsetHeight;
  row.style.transition = 'height .32s cubic-bezier(.2,.7,.2,1), padding .32s cubic-bezier(.2,.7,.2,1), opacity .32s ease-out .08s, transform .32s cubic-bezier(.2,.7,.2,1)';
  row.style.height = h + 'px'; row.style.paddingTop = ''; row.style.paddingBottom = ''; row.style.opacity = ''; row.style.transform = '';
  const settle = () => { row.style.cssText = ''; row.classList.remove('enter'); };
  row.addEventListener('transitionend', settle, { once: true }); setTimeout(settle, 450);
}
// Collapse a row upward, then run `done` (which removes it from state and re-renders).
function rowOut(row, done) {
  if (!row) return done();
  row.style.cssText = `height:${row.offsetHeight}px;transition:none`; row.classList.add('leave');
  void row.offsetHeight;
  row.style.transition = 'height .28s cubic-bezier(.4,0,.2,1), padding .28s cubic-bezier(.4,0,.2,1), opacity .18s ease-in, transform .28s cubic-bezier(.4,0,.2,1)';
  row.style.height = '0'; row.style.paddingTop = '0'; row.style.paddingBottom = '0'; row.style.opacity = '0'; row.style.transform = 'translateY(-10px)';
  let ran = false; const fin = () => { if (ran) return; ran = true; done(); };
  row.addEventListener('transitionend', e => { if (e.propertyName === 'height') fin(); });
  setTimeout(fin, 400);
}

// ---- dialog ----
// One shared <dialog>. dialog.open({ title, body, foot, footLeft }) fills and shows it; body/foot take nodes or arrays.
const dialog = (() => {
  let d, title, body, foot;
  const ensure = () => {
    if (d) return;
    title = el('span'); body = el('div', { class: 'dlg-b' }); foot = el('div', { class: 'dlg-f' });
    d = el('dialog', {}, el('div', { class: 'dlg-h' }, title, el('span', { class: 'spacer' }), el('button', { class: 'btn secondary', type: 'button', onclick: () => d.close() }, 'Close')), body, foot);
    d.addEventListener('click', e => { if (e.target === d) d.close(); });
    document.body.append(d);
  };
  return {
    get el() { ensure(); return d; },
    open({ title: t = '', body: b = [], foot: f = [], footLeft = false } = {}) {
      ensure(); title.textContent = t; body.replaceChildren(...[b].flat().filter(Boolean)); foot.replaceChildren(...[f].flat().filter(Boolean));
      foot.classList.toggle('left', footLeft); if (!d.open) d.showModal();
    },
    set({ title: t, body: b, foot: f, footLeft }) { ensure(); if (t != null) title.textContent = t; if (b) body.replaceChildren(...[b].flat().filter(Boolean)); if (f) foot.replaceChildren(...[f].flat().filter(Boolean)); if (footLeft != null) foot.classList.toggle('left', footLeft); },
    close() { if (d?.open) d.close(); },
  };
})();

// ---- popover ----
// Anchored panel inside a scrolling container. Closes on outside mousedown. Returns the panel.
let popEl = null;
function closePop() { if (popEl) { popEl.remove(); popEl = null; } }
function popover(anchor, container, content, { width = 300 } = {}) {
  closePop();
  const pop = el('div', { class: 'pop', style: `width:${width}px`, onmousedown: e => e.stopPropagation() }, ...[content].flat());
  const r = anchor.getBoundingClientRect(), pr = container.getBoundingClientRect();
  pop.style.left = Math.max(8, r.right - pr.left - width + container.scrollLeft) + 'px';
  pop.style.top = (r.bottom - pr.top + 6 + container.scrollTop) + 'px';
  container.append(pop); popEl = pop; return pop;
}
document.addEventListener('mousedown', e => { if (popEl && !e.target.closest('.pop')) closePop(); });

// ---- image picker: a label, a preview box and Upload / Replace / Remove / Reset ----
// Images live in the record itself as data URLs, so they travel with the data files.
// undefined means "never set" and falls back to the bundled image; '' means removed on purpose and shows nothing.
const imgOf = (obj, key, fallback) => obj?.[key] === undefined ? fallback : obj[key];
// Big photos are scaled down (longest side 800px) before storing; SVGs are kept as they are.
const readImage = file => new Promise((resolve, reject) => {
  const r = new FileReader();
  r.onerror = () => reject(r.error);
  r.onload = () => {
    if (file.type === 'image/svg+xml') return resolve(r.result);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 800 / Math.max(img.width, img.height)); if (k === 1) return resolve(r.result);
      const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); resolve(c.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Not an image'));
    img.src = r.result;
  };
  r.readAsDataURL(file);
});
function imagePicker(p, key, label, fallback) {
  const wrap = el('div', { class: 'field imgpick' });
  const input = el('input', { type: 'file', accept: 'image/png,image/jpeg,image/svg+xml,image/webp', hidden: true });
  const draw = () => {
    const src = imgOf(p, key, fallback);
    wrap.replaceChildren(el('span', { class: 'fl' }, label),
      el('div', { class: 'imgpick-box' }, src ? el('img', { src, alt: '' }) : el('span', { class: 'imgpick-empty' }, 'None')),
      el('span', { class: 'actions' },
        el('button', { class: 'btn sm secondary', type: 'button', onclick: () => input.click() }, src ? 'Replace' : 'Upload'),
        src ? el('button', { class: 'btn sm secondary', type: 'button', onclick: () => { p[key] = ''; draw(); } }, 'Remove') : null,
        p[key] !== undefined && fallback ? el('button', { class: 'btn sm secondary', type: 'button', title: 'Use the bundled image again', onclick: () => { delete p[key]; draw(); } }, 'Reset') : null),
      input);
  };
  input.onchange = async () => { const f = input.files[0]; input.value = ''; if (!f) return; try { p[key] = await readImage(f); draw(); } catch (e) { toast('Could not read that image'); } };
  draw(); return wrap;
}

// ---- dates ----
const isoLocal = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const today = () => isoLocal(new Date());
const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return isoLocal(d); };
const fmtDate = iso => iso ? new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
// A month grid. onPick(iso) is called with the chosen day.
function calendar(value, onPick, { min } = {}) {   // min: ISO date; earlier days are disabled
  const sel = value || today(); const view = new Date(sel + 'T00:00:00'); view.setDate(1);
  const cal = el('div', { class: 'cal' });
  const draw = () => {
    cal.innerHTML = '';
    const y = view.getFullYear(), m = view.getMonth();
    cal.append(el('div', { class: 'cal-h' },
      el('button', { type: 'button', class: 'cal-nav', onclick: () => { view.setMonth(m - 1); draw(); } }, icon('caret-left-bold', 'xs')),
      el('span', {}, view.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })),
      el('button', { type: 'button', class: 'cal-nav', onclick: () => { view.setMonth(m + 1); draw(); } }, icon('caret-right-bold', 'xs'))));
    const grid = el('div', { class: 'cal-g' }, ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => el('span', { class: 'cal-d' }, d)));
    const first = (new Date(y, m, 1).getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
    for (let i = 0; i < first; i++) grid.append(el('span'));
    for (let d = 1; d <= days; d++) { const iso = isoLocal(new Date(y, m, d)); grid.append(el('button', { type: 'button', class: 'cal-day' + (iso === sel ? ' on' : '') + (iso === today() ? ' today' : ''), disabled: !!(min && iso < min), onclick: () => onPick(iso) }, String(d))); }
    cal.append(grid);
  };
  draw(); return cal;
}
// Date picker popover: optional `before` nodes (presets) above the calendar.
function datePicker({ anchor, container, value, before = [], min, onPick }) {
  return popover(anchor, container, [...[before].flat(), calendar(value, iso => { onPick(iso); closePop(); }, { min })], { width: 7 * 30 + 2 * 16 });   // the calendar grid (7 × 30px, see .cal-g) plus panel padding (--pad-pop), so presets and month bar share its width
}

// ---- in-place editing ----
// Wire a container whose editable spans carry data-edit (a key) and contenteditable. Enter commits, Escape reverts, Tab moves on.
// onCommit(key, text, elm) returns nothing; onCancel is optional.
function inlineEdit(container, { onCommit, selector = '[data-edit]' }) {
  let editing = null;
  const begin = t => { if (!t || editing?.elm === t) return; editing = { elm: t, orig: t.textContent, next: 0 }; };
  const commit = (t, cancel) => {
    if (!editing || editing.elm !== t) return;
    const { orig, next } = editing; editing = null;
    if (cancel) { t.textContent = orig; return; }
    if (t.textContent !== orig) onCommit(t.dataset.edit, t.textContent, t);
    if (next) { const all = [...container.querySelectorAll(selector)]; const i = all.indexOf(t); const n = all[i + next]; if (n) { n.focus(); document.getSelection()?.selectAllChildren(n); } }
  };
  container.addEventListener('focusin', e => begin(e.target.closest?.(selector)));
  container.addEventListener('mousedown', e => begin(e.target.closest?.(selector)));
  container.addEventListener('focusout', e => { const t = e.target.closest?.(selector); if (t) commit(t, false); });
  container.addEventListener('keydown', e => {
    const t = e.target.closest?.(selector); if (!t) return; begin(t);
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit(t, false); t.blur(); }
    else if (e.key === 'Escape') { e.preventDefault(); commit(t, true); t.blur(); }
    else if (e.key === 'Tab') { e.preventDefault(); editing.next = e.shiftKey ? -1 : 1; commit(t, false); }
  });
}

document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('[data-icon]').forEach(e => e.prepend(icon(e.dataset.icon))));

window.ui = { ICONS, el, icon, imgOf, imagePicker, readImage, iconHtml, field, esc, toast, confirmClick, swapFade, swapSlide, rowIn, rowOut, dialog, popover, closePop, calendar, datePicker, inlineEdit, isoLocal, today, addDays, fmtDate };
window.el = el; window.icon = icon; window.toast = toast; window.ICONS = ICONS;
})();
