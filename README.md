# Landing Page Workshop - Rolling Code School

Landing page responsive desarrollada como parte del Bootcamp de Scrum Professional de Rolling Code School. El objetivo del proyecto es construir la web promocional para un evento de tecnología aplicando metodologías ágiles y buenas prácticas de desarrollo web.

---

## :hammer_and_wrench: Tecnologías Utilizadas

* **HTML5:** Estructura semántica de la página.
* **CSS3:** Estilos personalizados, paleta de colores mediante variables CSS y tipografía.
* **Bootstrap 5.3:** Sistema de grillas y componentes responsive (vía CDN).
* **Git & GitHub:** Control de versiones y trabajo colaborativo.
* **GitHub Pages:** Despliegue e integración continua del sitio web.

---

## :file_folder: Estructura del Proyecto

```text
landing-workshop/
├── index.html
├── error404.html
├── css/                  # un archivo por sección (el orden de los <link> importa)
│   ├── style.css         # base, speakers, agenda y precios
│   ├── variables.css
│   ├── hero.css
│   ├── stats.css
│   ├── entradas.css
│   ├── responsive.css
│   ├── checkout.css
│   ├── error404.css
│   ├── sponsors.css
│   └── sponsor-form.css
├── js/                   # funcionalidad
│   ├── countdown.js
│   └── sponsorForm.js
├── img/
│   └── speaker-1.jpg ... speaker-10.jpg
└── README.md