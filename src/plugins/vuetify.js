import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createVuetify } from "vuetify";
import { VDataTable } from "vuetify/labs/VDataTable";

import "@fortawesome/fontawesome-free/css/all.css";
import { aliases, fa } from "vuetify/iconsets/fa";

export default createVuetify({
  components: {
    VDataTable,
  },
  theme: {
    defaultTheme: "lightTheme",
    themes: {
      lightTheme: {
        dark: false,
        colors: {
          ourMaroon: "#77202B",
          ourLightMaroon: "#F2DFE1",
          ourTeal: "#78C1B6",
          ourLightTeal: "#CEE4E1",
          ourBlue: "#3272AA",
          ourLightBlue: "#D7E1E9",
          ourDarkBlue: "#1A465F",
          ourLightDarkBlue: "#D5DCDF",
          ourOrange: "#DF5B48",
          ourLightOrange: "#EEC8C2",
          ourYellow: "#F2C754",
          ourLightYellow: "#F4E9CC",
          ourMediumGray: "#C5C5C5",
          ourLightGray: "#F4F4F4",
        },
      },
    },
    icons: {
      defaultSet: "fa",
      aliases,
      sets: {
        fa,
      },
    },
  },
});
